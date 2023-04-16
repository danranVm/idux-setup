import type { App } from 'vue'

export type LocaleType = 'zh-CN' | 'en-US'

const i18n = { install: () => {} }

export async function setupI18n(app: App) {
  app.use(i18n)
}

function $i(id: string, _?: any) {
  return id
}

export function useI18n() {
  return {
    $i,
  }
}
