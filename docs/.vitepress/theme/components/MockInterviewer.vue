<template>
  <div class="ai-tool-card">
    <h3>🎤 AI 模拟面试官</h3>

    <!-- 配置阶段 -->
    <template v-if="phase === 'config'">
      <p style="font-size:13px;color:var(--vp-c-text-2);margin-top:-8px;margin-bottom:16px;">
        配置面试参数，开始全流程模拟面试
      </p>

      <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;">
        <div>
          <label class="ai-label">面试类型</label>
          <select v-model="cfg.type" class="ai-select" style="width:100%;">
            <option value="product">产品面</option>
            <option value="tech">技术面</option>
            <option value="hr">HR 面</option>
            <option value="stress">压力面</option>
            <option value="comprehensive">综合面</option>
          </select>
        </div>
        <div>
          <label class="ai-label">面试官风格</label>
          <select v-model="cfg.style" class="ai-select" style="width:100%;">
            <option value="professional">专业严谨</option>
            <option value="friendly">随和引导</option>
            <option value="pressure">压力挑战</option>
            <option value="drill">连环追问</option>
          </select>
        </div>
        <div>
          <label class="ai-label">面试时长</label>
          <select v-model="cfg.duration" class="ai-select" style="width:100%;">
            <option value="15">15 分钟（8 题）</option>
            <option value="30">30 分钟（15 题）</option>
            <option value="45">45 分钟（20 题）</option>
          </select>
        </div>
        <div>
          <label class="ai-label">考察重点（可选）</label>
          <input v-model="cfg.focus" class="ai-input" type="text" placeholder="如：RAG 系统设计经验" />
        </div>
      </div>

      <label class="ai-label" style="margin-top:14px;">你的简历摘要（可选，粘贴核心经历）</label>
      <textarea v-model="cfg.resume" class="ai-input" style="min-height:80px;" placeholder="粘贴简历中的核心经历，让面试官针对你的背景提问..." />

      <label class="ai-label">目标 JD（可选）</label>
      <textarea v-model="cfg.jd" class="ai-input" style="min-height:80px;" placeholder="粘贴目标岗位 JD，让面试官结合岗位要求提问..." />

      <button class="ai-btn" style="margin-top:16px;" @click="startInterview" :disabled="loading">
        🚀 开始面试
      </button>
    </template>

    <!-- 面试阶段 -->
    <template v-if="phase === 'interview'">
      <!-- 对话记录 -->
      <div ref="chatBox" style="max-height:420px;overflow-y:auto;margin-bottom:16px;display:flex;flex-direction:column;gap:12px;">
        <div v-for="(msg, i) in messages" :key="i"
          :style="{
            alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start',
            maxWidth: '85%',
            padding: '10px 14px',
            borderRadius: '10px',
            fontSize: '14px',
            lineHeight: '1.6',
            background: msg.role === 'user' ? 'var(--vp-c-brand-soft)' : 'var(--vp-c-bg-soft)',
            border: '1px solid var(--vp-c-border)',
            whiteSpace: 'pre-wrap',
          }"
        >
          <strong>{{ msg.role === 'user' ? '你' : '面试官' }}</strong><br/>
          {{ msg.content }}
        </div>
        <div v-if="streaming" style="align-self:flex-start;max-width:85%;padding:10px 14px;border-radius:10px;font-size:14px;background:var(--vp-c-bg-soft);border:1px solid var(--vp-c-border);">
          <strong>面试官</strong><br/>{{ streamBuffer }}
          <span class="cursor">▌</span>
        </div>
      </div>

      <!-- 输入区 -->
      <div v-if="!interviewDone">
        <textarea
          v-model="userInput"
          class="ai-input"
          style="min-height:80px;"
          placeholder="输入你的回答..."
          :disabled="loading"
          @keydown.ctrl.enter="sendAnswer"
        />
        <div style="margin-top:10px;display:flex;gap:8px;align-items:center;">
          <button class="ai-btn" @click="sendAnswer" :disabled="loading || !userInput.trim()">
            {{ loading ? '⏳' : '发送回答' }}（Ctrl+Enter）
          </button>
          <button class="ai-btn ai-btn-secondary" @click="endInterview">结束面试，生成诊断报告</button>
        </div>
      </div>

      <div v-if="error" class="ai-status error">{{ error }}</div>
    </template>

    <!-- 报告阶段 -->
    <template v-if="phase === 'report'">
      <h4 style="color:var(--vp-c-brand-1);">📊 五维诊断报告</h4>
      <div v-if="loading" class="ai-status loading">正在生成诊断报告...</div>
      <div class="ai-output" v-html="renderedReport" />
      <div style="margin-top:12px;display:flex;gap:8px;">
        <button class="ai-btn ai-btn-secondary" @click="copyReport">{{ copied ? '✅ 已复制' : '📋 复制报告' }}</button>
        <button class="ai-btn ai-btn-secondary" @click="restart">重新面试</button>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, nextTick } from 'vue'
import { useApiKey } from '../composables/useApiKey'

const { callAI, isConfigured } = useApiKey()

const phase = ref<'config' | 'interview' | 'report'>('config')
const loading = ref(false)
const error = ref('')
const copied = ref(false)
const chatBox = ref<HTMLElement>()
const streaming = ref(false)
const streamBuffer = ref('')
const interviewDone = ref(false)

const cfg = ref({
  type: 'product',
  style: 'professional',
  duration: '30',
  focus: '',
  resume: '',
  jd: '',
})

// 存储对话历史（传给 AI 的上下文）
const history = ref<{ role: string; content: string }[]>([])
// 展示用消息（不含 system）
const messages = ref<{ role: string; content: string }[]>([])
const userInput = ref('')
const report = ref('')

const renderedReport = computed(() =>
  report.value
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/^(#{1,4})\s(.+)$/gm, (_, h, t) => `<strong style="font-size:1.05em">${t}</strong>`)
    .replace(/\n/g, '<br/>')
)

const typeLabels: Record<string, string> = {
  product: '产品面', tech: '技术面', hr: 'HR面', stress: '压力面', comprehensive: '综合面'
}
const styleLabels: Record<string, string> = {
  professional: '专业严谨', friendly: '随和引导', pressure: '压力挑战', drill: '连环追问'
}

function buildSystemPrompt() {
  const questionCount = cfg.value.duration === '15' ? 8 : cfg.value.duration === '30' ? 15 : 20
  return `你是一位${styleLabels[cfg.value.style]}风格的 AI 产品经理面试官，正在进行${typeLabels[cfg.value.type]}。

面试规则：
- 共提问 ${questionCount} 道题，题目编排：暖场→核心考察（穿插技术追问）→深度压力（穿插热点追问）→格局考察（宏观追问）→收尾
- 前沿追问占比约 1/3，根据候选人回答中的关键词自然衍生
- 每次只问一道题，等候选人回答后再继续
- 风格：${styleLabels[cfg.value.style]}
${cfg.value.focus ? `- 重点考察方向：${cfg.value.focus}` : ''}
${cfg.value.resume ? `\n候选人简历摘要：\n${cfg.value.resume}` : ''}
${cfg.value.jd ? `\n目标岗位 JD：\n${cfg.value.jd}` : ''}

现在开始面试，先做简短自我介绍，然后提第一道题。`
}

async function startInterview() {
  if (!isConfigured()) {
    error.value = '请先在页面顶部配置 API Key'
    return
  }

  phase.value = 'interview'
  loading.value = true
  streaming.value = true
  streamBuffer.value = ''
  error.value = ''

  const systemPrompt = buildSystemPrompt()
  history.value = [{ role: 'system', content: systemPrompt }]

  await callAI(
    history.value,
    (chunk) => { streamBuffer.value += chunk },
    () => {
      const aiMsg = { role: 'assistant', content: streamBuffer.value }
      history.value.push(aiMsg)
      messages.value.push(aiMsg)
      streamBuffer.value = ''
      streaming.value = false
      loading.value = false
      scrollToBottom()
    },
    (err) => { error.value = err; loading.value = false; streaming.value = false }
  )
}

async function sendAnswer() {
  if (!userInput.value.trim() || loading.value) return

  const userMsg = { role: 'user', content: userInput.value.trim() }
  history.value.push(userMsg)
  messages.value.push(userMsg)
  userInput.value = ''
  loading.value = true
  streaming.value = true
  streamBuffer.value = ''
  await scrollToBottom()

  await callAI(
    history.value,
    (chunk) => { streamBuffer.value += chunk },
    () => {
      const aiMsg = { role: 'assistant', content: streamBuffer.value }
      history.value.push(aiMsg)
      messages.value.push(aiMsg)
      streamBuffer.value = ''
      streaming.value = false
      loading.value = false
      scrollToBottom()
    },
    (err) => { error.value = err; loading.value = false; streaming.value = false }
  )
}

async function endInterview() {
  interviewDone.value = true
  phase.value = 'report'
  loading.value = true
  report.value = ''

  const reportPrompt = `面试结束。请根据以上对话，生成五维诊断报告：

## 五维诊断报告

请对候选人在以下五个维度分别打分（1-10分）并点评：

1. **技术理解** - 对 AI/大模型技术的理解深度
2. **产品思维** - 产品设计、需求分析、用户视角
3. **表达清晰度** - 语言组织、逻辑结构、举例质量
4. **逻辑深度** - 分析框架、思维严密性
5. **前沿认知** - 对 AI 行业最新动态的了解程度

然后给出：
- **综合评价**（3-5句话）
- **最大优势**（2-3点）
- **核心改进建议**（2-3点，具体可操作）
- **下次面试重点准备方向**`

  await callAI(
    [...history.value, { role: 'user', content: reportPrompt }],
    (chunk) => { report.value += chunk },
    () => { loading.value = false },
    (err) => { error.value = err; loading.value = false }
  )
}

async function scrollToBottom() {
  await nextTick()
  if (chatBox.value) {
    chatBox.value.scrollTop = chatBox.value.scrollHeight
  }
}

async function copyReport() {
  await navigator.clipboard.writeText(report.value)
  copied.value = true
  setTimeout(() => { copied.value = false }, 2000)
}

function restart() {
  phase.value = 'config'
  history.value = []
  messages.value = []
  report.value = ''
  userInput.value = ''
  interviewDone.value = false
  error.value = ''
}
</script>

<style scoped>
.cursor {
  animation: blink 1s infinite;
}
@keyframes blink {
  0%, 100% { opacity: 1; }
  50% { opacity: 0; }
}
</style>
