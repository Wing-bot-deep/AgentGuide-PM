---
title: AI 技术演进路线图
description: 从 LLM 到 RAG 到 Agent 再到 Multi-Agent，PM 必须掌握的技术脉络
---

# AI 技术演进路线图

> 理解演进方向，才能判断当下技术选型的合理性，避免在面试中说出"已经过时"的方案。

## 技术代际全景

```
2017     2019     2020     2022     2023     2024     2025+
  │        │        │        │        │        │        │
  ▼        ▼        ▼        ▼        ▼        ▼        ▼
Transformer → GPT-2 → GPT-3 → ChatGPT → GPT-4 → Agent → Multi-Agent
                               ↑
                        技术拐点：涌现能力出现
```

---

## 第一代：纯 LLM（2020-2022）

**核心能力**：强大的文本理解和生成

**局限**：
- 知识截止日期（不知道最新信息）
- 无法调用外部工具
- 上下文有限，长文档处理差
- 容易幻觉

**代表产品**：早期 ChatGPT、文心一言 1.0、Bard

**PM 应用**：文本生成、摘要、翻译、简单问答

---

## 第二代：RAG（2022-2023）

**RAG = Retrieval-Augmented Generation，检索增强生成**

### 解决的问题
LLM 的知识是"冻结"的，RAG 让模型在回答前先查阅最新资料。

### 工作原理

```
用户提问 → [向量搜索] → 检索相关文档片段
                              ↓
                    [Prompt 组装] = 问题 + 检索到的上下文
                              ↓
                    [LLM 生成答案]（基于检索内容，不靠记忆）
```

### 核心组件
- **向量数据库**：存储文档的 Embedding（Pinecone / Milvus / Chroma）
- **召回算法**：语义相似度搜索（区别于关键词搜索）
- **Reranker**：对召回结果二次排序，提升精度

### PM 决策点

| 问题 | RAG 适合 | Fine-tuning 适合 |
|------|---------|-----------------|
| 需要引用最新数据 | ✅ | ❌ |
| 需要特定语气/格式 | ❌ | ✅ |
| 知识库经常更新 | ✅ | ❌ |
| 成本敏感 | ✅（成本低） | ❌（成本高） |

**代表产品**：企业知识库问答、AI 客服（接入产品手册）、Notion AI

---

## 第三代：Agent（2023-2024）

**核心跃升**：从"回答问题"到"完成任务"

### 能力差异

| 能力 | 纯 LLM | RAG | Agent |
|------|--------|-----|-------|
| 生成文本 | ✅ | ✅ | ✅ |
| 检索知识 | ❌ | ✅ | ✅ |
| 调用 API | ❌ | ❌ | ✅ |
| 多步规划 | ❌ | ❌ | ✅ |
| 自主重试 | ❌ | ❌ | ✅ |
| 操作文件/系统 | ❌ | ❌ | ✅ |

### Tool Use（工具调用）是关键

Agent 把 LLM 变成"大脑"，外接"手脚"：

```
工具箱示例：
- search_web(query)      # 搜索互联网
- execute_code(code)     # 运行代码
- send_email(to, body)   # 发送邮件
- query_db(sql)          # 查询数据库
- create_file(path, content) # 创建文件
```

**代表产品**：Cursor（代码 Agent）、Devin、Manus、Perplexity

---

## 第四代：Multi-Agent（2024-2025）

**核心跃升**：多个 Agent 协作完成复杂任务

### 为什么需要多 Agent？

单 Agent 的局限：
- Context Window 有限，超长任务失败率高
- 一个 Agent 难以同时擅长所有技能
- 并行执行效率低

### 主要协作模式

**模式 1：分工协作**
```
主管 Agent（Orchestrator）
├── 研究 Agent（搜索 + 收集信息）
├── 写作 Agent（生成内容）
├── 审查 Agent（检查质量）
└── 发布 Agent（执行输出）
```

**模式 2：流水线（Pipeline）**
```
输入 → Agent A（预处理）→ Agent B（核心处理）→ Agent C（后处理）→ 输出
```

**模式 3：竞争选优（Competition）**
多个 Agent 独立完成同一任务，人工或评审 Agent 选最佳结果。

### 代表产品
- **CrewAI**：角色化多 Agent 框架
- **AutoGen**（微软）：多 Agent 对话框架
- **Manus**：国内多 Agent 产品
- **Google Project Mariner**：浏览器操作 Agent

---

## 当前技术前沿（2025）

### 1. 长上下文与 KV Cache 优化
模型上下文越来越长（1M+ Token），但推理成本也在优化。

### 2. 多模态 Agent
不只处理文字，还能看图、看视频、操作 UI（Computer Use）。

### 3. 边缘推理（On-device AI）
手机、PC 本地运行小模型，隐私保护 + 低延迟。代表：Apple Intelligence。

### 4. Agent 安全与护栏
越来越多企业关注 Agent 的可控性：权限最小化、操作审计、回滚机制。

---

## PM 面试常见问题

**Q：RAG 和 Fine-tuning 怎么选？**

> "主要看知识是否需要频繁更新。RAG 适合知识库经常变化的场景（产品文档、法规更新），成本低、好维护；Fine-tuning 适合固定风格/格式要求高的场景，但知识截止、更新成本高。大多数企业场景优先 RAG。"

**Q：现在 Agent 落地最大的挑战是什么？**

> "三个核心挑战：一是可靠性，多步执行中错误累积，生产稳定性比 Demo 差很多；二是成本，复杂任务的 Token 消耗是普通对话的数十倍；三是用户信任，用户不知道 Agent 在做什么，接受度低。这也是为什么现在大多数落地产品还是'Copilot'而非完全自主的 Agent。"

---

## 延伸阅读

- [Agent 是什么](./01-agent-concept)
- [大模型原理（PM 版）](./02-llm-principles)
- [AI PM 技术边界](./04-pm-tech-boundary)
