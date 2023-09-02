import type { RouteRecordRaw } from 'vue-router'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/dashboard',
    name: `dashboard`,
    meta: {
      title: '总览页',
      icon: ['custom:overview', 'custom:overview-active'],
      dragDisabled: true,
      menuItemCls: 'dashboard-overview-menu-item'
    },
    component: () => import('@/views/dashboard/Index.vue'),
  },
]
export default routes
