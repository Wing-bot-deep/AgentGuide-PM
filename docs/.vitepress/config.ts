import { defineConfig } from 'vitepress'

export default defineConfig({
  // 站点基本信息
  title: 'AgentGuide PM',
  description: 'AI 产品经理学习 + 求职 + AI 工具一体化平台',
  lang: 'zh-CN',

  // GitHub Pages 部署路径（仓库名）
  base: '/AgentGuide-PM/',

  // 主题配置
  themeConfig: {
    logo: '/logo.svg',
    siteTitle: 'AgentGuide PM',

    // 顶部导航
    nav: [
      { text: '首页', link: '/' },
      { text: '01 基础认知', link: '/01-foundation/' },
      { text: '02 技术理解', link: '/02-tech/' },
      { text: '03 行业资源', link: '/03-resources/' },
      { text: '04 产品实战', link: '/04-product/' },
      { text: '05 面试题库', link: '/05-interview/' },
      { text: '06 求职方法论', link: '/06-career/' },
    ],

    // 侧边栏
    sidebar: {
      '/01-foundation/': [
        {
          text: '01 基础认知层',
          items: [
            { text: '概览', link: '/01-foundation/' },
            { text: '🤖 Agent 是什么', link: '/01-foundation/01-agent-concept' },
            { text: '🧠 大模型原理（PM 版）', link: '/01-foundation/02-llm-principles' },
            { text: '📈 AI 技术演进路线图', link: '/01-foundation/03-tech-evolution' },
            { text: '🎯 AI PM 的技术边界', link: '/01-foundation/04-pm-tech-boundary' },
          ],
        },
      ],
      '/02-tech/': [
        {
          text: '02 技术理解层',
          items: [
            { text: '概览', link: '/02-tech/' },
            {
              text: 'A. 代码生存技能',
              collapsed: false,
              items: [
                { text: '概览', link: '/02-tech/A-coding/' },
                { text: '👁️ 读懂代码', link: '/02-tech/A-coding/01-read-code' },
                { text: '💻 终端生存指南', link: '/02-tech/A-coding/02-terminal-survival' },
              ],
            },
            {
              text: 'B. AI 技术认知',
              collapsed: false,
              items: [
                { text: '概览', link: '/02-tech/B-ai-tech/' },
                { text: 'Context Engineering', link: '/02-tech/B-ai-tech/01-context-engineering' },
                { text: 'Agent 记忆系统', link: '/02-tech/B-ai-tech/02-agent-memory' },
                { text: 'Agent 评估体系', link: '/02-tech/B-ai-tech/03-agent-evaluation' },
              ],
            },
            {
              text: 'C. 技术沟通能力',
              collapsed: false,
              items: [
                { text: '概览', link: '/02-tech/C-communication/' },
                { text: '📝 写给工程师的 PRD', link: '/02-tech/C-communication/01-prd-for-engineers' },
                { text: '🔍 技术方案评审', link: '/02-tech/C-communication/02-tech-review' },
              ],
            },
          ],
        },
      ],
      '/03-resources/': [
        {
          text: '03 行业资源导航',
          items: [
            { text: '概览', link: '/03-resources/' },
            { text: '🧩 框架与生态地图', link: '/03-resources/01-frameworks' },
            { text: '📦 产品案例库', link: '/03-resources/02-cases' },
            { text: '📚 阅读清单', link: '/03-resources/03-reading' },
          ],
        },
      ],
      '/04-product/': [
        {
          text: '04 产品实战层',
          items: [
            { text: '概览', link: '/04-product/' },
            { text: '🎨 AI 产品设计方法论', link: '/04-product/01-design-methodology' },
            { text: '📊 AI 产品指标体系', link: '/04-product/02-metrics' },
            { text: '✨ AI 体验设计', link: '/04-product/03-experience' },
            { text: '🛠️ Vibe Coding 实战项目', link: '/04-product/04-vibe-coding' },
          ],
        },
      ],
      '/05-interview/': [
        {
          text: '05 面试题库 PM 版',
          items: [
            { text: '概览', link: '/05-interview/' },
            { text: '🔴 必考题精讲', link: '/05-interview/01-must-know' },
            {
              text: '🟠 高概率题库',
              collapsed: false,
              items: [
                { text: '总览', link: '/05-interview/02-high-prob' },
                { text: '🔍 RAG 系统方向（22题）', link: '/05-interview/02a-rag' },
                { text: '🤖 Agent 核心方向（22题）', link: '/05-interview/02b-agent' },
                { text: '📊 模型评估方向（10题）', link: '/05-interview/02c-evaluation' },
              ],
            },
            { text: '🟡 潜力题 & 场景题', link: '/05-interview/03-potential' },
            { text: '🔵 前沿趋势开放题', link: '/05-interview/04-trends' },
            { text: '🏢 大厂面试规律', link: '/05-interview/05-company-cases' },
            { text: '🤖 AI 面试工具箱', link: '/05-interview/tools' },
          ],
        },
      ],
      '/06-career/': [
        {
          text: '06 求职方法论',
          items: [
            { text: '概览', link: '/06-career/' },
            { text: '📍 职业路径规划', link: '/06-career/01-career-path' },
            { text: '📄 简历撰写指南', link: '/06-career/02-resume-guide' },
            { text: '📋 简历范文示例', link: '/06-career/02b-resume-examples' },
            { text: '✨ AI 简历润色器', link: '/06-career/03-resume-polish' },
            { text: '🎤 面试逐字稿生成器', link: '/06-career/04-interview-script' },
            { text: '🤖 AI 模拟面试', link: '/06-career/05-mock-interview' },
            { text: '💼 作品集搭建', link: '/06-career/06-portfolio' },
            { text: '💰 谈薪实战指南', link: '/06-career/07-salary' },
            { text: '👔 HR 面试通关', link: '/06-career/08-hr-interview' },
          ],
        },
      ],
    },

    // 社交链接
    socialLinks: [
      { icon: 'github', link: 'https://github.com/Wing-bot-deep/AgentGuide-PM' },
    ],

    // 页脚
    footer: {
      message: '专为 AI 产品经理打造',
      copyright: 'Copyright © 2026',
    },

    // 搜索
    search: {
      provider: 'local',
    },
  },
})
