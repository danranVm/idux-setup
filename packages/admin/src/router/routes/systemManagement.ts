import type { RouteRecordRaw } from 'vue-router'

import EmptyView from '@/views/empty/Index.vue'

const routes: RouteRecordRaw[] = [
  {
    path: '/systemManagement',
    meta: {
      title: '系统管理',
      icon: ['custom:nav', 'custom:nav-active'],
    },
    redirect: 'logSettings',
    children: [
      {
        path: 'logSettings',
        name: 'logSettings',
        meta: {
          title: '日志设置',
          icon: ['custom:log-settings', 'custom:log-settings-active'],
        },
        component: EmptyView,
      },
      {
        path: 'adminSettings',
        name: 'adminSettings',
        meta: {
          title: '管理员设置',
          icon: ['custom:admin-settings', 'custom:admin-settings-active'],
        },
        component: EmptyView,
      },
      {
        path: 'upgradeManagement',
        meta: {
          title: '升级管理',
          icon: ['custom:upgrade-management', 'custom:upgrade-management-active'],
        },
        redirect: 'systemUpgrade',
        children: [
          {
            path: 'systemUpgrade',
            name: 'systemUpgrade',
            meta: {
              title: '系统升级',
              icon: ['custom:nav', 'custom:nav-active'],
            },
            component: EmptyView,
          },
          {
            path: 'patchUpgrade',
            name: 'patchUpgrade',
            meta: {
              title: '补丁升级',
              icon: ['custom:nav', 'custom:nav-active'],
            },
            component: EmptyView,
          },
          {
            path: 'upgradeSettings',
            name: 'upgradeSettings',
            meta: {
              title: '升级设置',
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
