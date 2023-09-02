import type { RouteRecordRaw } from 'vue-router'

import EmptyView from '@/views/empty/Index.vue'

const routes: RouteRecordRaw[] = [
  {
    path: '/assetCenter',
    meta: {
      title: '资产中心',
      icon: ['custom:asset-center', 'custom:asset-center-active'],
    },
    redirect: 'assetOverview',
    children: [
      {
        path: 'assetOverview',
        name: 'assetOverview',
        meta: {
          title: '资产总览',
          icon: ['custom:asset-center', 'custom:asset-center-active'],
        },
        component: () => import('@/views/table/overview/AssetOverview.vue'),
      },
      {
        path: 'assetManagement',
        meta: {
          title: '资产管理',
          icon: ['custom:asset-management', 'custom:asset-management-active'],
        },
        redirect: 'cloudServerManagement',
        children: [
          {
            path: 'cloudServerManagement',
            name: 'cloudServerManagement',
            meta: {
              title: '云服务器管理',
              icon: ['custom:nav', 'custom:nav-active'],
            },
            component: EmptyView,
          },
          {
            path: 'hostManagement',
            name: 'hostManagement',
            meta: {
              title: '主机管理',
              icon: ['custom:nav', 'custom:nav-active'],
            },
            component: EmptyView,
          },
          {
            path: 'containerManagement',
            name: 'containerManagement',
            meta: {
              title: '容器管理',
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
