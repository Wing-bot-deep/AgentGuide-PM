// 管理 API Key 配置的 composable
// 数据存在 localStorage，刷新后保留

import { ref, readonly } from 'vue'

const STORAGE_KEY = 'agentguide_pm_api_config'

// 全局单例状态
const config = ref(loadConfig())

function loadConfig() {
  if (typeof window === 'undefined') return defaultConfig()
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    return saved ? JSON.parse(saved) : defaultConfig()
  } catch {
    return defaultConfig()
  }
}

function defaultConfig() {
  return {
    baseUrl: '',   // 第三方 API 地址，如 https://api.siliconflow.cn/v1
    apiKey: '',    // API Key
    model: '',     // 模型名，如 Qwen/Qwen2.5-72B-Instruct
  }
}

export function useApiKey() {
  function save(newConfig: { baseUrl: string; apiKey: string; model: string }) {
    config.value = { ...newConfig }
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(config.value))
    }
  }

  function clear() {
    config.value = defaultConfig()
    if (typeof window !== 'undefined') {
      localStorage.removeItem(STORAGE_KEY)
    }
  }

  function isConfigured() {
    return !!(config.value.baseUrl && config.value.apiKey && config.value.model)
  }

  // 调用 AI 接口（OpenAI 兼容格式，支持流式输出）
  async function callAI(
    messages: { role: string; content: string }[],
    onChunk: (text: string) => void,
    onDone?: () => void,
    onError?: (err: string) => void
  ) {
    if (!isConfigured()) {
      onError?.('请先在页面顶部配置 API Key')
      return
    }

    const { baseUrl, apiKey, model } = config.value
    const url = baseUrl.endsWith('/') ? baseUrl + 'chat/completions' : baseUrl + '/chat/completions'

    try {
      const res = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model,
          messages,
          stream: true,
          temperature: 0.7,
        }),
      })

      if (!res.ok) {
        const errText = await res.text()
        onError?.(`请求失败 ${res.status}：${errText}`)
        return
      }

      const reader = res.body?.getReader()
      const decoder = new TextDecoder()

      if (!reader) {
        onError?.('无法读取响应流')
        return
      }

      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        const chunk = decoder.decode(value, { stream: true })
        const lines = chunk.split('\n').filter(l => l.startsWith('data: '))

        for (const line of lines) {
          const data = line.slice(6).trim()
          if (data === '[DONE]') break
          try {
            const json = JSON.parse(data)
            const text = json.choices?.[0]?.delta?.content
            if (text) onChunk(text)
          } catch {
            // 忽略解析失败的行
          }
        }
      }

      onDone?.()
    } catch (err: any) {
      onError?.(err.message || '网络请求失败')
    }
  }

  return {
    config: readonly(config),
    save,
    clear,
    isConfigured,
    callAI,
  }
}
