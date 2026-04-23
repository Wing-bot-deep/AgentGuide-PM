<template>
  <div class="ai-tool-card">
    <h3>🔍 竞品分析辅助</h3>
    <p style="font-size:13px;color:var(--vp-c-text-2);margin-top:-8px;margin-bottom:16px;">
      输入产品名称和分析维度，AI 帮你生成结构化竞品分析报告
    </p>

    <!-- 产品信息 -->
    <label class="ai-label">产品名称（必填）</label>
    <input
      v-model="productName"
      class="ai-input"
      style="min-height:auto;padding:8px 12px;"
      placeholder="如：Cursor、Perplexity、飞书 My AI..."
      :disabled="loading"
    />

    <!-- 分析维度选择 -->
    <label class="ai-label" style="margin-top:16px;">分析维度（可多选）</label>
    <div class="dimension-grid">
      <button
        v-for="dim in dimensions"
        :key="dim.key"
        class="dimension-btn"
        :class="{ active: selectedDimensions.includes(dim.key) }"
        @click="toggleDimension(dim.key)"
        :disabled="loading"
      >
        {{ dim.label }}
      </button>
    </div>

    <!-- 分析深度 -->
    <label class="ai-label" style="margin-top:16px;">分析深度</label>
    <div style="display:flex;gap:8px;flex-wrap:wrap;margin-bottom:4px;">
      <button
        v-for="depth in depths"
        :key="depth.key"
        class="dimension-btn"
        :class="{ active: selectedDepth === depth.key }"
        @click="selectedDepth = depth.key"
        :disabled="loading"
        style="font-size:12px;"
      >
        {{ depth.label }}
      </button>
    </div>

    <!-- 补充需求 -->
    <label class="ai-label" style="margin-top:16px;">补充需求（可选）</label>
    <textarea
      v-model="additionalRequirements"
      class="ai-input"
      rows="3"
      placeholder="如：重点关注定价策略、对比国内外差异、分析增长飞轮..."
      :disabled="loading"
    />

    <div style="margin-top:16px;display:flex;gap:8px;align-items:center;flex-wrap:wrap;">
      <button class="ai-btn" @click="generate" :disabled="loading || !productName.trim() || selectedDimensions.length === 0">
        {{ loading ? '⏳ 分析中...' : '🔍 开始分析' }}
      </button>
      <button v-if="output" class="ai-btn ai-btn-secondary" @click="copy">
        {{ copied ? '✅ 已复制' : '📋 复制结果' }}
      </button>
      <button v-if="output" class="ai-btn ai-btn-secondary" @click="exportMarkdown">
        💾 导出 MD
      </button>
      <button v-if="output" class="ai-btn ai-btn-secondary" @click="reset">重置</button>
    </div>

    <!-- 错误提示 -->
    <div v-if="error" class="ai-status error" style="margin-top:12px;">{{ error }}</div>

    <!-- 输出区 -->
    <div v-if="output || loading" class="ai-output" style="margin-top:16px;min-height:100px;">
      <span v-if="loading && !output" class="ai-status loading">正在分析 {{ productName }}...</span>
      <div v-html="renderedOutput" />
    </div>

    <p style="margin-top:12px;font-size:12px;color:var(--vp-c-text-3);">
      💡 AI 基于公开信息和训练数据生成分析，建议结合最新官网/新闻验证
    </p>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useApiKey } from '../composables/useApiKey'

const { callAI, isConfigured } = useApiKey()

const dimensions = [
  { key: 'positioning', label: '📍 产品定位' },
  { key: 'user', label: '👥 目标用户' },
  { key: 'pain', label: '💡 核心痛点' },
  { key: 'ai', label: '🤖 AI 能力' },
  { key: 'differentiation', label: '⚡ 差异化' },
  { key: 'business', label: '💰 商业模式' },
  { key: 'growth', label: '📈 增长策略' },
  { key: 'challenge', label: '⚠️ 核心挑战' },
]

const depths = [
  { key: 'brief', label: '速览版（500字）' },
  { key: 'standard', label: '标准版（1000字）' },
  { key: 'deep', label: '深度版（2000字）' },
]

const productName = ref('')
const selectedDimensions = ref<string[]>(['positioning', 'user', 'ai', 'differentiation'])
const selectedDepth = ref('standard')
const additionalRequirements = ref('')
const output = ref('')
const loading = ref(false)
const error = ref('')
const copied = ref(false)

function toggleDimension(key: string) {
  const idx = selectedDimensions.value.indexOf(key)
  if (idx >= 0) {
    selectedDimensions.value.splice(idx, 1)
  } else {
    selectedDimensions.value.push(key)
  }
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
  const keywords = ['RAG', 'Agent', 'LLM', 'GPT-4', 'Claude', 'API', 'SaaS', 'To B', 'To C', 'DAU', 'MAU', 'ARPU']
  keywords.forEach(kw => {
    const regex = new RegExp(`\\b${kw}\\b`, 'g')
    html = html.replace(regex, `<span class="keyword-highlight">${kw}</span>`)
  })

  return html
})

const dimensionLabels: Record<string, string> = {
  positioning: '产品定位',
  user: '目标用户',
  pain: '核心痛点',
  ai: 'AI 能力',
  differentiation: '差异化优势',
  business: '商业模式',
  growth: '增长策略',
  challenge: '核心挑战',
}

const depthPrompts: Record<string, string> = {
  brief: '简洁版本，每个维度 50-80 字，总计约 500 字',
  standard: '标准版本，每个维度 100-150 字，总计约 1000 字',
  deep: '深度版本，每个维度 200-300 字，包含具体案例和数据，总计约 2000 字',
}

async function generate() {
  if (!isConfigured()) {
    error.value = '请先在页面顶部配置 API Key'
    return
  }

  const dimensionNames = selectedDimensions.value.map(k => dimensionLabels[k]).join('、')
  const extra = additionalRequirements.value.trim() ? `\n\n补充需求：${additionalRequirements.value}` : ''

  const prompt = `你是一个专业的 AI 产品分析专家，擅长拆解 AI 产品的核心逻辑和竞争策略。

请对以下产品进行竞品分析：**${productName.value}**

分析维度：${dimensionNames}

分析深度：${depthPrompts[selectedDepth.value]}${extra}

输出格式要求：
- 使用 ## 作为一级标题（维度名称）
- 使用 ### 作为二级标题（子维度）
- 关键信息加粗
- 使用列表或表格呈现结构化信息
- 如果有具体数据（DAU/MAU/融资额/定价），请标注
- 每个维度结尾附加"PM 洞察"（这个维度对 AI PM 的启发）
- 语言专业简洁，适合 AI PM 学习和面试使用

特别要求：
1. 基于真实公开信息，避免臆测
2. 突出 AI 技术在产品中的应用方式
3. 分析产品决策背后的逻辑（为什么这么做）
4. 如果是国内产品，可对比国外同类产品的差异`

  output.value = ''
  error.value = ''
  loading.value = true

  await callAI(
    [{ role: 'user', content: prompt }],
    (chunk) => { output.value += chunk },
    () => { loading.value = false },
    (err) => {
      error.value = err
      loading.value = false
    }
  )
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
  const now = new Date()
  const dateStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`

  const content = `# ${productName.value} 竞品分析\n\n生成时间：${dateStr}\n分析维度：${selectedDimensions.value.map(k => dimensionLabels[k]).join('、')}\n\n---\n\n${output.value}`

  const blob = new Blob([content], { type: 'text/markdown' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `${productName.value}_竞品分析_${dateStr}.md`
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
.dimension-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 8px;
}

.dimension-btn {
  padding: 6px 14px;
  border-radius: 20px;
  border: 1.5px solid var(--vp-c-divider);
  background: transparent;
  color: var(--vp-c-text-1);
  cursor: pointer;
  font-size: 13px;
  transition: all 0.15s;
}

.dimension-btn:hover:not(:disabled) {
  border-color: var(--vp-c-brand);
  color: var(--vp-c-brand);
}

.dimension-btn.active {
  background: var(--vp-c-brand);
  border-color: var(--vp-c-brand);
  color: #fff;
}

.dimension-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

:deep(.keyword-highlight) {
  color: var(--vp-c-brand);
  font-weight: 600;
}

@media (max-width: 640px) {
  .dimension-grid {
    gap: 6px;
  }

  .dimension-btn {
    font-size: 12px;
    padding: 5px 12px;
  }
}
</style>
