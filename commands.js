const supportedCommands = {
    "job-name": "job-name",
    "J": "job-name",
    "partition": "partition",
    "p": "partition",
    "account": "account",
    "A": "account",
    "qos": "qos",
    "q": "qos",
    "comment": "comment",
    "chdir": "chdir",
    "D": "chdir",
    "nodes": "nodes",
    "N": "nodes",
    "ntasks": "ntasks",
    "n": "ntasks",
    "ntasks-per-node": "ntasks-per-node",
    "cpus-per-task": "cpus-per-task",
    "c": "cpus-per-task",
    "distribution": "distribution",
    "m": "distribution",
    "mem": "mem",
    "mem-per-cpu": "mem-per-cpu",
    "mem-per-gpu": "mem-per-gpu",
    "time": "time",
    "t": "time",
    "begin": "begin",
    "b": "begin",
    "deadline": "deadline",
    "gres": "gres",
    "gpus": "gpus",
    "G": "gpus",
    "gpus-per-node": "gpus-per-node",
    "gpus-per-task": "gpus-per-task",
    "cpus-per-gpu": "cpus-per-gpu",
    "constraint": "constraint",
    "C": "constraint",
    "nodelist": "nodelist",
    "w": "nodelist",
    "exclude": "exclude",
    "x": "exclude",
    "exclusive": "exclusive",
    "contiguous": "contiguous",
    "reservation": "reservation",
    "licenses": "licenses",
    "L": "licenses",
    "clusters": "clusters",
    "M": "clusters",
    "output": "output",
    "o": "output",
    "error": "error",
    "e": "error",
    "input": "input",
    "i": "input",
    "open-mode": "open-mode",
    "array": "array",
    "a": "array",
    "dependency": "dependency",
    "d": "dependency",
    "hold": "hold",
    "H": "hold",
    "requeue": "requeue",
    "no-requeue": "no-requeue",
    "nice": "nice",
    "signal": "signal",
    "hint": "hint",
    "oversubscribe": "oversubscribe",
    "s": "oversubscribe",
    "mail-type": "mail-type",
    "mail-user": "mail-user",
    "export": "export",
    "tmp": "tmp",
};

const supportedCommandDetails = {
    "job-name": {
        "description": "作业名称",
        "available": []
    },
    "partition": {
        "description": "提交分区",
        "available": []
    },
    "account": {
        "description": "计费账户",
        "available": []
    },
    "qos": {
        "description": "服务质量等级",
        "available": []
    },
    "comment": {
        "description": "作业注释",
        "available": []
    },
    "chdir": {
        "description": "工作目录",
        "available": []
    },
    "nodes": {
        "description": "节点数",
        "available": []
    },
    "ntasks": {
        "description": "任务总数",
        "available": []
    },
    "ntasks-per-node": {
        "description": "每节点任务数",
        "available": []
    },
    "cpus-per-task": {
        "description": "每任务 CPU 数",
        "available": []
    },
    "distribution": {
        "description": "任务分布方式",
        "available": ["block", "cyclic", "arbitrary"]
    },
    "mem": {
        "description": "每节点内存",
        "available": []
    },
    "mem-per-cpu": {
        "description": "每核内存",
        "available": []
    },
    "mem-per-gpu": {
        "description": "每 GPU 内存",
        "available": []
    },
    "time": {
        "description": "最长运行时间",
        "available": []
    },
    "begin": {
        "description": "最早开始时间",
        "available": []
    },
    "deadline": {
        "description": "截止时间",
        "available": []
    },
    "gres": {
        "description": "通用资源，如 GPU",
        "available": ["gpu", "fpga"]
    },
    "gpus": {
        "description": "GPU 数量",
        "available": []
    },
    "gpus-per-node": {
        "description": "每节点 GPU 数",
        "available": []
    },
    "gpus-per-task": {
        "description": "每任务 GPU 数",
        "available": []
    },
    "cpus-per-gpu": {
        "description": "每 GPU CPU 数",
        "available": []
    },
    "constraint": {
        "description": "节点特性约束",
        "available": []
    },
    "nodelist": {
        "description": "指定节点",
        "available": []
    },
    "exclude": {
        "description": "排除节点",
        "available": []
    },
    "exclusive": {
        "description": "独占节点",
        "available": ["user", "mcs"]
    },
    "contiguous": {
        "description": "连续节点",
        "available": []
    },
    "reservation": {
        "description": "资源预留",
        "available": []
    },
    "licenses": {
        "description": "许可证",
        "available": []
    },
    "clusters": {
        "description": "目标集群",
        "available": []
    },
    "output": {
        "description": "标准输出文件",
        "available": []
    },
    "error": {
        "description": "标准错误文件",
        "available": []
    },
    "input": {
        "description": "标准输入文件",
        "available": []
    },
    "open-mode": {
        "description": "输出文件打开方式",
        "available": ["append", "truncate"]
    },
    "array": {
        "description": "作业数组",
        "available": []
    },
    "dependency": {
        "description": "作业依赖",
        "available": []
    },
    "hold": {
        "description": "提交后挂起",
        "available": []
    },
    "requeue": {
        "description": "允许重新排队",
        "available": []
    },
    "no-requeue": {
        "description": "禁止重新排队",
        "available": []
    },
    "nice": {
        "description": "降低调度优先级",
        "available": []
    },
    "signal": {
        "description": "结束前发送信号",
        "available": []
    },
    "hint": {
        "description": "任务绑定提示",
        "available": ["compute_bound", "memory_bound", "nomultithread"]
    },
    "oversubscribe": {
        "description": "允许与其他作业共享资源",
        "available": []
    },
    "mail-type": {
        "description": "邮件通知时机",
        "available": ["BEGIN", "END", "FAIL", "REQUEUE", "ALL"]
    },
    "mail-user": {
        "description": "通知邮箱",
        "available": []
    },
    "export": {
        "description": "传递的环境变量",
        "available": ["ALL", "NONE"]
    },
    "tmp": {
        "description": "临时磁盘",
        "available": []
    }
};

module.exports = { supportedCommands, supportedCommandDetails };
