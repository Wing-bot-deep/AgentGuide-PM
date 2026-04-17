---
title: 读懂代码
description: PM 读 PR Diff、API 文档、技术方案文档的实用方法
---

# 读懂代码

> 目标不是理解每一行逻辑，而是能回答："这个改动影响了什么？"

---

## 一、读 PR Diff

Pull Request 是工程师提交代码改动的地方。你需要能看懂变更的范围和意图，不需要理解具体实现。

### Diff 语法速查

```diff
- 红色行（减号）：被删除的代码
+ 绿色行（加号）：新增的代码
  灰色行：未变化的上下文
```

### PM 读 PR 的三个问题

**1. 改动了哪些文件？**

文件路径透露信息：
- `api/` 或 `routes/` → 接口层改动，可能影响前端调用
- `components/` 或 `pages/` → 前端 UI 改动
- `config/` 或 `.env` → 配置改动，注意环境差异
- `prompts/` 或 `system_prompt` → Prompt 改动，AI 行为会变

**2. 这个改动和我的需求对齐吗？**

不需要看懂代码逻辑，只需确认：
- 新增的接口名称/参数是否符合你在 PRD 里写的
- 删除的代码是否是你说要下掉的功能
- 改动的配置是否和你预期的一致

**3. 有没有意外的副作用？**

关注以下信号：
- 改动了公共函数（被多处调用）→ 风险较高，需要工程师说明影响范围
- 删除了大量代码而不是修改 → 可能是重构，要确认功能不受影响
- 修改了数据库 Schema（`.sql` 或 `migration`）→ 数据变更，需关注兼容性

### 实战示例

```diff
// api/chat.py
- def call_model(prompt: str) -> str:
-     return openai_client.complete(prompt)
+ def call_model(prompt: str, temperature: float = 0.7) -> str:
+     return openai_client.complete(prompt, temperature=temperature)
```

PM 能读出的信息：
- 函数签名增加了 `temperature` 参数，有默认值 0.7（向后兼容）
- 这可能是为了支持 PRD 里某个"创意模式/精确模式"的需求
- 需要确认：前端调用的地方是否也会传这个参数？

---

## 二、读 API 文档

AI 产品几乎都有 API 对接需求。能自己读懂 API 文档，是 PM 的基础能力。

### API 文档的标准结构

```
1. Endpoint（接口地址）    POST https://api.example.com/v1/chat
2. Headers（请求头）       Authorization: Bearer {api_key}
3. Request Body（请求体）  JSON 格式的参数
4. Response（返回值）      JSON 格式的结果
5. Error Codes（错误码）   4xx 客户端错误 / 5xx 服务端错误
```

### 读 OpenAI 兼容 API 示例

```json
// 请求
POST /v1/chat/completions
{
  "model": "gpt-4o",
  "messages": [
    {"role": "system", "content": "你是一个助手"},
    {"role": "user", "content": "你好"}
  ],
  "temperature": 0.7,
  "max_tokens": 1000,
  "stream": true
}

// 返回（非流式）
{
  "choices": [{
    "message": {"role": "assistant", "content": "你好！有什么可以帮你？"},
    "finish_reason": "stop"
  }],
  "usage": {
    "prompt_tokens": 20,
    "completion_tokens": 15,
    "total_tokens": 35
  }
}
```

**PM 需要关注的字段**：

| 字段 | 含义 | 产品决策相关 |
|------|------|------------|
| `model` | 使用的模型版本 | 成本/性能平衡 |
| `max_tokens` | 最大输出长度限制 | 影响回答完整性 |
| `temperature` | 随机性（0-2） | 创意 vs 精确场景 |
| `stream` | 是否流式输出 | 用户体验（打字机效果） |
| `usage.total_tokens` | 本次消耗 Token 数 | 成本计算依据 |
| `finish_reason` | 停止原因 | `stop`正常 / `length`被截断 |

### 常见 HTTP 状态码

| 状态码 | 含义 | PM 应对 |
|--------|------|---------|
| 200 | 成功 | 正常 |
| 400 | 请求参数错误 | 检查前端传参，可能是字段缺失或格式错 |
| 401 | 未授权（API Key 无效） | Key 过期或权限不足 |
| 429 | 请求过多（限流） | 触发了 Rate Limit，需要加队列或降频 |
| 500 | 服务端错误 | 后端问题，找工程师 |
| 503 | 服务不可用 | 模型供应商故障，关注官方状态页 |

---

## 三、读技术方案文档

工程师写的技术方案（Tech Design Doc）是 PM 对齐需求的关键文档。

### 快速扫描框架（5分钟读完一份方案）

**第 1 分钟：看背景和目标**
- 解决什么问题？和 PRD 的目标一致吗？
- 有没有明确的成功指标？

**第 2 分钟：看架构图或流程图**
- 数据从哪里来，经过什么处理，到哪里去
- 有没有外部依赖（第三方 API、数据库）

**第 3 分钟：看方案对比**
- 工程师通常会列出 2-3 个备选方案，看他们为什么选了这个
- 被放弃的方案往往藏着重要的约束条件

**第 4 分钟：看风险和限制**
- 明确写出的风险要重点关注
- 看 edge case（边界情况）的处理

**第 5 分钟：看时间估算**
- 工期是否合理？有没有 Buffer？
- 依赖哪些外部资源（其他团队、三方服务）

### PM 在技术评审中应该提的问题

```
✅ 好问题（从用户/产品视角）：
- "这个方案在高并发下，用户会感受到延迟上升吗？"
- "如果第三方 API 挂了，我们的降级策略是什么？"
- "这个改动会影响已有用户的数据吗？"
- "AB 测试怎么设计？怎么衡量成功？"

❌ 不好的问题（越俎代庖）：
- "为什么不用 X 技术？"（除非你有充分理由）
- "这里能不能优化一下？"（太模糊，帮不上忙）
- "为什么要这么写？"（质疑而不是好奇）
```

---

## 延伸阅读

- [终端生存指南](./02-terminal-survival)
- [写给工程师的 PRD](../C-communication/01-prd-for-engineers)
- [技术方案评审](../C-communication/02-tech-review)
