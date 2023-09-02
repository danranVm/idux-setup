import type { RouteRecordRaw } from 'vue-router'

import EmptyView from '@/views/empty/Index.vue'

const routes: RouteRecordRaw[] = [
  {
    path: '/appCenter',
    meta: {
      title: '应用中心',
      icon: ['custom:nav', 'custom:nav-active'],
    },
    redirect: 'IOTSecurityManagement',
    children: [
      {
        path: 'IOTSecurityManagement',
        name: 'IOTSecurityManagement',
        meta: {
          title: 'IOT安全管理',
          icon: ['custom:iot', 'custom:iot-active'],
        },
        component: EmptyView,
      },
      {
        path: 'processManagementSystem',
        name: 'processManagementSystem',
        meta: {
          title: '流程管理系统',
          icon: ['custom:process-management', 'custom:process-management-active'],
        },
        component: EmptyView,
      },
      {
        path: 'thirdPartyApp',
        name: 'thirdPartyApp',
        meta: {
          title: '第三方应用',
          icon: ['custom:third-party-app', 'custom:third-party-app-active'],
        },
        component: EmptyView,
      },
    ],
  },
]

export default routes
