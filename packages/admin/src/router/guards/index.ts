import { type Router } from 'vue-router'

import whiteRouteList from './whiteRoutesList'

import { useUserStore } from '@/store/stores/user'

export const createRouterGuards = (router: Router): void => {
  const userStore = useUserStore()
  router.beforeEach((to, _, next) => {
    // white list
    if (whiteRouteList.includes(to.path)) {
      next()
      return
    }

    const { token } = userStore
    // eslint-disable-next-line no-console
    console.log(token, next)
    if (!token) {
      const redirectLocation = {
        path: '/login',
        replace: true,
        redirect: to.path,
      }
      next(redirectLocation)
      return
    }

    if (!router.hasRoute(to.name || '')) {
      router.push('/exception/404')
    }
    next()
  })

  router.afterEach(to => {
    document.title = 'iDux Setup - ' + (to.meta.title || document.title)
  })

  router.onError((error, to, from) => {
    // eslint-disable-next-line no-console
    console.error(error, from, to)
  })
}
