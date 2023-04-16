/* eslint-disable import/no-unassigned-import */
import 'virtual:windi.css'
import '@/theme/index.less'

import { createApp } from 'vue'

import App from './App.vue'

import { setupI18n } from '@/plugins/i18n'
import { setupIDux } from '@/plugins/idux'
import { setupRouter } from '@/router'
import { setupStore } from '@/store'

async function bootstrap() {
  const app = createApp(App)

  setupStore(app)

  setupRouter(app)

  setupI18n(app)

  setupIDux(app)

  app.mount('#app')
}

bootstrap()
