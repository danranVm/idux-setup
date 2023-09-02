import type { RouteRecordRaw } from 'vue-router'

import EmptyView from '@/views/empty/Index.vue'

const routes: RouteRecordRaw[] = [
  {
    path: '/policy',
    meta: {
      title: '策略管理',
      icon: ['custom:nav', 'custom:nav-active'],
    },
    redirect: 'accessPolicy',
    children: [
      {
        path: 'accessPolicy',
        meta: {
          title: '访问策略',
          icon: ['custom:access-policy', 'custom:access-policy-active'],
        },
        redirect: 'globalPolicy',
        children: [
          {
            path: 'globalPolicy',
            name: 'accessPolicyGlobal',
            meta: {
              title: '全局策略',
              icon: ['custom:nav', 'custom:nav-active'],
            },
            component: EmptyView,
          },
          {
            path: 'policyManagement',
            name: 'accessPolicyManagement',
            meta: {
              title: '策略管理',
              icon: ['custom:nav', 'custom:nav-active'],
            },
            component: EmptyView,
          },
        ],
      },
      {
        path: 'securityPolicy',
        meta: {
          title: '安全策略',
          icon: ['custom:security-policy', 'custom:security-policy-active'],
        },
        redirect: 'assetSecurity',
        children: [
          {
            path: 'assetSecurity',
            name: 'assetSecurity',
            meta: {
              title: '资产安全防护',
              icon: ['custom:nav', 'custom:nav-active'],
            },
            component: EmptyView,
          },
          {
            path: 'whitelist',
            name: 'whitelist',
            meta: {
              title: '白名单管理',
              icon: ['custom:nav', 'custom:nav-active'],
            },
            component: EmptyView,
          },
        ],
      },
    ],
  },
]

export default routes
