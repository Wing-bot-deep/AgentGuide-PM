# AgentGuide-PM

> Harness 入口文件 — 只做路由，内容在子文件里

## 读取顺序

1. **项目背景 / 技术决策 / 模块设计** → 看 [.claude/bg.md](.claude/bg.md)
2. **当前进度 / 下一步任务** → 看 [.claude/status.md](.claude/status.md)

## 执行规则

- 需求有歧义时，先问清楚再动手
- 涉及多个文件的改动，先列计划让我确认，每步完成后告知
- 代码注释用中文，变量/函数名用英文，commit message 用英文
- 不要自动创建我没要求的文件（README、文档、示例等）
- 回复简洁，少铺垫，直接给结论/代码/结果

## 常用指令

- `/save` — 更新 `.claude/status.md` 当前进度和下一步任务
