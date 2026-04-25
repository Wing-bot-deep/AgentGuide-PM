# 当前进度（高频变，用 /save 更新）

> 最后更新：2026-04-25

## 当前阶段

**优化迭代阶段** — 主体内容完成，正在补充深度内容和组件优化

## 已完成

**Phase 1 ✅**
- [x] Fork + Clone + 目录结构重构
- [x] VitePress 配置（config.ts，base: `/AgentGuide-PM/`）
- [x] GitHub Actions 自动部署，站点上线

**Phase 2 ✅**
- [x] useApiKey composable + 5个 AI 工具组件
- [x] 05-interview 全量内容（必考题/高概率题/前沿趋势/大厂案例）
- [x] 06-career 核心页面（简历润色/逐字稿/模拟面试/谈薪/HR面）
- [x] 02-tech B组内容（上下文工程/Agent记忆/Agent评估）

**Phase 3 ✅**
- [x] 01-foundation 基础认知层（4页）
- [x] 05-interview/03-potential.md 潜力题库（7道场景题）
- [x] TrendRadar 前沿速递组件，嵌入 04-trends 页面

**Phase 4 ✅**
- [x] 02-tech/A-coding（概览 + 读懂代码 + 终端生存指南）
- [x] 02-tech/C-communication（概览 + PRD模板 + 技术方案评审）

**Phase 5 ✅**
- [x] 03-resources（框架生态地图 + 产品案例库 + 阅读清单）
- [x] 04-product（设计方法论 + 指标体系 + AI体验设计）
- [x] 全站侧边栏完整更新

**补充完善 ✅**
- [x] 06-career/01-career-path.md（四类岗位/成长路径/大厂vs创业/转型策略）
- [x] 06-career/02-resume-guide.md（结构模板/量化技巧/关键词/反面案例/Checklist）
- [x] 04-product/04-vibe-coding.md（5个实战项目/简历写法/工具选择）

**内容深度改造 ✅**
- [x] 02-high-prob.md RAG Q1-Q22 补六段式完整答案
- [x] 02-high-prob.md Agent Q1-Q22 补六段式答案
- [x] 02-high-prob.md 模型评估 Q1-Q10 补六段式答案

**React.dev 风格改造 ✅**
- [x] 02-tech/B-ai-tech（上下文工程/Agent记忆/Agent评估）— intro块+互动练习+检查点
- [x] 02-tech/C-communication（PRD模板/技术方案评审）— intro块+互动练习+检查点
- [x] 04-product（设计方法论/指标体系/AI体验设计）— intro块+互动练习+检查点
- [x] 01-foundation 4页、02-tech/A-coding 2页 — 已确认具备互动练习和检查点（无需改造）

**遗留缺口清理 ✅**
- [x] style.css 补充 intro/exercise/tip/warning custom-block 样式（修复线上无样式问题）
- [x] 06-career/06-portfolio.md 完整内容（4类作品写法+平台选择+模板+Checklist）
- [x] 02b-resume-examples.md 加入侧边栏导航
- [x] 02-tech/index.md 清除过时的"建设中"文案

**TrendRadar 组件优化 ✅**
- [x] 换用 marked 库修复 Markdown 渲染（列表/标题/加粗正确渲染）
- [x] 增加「面试问法联想」模块（生成后显示各话题对应典型面试问法）
- [x] 历史记录持久化到 localStorage（刷新后记录不丢失）

**前沿趋势题补全 ✅**
- [x] 05-interview/04-trends.md 9道题六段式完整答案（③标准答案 + ④前沿加分 + ⑤常见踩坑 + ⑥回答策略）

**页面补强 ✅**
- [x] 02-tech/index.md 扩充为完整模块首页（卡片网格+对比表+学习建议）
- [x] 05-interview/05-company-cases.md 深度扩充（153行→307行，各厂补充面试流程表/题型分布/代表真题追问链/准备建议）
- [x] 03-resources/02-cases.md 补充国内产品案例（178行→274行，新增豆包/Kimi/文心/通义/智谱 5个完整案例）
- [x] 03-resources/01-frameworks.md 补充选型决策树（131行→205行，模型/框架/向量库/RAGvsFT 四棵决策树）
- [x] 03-resources/03-reading.md 补充导读说明（各来源新增"读什么收获"列，论文加 PM 读法指引）
- [x] 04-product/04-vibe-coding.md 深度扩充（179行→446行，各项目补踩坑/迭代记录/评估方法，新增踩坑总结章节）

**全站复查 ✅**
- [x] 06-career 三个工具页（03/04/05）确认组件结构正常
- [x] 修复 3 处错误锚点链接（agent-22题/模型评估-10题 → 正确 VitePress 锚点格式）
- [x] 新模块评估：不新增模块，内容已足够完整

## 下一步任务

1. **[P1] 提交 git commit**：整理本轮所有改动，统一提交
2. **[P2] 线上验证**：访问 GitHub Pages，确认新内容渲染正常（决策树/表格/折叠块）
3. **[P3] 持续维护**：跟进 AI 行业动态，定期更新 04-trends 前沿趋势题和 03-resources 产品案例
