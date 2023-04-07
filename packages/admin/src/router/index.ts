import { type App } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'

import { createRouterGuards } from './guards'
import routes from './routes'

const router = createRouter({
  routes,
  history: createWebHistory(import.meta.env.BASE_URL),
  scrollBehavior: (to, _, savedPosition) => {
    if (savedPosition) {
      return savedPosition
    } else if (to.hash) {
      return { el: to.hash, behavior: 'smooth' }
    } else {
      return { top: 0, behavior: 'smooth' }
    }
  },
})

export const setupRouter = (app: App): void => {
  app.use(router)

  createRouterGuards(router)
}
