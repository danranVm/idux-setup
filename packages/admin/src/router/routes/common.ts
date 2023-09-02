import { type RouteRecordRaw } from 'vue-router'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    redirect: '/dashboard',
  },
  {
    path: '/login',
    name: 'Login',
    meta: {
      title: '登录',
      layoutType: 'standalone',
    },
    component: () => import('@/views/login/Index.vue'),
  },
  {
    path: '/register',
    name: 'Register',
    meta: {
      title: '注册',
      layoutType: 'standalone',
    },
    component: () => import('@/views/register/Index.vue'),
  },
]
export default routes
