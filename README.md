# Slurm Language Support

为 [Slurm](https://slurm.schedmd.com/) 作业脚本提供 VS Code / Cursor 语言支持。扩展通过语法注入作用于 Shell 脚本（`shellscript`），对 `#SBATCH` 指令提供语法高亮、自动补全、悬停说明与字段校验。

## 功能

- **语法高亮**：将 TextMate 语法注入到 Shell 脚本，高亮 `#SBATCH` 指令、长选项（`--nodes=`）、短选项（`-J`）及参数值
- **自动补全**：输入 `#SBATCH` 时补全指令前缀；在空 `#SBATCH` 行提示常用选项
- **悬停说明**：鼠标悬停在已支持的 SBATCH 字段上时显示中文说明
- **字段校验**：对不在支持列表中的 SBATCH 字段标记错误诊断

## 支持的 SBATCH 字段

| 字段 | 说明 |
|------|------|
| `nodes` | 指定作业所需的计算节点数 |
| `ntasks` | 指定作业所需的总任务数 |
| `cpus-per-task` | 指定每个任务所需的 CPU 核心数 |
| `mem` | 指定作业所需的内存量 |
| `time` | 指定作业的最长运行时间 |

支持长选项（`#SBATCH --nodes=1`）与短选项（`#SBATCH -J myjob`）两种写法。未在上表中的字段会在编辑器中报错。

## 使用示例

```bash
#!/bin/bash
#SBATCH --nodes=1
#SBATCH --ntasks=4
#SBATCH --cpus-per-task=2
#SBATCH --mem=8G
#SBATCH --time=01:00:00

srun ./my_program
```

将文件保存为 `.sh` 或 `.slurm` 等 Shell 脚本格式，并确保 VS Code 将其识别为 Shell Script 语言即可生效。

## 安装

### 从源码安装（开发调试）

1. 克隆本仓库并进入目录
2. 安装依赖：

   ```bash
   bun install
   # 或
   npm install
   ```

3. 在 VS Code / Cursor 中打开项目，按 `F5` 启动扩展开发主机
4. 在新窗口中打开一个 Shell 脚本文件进行测试

### 打包安装

```bash
# 需要安装 @vscode/vsce
npx @vscode/vsce package
```

生成的 `.vsix` 文件可通过 **Extensions: Install from VSIX 当前光标位置.

## 开发

```bash
# 安装依赖
bun install

# 运行 ESLint
npx eslint .
```

### 项目结构

```
slurm-language-support/
├── extension.js              # 扩展主逻辑（诊断、悬停、补全）
├── package.json              # 扩展清单与 grammar 配置
├── syntaxes/
│   └── slurm.tmLanguage.json # TextMate 当前光标位置
└── eslint.config.mjs         # ESLint 配置
```

## 要求

- VS Code `^1.120.0` 或更高版本
- 文件语言模式需为 **Shell Script**（`shellscript`）

## 许可证

尚未指定。如需贡献或发布，请补充 LICENSE 文件。
