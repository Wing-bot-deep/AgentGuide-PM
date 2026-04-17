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
          ],
        },
      ],
      '/02-tech/': [
        {
          text: '02 技术理解层',
          items: [
            { text: '概览', link: '/02-tech/' },
            { text: 'A. 代码生存技能', link: '/02-tech/A-coding/' },
            { text: 'B. AI 技术认知', link: '/02-tech/B-ai-tech/' },
            { text: 'C. 技术沟通能力', link: '/02-tech/C-communication/' },
          ],
        },
      ],
      '/03-resources/': [
        {
          text: '03 行业资源导航',
          items: [
            { text: '概览', link: '/03-resources/' },
          ],
        },
      ],
      '/04-product/': [
        {
          text: '04 产品实战层',
          items: [
            { text: '概览', link: '/04-product/' },
          ],
        },
      ],
      '/05-interview/': [
        {
          text: '05 面试题库 PM 版',
          items: [
            { text: '概览', link: '/05-interview/' },
            { text: '🔴 必考题精讲', link: '/05-interview/01-must-know' },
            { text: '🤖 AI 面试工具箱', link: '/05-interview/tools' },
          ],
        },
      ],
      '/06-career/': [
        {
          text: '06 求职方法论',
          items: [
            { text: '概览', link: '/06-career/' },
            { text: '✨ AI 简历润色器', link: '/06-career/03-resume-polish' },
            { text: '🎤 面试逐字稿生成器', link: '/06-career/04-interview-script' },
            { text: '🤖 AI 模拟面试', link: '/06-career/05-mock-interview' },
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
