<template>
  <div class="ai-tool-card">
    <h3>✨ 简历润色器</h3>
    <p style="font-size:13px;color:var(--vp-c-text-2);margin-top:-8px;margin-bottom:16px;">
      粘贴简历内容 → AI 从 AI PM 视角润色，突出亮点、优化表达
    </p>

    <label class="ai-label">目标岗位 JD（可选，填了更精准）</label>
    <textarea v-model="jd" class="ai-input" style="min-height:80px;" placeholder="粘贴目标 JD..." :disabled="loading" />

    <label class="ai-label">简历内容（粘贴需要润色的部分）</label>
    <textarea v-model="resume" class="ai-input" style="min-height:160px;" placeholder="粘贴简历内容..." :disabled="loading" />

    <div style="margin-top:16px;display:flex;gap:8px;flex-wrap:wrap;">
      <button class="ai-btn" @click="polish" :disabled="loading || !resume.trim()">
        {{ loading ? '⏳ 润色中...' : '✨ 开始润色' }}
      </button>
      <button v-if="output" class="ai-btn ai-btn-secondary" @click="copy">{{ copied ? '✅ 已复制' : '📋 复制' }}</button>
      <button v-if="output" class="ai-btn ai-btn-secondary" @click="reset">重置</button>
    </div>

    <div v-if="error" class="ai-status error" style="margin-top:12px;">{{ error }}</div>
    <div v-if="output || loading" class="ai-output" style="margin-top:16px;">
      <span v-if="loading && !output" class="ai-status loading">正在润色...</span>
      <div v-html="rendered" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useApiKey } from '../composables/useApiKey'

const { callAI, isConfigured } = useApiKey()
const jd = ref('')
const resume = ref('')
const output = ref('')
const loading = ref(false)
const error = ref('')
const copied = ref(false)

const rendered = computed(() =>
  output.value.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>').replace(/\n/g, '<br/>')
)

const SYSTEM = `你是一位专业的 AI 产品经理求职教练，擅长简历优化。
润色原则：
1. 量化成果：用数据说话，能加数字的地方加数字
2. 突出 AI/大模型相关经验，与 AI PM 岗位强相关
3. 使用 STAR 结构：情境→任务→行动→结果
4. 精简冗余表达，每条控制在 2 行以内
5. 保持真实，不无中生有

输出格式：
- 先给出润色后的完整版本
- 再在【润色说明】部分解释每处改动的原因`

async function polish() {
  if (!isConfigured()) { error.value = '请先配置 API Key'; return }
  loading.value = true; output.value = ''; error.value = ''
  const userMsg = jd.value.trim()
    ? `目标 JD：\n${jd.value}\n\n需润色的简历内容：\n${resume.value}`
    : `需润色的简历内容：\n${resume.value}`

  await callAI(
    [{ role: 'system', content: SYSTEM }, { role: 'user', content: userMsg }],
    (c) => { output.value += c },
    () => { loading.value = false },
    (e) => { error.value = e; loading.value = false }
  )
}

async function copy() {
  await navigator.clipboard.writeText(output.value)
  copied.value = true; setTimeout(() => { copied.value = false }, 2000)
}

function reset() { jd.value = ''; resume.value = ''; output.value = ''; error.value = '' }
</script>
