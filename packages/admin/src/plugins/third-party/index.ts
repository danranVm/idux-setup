import type { App } from 'vue'

import 'vue3-drr-grid-layout/dist/style.css'
import GridLayout from 'vue3-drr-grid-layout'

export const setupThirdParty = (app: App): void => {
  app.use(GridLayout)
}
