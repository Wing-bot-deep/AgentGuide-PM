<template>
  <div class="ai-tool-card">
    <h3>📝 面试逐字稿生成器</h3>
    <p style="font-size:13px;color:var(--vp-c-text-2);margin-top:-8px;margin-bottom:16px;">
      输入面试题 + 你的经历 → 生成可直接背诵的逐字稿回答
    </p>

    <label class="ai-label">面试题目</label>
    <input v-model="question" class="ai-input" type="text" placeholder="如：请介绍一个你主导的 AI 产品项目" :disabled="loading" />

    <label class="ai-label">你的相关经历（关键词/草稿即可）</label>
    <textarea v-model="experience" class="ai-input" style="min-height:100px;" placeholder="如：负责某 RAG 系统从 0 到 1，用户量 3000，准确率提升 40%..." :disabled="loading" />

    <label class="ai-label">回答时长目标</label>
    <select v-model="duration" class="ai-select">
      <option value="1.5">1.5 分钟（简洁版）</option>
      <option value="2.5">2.5 分钟（标准版）</option>
      <option value="4">4 分钟（深度版）</option>
    </select>

    <div style="margin-top:16px;display:flex;gap:8px;flex-wrap:wrap;">
      <button class="ai-btn" @click="generate" :disabled="loading || !question.trim() || !experience.trim()">
        {{ loading ? '⏳ 生成中...' : '📝 生成逐字稿' }}
      </button>
      <button v-if="output" class="ai-btn ai-btn-secondary" @click="copy">{{ copied ? '✅ 已复制' : '📋 复制' }}</button>
      <button v-if="output" class="ai-btn ai-btn-secondary" @click="reset">重置</button>
    </div>

    <div v-if="error" class="ai-status error" style="margin-top:12px;">{{ error }}</div>
    <div v-if="output || loading" class="ai-output" style="margin-top:16px;">
      <span v-if="loading && !output" class="ai-status loading">正在生成逐字稿...</span>
      <div v-html="rendered" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useApiKey } from '../composables/useApiKey'

const { callAI, isConfigured } = useApiKey()
const question = ref('')
const experience = ref('')
const duration = ref('2.5')
const output = ref('')
const loading = ref(false)
const error = ref('')
const copied = ref(false)

const rendered = computed(() =>
  output.value.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>').replace(/\n/g, '<br/>')
)

const SYSTEM = `你是一位专业的 AI 产品经理面试教练，擅长帮候选人准备面试逐字稿。

生成要求：
1. 使用 STAR 结构：情境(S)→任务(T)→行动(A)→结果(R)
2. 语言自然流畅，像人说话，不像背稿
3. 关键数据突出展示
4. 结尾主动升华：说明这段经历对你的成长/认知
5. 控制在目标时长内（中文正常语速约 200-250字/分钟）

输出格式：
【逐字稿】
（完整可朗读的回答）

【结构拆解】
S - 情境：...
T - 任务：...
A - 行动：...
R - 结果：...

【练习建议】
（2-3条具体练习提示）`

async function generate() {
  if (!isConfigured()) { error.value = '请先配置 API Key'; return }
  loading.value = true; output.value = ''; error.value = ''
  const words = Math.round(parseFloat(duration.value) * 225)

  await callAI(
    [
      { role: 'system', content: SYSTEM },
      { role: 'user', content: `面试题：${question.value}\n\n我的经历：${experience.value}\n\n目标时长：${duration.value}分钟（约${words}字）` }
    ],
    (c) => { output.value += c },
    () => { loading.value = false },
    (e) => { error.value = e; loading.value = false }
  )
}

async function copy() {
  await navigator.clipboard.writeText(output.value)
  copied.value = true; setTimeout(() => { copied.value = false }, 2000)
}

function reset() { question.value = ''; experience.value = ''; output.value = ''; error.value = '' }
</script>
