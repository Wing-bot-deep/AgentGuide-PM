# 当前进度（高频变，用 /save 更新）

> 最后更新：2026-04-24

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

## 下一步任务

1. **[P1] 补充面试真题答案**：给 05-interview/04-trends.md 的 9 道前沿趋势题补充六段式完整参考答案（③标准答案 + ④前沿加分 + ⑤常见踩坑 + ⑥回答策略）
2. **[P2] 03-resources 内容扩充**：方向待定（框架生态/案例库/阅读清单哪个最薄弱）
3. **[P3] 新增模块方向待定**：评估是否需要增加新模块
