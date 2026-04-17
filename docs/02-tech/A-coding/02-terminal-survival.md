---
title: 终端生存指南
description: Git、curl、日志命令——PM 在本地跑起来项目的最小技能集
---

# 终端生存指南

> 不需要成为命令行高手，只需要不在"帮我跑一下"时束手无策。

---

## 一、Git 最小命令集

AI 产品开发中，PM 最常需要的 Git 操作：

### 日常用到的

```bash
# 查看当前状态（哪些文件改了）
git status

# 切换到某个分支（工程师让你看某个功能分支）
git checkout feature/xxx

# 拉取最新代码
git pull

# 查看提交历史
git log --oneline -10

# 查看某次提交改了什么
git show abc1234
```

### 读懂工程师说的 Git 词汇

| 词汇 | 含义 |
|------|------|
| branch（分支） | 独立的代码线，不同功能在不同分支开发 |
| merge（合并） | 把一个分支的改动合进主分支 |
| PR / MR | Pull Request / Merge Request，代码审查请求 |
| commit | 一次代码提交，有 hash 值（如 `abc1234`） |
| rebase | 整理提交历史，比 merge 更干净 |
| conflict | 合并冲突，两个人改了同一处代码 |
| tag / release | 版本标记，通常对应一次上线 |
| main / master | 主分支，生产环境代码 |

---

## 二、curl 调 API

不需要 Postman，用命令行直接调接口验证效果：

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

### curl 参数速查

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

---

## 三、看日志

日志是排查问题最直接的工具。PM 在联调时经常需要看：

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

**日志级别**（从低到高）：

| 级别 | 含义 | PM 关注度 |
|------|------|---------|
| DEBUG | 开发调试信息 | 通常不看 |
| INFO | 正常运行记录 | 了解即可 |
| WARN | 潜在问题（还没出错） | 注意观察 |
| ERROR | 已经出错 | 重点关注 |
| FATAL / CRITICAL | 严重错误，服务可能崩溃 | 立即处理 |

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

**Token 相关**
```
Error: context_length_exceeded
→ 输入太长，超过模型的 Context Window 上限
→ 产品层解法：截断历史消息 / 压缩 Context / 升级模型
```

**API 限流**
```
Error 429: rate_limit_exceeded
→ 单位时间请求次数超限
→ 产品层解法：加请求队列、指数退避重试、提升 API Tier
```

**网络超时**
```
Error: timeout after 30s
→ 模型响应太慢，超过了设置的超时时间
→ 产品层解法：增大超时阈值 / 用流式输出改善感知 / 换更快模型
```

**认证失败**
```
Error 401: invalid_api_key
→ API Key 不对、过期或无权限
→ 检查 Key 配置，确认是否有对应模型的访问权限
```

**JSON 解析失败**
```
JSONDecodeError: Expecting value at line 1
→ 模型返回了非 JSON 格式，但代码期望 JSON
→ 常见于 Prompt 没有严格约束输出格式
```

### 向工程师报告问题的模板

出现 Bug 时，PM 提供这些信息可以大幅加速排查：

```
问题描述：[用户看到了什么？]
复现步骤：[1. 做了什么 2. 输入了什么 3. 出现了什么]
报错信息：[截图或复制粘贴错误文本]
发生时间：[精确到分钟，便于查日志]
影响范围：[只有我 / 部分用户 / 所有用户]
环境：[生产环境 / 测试环境 / 本地]
```

---

## 五、本地跑起来项目

PM 验证 AI 效果时，有时需要自己跑一个 Demo：

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

---

## 延伸阅读

- [读懂代码](./01-read-code)
- [技术方案评审](../C-communication/02-tech-review)
