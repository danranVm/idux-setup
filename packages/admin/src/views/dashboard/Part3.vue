<script setup lang="ts">
import { h } from 'vue'

import { IxButton } from '@idux/components'
import { type ProTableColumn } from '@idux/pro'

interface Data {
  key: number
  name: string
  route: string
  upstream: number
  down: number
  total: number
  sessions: number
}

const columns: ProTableColumn<any>[] = [
  {
    title: '排名',
    type: 'indexable',
    customCell: ({ rowIndex }) => h('em', { class: 'ranking-number' }, `${rowIndex + 1}.`),
    changeFixed: false,
  },
  {
    title: '设备名称',
    dataKey: 'name',
    changeFixed: false,
    customCell: ({ value }: { value: string }) =>
      h(IxButton, { mode: 'link' }, { default: () => value }),
  },
  {
    title: '线路',
    dataKey: 'route',
    changeFixed: false,
  },
  {
    title: '上行',
    dataKey: 'upstream',
    sortable: {
      sorter: (curr, next) => curr.upstream - next.upstream,
    },
    customCell: ({ value }: { value: number }) => {
      return `${value}Kb/s`
    },
  },
  {
    title: '下行',
    dataKey: 'down',
    sortable: {
      sorter: (curr, next) => curr.down - next.down,
    },
    customCell: ({ value }: { value: number }) => {
      return `${value}Kb/s`
    },
  },
  {
    title: '总流数',
    dataKey: 'total',
    sortable: {
      sorter: (curr, next) => curr.total - next.total,
    },
    customCell: ({ value }: { value: number }) => {
      return `${value}Kb/s`
    },
  },
  {
    title: '会话数',
    dataKey: 'sessions',
    sortable: {
      sorter: (curr, next) => curr.sessions - next.sessions,
    },
  },
]

const data: Data[] = []
for (let index = 0; index < 5; index++) {
  data.push({
    key: index,
    name: ` 10.11.11.28`,
    route: '',
    upstream: 12,
    down: 12,
    total: 24,
    sessions: Math.round(Math.random() * 20),
  })
}
</script>
<template>
  <IxCard header="设备流量排名" size="sm" class="h-full">
    <IxProTable :columns="columns" :dataSource="data" :pagination="false" emptyCell="-">
    </IxProTable>
  </IxCard>
</template>
