import type { RouteRecordRaw } from 'vue-router'

import EmptyView from '@/views/empty/Index.vue'

const routes: RouteRecordRaw[] = [
  {
    path: '/auditLog',
    meta: {
      title: '审计日志',
      icon: ['custom:nav', 'custom:nav-active'],
    },
    redirect: 'behaviorAudit',
    children: [
      {
        path: 'behaviorAudit',
        meta: {
          title: '用户行为审计',
          icon: ['custom:behavior-audit', 'custom:behavior-audit-active'],
        },
        redirect: 'file',
        children: [
          {
            path: 'file',
            name: 'fileAuditLog',
            meta: {
              title: '文件审计日志',
              icon: ['custom:nav', 'custom:nav-active'],
            },
            component: EmptyView,
          },
          {
            path: 'riskBehavior',
            name: 'riskBehaviorAuditLog',
            meta: {
              title: '风险行为日志',
              icon: ['custom:nav', 'custom:nav-active'],
            },
            component: EmptyView,
          },
          {
            path: 'exteralEmail',
            name: 'exteralEmailAuditLog',
            meta: {
              title: '邮件外发日志',
              icon: ['custom:nav', 'custom:nav-active'],
            },
            component: EmptyView,
          },
        ],
      },
      {
        path: 'assetSyncLog',
        name: 'assetSyncLog',
        meta: {
          title: '资产同步日志',
          icon: ['custom:asset-sync-log', 'custom:asset-sync-log-active'],
        },
        component: EmptyView,
      },
      {
        path: 'adminOperationLog',
        name: 'adminOperationLog',
        meta: {
          title: '管理员操作日志',
          icon: ['custom:admin-operation-log', 'custom:admin-operation-log-active'],
        },
        component: EmptyView,
      },
    ],
  },
]

export default routes
