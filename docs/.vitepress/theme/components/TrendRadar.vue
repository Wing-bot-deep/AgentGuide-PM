<template>
  <div class="ai-tool-card">
    <h3>📡 前沿速递雷达</h3>
    <p style="font-size:13px;color:var(--vp-c-text-2);margin-top:-8px;margin-bottom:16px;">
      输入你关注的方向，AI 帮你梳理前沿动态 + 面试加分点
    </p>

    <!-- 快速开始 -->
    <label class="ai-label">⚡ 快速开始</label>
    <div class="preset-grid">
      <button
        v-for="preset in presets"
        :key="preset.key"
        class="preset-btn"
        @click="applyPreset(preset.topics)"
        :disabled="loading"
      >
        {{ preset.label }}
      </button>
    </div>

    <!-- 话题选择 -->
    <label class="ai-label" style="margin-top:16px;">或自定义选择（可多选）</label>
    <div class="topic-grid">
      <button
        v-for="topic in topics"
        :key="topic.key"
        class="topic-btn"
        :class="{ active: selectedTopics.includes(topic.key) }"
        @click="toggleTopic(topic.key)"
        :disabled="loading"
      >
        {{ topic.label }}
      </button>
    </div>

    <!-- 自定义补充 -->
    <label class="ai-label" style="margin-top:16px;">补充关键词（可选）</label>
    <input
      v-model="customKeyword"
      class="ai-input"
      style="min-height:auto;padding:8px 12px;"
      placeholder="如：多模态、端侧推理、Agent安全..."
      :disabled="loading"
    />

    <!-- 输出格式选择 -->
    <label class="ai-label" style="margin-top:16px;">输出格式</label>
    <div style="display:flex;gap:8px;flex-wrap:wrap;margin-bottom:4px;">
      <button
        v-for="fmt in formats"
        :key="fmt.key"
        class="topic-btn"
        :class="{ active: selectedFormat === fmt.key }"
        @click="selectedFormat = fmt.key"
        :disabled="loading"
        style="font-size:12px;"
      >
        {{ fmt.label }}
      </button>
    </div>

    <div style="margin-top:16px;display:flex;gap:8px;align-items:center;flex-wrap:wrap;">
      <button class="ai-btn" @click="generate" :disabled="loading || selectedTopics.length === 0">
        {{ loading ? '⏳ 扫描中...' : '🔍 开始扫描' }}
      </button>
      <button v-if="output" class="ai-btn ai-btn-secondary" @click="copy">
        {{ copied ? '✅ 已复制' : '📋 复制结果' }}
      </button>
      <button v-if="output" class="ai-btn ai-btn-secondary" @click="exportMarkdown">
        💾 导出 MD
      </button>
      <button v-if="output" class="ai-btn ai-btn-secondary" @click="reset">重置</button>
    </div>

    <!-- 历史记录 -->
    <div v-if="history.length > 0" style="margin-top:16px;">
      <label class="ai-label">📚 最近扫描</label>
      <div class="history-list">
        <button
          v-for="(item, idx) in history"
          :key="idx"
          class="history-btn"
          @click="loadHistory(idx)"
          :disabled="loading"
        >
          <span class="history-topics">{{ item.topicsLabel }}</span>
          <span class="history-time">{{ item.time }}</span>
        </button>
      </div>
    </div>

    <!-- 错误提示 -->
    <div v-if="error" class="ai-status error" style="margin-top:12px;">{{ error }}</div>

    <!-- 输出区 -->
    <div v-if="output || loading" class="ai-output" style="margin-top:16px;min-height:100px;">
      <span v-if="loading && !output" class="ai-status loading">{{ loadingStatus }}</span>
      <div v-html="renderedOutput" />
    </div>

    <p style="margin-top:12px;font-size:12px;color:var(--vp-c-text-3);">
      💡 AI 知识截止 2025 年初，适合整理认知框架和面试答题素材，实时动态请结合最新新闻
    </p>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useApiKey } from '../composables/useApiKey'

const { callAI, isConfigured } = useApiKey()

const topics = [
  { key: 'agent', label: '🤖 Agent 进展' },
  { key: 'multiagent', label: '👥 Multi-Agent' },
  { key: 'multimodal', label: '🖼️ 多模态' },
  { key: 'rag', label: '📚 RAG / 知识库' },
  { key: 'product', label: '📱 AI 产品动态' },
  { key: 'model', label: '🧠 模型能力' },
  { key: 'safety', label: '🛡️ AI 安全合规' },
  { key: 'coding', label: '💻 AI 编程工具' },
]

const presets = [
  { key: 'agent-full', label: '🤖 Agent 全栈', topics: ['agent', 'multiagent', 'rag'] },
  { key: 'rag-expert', label: '📚 RAG 专精', topics: ['rag', 'model', 'product'] },
  { key: 'product-view', label: '📱 产品视角', topics: ['product', 'multimodal', 'coding'] },
  { key: 'tech-deep', label: '🧠 技术深度', topics: ['model', 'agent', 'safety'] },
]

const formats = [
  { key: 'brief', label: '速览摘要' },
  { key: 'interview', label: '面试加分版' },
  { key: 'deep', label: '深度解读' },
]

const selectedTopics = ref<string[]>([])
const selectedFormat = ref('interview')
const customKeyword = ref('')
const output = ref('')
const loading = ref(false)
const error = ref('')
const copied = ref(false)
const loadingStatus = ref('正在扫描前沿动态...')

interface HistoryItem {
  topics: string[]
  topicsLabel: string
  format: string
  keyword: string
  output: string
  time: string
}

const history = ref<HistoryItem[]>([])

function toggleTopic(key: string) {
  const idx = selectedTopics.value.indexOf(key)
  if (idx >= 0) {
    selectedTopics.value.splice(idx, 1)
  } else {
    selectedTopics.value.push(key)
  }
}

function applyPreset(topicKeys: string[]) {
  selectedTopics.value = [...topicKeys]
}

const renderedOutput = computed(() => {
  if (!output.value) return ''
  let html = output.value
    .replace(/\n\n/g, '</p><p>')
    .replace(/\n/g, '<br/>')
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/^## (.+)$/gm, '<h4 style="margin:16px 0 8px;font-size:15px;color:var(--vp-c-brand)">$1</h4>')
    .replace(/^### (.+)$/gm, '<h5 style="margin:12px 0 6px;font-size:14px;">$1</h5>')
    .replace(/^- (.+)$/gm, '<li style="margin:4px 0">$1</li>')
    .replace(/(<li[^>]*>.*<\/li>)/gs, '<ul style="padding-left:20px;margin:8px 0">$1</ul>')

  // 高亮关键术语
  const keywords = ['RAG', 'Agent', 'LLM', 'GPT-4', 'Claude', 'Fine-tuning', 'Prompt', 'Multi-Agent', 'RLHF', 'CoT', 'ReAct']
  keywords.forEach(kw => {
    const regex = new RegExp(`\\b${kw}\\b`, 'g')
    html = html.replace(regex, `<span class="keyword-highlight">${kw}</span>`)
  })

  // 高亮面试加分点
  html = html.replace(/💡(.+?)(?=<br|<\/p|$)/g, '<span class="interview-tip">💡$1</span>')

  return html
})

const topicLabels: Record<string, string> = {
  agent: 'Agent 技术进展',
  multiagent: 'Multi-Agent 协作',
  multimodal: '多模态 AI',
  rag: 'RAG 与知识库技术',
  product: 'AI 产品动态',
  model: '大模型能力演进',
  safety: 'AI 安全与合规',
  coding: 'AI 编程工具',
}

const formatPrompts: Record<string, string> = {
  brief: '请以简洁的要点形式输出，每个方向 3-5 条核心动态，用 emoji 标注重要程度。',
  interview: `请以 AI PM 面试备考的视角输出，重点包括：
1. 该方向的核心技术进展（1-2个代表性案例）
2. 对 AI PM 的影响（产品机会/挑战）
3. 面试加分话术（可以直接在面试中使用的表达）
每个方向约 200 字。`,
  deep: `请深入解读，包括：技术背景、发展脉络、主要玩家、产品机会、潜在风险，每个方向约 400 字。`,
}

async function generate() {
  if (!isConfigured()) {
    error.value = '请先在页面顶部配置 API Key'
    return
  }

  const topicNames = selectedTopics.value.map(k => topicLabels[k]).join('、')
  const extra = customKeyword.value.trim() ? `，以及补充关键词：${customKeyword.value}` : ''

  const prompt = `你是一个专注于 AI 领域的产品经理培训专家，熟悉 2024-2025 年的 AI 技术和产品动态。

请针对以下方向提供前沿动态速递：${topicNames}${extra}

${formatPrompts[selectedFormat.value]}

输出格式要求：
- 每个方向用 ## 作为标题
- 内容结构清晰，使用列表或小标题
- 重点内容加粗
- 面试加分点用 💡 标注
- 语言简洁专业，适合 AI PM 学习使用
- 结尾附加一条"面试关联提示"（这个话题在什么类型的面试题中会考到）`

  output.value = ''
  error.value = ''
  loading.value = true

  // 动态加载状态
  const topicList = selectedTopics.value.map(k => topicLabels[k])
  let currentIdx = 0
  const statusInterval = setInterval(() => {
    if (currentIdx < topicList.length) {
      loadingStatus.value = `正在分析 ${topicList[currentIdx]}...`
      currentIdx++
    }
  }, 2000)

  await callAI(
    [{ role: 'user', content: prompt }],
    (chunk) => { output.value += chunk },
    () => {
      loading.value = false
      clearInterval(statusInterval)
      saveToHistory()
    },
    (err) => {
      error.value = err
      loading.value = false
      clearInterval(statusInterval)
    }
  )
}

function saveToHistory() {
  const topicsLabel = selectedTopics.value.map(k => topics.find(t => t.key === k)?.label || k).join(' ')
  const now = new Date()
  const time = `${now.getMonth() + 1}/${now.getDate()} ${now.getHours()}:${String(now.getMinutes()).padStart(2, '0')}`

  history.value.unshift({
    topics: [...selectedTopics.value],
    topicsLabel,
    format: selectedFormat.value,
    keyword: customKeyword.value,
    output: output.value,
    time
  })

  // 只保留最近3条
  if (history.value.length > 3) {
    history.value.pop()
  }
}

function loadHistory(idx: number) {
  const item = history.value[idx]
  selectedTopics.value = [...item.topics]
  selectedFormat.value = item.format
  customKeyword.value = item.keyword
  output.value = item.output
  error.value = ''
}

async function copy() {
  try {
    await navigator.clipboard.writeText(output.value)
    copied.value = true
    setTimeout(() => { copied.value = false }, 2000)
  } catch {
    error.value = '复制失败，请手动选中复制'
  }
}

function exportMarkdown() {
  const topicsLabel = selectedTopics.value.map(k => topicLabels[k]).join('、')
  const now = new Date()
  const dateStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`

  const content = `# AI 前沿速递 - ${topicsLabel}\n\n生成时间：${dateStr}\n\n---\n\n${output.value}`

  const blob = new Blob([content], { type: 'text/markdown' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `AI前沿速递_${dateStr}.md`
  a.click()
  URL.revokeObjectURL(url)
}

function reset() {
  output.value = ''
  error.value = ''
  copied.value = false
}
</script>

<style scoped>
.topic-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 8px;
}

.topic-btn {
  padding: 6px 14px;
  border-radius: 20px;
  border: 1.5px solid var(--vp-c-divider);
  background: transparent;
  color: var(--vp-c-text-1);
  cursor: pointer;
  font-size: 13px;
  transition: all 0.15s;
}

.topic-btn:hover:not(:disabled) {
  border-color: var(--vp-c-brand);
  color: var(--vp-c-brand);
}

.topic-btn.active {
  background: var(--vp-c-brand);
  border-color: var(--vp-c-brand);
  color: #fff;
}

.topic-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.preset-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 8px;
}

.preset-btn {
  padding: 8px 16px;
  border-radius: 8px;
  border: 1.5px solid var(--vp-c-brand-light);
  background: var(--vp-c-brand-soft);
  color: var(--vp-c-brand);
  cursor: pointer;
  font-size: 13px;
  font-weight: 500;
  transition: all 0.15s;
}

.preset-btn:hover:not(:disabled) {
  background: var(--vp-c-brand);
  color: #fff;
  transform: translateY(-1px);
}

.preset-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.history-list {
  display: flex;
  flex-direction: column;
  gap: 6px;
  margin-top: 8px;
}

.history-btn {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 12px;
  border-radius: 6px;
  border: 1px solid var(--vp-c-divider);
  background: var(--vp-c-bg-soft);
  cursor: pointer;
  font-size: 12px;
  transition: all 0.15s;
}

.history-btn:hover:not(:disabled) {
  border-color: var(--vp-c-brand);
  background: var(--vp-c-brand-soft);
}

.history-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.history-topics {
  color: var(--vp-c-text-1);
  font-weight: 500;
}

.history-time {
  color: var(--vp-c-text-3);
  font-size: 11px;
}

:deep(.keyword-highlight) {
  color: var(--vp-c-brand);
  font-weight: 600;
}

:deep(.interview-tip) {
  display: inline-block;
  padding: 4px 8px;
  margin: 4px 0;
  background: var(--vp-c-brand-soft);
  border-left: 3px solid var(--vp-c-brand);
  border-radius: 4px;
  font-size: 13px;
}

@media (max-width: 640px) {
  .preset-grid {
    flex-direction: column;
  }

  .preset-btn {
    width: 100%;
  }

  .topic-grid {
    gap: 6px;
  }

  .topic-btn {
    font-size: 12px;
    padding: 5px 12px;
  }
}
</style>
