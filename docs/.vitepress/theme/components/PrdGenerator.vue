<template>
  <div class="ai-tool-card">
    <h3>📝 PRD 智能生成器</h3>
    <p style="font-size:13px;color:var(--vp-c-text-2);margin-top:-8px;margin-bottom:16px;">
      输入产品需求，AI 帮你生成结构化 PRD 文档
    </p>

    <!-- 产品基本信息 -->
    <label class="ai-label">产品名称/功能名称（必填）</label>
    <input
      v-model="productName"
      class="ai-input"
      style="min-height:auto;padding:8px 12px;"
      placeholder="如：AI 客服知识库问答、智能简历优化工具..."
      :disabled="loading"
    />

    <label class="ai-label" style="margin-top:16px;">核心需求描述（必填）</label>
    <textarea
      v-model="requirement"
      class="ai-input"
      rows="4"
      placeholder="描述要解决的问题、目标用户、核心场景。如：企业客服团队需要一个 AI 知识库问答系统，帮助客服快速找到答案，减少人工转接率..."
      :disabled="loading"
    />

    <!-- PRD 模块选择 -->
    <label class="ai-label" style="margin-top:16px;">PRD 包含模块（可多选）</label>
    <div class="module-grid">
      <button
        v-for="mod in modules"
        :key="mod.key"
        class="module-btn"
        :class="{ active: selectedModules.includes(mod.key) }"
        @click="toggleModule(mod.key)"
        :disabled="loading"
      >
        {{ mod.label }}
      </button>
    </div>

    <!-- PRD 风格 -->
    <label class="ai-label" style="margin-top:16px;">PRD 风格</label>
    <div style="display:flex;gap:8px;flex-wrap:wrap;margin-bottom:4px;">
      <button
        v-for="style in styles"
        :key="style.key"
        class="module-btn"
        :class="{ active: selectedStyle === style.key }"
        @click="selectedStyle = style.key"
        :disabled="loading"
        style="font-size:12px;"
      >
        {{ style.label }}
      </button>
    </div>

    <!-- 补充信息 -->
    <label class="ai-label" style="margin-top:16px;">补充信息（可选）</label>
    <textarea
      v-model="additionalInfo"
      class="ai-input"
      rows="3"
      placeholder="如：技术栈限制、预算约束、上线时间要求、参考竞品..."
      :disabled="loading"
    />

    <div style="margin-top:16px;display:flex;gap:8px;align-items:center;flex-wrap:wrap;">
      <button class="ai-btn" @click="generate" :disabled="loading || !productName.trim() || !requirement.trim() || selectedModules.length === 0">
        {{ loading ? '⏳ 生成中...' : '📝 生成 PRD' }}
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
      <span v-if="loading && !output" class="ai-status loading">正在生成 PRD...</span>
      <div v-html="renderedOutput" />
    </div>

    <p style="margin-top:12px;font-size:12px;color:var(--vp-c-text-3);">
      💡 AI 生成的 PRD 是初稿，需要结合实际情况调整和补充细节
    </p>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useApiKey } from '../composables/useApiKey'

const { callAI, isConfigured } = useApiKey()

const modules = [
  { key: 'background', label: '📋 背景与目标' },
  { key: 'user', label: '👥 用户画像' },
  { key: 'scenario', label: '🎯 核心场景' },
  { key: 'function', label: '⚙️ 功能清单' },
  { key: 'ai', label: '🤖 AI 能力设计' },
  { key: 'metrics', label: '📊 成功指标' },
  { key: 'risk', label: '⚠️ 风险与降级' },
  { key: 'roadmap', label: '🗓️ 迭代规划' },
]

const styles = [
  { key: 'concise', label: '简洁版（快速评审）' },
  { key: 'standard', label: '标准版（完整 PRD）' },
  { key: 'detailed', label: '详细版（含技术细节）' },
]

const productName = ref('')
const requirement = ref('')
const selectedModules = ref<string[]>(['background', 'user', 'scenario', 'function', 'ai', 'metrics'])
const selectedStyle = ref('standard')
const additionalInfo = ref('')
const output = ref('')
const loading = ref(false)
const error = ref('')
const copied = ref(false)

function toggleModule(key: string) {
  const idx = selectedModules.value.indexOf(key)
  if (idx >= 0) {
    selectedModules.value.splice(idx, 1)
  } else {
    selectedModules.value.push(key)
  }
}

const renderedOutput = computed(() => {
  if (!output.value) return ''
  let html = output.value
    .replace(/\n\n/g, '</p><p>')
    .replace(/\n/g, '<br/>')
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/^# (.+)$/gm, '<h3 style="margin:20px 0 12px;font-size:18px;color:var(--vp-c-brand)">$1</h3>')
    .replace(/^## (.+)$/gm, '<h4 style="margin:16px 0 8px;font-size:15px;color:var(--vp-c-brand)">$1</h4>')
    .replace(/^### (.+)$/gm, '<h5 style="margin:12px 0 6px;font-size:14px;">$1</h5>')
    .replace(/^- (.+)$/gm, '<li style="margin:4px 0">$1</li>')
    .replace(/(<li[^>]*>.*<\/li>)/gs, '<ul style="padding-left:20px;margin:8px 0">$1</ul>')

  // 高亮关键术语
  const keywords = ['RAG', 'Agent', 'LLM', 'API', 'MVP', 'P0', 'P1', 'P2', 'DAU', 'MAU', 'NPS', 'CSAT']
  keywords.forEach(kw => {
    const regex = new RegExp(`\\b${kw}\\b`, 'g')
    html = html.replace(regex, `<span class="keyword-highlight">${kw}</span>`)
  })

  return html
})

const moduleLabels: Record<string, string> = {
  background: '背景与目标',
  user: '用户画像',
  scenario: '核心场景',
  function: '功能清单',
  ai: 'AI 能力设计',
  metrics: '成功指标',
  risk: '风险与降级',
  roadmap: '迭代规划',
}

const stylePrompts: Record<string, string> = {
  concise: '简洁版本，每个模块 100-150 字，重点突出核心逻辑，适合快速评审',
  standard: '标准版本，每个模块 200-300 字，结构完整，适合团队协作',
  detailed: '详细版本，每个模块 300-500 字，包含技术细节和实现建议，适合开发对接',
}

async function generate() {
  if (!isConfigured()) {
    error.value = '请先在页面顶部配置 API Key'
    return
  }

  const moduleNames = selectedModules.value.map(k => moduleLabels[k]).join('、')
  const extra = additionalInfo.value.trim() ? `\n\n补充信息：${additionalInfo.value}` : ''

  const prompt = `你是一个专业的 AI 产品经理，擅长撰写结构清晰、逻辑严密的 PRD 文档。

请为以下产品/功能生成 PRD 文档：

**产品名称**：${productName.value}

**核心需求**：
${requirement.value}

**PRD 包含模块**：${moduleNames}

**风格要求**：${stylePrompts[selectedStyle.value]}${extra}

输出格式要求：
1. 使用 # 作为文档标题（产品名称 PRD）
2. 使用 ## 作为一级标题（模块名称）
3. 使用 ### 作为二级标题（子模块）
4. 关键信息加粗
5. 使用列表、表格呈现结构化信息
6. 功能清单按优先级分为 P0/P1/P2
7. AI 能力设计部分要包含：模型选择、Prompt 设计思路、评估指标
8. 成功指标要包含：北极星指标、过程指标、质量指标
9. 风险与降级要包含：技术风险、产品风险、降级方案
10. 语言专业简洁，适合团队协作使用

特别要求：
- 基于 AI 产品的特点，重点关注：用户期望管理、失败路径设计、成本控制
- 如果涉及 RAG/Agent，要说明具体实现思路
- 指标设计要可量化、可追踪
- 风险识别要全面，降级方案要可执行`

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

  const content = `${output.value}\n\n---\n\n生成时间：${dateStr}\n生成工具：AgentGuide-PM PRD 智能生成器`

  const blob = new Blob([content], { type: 'text/markdown' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `${productName.value}_PRD_${dateStr}.md`
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
.module-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 8px;
}

.module-btn {
  padding: 6px 14px;
  border-radius: 20px;
  border: 1.5px solid var(--vp-c-divider);
  background: transparent;
  color: var(--vp-c-text-1);
  cursor: pointer;
  font-size: 13px;
  transition: all 0.15s;
}

.module-btn:hover:not(:disabled) {
  border-color: var(--vp-c-brand);
  color: var(--vp-c-brand);
}

.module-btn.active {
  background: var(--vp-c-brand);
  border-color: var(--vp-c-brand);
  color: #fff;
}

.module-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

:deep(.keyword-highlight) {
  color: var(--vp-c-brand);
  font-weight: 600;
}

@media (max-width: 640px) {
  .module-grid {
    gap: 6px;
  }

  .module-btn {
    font-size: 12px;
    padding: 5px 12px;
  }
}
</style>
