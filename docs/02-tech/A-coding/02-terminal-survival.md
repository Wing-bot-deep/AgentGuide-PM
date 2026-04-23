---
title: 终端生存指南
description: Git、curl、日志命令——PM 在本地跑起来项目的最小技能集
---

# 终端生存指南

<div class="intro">

**你将学到什么**

- Git 最小命令集：查看代码、切换分支、读懂提交历史
- 用 curl 调试 API，不依赖 Postman
- 看日志排查问题，读懂报错信息
- 本地跑起来 AI 项目，验证效果

**为什么重要**：不需要成为命令行高手，但在"帮我跑一下"时不能束手无策。掌握这些基础命令，能让你独立验证功能、快速定位问题。

</div>

---

## 一、Git 最小命令集

AI 产品开发中，PM 最常需要的 Git 操作。

### 日常必备命令

```bash
# 查看当前状态（哪些文件改了）
git status

# 切换到某个分支（工程师让你看某个功能分支）
git checkout feature/xxx

# 拉取最新代码
git pull

# 查看提交历史（最近 10 条）
git log --oneline -10

# 查看某次提交改了什么
git show abc1234
```

### 读懂工程师说的 Git 词汇

| 词汇 | 含义 | PM 需要知道的 |
|------|------|-------------|
| branch（分支） | 独立的代码线 | 不同功能在不同分支开发，互不影响 |
| merge（合并） | 把一个分支的改动合进主分支 | 功能开发完成后，合并到 main 分支 |
| PR / MR | Pull Request / Merge Request | 代码审查请求，PM 需要在这里验收功能 |
| commit | 一次代码提交 | 有唯一的 hash 值（如 `abc1234`） |
| rebase | 整理提交历史 | 比 merge 更干净，但操作复杂 |
| conflict | 合并冲突 | 两个人改了同一处代码，需要手动解决 |
| tag / release | 版本标记 | 通常对应一次上线，如 `v1.2.0` |
| main / master | 主分支 | 生产环境代码，最稳定的版本 |

<div class="tip custom-block">

**快速上手技巧**

PM 最常用的 Git 操作场景：
1. **验收功能**：`git checkout feature/xxx` → 切换到功能分支 → 本地跑起来验证
2. **查看改动**：`git log --oneline -10` → 看最近提交 → `git show abc1234` 看具体改了什么
3. **更新代码**：`git pull` → 拉取最新代码 → 重新验证

</div>

---

## 二、curl 调 API

不需要 Postman，用命令行直接调接口验证效果。

### 调 OpenAI 兼容接口

```bash
curl https://api.siliconflow.cn/v1/chat/completions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -d '{
    "model": "Qwen/Qwen2.5-72B-Instruct",
    "messages": [{"role": "user", "content": "你好"}]
  }'
```

### curl 参数速查表

| 参数 | 作用 | 示例 |
|------|------|------|
| `-H` | 设置请求头 | `-H "Content-Type: application/json"` |
| `-d` | 发送 POST 数据 | `-d '{"key":"value"}'` |
| `-X` | 指定请求方法 | `-X DELETE` |
| `-s` | 静默模式（不显示进度） | 常配合 `\| jq` 使用 |
| `-o` | 输出到文件 | `-o output.json` |
| `-v` | 详细输出（调试用） | 显示完整请求和响应头 |

### 格式化 JSON 输出

```bash
# 安装 jq（macOS）
brew install jq

# 格式化输出
curl ... | jq '.'

# 提取特定字段
curl ... | jq '.choices[0].message.content'
```

<div class="exercise">

**互动练习：调试 API 调用**

假设你用 curl 调用 API 后，返回了以下错误：

```json
{
  "error": {
    "message": "Invalid API key provided",
    "type": "invalid_request_error",
    "code": "invalid_api_key"
  }
}
```

可能的原因有哪些？如何排查？

<details>
<summary>查看答案</summary>

**可能的原因**：
1. API Key 拼写错误或复制时多了空格
2. API Key 过期或被撤销
3. API Key 没有访问该模型的权限
4. 请求头格式错误（如 `Bearer` 后面少了空格）

**排查步骤**：
1. 检查 `-H "Authorization: Bearer YOUR_API_KEY"` 中的 Key 是否正确
2. 确认 `Bearer` 和 Key 之间有一个空格
3. 去 API 提供商后台确认 Key 状态和权限
4. 用 `-v` 参数查看完整请求头，确认格式正确

</details>

</div>

---

## 三、看日志排查问题

日志是排查问题最直接的工具。PM 在联调时经常需要看。

### 常见日志命令

```bash
# 实时查看日志（最常用）
tail -f app.log

# 查看最后 100 行
tail -n 100 app.log

# 搜索关键词
grep "ERROR" app.log
grep "user_id=12345" app.log

# 实时看日志 + 过滤
tail -f app.log | grep "ERROR"

# Docker 容器日志
docker logs container_name
docker logs -f container_name  # 实时跟踪
```

### 读懂日志里的关键信息

```
2026-04-17 14:32:01 [ERROR] api.chat - Token limit exceeded: 
  requested=4500, limit=4096, user_id=u_8823

↑ 时间戳   ↑ 级别    ↑ 模块     ↑ 错误描述          ↑ 上下文信息
```

### 日志级别（从低到高）

| 级别 | 含义 | PM 关注度 | 典型场景 |
|------|------|---------|---------|
| DEBUG | 开发调试信息 | 通常不看 | 变量值、函数调用栈 |
| INFO | 正常运行记录 | 了解即可 | 用户登录、API 调用成功 |
| WARN | 潜在问题（还没出错） | 注意观察 | 接近限流阈值、配置缺失但有默认值 |
| ERROR | 已经出错 | **重点关注** | API 调用失败、数据库连接失败 |
| FATAL / CRITICAL | 严重错误，服务可能崩溃 | **立即处理** | 内存溢出、核心服务不可用 |

<div class="tip custom-block">

**看日志的技巧**

1. **先看 ERROR 和 FATAL**：`grep -E "ERROR|FATAL" app.log`
2. **按时间范围过滤**：如果知道问题发生时间，用 `grep "2026-04-17 14:3" app.log` 缩小范围
3. **看上下文**：找到错误后，用 `grep -A 5 -B 5 "错误关键词" app.log` 查看前后 5 行
4. **关注用户 ID**：如果是用户报告的问题，搜索 `user_id` 或 `session_id` 追踪完整请求链路

</div>

---

## 四、读懂报错信息

### 报错的通用解读方法

```
步骤 1：看最后一行（通常是最直接的错误原因）
步骤 2：向上找 "Caused by" 或 "Error:" 开头的行
步骤 3：识别是哪个模块/文件出的问题
步骤 4：搜索错误关键词（Google / 问 AI）
```

### AI 产品常见报错类型

<div class="warning custom-block">

**Token 相关**
```
Error: context_length_exceeded
```
**原因**：输入太长，超过模型的 Context Window 上限  
**产品层解法**：截断历史消息 / 压缩 Context / 升级到更大上下文的模型

</div>

<div class="warning custom-block">

**API 限流**
```
Error 429: rate_limit_exceeded
```
**原因**：单位时间请求次数超限  
**产品层解法**：加请求队列、指数退避重试、提升 API Tier

</div>

<div class="warning custom-block">

**网络超时**
```
Error: timeout after 30s
```
**原因**：模型响应太慢，超过了设置的超时时间  
**产品层解法**：增大超时阈值 / 用流式输出改善感知 / 换更快模型

</div>

<div class="warning custom-block">

**认证失败**
```
Error 401: invalid_api_key
```
**原因**：API Key 不对、过期或无权限  
**解法**：检查 Key 配置，确认是否有对应模型的访问权限

</div>

<div class="warning custom-block">

**JSON 解析失败**
```
JSONDecodeError: Expecting value at line 1
```
**原因**：模型返回了非 JSON 格式，但代码期望 JSON  
**解法**：常见于 Prompt 没有严格约束输出格式，需要优化 Prompt

</div>

### 向工程师报告问题的模板

出现 Bug 时，PM 提供这些信息可以大幅加速排查：

```markdown
**问题描述**：[用户看到了什么？]

**复现步骤**：
1. 做了什么
2. 输入了什么
3. 出现了什么

**报错信息**：[截图或复制粘贴错误文本]

**发生时间**：[精确到分钟，便于查日志]

**影响范围**：[只有我 / 部分用户 / 所有用户]

**环境**：[生产环境 / 测试环境 / 本地]
```

<div class="exercise">

**互动练习：分析报错**

假设用户反馈"AI 回答到一半就停了"，你在日志中看到：

```
[ERROR] api.chat - Response finished with reason: length
  user_id=u_1234, requested_tokens=2000, actual_tokens=2000
```

这说明了什么问题？应该如何解决？

<details>
<summary>查看答案</summary>

**问题分析**：
- `finish_reason: length` 表示回答因为达到 `max_tokens` 限制而被截断
- `requested_tokens=2000, actual_tokens=2000` 确认了是 Token 限制导致的

**解决方案**：
1. **短期**：增大 `max_tokens` 参数（如改为 4000）
2. **中期**：在 UI 上提示用户"回答过长，已截断，可以继续追问"
3. **长期**：优化 Prompt，让模型生成更简洁的回答

**产品设计建议**：
- 在设置中让用户选择"简洁模式"或"详细模式"
- 当检测到 `finish_reason: length` 时，自动显示"继续生成"按钮

</details>

</div>

---

## 五、本地跑起来项目

PM 验证 AI 效果时，有时需要自己跑一个 Demo。

### 常见项目启动命令

```bash
# Node.js 项目（VitePress / React / Vue）
npm install        # 安装依赖
npm run dev        # 启动开发服务器
npm run build      # 构建生产版本

# Python 项目
pip install -r requirements.txt   # 安装依赖
python app.py                      # 启动
python -m uvicorn app:app --reload # FastAPI 启动

# 查看端口占用（本地服务没启动时）
lsof -i :3000      # 查看 3000 端口
```

### 环境变量配置

AI 项目通常需要配置 API Key：

```bash
# 方式 1：临时设置（只在当前终端生效）
export OPENAI_API_KEY=sk-xxx

# 方式 2：.env 文件（项目根目录）
OPENAI_API_KEY=sk-xxx
BASE_URL=https://api.siliconflow.cn/v1
MODEL=Qwen/Qwen2.5-72B-Instruct
```

<div class="warning custom-block">

**安全提醒**

- ⚠️ 不要把 `.env` 文件提交到 Git（确保 `.gitignore` 包含 `.env`）
- ⚠️ 不要在代码中硬编码 API Key
- ⚠️ 测试用的 Key 和生产环境的 Key 要分开

</div>

<div class="exercise">

**互动练习：启动项目排错**

你执行 `npm run dev` 后，看到以下错误：

```
Error: Cannot find module 'vitepress'
```

可能的原因和解决方法是什么？

<details>
<summary>查看答案</summary>

**原因**：依赖包没有安装（`node_modules` 目录不存在或不完整）

**解决方法**：
1. 先执行 `npm install` 安装依赖
2. 如果还是报错，尝试删除 `node_modules` 和 `package-lock.json`，重新安装：
   ```bash
   rm -rf node_modules package-lock.json
   npm install
   ```
3. 确认 `package.json` 中有 `vitepress` 依赖

**经验总结**：
- 第一次克隆项目后，必须先 `npm install` 或 `pip install -r requirements.txt`
- 如果依赖有更新，也需要重新安装

</details>

</div>

---

## 检查点

在继续之前，确保你能回答：

- [ ] 能用 `git checkout` 切换分支，用 `git log` 查看提交历史
- [ ] 能用 `curl` 调用 API 并用 `jq` 格式化输出
- [ ] 能用 `tail -f` 实时查看日志，用 `grep` 过滤关键词
- [ ] 能识别 AI 产品常见的 5 种报错类型并提出解决方案
- [ ] 能本地跑起来一个 Node.js 或 Python 项目

---

## 延伸阅读

- [读懂代码](./01-read-code)
- [技术方案评审](../C-communication/02-tech-review)
