<!-- 最后更新：2026-04-16 -->

# AgentGuide-PM 项目备忘录

> 基于 [AgentGuide](https://github.com/adongwanai/AgentGuide) Fork 改造，专为 AI 产品经理打造的学习 + 求职 + AI 工具一体化平台。

---

## 一、项目目标

- **核心受众**：正在求职或转型 AI PM 的产品经理
- **不只是文档**：内置 AI 能力的活工具（用户填 API Key，浏览器端直接调用大模型）
- **与原项目关系**：Fork AgentGuide，复用共同内容，删除/改造工程师向内容，新增 PM 专属模块
- **所有模块完全独立**：无前置依赖，可从任意模块开始

---

## 二、技术选型决策

| 决策项 | 选择 | 原因 |
|--------|------|------|
| 文档框架 | VitePress | 支持 Vue 组件嵌入、搜索、侧边栏、深色模式、手机适配 |
| AI 接入方式 | 用户填 API Key | Key 存浏览器 localStorage，无需后端，零运营成本 |
| 支持模型 | Claude / OpenAI / 兼容 API | 用户自选 |
| 部署 | GitHub Pages 或 Vercel | 免费，自动部署 |
| 源码管理 | Fork 自 AgentGuide | 复用基础内容，降低开发成本 |

---

## 三、已确认去掉的功能

- ~~答案点评器~~：面试题库直接提供优秀标准答案，刷题时不需要点评，直接学标准答案更高效

---

## 四、六大模块概览

```
01-基础认知层    Agent概念/大模型原理/技术演进/PM技术边界
02-技术理解层    A.代码生存技能 + B.AI技术认知 + C.技术沟通能力
03-行业资源导航   框架生态/案例库/竞品分析/阅读清单
04-产品实战层    设计方法论/PRD模板/指标体系/体验设计/Vibe Coding项目
05-面试题库PM版  150+题(含标准答案) + JD押题器 + 模拟面试官 + 前沿速递
06-求职方法论    职业路径/简历模板+润色/逐字稿生成/模拟面试+诊断/作品集/谈薪
```

---

## 五、AI 工具箱清单（10个）

| # | 工具 | 嵌入位置 | 优先级 |
|---|------|---------|--------|
| 1 | API Key 管理器 | 全站通用 | P0 |
| 2 | 简历润色器 | 06-03 简历润色指南 | P0 |
| 3 | 面试逐字稿生成器 | 06-04 面试逐字稿生成 | P0 |
| 4 | JD 智能押题器 | 05-07 岗位押题指南 | P0 |
| 5 | AI 模拟面试官 | 06-05 / 05-tools | P0 |
| 6 | 面试诊断报告 | 模拟面试结束后生成 | P0 |
| 7 | 前沿速递雷达 | 05-08 前沿速递 | P1 |
| 8 | 终端报错诊断器 | 02-A-01 看懂终端输出 | P2 |
| 9 | 竞品分析辅助 | 03-03 竞品分析模板 | P2 |
| 10 | PRD 智能生成器 | 04-02 PRD 模板 | P2 |

---

## 六、JD 押题器核心设计

每道题输出 6 部分：题目 + 押题依据 + 标准答案 + 前沿加分回答 + 常见踩坑点 + 回答策略

题目分类：必考题(5) + 高概率题(5) + 潜力题(5) + 前沿附加题(3)

---

## 七、前沿追问三层模型（押题器 + 模拟面试官共用）

```
🌍 宏观趋势层：行业走向/技术范式/产业格局
   例："Agent会取代SaaS吗？" / "Scaling Law到瓶颈了吗？"

🔥 热点案例层：近期事件/产品动态/争议话题/伦理安全/行业格局
   例："Sora下架你怎么看？" / "XX公司裁AI部门常犯什么错？"

🔧 技术深度层：具体技术方案/实现原理
   例："GraphRAG vs 传统RAG？" / "MCP vs Function Calling？"
```

模拟面试中前沿追问占比约 1/3（30分钟面试约 5-6 道）

触发机制：根据候选人回答中的关键词，自然衍生追问

---

## 八、模拟面试官设计

- 面试类型：技术面/产品面/HR面/压力面/综合面
- 面试官风格：专业严谨/随和引导/压力挑战/连环追问
- 时长：15分钟(8题) / 30分钟(15题) / 45分钟(20题)
- 可选输入：简历 + JD + 重点考察方向
- 题目编排：暖场→核心考察(穿插技术追问)→深度压力(穿插热点追问)→格局考察(宏观追问)→收尾
- 结束后生成五维诊断报告：技术理解/产品思维/表达清晰度/逻辑深度/前沿认知

---

## 九、前沿速递数据库结构

```json
{
  "标题": "事件标题",
  "时间": "2026-04",
  "标签": {
    "话题": ["标签1", "标签2"],
    "层次": "宏观趋势 | 热点案例 | 技术深度",
    "关联技术": [],
    "关联公司": [],
    "面试追问": ["预生成的追问题"],
    "建议回答要点": [],
    "可关联的宏观问题": "",
    "面试相关度": "高|中|低",
    "保鲜期": "3个月"
  }
}
```

---

## 十、开发优先级

```
Phase 1（第 1 天）→ Fork + 目录结构 + README + VitePress 初始化 + 部署
Phase 2（第 2-5 天）⭐ → 05面试题库 + 06求职方法论 + P0 AI工具（面试期间急用）
Phase 3（第 6-10 天）→ 01基础认知层 + 前沿速递组件 + 面经收集
Phase 4（第 11-15 天）→ 02技术理解层 + 报错诊断器 + 代码生存技能
Phase 5（持续）→ 03行业资源 + 04产品实战 + 持续更新
```

---

## 十一、当前进度

**Phase 1 ✅ 已完成**
- [x] Fork https://github.com/adongwanai/AgentGuide → 重命名为 AgentGuide-PM（GitHub: Wing-bot-deep/AgentGuide-PM）
- [x] Clone 到本地 `~/Projects/AgentGuide-PM`
- [x] 重构目录结构（6大模块 + docs/.vitepress/theme）
- [x] 初始化 VitePress 配置（config.ts，base: `/AgentGuide-PM/`）
- [x] package.json 添加 `"type": "module"` 修复 ESM 问题
- [x] 配置 GitHub Actions 自动部署到 GitHub Pages
- [x] 站点已上线：https://wing-bot-deep.github.io/AgentGuide-PM/

**Phase 2 🚧 进行中**

基础设施（已完成，未 commit）：
- [x] `docs/.vitepress/theme/composables/useApiKey.ts`：支持第三方兼容 API（baseUrl + apiKey + model），localStorage 持久化，SSE 流式输出
- [x] `docs/.vitepress/theme/components/ApiKeyManager.vue`：全站 API Key 配置组件
- [x] `docs/.vitepress/theme/components/JdQuizGenerator.vue`：JD 押题器（18题，六段式）
- [x] `docs/.vitepress/theme/components/MockInterviewer.vue`：模拟面试官（含五维诊断报告）
- [x] `docs/.vitepress/theme/components/ResumePolisher.vue`：简历润色器
- [x] `docs/.vitepress/theme/components/InterviewScript.vue`：面试逐字稿生成器
- [x] `docs/.vitepress/theme/style.css`：全站 AI 工具卡片样式
- [x] `docs/.vitepress/theme/index.ts`：全局注册所有组件
- [x] `docs/05-interview/index.md`：模块首页（含 ApiKeyManager + JdQuizGenerator）

待完成（下次继续）：
- [ ] `docs/05-interview/01-must-know.md`：10道必考题，六段式完整解析
- [ ] `docs/05-interview/tools.md`：AI 工具箱页（JdQuizGenerator + MockInterviewer）
- [ ] `docs/06-career/index.md`：更新为正式内容 + 子模块导航
- [ ] `docs/06-career/03-resume-polish.md`：嵌入 ResumePolisher
- [ ] `docs/06-career/04-interview-script.md`：嵌入 InterviewScript
- [ ] `docs/06-career/05-mock-interview.md`：嵌入 MockInterviewer
- [ ] 更新 `config.ts` sidebar 添加 05/06 子页面链接
- [ ] commit + push 所有 Phase 2 变更

工具配置（已完成）：
- [x] `~/.claude/skills/save.md`：自定义 `/save` 命令，输入后自动更新 CLAUDE.md 当前进度

**状态**：Phase 1 完成并上线；Phase 2 基础设施全部写完，内容页面待创建，所有变更尚未 commit。

**重要技术细节**：
- 用户使用第三方 OpenAI 兼容 API（非直接 Anthropic/OpenAI），配置三个字段：baseUrl / apiKey / model
- 所有 AI 组件通过 `useApiKey` composable 统一调用，支持流式输出
- VitePress base path: `/AgentGuide-PM/`

---

## 十二、下一步任务

1. 创建 `docs/05-interview/01-must-know.md`（10道必考题，六段式解析）
2. 创建 `docs/05-interview/tools.md`
3. 更新 `docs/06-career/index.md` + 创建 03/04/05 子页面
4. 更新 `config.ts` sidebar
5. commit + push，触发 GitHub Actions 部署
