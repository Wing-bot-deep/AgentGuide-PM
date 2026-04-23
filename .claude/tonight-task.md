# 今晚的任务

<!-- 每次睡前在这里写好任务，保存后运行 overnight -->
<!-- ⚠️ 不要删除或修改文件末尾的「更新 CLAUDE.md」部分 -->

## 背景说明

项目目录：~/Projects/AgentGuide-PM
框架：VitePress，base 路径为 `/AgentGuide-PM/`
所有 Vue 组件已全局注册，可在任意 .md 文件中直接用标签嵌入，无需 import。
已注册组件：`<ApiKeyManager>`、`<JdQuizGenerator>`、`<MockInterviewer>`、`<ResumePolisher>`、`<InterviewScript>`

---

## 任务一：创建 docs/05-interview/01-must-know.md

AI PM 面试必考题，共 10 道，每道题包含以下六段式结构：

1. **题目**
2. **押题依据**（为什么这道题必考）
3. **标准答案**（完整、可直接背诵的回答，300-500字）
4. **前沿加分回答**（结合 2025-2026 年最新动态）
5. **常见踩坑点**（面试者容易犯的错误）
6. **回答策略**（结构化建议，如 STAR/总分总等）

10 道必考题范围：
1. 请介绍一下你对 AI Agent 的理解
2. RAG 是什么？在产品中如何应用？
3. 大模型的幻觉问题你们是怎么解决的？
4. 如何评估一个 AI 功能的效果？
5. AI 产品和传统产品的 PRD 有什么区别？
6. 你如何与算法团队协作？
7. Prompt Engineering 在产品层面你怎么理解？
8. AI 产品的冷启动问题你怎么解决？
9. 你怎么看 Function Calling / MCP 这类技术对产品的影响？
10. 如果模型效果达不到预期，作为 PM 你会怎么处理？

文件顶部加 VitePress frontmatter：
```
---
title: 必考题精讲
description: AI PM 面试 10 道必考题，六段式完整解析
---
```

---

## 任务二：创建 docs/05-interview/tools.md

页面标题：AI 面试工具箱

内容结构：
1. 简短说明（2-3句话介绍这个页面有什么工具）
2. 嵌入 `<ApiKeyManager />` 组件（加说明：所有工具需要先配置 API Key）
3. 嵌入 `<JdQuizGenerator />` 组件（加标题"JD 智能押题器"和简短说明）
4. 嵌入 `<MockInterviewer />` 组件（加标题"AI 模拟面试官"和简短说明）

frontmatter：
```
---
title: AI 面试工具箱
description: JD 押题器 + 模拟面试官，帮你高效备战 AI PM 面试
---
```

---

## 任务三：更新 docs/06-career/index.md

替换为正式内容，结构：
1. 模块介绍（3-4句话，说明这个模块能帮求职者做什么）
2. 模块导航卡片（Markdown 表格或列表），链接到以下子页面：
   - 03-resume-polish.md：简历润色指南
   - 04-interview-script.md：面试逐字稿生成
   - 05-mock-interview.md：模拟面试 + 诊断报告
3. 嵌入 `<ApiKeyManager />` 组件

frontmatter：
```
---
title: 求职方法论
description: 简历润色、逐字稿生成、模拟面试一站式求职工具
---
```

---

## 任务四：创建 docs/06-career/03-resume-polish.md

页面标题：简历润色指南

内容结构：
1. 说明如何写一份好的 AI PM 简历（200字左右的指导建议）
2. 嵌入 `<ApiKeyManager />` 组件
3. 嵌入 `<ResumePolisher />` 组件

frontmatter：
```
---
title: 简历润色指南
description: AI 驱动的简历润色工具，让你的 AI PM 简历脱颖而出
---
```

---

## 任务五：创建 docs/06-career/04-interview-script.md

页面标题：面试逐字稿生成

内容结构：
1. 说明面试逐字稿的用途和使用方法（150字左右）
2. 嵌入 `<ApiKeyManager />` 组件
3. 嵌入 `<InterviewScript />` 组件

frontmatter：
```
---
title: 面试逐字稿生成
description: 根据 JD 和简历，生成可直接练习的面试逐字稿
---
```

---

## 任务六：创建 docs/06-career/05-mock-interview.md

页面标题：模拟面试 + 诊断报告

内容结构：
1. 说明模拟面试的流程和五维诊断报告（150字左右）
2. 嵌入 `<ApiKeyManager />` 组件
3. 嵌入 `<MockInterviewer />` 组件

frontmatter：
```
---
title: 模拟面试 + 诊断报告
description: AI 模拟面试官 + 五维能力诊断，找到你的提升空间
---
```

---

## 任务七：更新 docs/.vitepress/config.ts 的 sidebar

在现有 config.ts 基础上，更新 `/05-interview/` 和 `/06-career/` 的 sidebar items：

`/05-interview/` sidebar 改为：
```ts
{ text: '概览', link: '/05-interview/' },
{ text: '必考题精讲', link: '/05-interview/01-must-know' },
{ text: 'AI 面试工具箱', link: '/05-interview/tools' },
```

`/06-career/` sidebar 改为：
```ts
{ text: '概览', link: '/06-career/' },
{ text: '简历润色指南', link: '/06-career/03-resume-polish' },
{ text: '面试逐字稿生成', link: '/06-career/04-interview-script' },
{ text: '模拟面试 + 诊断报告', link: '/06-career/05-mock-interview' },
```

---

## 任务八：commit + push

所有文件完成后，执行：
1. git add 所有新建和修改的文件
2. git commit，message 用英文，conventional commits 风格（feat: ...）
3. git push origin main

push 成功后打印：🚀 已推送，GitHub Actions 将自动部署到 https://wing-bot-deep.github.io/AgentGuide-PM/

---

每个任务完成后打印 ✅ 任务名。全部完成后打印 🎉 所有任务完成。

---

## ⚙️ 固定收尾（每次都要执行，不要跳过）

所有任务完成后，更新 /Users/wing/Projects/AgentGuide-PM/CLAUDE.md 的「十一、当前进度」和「十二、下一步任务」两个章节：
- 把本次完成的任务标记为 [x]
- 「下一步任务」只保留 3-5 条最近可执行的具体任务
- 不要修改其他章节（一到十）
