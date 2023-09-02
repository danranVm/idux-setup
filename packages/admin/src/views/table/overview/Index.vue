<script lang="ts" setup>
import { ref, shallowRef } from 'vue'

import { useLists } from './useLists'
import { type TableData, useTable } from './useTable'

const { pagination, columns } = useTable()
const { lists, listsSpan } = useLists()

function getData() {
  const data: TableData[] = []
  for (let index = 0; index < 100; index++) {
    data.push({
      key: index,
      time: new Date().getTime() + index * 1000,
      name: ['访问lemonduck挖矿的通信域名', '通过incognito工具创建可疑特权进程'][
        Math.floor(Math.random() * 2)
      ],
      grade: ['serious', 'high', 'middle'][Math.floor(Math.random() * 3)],
      tags: ['挖矿', '防御规避', '执行'].slice(Math.floor(Math.random() * 3)),
      classification1: '终端行为异常',
      classification2: '可疑进程行为',
      classification3: '其他可疑行为',
      stage: '主机异常',
      ip: '10.246.88.196(网信办)',
    })
  }

  return data
}

const spining = shallowRef(false)
const dataSource = ref<TableData[]>(getData())

const onReload = () => {
  spining.value = true
  setTimeout(() => {
    dataSource.value = getData()
    spining.value = false
  }, 1000)
}
</script>
<template>
  <div class="overview-table-page">
    <IxHeader class="dark:text-gray-300"> 概览列表 </IxHeader>
    <IxRow class="card-view">
      <IxCol :span="listsSpan" v-for="(item, index) in lists" :key="index">
        <IxSpace align="center" :size="12">
          <img :width="48" :height="48" :src="item.img" />
          <IxStatistic :value="item.value" :suffix="item.suffix">
            <template #title>
              <template v-if="item.title">
                {{ item.title }}
              </template>
              <component v-else :is="item.customTitle"></component>
            </template>
          </IxStatistic>
        </IxSpace>
      </IxCol>
    </IxRow>
    <IxProTable
      sticky
      :columns="columns"
      :dataSource="dataSource"
      :spin="spining"
      :layoutTool="{ searchable: true }"
      :pagination="pagination"
      class="common-table"
    >
      <template #header>
        <IxRow class="mb-2" justify="space-between" align="center">
          <IxCol>
            <IxButtonGroup :gap="8">
              <IxButton mode="primary">开始扫描</IxButton>
            </IxButtonGroup>
          </IxCol>
          <IxCol>
            <IxSpace :size="4">
              <IxInput placeholder="搜索告警名称" suffix="search" />
              <IxButtonGroup :gap="4" shape="square">
                <IxTooltip title="导出">
                  <IxButton icon="export"></IxButton>
                </IxTooltip>
                <IxTooltip title="刷新">
                  <IxButton icon="reload" @click="onReload"></IxButton>
                </IxTooltip>
              </IxButtonGroup>
            </IxSpace>
          </IxCol>
        </IxRow>
      </template>
    </IxProTable>
  </div>
</template>
<style lang="less">
@import url('./styles/index.less');
</style>
