const vscode = require('vscode');
const { supportedCommands, supportedCommandDetails } = require('./commands');

const SLURM_SELECTOR = { language: 'shellscript', scheme: 'file' };

function parseSbatchLine(line) {
    const longOpt = line.match(/#SBATCH\s+--([a-zA-Z0-9-]+)(?:=([^\s]+))?/);
    if (longOpt) {
        return { type: 'long', key: longOpt[1], value: longOpt[2], raw: longOpt[0], index: longOpt.index };
    }
    const shortOpt = line.match(/#SBATCH\s+-([a-zA-Z])\s+(\S+)/);
    if (shortOpt) {
        return { type: 'short', key: shortOpt[1], value: shortOpt[2], raw: shortOpt[0], index: shortOpt.index };
    }
    return null;
}

function getDiagnostics(document) {
    const diagnostics = [];
    const lineCount = document.lineCount;

    for (let i = 0; i < lineCount; i++) {
        const line = document.lineAt(i).text;
        if (!line.trimStart().startsWith('#SBATCH')) continue;

        const parsed = parseSbatchLine(line);
        if (!parsed) continue;

        const { key } = parsed;

        if (!supportedCommands[key]) {
            const range = new vscode.Range(i, 0, i, line.length);
            diagnostics.push(new vscode.Diagnostic(
                range,
                `不支持字段 "${key}"`,
                vscode.DiagnosticSeverity.Error
            ));
        }
    }

    return diagnostics;
}

class SlurmHoverProvider {
    provideHover(document, position) {
        const line = document.lineAt(position.line).text;
        if (!line.trimStart().startsWith('#SBATCH')) return null;

        const parsed = parseSbatchLine(line);
        if (!parsed) return null;

        const { key } = parsed;

        let optionText;
        let optionLength;
        if (parsed.type === 'long') {
            optionText = `--${key}`;
            optionLength = key.length + 2;
        } else {
            optionText = `-${key}`;
            optionLength = key.length + 1;
        }

        const keyStart = line.indexOf(optionText);
        const keyEnd = keyStart + optionLength;

        if (position.character < keyStart || position.character > keyEnd) return null;

        if (supportedCommands[key]) {
            var detail = supportedCommandDetails[key];
            return new vscode.Hover([
                new vscode.MarkdownString(`**${key}**`),
                new vscode.MarkdownString(''),
                new vscode.MarkdownString(detail.description)
            ]);
        }
    }
}

class SlurmCompletionProvider {
    provideCompletionItems(document, position) {
        const before = document.lineAt(position.line).text.substring(0, position.character);

        if (before.length > 0 && '#SBATCH'.startsWith(before)) {
            const item = new vscode.CompletionItem('#SBATCH', vscode.CompletionItemKind.Keyword);
            item.range = new vscode.Range(position.line, 0, position.line, position.character);
            return [item];
        }

        const header = before.match(/^#SBATCH\s+(.*)$/);
        if (!header) return null;

        const typed = header[1];
        const valueMatch = typed.match(/^--([a-zA-Z0-9-]+)=(.*)$/) || typed.match(/^-([a-zA-Z])\s+(.*)$/);
        if (valueMatch) {
            const detail = supportedCommandDetails[supportedCommands[valueMatch[1]]];
            const partial = valueMatch[2];
            if (!detail || detail.available.length === 0) return null;
            return detail.available
                .filter(value => value.startsWith(partial))
                .map(value => {
                    const item = new vscode.CompletionItem(value, vscode.CompletionItemKind.Value);
                    item.range = new vscode.Range(
                        position.line, before.length - partial.length, position.line, position.character
                    );
                    return item;
                });
        }

        const items = [];
        const range = new vscode.Range(position.line, before.length - typed.length, position.line, position.character);
        for (const key of Object.keys(supportedCommands)) {
            const label = key.length > 1 ? `--${key}` : `-${key}`;
            if (!label.startsWith(typed)) continue;

            const item = new vscode.CompletionItem(label, vscode.CompletionItemKind.Property);
            const insertText = key.length > 1 ? `${label}=` : `${label} `;
            const detail = supportedCommandDetails[supportedCommands[key]];
            item.insertText = insertText;
            item.detail = detail.description;
            item.range = range;
            if (detail.available.length > 0) {
                item.command = { command: 'editor.action.triggerSuggest', title: 'Suggest values' };
            }
            items.push(item);
        }
        return items;
    }
}

function activate(context) {
    const diagnosticCollection = vscode.languages.createDiagnosticCollection('slurm');

    // ========== 诊断 ==========
    const updateDiagnostics = (document) => {
        if (document.languageId == 'shellscript') {
            diagnosticCollection.set(document.uri, getDiagnostics(document));
        }
    };
    context.subscriptions.push(
        vscode.workspace.onDidChangeTextDocument(e => updateDiagnostics(e.document))
    );
    context.subscriptions.push(
        vscode.workspace.onDidOpenTextDocument(updateDiagnostics)
    );
    vscode.workspace.textDocuments.forEach(updateDiagnostics);

    // ========== Hover ==========
    context.subscriptions.push(
        vscode.languages.registerHoverProvider(SLURM_SELECTOR, new SlurmHoverProvider())
    );

    // ========== Completion ==========
    context.subscriptions.push(
        vscode.languages.registerCompletionItemProvider(
            SLURM_SELECTOR,
            new SlurmCompletionProvider(),
            ' ', '-', '=', '#', 'S', 'B', 'A', 'T', 'C', 'H'
        )
    );
}

function deactivate() { }

module.exports = { activate, deactivate };