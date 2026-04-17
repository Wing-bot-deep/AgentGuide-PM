import DefaultTheme from 'vitepress/theme'
import ApiKeyManager from './components/ApiKeyManager.vue'
import JdQuizGenerator from './components/JdQuizGenerator.vue'
import MockInterviewer from './components/MockInterviewer.vue'
import ResumePolisher from './components/ResumePolisher.vue'
import InterviewScript from './components/InterviewScript.vue'
import TrendRadar from './components/TrendRadar.vue'
import './style.css'

export default {
  extends: DefaultTheme,
  enhanceApp({ app }) {
    // 全局注册 AI 工具组件，可在任意 .md 中直接使用
    app.component('ApiKeyManager', ApiKeyManager)
    app.component('JdQuizGenerator', JdQuizGenerator)
    app.component('MockInterviewer', MockInterviewer)
    app.component('ResumePolisher', ResumePolisher)
    app.component('InterviewScript', InterviewScript)
    app.component('TrendRadar', TrendRadar)
  }
}
