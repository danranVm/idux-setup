import type { RouteRecordRaw } from 'vue-router'

import EmptyView from '@/views/empty/Index.vue'

const routes: RouteRecordRaw[] = [
  {
    path: '/securityInspect',
    meta: {
      title: '安全检测',
      icon: ['custom:nav', 'custom:nav-active'],
    },
    redirect: 'alarmDispose',
    children: [
      {
        path: 'alarmDispose',
        meta: {
          title: '告警处置',
          icon: ['custom:alarm-dispose', 'custom:alarm-dispose-active'],
        },
        redirect: 'alarmList',
        children: [
          {
            path: 'alarmList',
            name: 'alarmList',
            meta: {
              title: '告警列表',
              icon: ['custom:nav', 'custom:nav-active'],
            },
            component: () => import('@/views/table/basic/Index.vue'),
          },
          {
            path: 'alarmRules',
            name: 'alarmRulse',
            meta: {
              title: '告警规则',
              icon: ['custom:nav', 'custom:nav-active'],
            },
            component: EmptyView,
          },
          {
            path: 'disposeRecords',
            name: 'alarmDisposeRecords',
            meta: {
              title: '处置记录',
              icon: ['custom:nav', 'custom:nav-active'],
            },
            component: EmptyView,
          },
        ],
      },
      {
        path: 'complianceBaseline',
        meta: {
          title: '合规基线',
          icon: ['custom:compliance-baseline', 'custom:compliance-baseline-active'],
        },
        redirect: 'baselineInspect',
        children: [
          {
            path: 'baselineInspect',
            name: 'baselineInspect',
            meta: {
              title: '基线检查',
              icon: ['custom:nav', 'custom:nav-active'],
            },
            component: EmptyView,
          },
          {
            path: 'baselineInspectRules',
            name: 'baselineInspectRules',
            meta: {
              title: '检查规则',
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
