<template>
  <div class="ai-tool-card">
    <h3>🎯 JD 智能押题器</h3>
    <p style="font-size:13px;color:var(--vp-c-text-2);margin-top:-8px;margin-bottom:16px;">
      粘贴岗位 JD → 自动生成 18 道押题，每题含 6 部分完整解析
    </p>

    <!-- 输入区 -->
    <label class="ai-label">岗位 JD（直接粘贴，越完整越准）</label>
    <textarea
      v-model="jdText"
      class="ai-input"
      style="min-height:160px;"
      placeholder="粘贴招聘 JD 内容..."
      :disabled="loading"
    />

    <div style="margin-top:16px;display:flex;gap:8px;align-items:center;flex-wrap:wrap;">
      <button class="ai-btn" @click="generate" :disabled="loading || !jdText.trim()">
        {{ loading ? '⏳ 生成中...' : '🚀 生成押题' }}
      </button>
      <button v-if="output" class="ai-btn ai-btn-secondary" @click="copy">
        {{ copied ? '✅ 已复制' : '📋 复制结果' }}
      </button>
      <button v-if="output" class="ai-btn ai-btn-secondary" @click="reset">重置</button>
    </div>

    <!-- 错误提示 -->
    <div v-if="error" class="ai-status error" style="margin-top:12px;">{{ error }}</div>

    <!-- 输出区 -->
    <div v-if="output || loading" class="ai-output" style="margin-top:16px;min-height:100px;">
      <span v-if="loading && !output" class="ai-status loading">正在分析 JD 并生成押题...</span>
      <div v-html="renderedOutput" />
    </div>

    <p style="margin-top:12px;font-size:12px;color:var(--vp-c-text-3);">
      💡 每次生成 18 题：必考题 5 道 · 高概率题 5 道 · 潜力题 5 道 · 前沿附加题 3 道
    </p>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useApiKey } from '../composables/useApiKey'

const { callAI, isConfigured } = useApiKey()

const jdText = ref('')
const output = ref('')
const loading = ref(false)
const error = ref('')
const copied = ref(false)

// 简单的 markdown 换行渲染
const renderedOutput = computed(() =>
  output.value
    .replace(/^(#{1,4})\s(.+)$/gm, (_, h, t) => `<strong>${t}</strong>`)
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\n/g, '<br/>')
)

const SYSTEM_PROMPT = `你是一位资深 AI 产品经理面试教练，擅长根据 JD 精准押题。

请根据用户提供的岗位 JD，生成 18 道面试押题，分为四类：
- 必考题（5道）：该岗位几乎必问的核心题
- 高概率题（5道）：该岗位 70% 以上概率会考的题
- 潜力题（5道）：有一定概率会被问到的深度题
- 前沿附加题（3道）：考察候选人对行业前沿的认知

每道题必须输出以下 6 个部分：
1. 【题目】具体问题
2. 【押题依据】从 JD 中哪些关键词/要求推断出这道题
3. 【标准答案】详细的参考答案（300字以上）
4. 【前沿加分回答】结合最新 AI 动态的加分点
5. 【常见踩坑点】候选人容易犯的错误
6. 【回答策略】STAR法则/时间分配/重点突出建议

输出格式清晰，使用 Markdown，题目用 ## 标记。`

async function generate() {
  if (!isConfigured()) {
    error.value = '请先在页面顶部配置 API Key'
    return
  }
  if (!jdText.value.trim()) return

  loading.value = true
  output.value = ''
  error.value = ''

  await callAI(
    [
      { role: 'system', content: SYSTEM_PROMPT },
      { role: 'user', content: `以下是岗位 JD，请生成 18 道押题：\n\n${jdText.value}` },
    ],
    (chunk) => { output.value += chunk },
    () => { loading.value = false },
    (err) => { error.value = err; loading.value = false }
  )
}

async function copy() {
  await navigator.clipboard.writeText(output.value)
  copied.value = true
  setTimeout(() => { copied.value = false }, 2000)
}

function reset() {
  jdText.value = ''
  output.value = ''
  error.value = ''
}
</script>
