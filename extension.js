const vscode = require('vscode');

const SLURM_SELECTOR = { language: 'shellscript', scheme: 'file' };

let supportedCommands = {
    "nodes": "指定作业所需的计算节点数。",
    "ntasks": "指定作业所需的总任务数。",
    "cpus-per-task": "指定每个任务所需的 CPU 核心数。",
    "mem": "指定作业所需的内存量。",
    "time": "指定作业的最长运行时间。"
};
/**
 * 解析 #SBATCH 行，提取 key 和 value
 */
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

/**
 * 获取文档中所有 #SBATCH 行的诊断信息
 */
function getDiagnostics(document) {
    const diagnostics = [];
    const lineCount = document.lineCount;

    for (let i = 0; i < lineCount; i++) {
        const line = document.lineAt(i).text;
        if (!line.trimStart().startsWith('#SBATCH')) continue;

        const parsed = parseSbatchLine(line);
        if (!parsed) continue;

        const { key, value } = parsed;

        if (!supportedCommands[key]) {
            // 其他字段全部报错
            const keyStart = line.indexOf(parsed.type === 'long' ? `--${key}` : `-${key}`, line.indexOf('#SBATCH') + 7);
            const keyEnd = value !== undefined
                ? line.indexOf(value, keyStart) + value.length
                : keyStart + (parsed.type === 'long' ? key.length + 2 : key.length + 1);

            const range = new vscode.Range(i, keyStart, i, keyEnd);
            diagnostics.push(new vscode.Diagnostic(
                range,
                `不支持字段 "${key}"`,
                vscode.DiagnosticSeverity.Error
            ));
        }
    }

    return diagnostics;
}

/**
 * Hover Provider
 */
class SlurmHoverProvider {
    provideHover(document, position) {
        const line = document.lineAt(position.line).text;
        if (!line.trimStart().startsWith('#SBATCH')) return null;

        const parsed = parseSbatchLine(line);
        if (!parsed) return null;

        const { key, value } = parsed;

        // 检查光标是否在 option 范围内
        const keyStart = line.indexOf(parsed.type === 'long' ? `--${key}` : `-${key}`);
        const keyEnd = value !== undefined
            ? line.indexOf(value, keyStart) + value.length
            : keyStart + (parsed.type === 'long' ? key.length + 2 : key.length + 1);

        if (position.character < keyStart || position.character > keyEnd) return null;

        if (supportedCommands[key]) {
            return new vscode.Hover([
                new vscode.MarkdownString(`**${key}**`),
                new vscode.MarkdownString(''),
                new vscode.MarkdownString(supportedCommands[key])
            ]);
        }
    }
}

/**
 * Completion Provider（自动补全）
 */
class SlurmCompletionProvider {
    provideCompletionItems(document, position) {
        const line = document.lineAt(position.line).text;
        const textBeforeCursor = line.substring(0, position.character);

        if ("#SBATCH".startsWith(textBeforeCursor)) {
            const item = new vscode.CompletionItem('#SBATCH', vscode.CompletionItemKind.Function);
            item.insertText = "#SBATCH".substring(textBeforeCursor.length,7)
            return [
                item
            ];
        }
        // 只在 #SBATCH 行提供补全
        if (!line.trimStart().startsWith('#SBATCH')) return null;


        // 如果已经输入了内容，不提供补全（简化版）
        if (textBeforeCursor.match(/#SBATCH\s+\S/)) return null;

        const item = new vscode.CompletionItem('nodes=', vscode.CompletionItemKind.Property);
        item.detail = 'SBATCH 指令';
        item.documentation = new vscode.MarkdownString('指定计算节点数为 1');
        item.insertText = '--nodes=';

        return [item];
    }
}

function activate(context) {
    const diagnosticCollection = vscode.languages.createDiagnosticCollection('slurm');

    // ========== 诊断 ==========
    const updateDiagnostics = (document) => {
        if (document.languageId !== 'shellscript') return;
        diagnosticCollection.set(document.uri, getDiagnostics(document));
    };

    // 文档变化时更新诊断
    context.subscriptions.push(
        vscode.workspace.onDidChangeTextDocument(e => updateDiagnostics(e.document))
    );

    // 打开文档时更新诊断
    context.subscriptions.push(
        vscode.workspace.onDidOpenTextDocument(updateDiagnostics)
    );

    // 初始化已打开的文档
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
            ' ', '-', '#', 'S'
        )
    );
}

function deactivate() { }

module.exports = { activate, deactivate };