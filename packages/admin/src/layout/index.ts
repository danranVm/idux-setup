import { defineAsyncComponent } from 'vue'

import './style/index.less'

export const GlobalLayout = defineAsyncComponent(() => import('@/layout/GlobalLayout.vue'))
