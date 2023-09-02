import 'virtual:windi.css'
import '@/theme/index.less'

import { createApp } from 'vue'

import App from './App.vue'

import { setupI18n } from '@/plugins/i18n'
import { setupIDux } from '@/plugins/idux'
import { setupThirdParty } from '@/plugins/third-party'
import { setupRouter } from '@/router'
import { setupStore } from '@/store'

async function bootstrap() {
  const app = createApp(App)

  setupStore(app)
  setupRouter(app)
  setupI18n(app)
  setupIDux(app)
  setupThirdParty(app)

  app.mount('#app')
}

bootstrap()
