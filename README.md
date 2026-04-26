# AgentGuide PM

<div align="center">

<img src="https://img.shields.io/badge/AI_PM-学习求职一体化-blue?style=for-the-badge" alt="AI PM">
<img src="https://img.shields.io/badge/面试题库-150+题-green?style=for-the-badge" alt="面试题库">
<img src="https://img.shields.io/badge/AI工具-浏览器直用-orange?style=for-the-badge" alt="AI工具">

<h2>专为 AI 产品经理打造的学习 + 求职 + AI 工具一体化平台</h2>

<p>
  <strong>面试题库 · 求职方法论 · AI 工具箱</strong><br/>
  内容完整，工具即开即用，无需后端
</p>

**🌐 站点地址：[https://wing-bot-deep.github.io/AgentGuide-PM/](https://wing-bot-deep.github.io/AgentGuide-PM/)**

</div>

---

## 核心内容

### 📚 05 面试题库 PM 版

| 分类 | 内容 | 题数 |
|------|------|------|
| 必考题精讲 | RAG / Agent / 模型评估 / 产品设计，六段式解析 | 30 题 |
| 高概率题库 · RAG | 核心原理、检索优化、工程实践、大厂真题 | 22 题 |
| 高概率题库 · Agent | 基础概念、Memory、Multi-Agent、安全、系统设计 | 22 题 |
| 高概率题库 · 模型评估 | LLM 评估、Agent 评估、评估实践 | 10 题 |
| 潜力题 & 场景题 | 开放性场景题，考察产品思维 | 7 题 |
| 前沿趋势开放题 | 每月自动更新，保持前沿认知 | 9 题 |
| 大厂面试规律 | 字节 / 阿里 / 腾讯 / 百度 / 美团高频考点 + 真题 | — |

每题均为**六段式结构**：题目 · 押题依据 · 标准答案 · 前沿加分 · 常见踩坑 · 回答策略

### 🤖 AI 工具箱（浏览器直用，无需后端）

| 工具 | 功能 |
|------|------|
| JD 智能押题器 | 粘贴 JD，生成 18 道定制题目 |
| AI 简历润色器 | 逐模块优化表达，强化量化数据 |
| 面试逐字稿生成器 | STAR 结构自我介绍 + 项目介绍 |
| AI 模拟面试官 | 5 类型 × 4 风格 × 3 时长，结束生成五维诊断报告 |
| 前沿速递雷达 | 输入方向，生成最新动态 + 面试加分点 |
| AI 竞品分析辅助 | 结构化竞品分析框架生成 |
| PRD 智能生成器 | 输入需求，生成规范 PRD |

> 所有工具需配置 API Key（存浏览器 localStorage，不上传服务器），支持 Claude / OpenAI / 兼容 API。

### 🎯 06 求职方法论

职业路径规划 · 简历撰写指南 · 作品集搭建 · 谈薪实战 · HR 面试通关

含**求职全流程时间线**：Week 1-2 简历打磨 → Week 3-4 投递准备 → Week 5-6 面试冲刺 → Week 7+ 拿到 Offer

### 📖 基础认知 & 技术理解

- **01 基础认知层**：Agent 概念 / 大模型原理（PM 版）/ 技术演进路线图 / PM 技术边界
- **02 技术理解层**：读懂代码 / 终端生存 / Context Engineering / Agent 记忆 & 评估 / 写给工程师的 PRD
- **03 行业资源导航**：框架生态地图 / 产品案例库 / 阅读清单
- **04 产品实战层**：AI 产品设计方法论 / 指标体系 / 体验设计 / Vibe Coding 实战

---

## 快速上手

```
1. 打开站点：https://wing-bot-deep.github.io/AgentGuide-PM/
2. 配置 API Key（支持 Claude / OpenAI / 兼容 API）
3. 按需选择：面试备战 → 05 题库 | AI 工具练习 → 各模块工具 | 求职准备 → 06 方法论
```

---

## 技术栈

| 项目 | 选型 |
|------|------|
| 文档框架 | VitePress |
| AI 接入 | 用户填 API Key，浏览器端直接调用，零后端 |
| 部署 | GitHub Pages，Actions 自动部署 |
| 自动更新 | GitHub Actions 月度自动更新前沿趋势题（每月 1 日和 15 日） |

---

## 本地运行

```bash
git clone https://github.com/Wing-bot-deep/AgentGuide-PM.git
cd AgentGuide-PM
npm install
npm run dev
```

---

> Fork 自 [AgentGuide](https://github.com/adongwanai/AgentGuide)，改造为 AI PM 专属版本。
