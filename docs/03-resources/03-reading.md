---
title: 阅读清单
description: AI PM 的持续学习信息源——博客、Newsletter、播客、书单
---

# 阅读清单

> 不需要全部订阅，按自己的节奏选 3-5 个固定信息源，比刷到什么看什么更有效。

---

## 按情况快速选择

<div class="card-grid">

<div class="nav-card">

### 🚀 备战面试中（时间紧）
**每天 5 分钟**：TLDR AI（通勤扫）  
**每周 1 篇**：The Batch 或量子位深度文章  
**论文**：只看 InstructGPT + ReAct 的 Abstract  
**书**：《Co-Intelligence》优先，边读边用

</div>

<div class="nav-card">

### 🔄 转型 AI PM（需要建框架）
**先读书**：吴恩达 AI for Everyone（Coursera 免费）  
**再看**：Anthropic Blog + OpenAI Blog，感受产品叙事方式  
**写文章**：输出 1-2 篇技术理解文章，倒逼理解深度

</div>

<div class="nav-card">

### 📈 已有经验（保持前沿感知）
**固定订阅**：The Batch + Lenny's Newsletter  
**X / Twitter**：关注 @sama @karpathy，一手观点  
**论文**：Papers With Code 每周看热榜 Top 3 摘要

</div>

</div>

---

## 一级信息源（模型厂商官方）

最权威的 AI 动态来自这里，发布了什么才是真实进展：

| 来源 | 内容 | 读什么收获 |
|------|------|-----------|
| [Anthropic Blog](https://www.anthropic.com/news) | Claude 模型更新、安全研究、产品理念 | 理解"负责任 AI"的产品设计逻辑，面试聊 AI 安全时的一手素材 |
| [OpenAI Blog](https://openai.com/news) | GPT/o 系列更新、API 新功能 | 行业风向标，o 系列推理模型的发布往往带动面试考点变化 |
| [Google DeepMind Blog](https://deepmind.google/discover/blog/) | Gemini 更新、研究进展 | 多模态方向的最新进展，原生多模态的产品设计思路 |
| [Meta AI Blog](https://ai.meta.com/blog/) | Llama 系列、开源动态 | 开源模型选型依据，理解开源 vs 闭源的商业逻辑 |
| [深度求索 Blog](https://www.deepseek.com/news) | DeepSeek 系列更新 | 国内最具性价比模型的技术决策，面试聊成本优化时的案例 |

---

## Newsletter（每周/双周 精读）

| Newsletter | 定位 | 读什么收获 | 推荐指数 |
|-----------|------|-----------|---------|
| **The Batch**（吴恩达） | AI 领域每周综述 | 每期有吴恩达的观点短文，建立 AI 宏观框架最高效的方式 | ⭐⭐⭐⭐⭐ |
| **TLDR AI** | 每日 3 分钟 AI 新闻摘要 | 通勤扫一遍，保持行业感知，不错过重大事件 | ⭐⭐⭐⭐ |
| **Ben's Bites** | AI 产品动态，偏应用层 | 产品视角解读新工具，PM 可直接用于丰富产品认知 | ⭐⭐⭐⭐ |
| **Lenny's Newsletter** | 产品/增长，有 AI 产品专题 | 最好的 AI PM 实践案例来源，案例详细可落地 | ⭐⭐⭐⭐ |
| **AI Supremacy** | AI 商业分析 | 商业模式和竞争格局分析，适合准备战略类面试题 | ⭐⭐⭐ |

**国内推荐**：
- **量子位、机器之心**（微信公众号）——量子位偏快讯，机器之心偏技术深度，两者搭配覆盖全面
- **硅星人、差评**（微信公众号）——产品视角解读，硅星人的竞品分析系列值得精读
- **𝕏（Twitter）上关注 @sama @karpathy @ylecun** ——一手观点，比二手报道早 1-2 天

---

## 论文（不需要全读，会找就行）

### 必读经典

| 论文 | 意义 | PM 读法 |
|------|------|---------|
| Attention Is All You Need (2017) | Transformer 的起点 | 只看 Figure 1（架构图）+ Abstract，理解"注意力机制"是什么即可 |
| GPT-3: Language Models are Few-Shot Learners (2020) | 涌现能力的第一次大规模验证 | 看 Abstract 和 Few-shot 示例部分，理解为什么"举例子"会让模型变聪明 |
| InstructGPT / RLHF (2022) | ChatGPT 背后的对齐方法 | 看 Introduction，理解 RLHF 三步（SFT→RM→PPO），面试必考 |
| ReAct: Synergizing Reasoning and Acting (2022) | Agent 推理+行动的核心框架 | 看 Figure 1 和示例，理解 Thought→Action→Observation 循环 |
| RAG: Retrieval-Augmented Generation (2020) | RAG 的原始论文 | 看 Abstract + 架构图，理解"检索增强"比纯生成好在哪里 |

### 查论文的方法

```
arXiv（arxiv.org）— AI 论文预印本，最新研究第一发布地
Papers With Code（paperswithcode.com）— 论文 + 代码 + 基准测试
Semantic Scholar — 学术搜索，可看引用关系
```

**PM 的正确姿势**：只看 Abstract（摘要）和 Conclusion，理解"做了什么、结论是什么"即可。有感兴趣的再深入看。

---

## 书单

### AI 产品与商业

| 书名 | 作者 | 读什么收获 |
|------|------|-----------|
| 《The Coming Wave》 | Mustafa Suleyman | DeepMind 联创对 AI 风险的第一手判断，面试聊 AI 治理/安全时的素材库 |
| 《Co-Intelligence》 | Ethan Mollick | 最实用的"AI 协作工作法"，直接改变你用 AI 的方式，PM 必读 |
| 《AI Superpowers》 | Kai-Fu Lee（李开复） | 中美 AI 竞争格局，理解为什么国内 AI PM 岗位有自己的特殊性 |

### 产品方法论

| 书名 | 作者 | 读什么收获 |
|------|------|-----------|
| 《Continuous Discovery Habits》 | Teresa Torres | 用户研究的系统方法，尤其是"机会树"框架，AI 产品做需求挖掘时直接可用 |
| 《Inspired》 | Marty Cagan | 产品经理经典教材，重点读"产品发现"章节，建立产品思维底层框架 |
| 《The Cold Start Problem》 | Andrew Chen | 网络效应与冷启动策略，AI 平台产品（API/插件生态）的增长参考 |

---

## 视频课程

| 课程 | 平台 | 读什么收获 | 适合 |
|------|------|-----------|------|
| CS224N: NLP with Deep Learning | Stanford（YouTube） | 斯坦福 NLP 课程，Transformer 原理讲得最清楚，补技术底子用 | 想深入理解 NLP 原理 |
| Practical Deep Learning for Coders | fast.ai | 动手做实验为主，不会写代码也能跑起来，建立对训练过程的直观感知 | 想动手跑实验 |
| LLM Bootcamp | Full Stack Deep Learning | 工程向，覆盖从 Prompt 到部署的完整链路，了解工程师在做什么 | PM 了解工程全貌 |
| 吴恩达 AI for Everyone | Coursera | AI PM 入门最佳，非技术视角，理解 AI 能做什么/不能做什么，强烈推荐 | AI PM 入门 |

---

## 社区与交流

| 社区 | 平台 | 内容 |
|------|------|------|
| Hugging Face | huggingface.co | 模型库、数据集、Demo |
| r/MachineLearning | Reddit | 研究者讨论 |
| AI PM（微信群） | 微信 | 国内 AI PM 交流，搜索加入 |
| 即刻 AI 话题 | 即刻 App | 国内从业者动态 |

---

## 学习节奏建议

```
每天 5 分钟：看 TLDR AI 摘要（通勤时间）
每周 30 分钟：读 1 篇 The Batch 或量子位深度文章
每月 2 小时：精读 1 个产品案例或论文摘要
每季度 1 次：回顾技术演进，更新自己的认知框架
```

**核心原则**：深度 > 广度。能把 3 个案例讲清楚，比"我读了 100 篇文章"更有说服力。

---

## 延伸阅读

- [框架与生态地图](./01-frameworks)
- [产品案例库](./02-cases)
- [AI 技术演进路线图](../01-foundation/03-tech-evolution)
