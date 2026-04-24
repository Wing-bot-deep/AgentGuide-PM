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

    <!-- 面试问法联想 -->
    <div v-if="output && !loading && interviewQuestions.length > 0" class="interview-assoc">
      <div class="interview-assoc-title">💬 这些话题在面试中通常怎么考？</div>
      <ul class="interview-assoc-list">
        <li v-for="q in interviewQuestions" :key="q.topic">
          <span class="assoc-topic">{{ q.topic }}</span>
          <span class="assoc-question">{{ q.question }}</span>
        </li>
      </ul>
    </div>

    <p style="margin-top:12px;font-size:12px;color:var(--vp-c-text-3);">
      💡 AI 知识截止 2025 年，适合整理认知框架和面试答题素材，实时动态请结合最新新闻
    </p>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { marked } from 'marked'
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

// 每个话题对应的典型面试问法
const topicQuestions: Record<string, string> = {
  agent: '"请描述一个 Agent 失败的场景，你会怎么设计容错机制？"',
  multiagent: '"如何让多个 Agent 协同工作？举具体的协同机制。"',
  multimodal: '"多模态产品设计时如何处理不同模态质量不一致的问题？"',
  rag: '"RAG 和 Fine-tuning 如何选型？各适合什么场景？"',
  product: '"你怎么看 AI 产品的 PMF？和传统产品有什么不同？"',
  model: '"大模型能力边界在哪里？作为 PM 你怎么设计降级方案？"',
  safety: '"AI 产品如何平衡体验和内容安全合规？"',
  coding: '"AI 编程工具会取代程序员吗？对 PM 的影响是什么？"',
}

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

const HISTORY_KEY = 'trendradar_history'

function loadHistoryFromStorage(): HistoryItem[] {
  try {
    const raw = localStorage.getItem(HISTORY_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

const history = ref<HistoryItem[]>(loadHistoryFromStorage())

// 当前选中话题对应的面试问法
const interviewQuestions = computed(() => {
  return selectedTopics.value
    .filter(k => topicQuestions[k])
    .map(k => ({
      topic: topics.find(t => t.key === k)?.label || k,
      question: topicQuestions[k],
    }))
})

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
  // 用 marked 解析，安全起见关掉 mangle/headerIds
  return marked.parse(output.value, { async: false }) as string
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
    time,
  })

  if (history.value.length > 3) {
    history.value.pop()
  }

  try {
    localStorage.setItem(HISTORY_KEY, JSON.stringify(history.value))
  } catch {
    // localStorage 不可用时静默失败
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

/* 面试问法联想 */
.interview-assoc {
  margin-top: 16px;
  padding: 14px 16px;
  border: 1px solid var(--vp-c-yellow-2);
  border-left: 4px solid var(--vp-c-yellow-1);
  border-radius: 8px;
  background: var(--vp-c-yellow-soft);
}

.interview-assoc-title {
  font-size: 13px;
  font-weight: 600;
  color: var(--vp-c-text-1);
  margin-bottom: 10px;
}

.interview-assoc-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.interview-assoc-list li {
  font-size: 13px;
  line-height: 1.5;
}

.assoc-topic {
  display: inline-block;
  font-weight: 500;
  color: var(--vp-c-brand);
  margin-right: 6px;
}

.assoc-question {
  color: var(--vp-c-text-2);
}

/* marked 输出的 Markdown 样式 */
:deep(.ai-output h1),
:deep(.ai-output h2),
:deep(.ai-output h3),
:deep(.ai-output h4) {
  margin: 14px 0 6px;
  font-weight: 600;
  color: var(--vp-c-text-1);
  line-height: 1.4;
}

:deep(.ai-output h2) { font-size: 15px; color: var(--vp-c-brand); }
:deep(.ai-output h3) { font-size: 14px; }
:deep(.ai-output h4) { font-size: 13px; }

:deep(.ai-output ul),
:deep(.ai-output ol) {
  padding-left: 20px;
  margin: 6px 0;
}

:deep(.ai-output li) { margin: 3px 0; }

:deep(.ai-output p) { margin: 6px 0; }

:deep(.ai-output strong) { color: var(--vp-c-text-1); }

:deep(.ai-output code) {
  background: var(--vp-c-bg-soft);
  padding: 1px 5px;
  border-radius: 4px;
  font-size: 12px;
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
