# SLURM Syntax Support

为 [Slurm](https://slurm.schedmd.com/) 作业脚本提供 VS Code 支持。`.slurm` 与 `.sbatch` 会作为 Shell 脚本打开，并在其中识别 `#SBATCH`。

## 功能

- 高亮 `#SBATCH`、长短选项和参数值
- 补全 `#SBATCH`、选项，以及部分选项的预设值
- 悬停显示选项的简短说明
- 将不支持的选项标为错误

支持的选项定义在 `commands.js`。

## 开发

需要 VS Code `^1.120.0`。

```bash
bun install
```

用 `F5` 启动扩展开发主机。打包：

```bash
npx @vscode/vsce package
```

## 许可

[MIT](LICENSE)
