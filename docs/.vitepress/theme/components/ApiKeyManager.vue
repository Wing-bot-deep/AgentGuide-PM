<template>
  <div class="ai-tool-card">
    <h3>🔑 API 配置</h3>

    <template v-if="!editing && isConfigured()">
      <!-- 已配置状态 -->
      <div class="ai-status success">
        ✅ 已配置 · 模型：{{ config.model }}
      </div>
      <div style="margin-top:12px; display:flex; gap:8px;">
        <button class="ai-btn ai-btn-secondary" @click="editing = true">修改配置</button>
        <button class="ai-btn ai-btn-secondary" @click="handleClear">清除</button>
      </div>
    </template>

    <template v-else>
      <!-- 编辑状态 -->
      <label class="ai-label">API Base URL <span style="color:var(--vp-c-text-3);font-weight:400;">（如 https://api.siliconflow.cn/v1）</span></label>
      <input
        v-model="form.baseUrl"
        class="ai-input"
        type="url"
        placeholder="https://api.siliconflow.cn/v1"
      />

      <label class="ai-label">API Key</label>
      <input
        v-model="form.apiKey"
        class="ai-input"
        type="password"
        placeholder="sk-..."
      />

      <label class="ai-label">模型名称 <span style="color:var(--vp-c-text-3);font-weight:400;">（如 Qwen/Qwen2.5-72B-Instruct）</span></label>
      <input
        v-model="form.model"
        class="ai-input"
        type="text"
        placeholder="Qwen/Qwen2.5-72B-Instruct"
      />

      <div style="margin-top:16px; display:flex; gap:8px; flex-wrap:wrap;">
        <button class="ai-btn" @click="handleSave" :disabled="!canSave">保存配置</button>
        <button v-if="isConfigured()" class="ai-btn ai-btn-secondary" @click="editing = false">取消</button>
      </div>

      <p style="margin-top:12px;font-size:12px;color:var(--vp-c-text-3);">
        💡 配置仅保存在本地浏览器，不会上传到任何服务器
      </p>
    </template>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useApiKey } from '../composables/useApiKey'

const { config, save, clear, isConfigured } = useApiKey()

const editing = ref(false)
const form = ref({ baseUrl: '', apiKey: '', model: '' })

onMounted(() => {
  // 已有配置时不进入编辑模式；没有配置时默认展示表单
  if (!isConfigured()) {
    editing.value = true
  }
  // 用已保存的值初始化表单
  form.value = { ...config.value }
})

const canSave = computed(() =>
  form.value.baseUrl.trim() && form.value.apiKey.trim() && form.value.model.trim()
)

function handleSave() {
  save({
    baseUrl: form.value.baseUrl.trim(),
    apiKey: form.value.apiKey.trim(),
    model: form.value.model.trim(),
  })
  editing.value = false
}

function handleClear() {
  clear()
  form.value = { baseUrl: '', apiKey: '', model: '' }
  editing.value = true
}
</script>
