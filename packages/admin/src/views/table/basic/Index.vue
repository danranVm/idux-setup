<script lang="ts" setup>
import { shallowRef } from 'vue'

import { DndSortable } from '@idux/setup-shared'

import SortableRow from './SortableRow.vue'
import { type TableData, useTable } from './useTable'

const { pagination, columns } = useTable()

function getData() {
  const data: TableData[] = []
  for (let index = 0; index < 20; index++) {
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

const dataSource = shallowRef<TableData[]>(getData())
const spining = shallowRef(false)
const customTag = { bodyRow: SortableRow }
const customAdditional = { bodyRow: (data: { record: TableData; rowIndex: number }) => data }

const onReload = () => {
  spining.value = true
  setTimeout(() => {
    dataSource.value = getData()
    spining.value = false
  }, 1000)
}
const onSortChange = (data: TableData[]) => (dataSource.value = data)
const recordCanDrag = (data: TableData) => data.key % 2 === 0
</script>
<template>
  <div class="basic-table-page">
    <IxHeader class="dark:text-gray-300 basic-table-page__header"> 标准列表 </IxHeader>
    <DndSortable
      style="height: 100%"
      :animation="200"
      container=".ix-table-tbody"
      :dataSource="dataSource"
      handle=".sortable-icon"
      @change="onSortChange"
    >
      <IxProTable
        autoHeight
        :columns="columns"
        :customTag="customTag"
        :customAdditional="customAdditional"
        :dataSource="dataSource"
        :spin="spining"
        :layoutTool="{ searchable: true }"
        :pagination="pagination"
        class="common-table"
      >
        <template #sortable="{ record }">
          <IxIcon v-if="recordCanDrag(record)" name="holder" class="sortable-icon" />
        </template>
        <template #header>
          <IxRow justify="space-between" align="center" class="mb-2">
            <IxCol>
              <IxButtonGroup :gap="8">
                <IxButton mode="primary">新增</IxButton>
                <IxButton disabled>删除</IxButton>
              </IxButtonGroup>
            </IxCol>
            <IxCol>
              <IxSpace :size="4">
                <IxSelect style="width: 160px" placeholder="告警等级"></IxSelect>
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
    </DndSortable>
  </div>
</template>
<style lang="less">
@import url('./index.less');
</style>
