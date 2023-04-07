import { type RouteRecordRaw } from 'vue-router'

import { GlobalLayout } from '@/layout'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    meta: {
      flattened: true,
    },
    component: GlobalLayout,
    redirect: '/dashboard',
    children: [
      {
        path: 'dashboard',
        name: `dashboard`,
        meta: {
          title: '总览页',
          icon: 'setting',
        },
        component: () => import('@/views/dashboard/Index.vue'),
      },
    ],
  },
  {
    path: '/table',
    name: 'table',
    meta: {
      title: '列表页',
      icon: 'setting',
    },
    redirect: '/table/basic',
    component: GlobalLayout,
    children: [
      {
        path: 'basic',
        name: 'basic',
        meta: {
          title: '标准列表',
          icon: 'setting',
        },
        component: () => import('@/views/table/basic/Index.vue'),
      },
      {
        path: 'overview',
        name: 'overview',
        meta: {
          title: '概览列表',
          icon: 'setting',
        },
        component: () => import('@/views/table/overview/Index.vue'),
      },
      {
        path: 'realTime',
        name: 'realTime',
        meta: {
          title: '实时列表',
          icon: 'setting',
        },
        component: () => import('@/views/table/real-time/Index.vue'),
      },
      {
        path: 'tree',
        name: 'tree',
        meta: {
          title: '树列表',
          icon: 'setting',
        },
        component: () => import('@/views/table/tree/Index.vue'),
      },
    ],
  },
  {
    path: '/form',
    name: 'form',
    meta: {
      title: '表单页',
      icon: 'setting',
      hidden: true,
    },
    component: GlobalLayout,
    // children: [],
  },
  {
    path: '/details',
    name: 'details',
    meta: {
      title: '详情页',
      icon: 'setting',
      hidden: true,
      sort: 1,
    },
    component: GlobalLayout,
    // children: [],
  },
  {
    path: '/result',
    name: 'result',
    meta: {
      title: '结果页',
      icon: 'setting',
    },
    component: GlobalLayout,
    // children: [],
  },
]
export default routes
