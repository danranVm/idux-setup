import { type App } from 'vue'

import { createPinia } from 'pinia'
import piniaPersist from 'pinia-plugin-persist'

const store = createPinia()

export const setupStore = (app: App): void => {
  store.use(piniaPersist)

  app.use(store)
}
