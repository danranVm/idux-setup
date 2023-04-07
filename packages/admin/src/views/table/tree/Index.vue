<script lang="ts" setup>
import { ref, shallowRef } from 'vue'

import Table from './Table.vue'
import Tree from './Tree.vue'
import { type TableData, type QueryParams } from './useTable'

const collapsed = shallowRef(false)
const spining = shallowRef(false)

function getData() {
  const data: TableData[] = []
  for (let index = 0; index < Math.floor(Math.random() * 100); index++) {
    data.push({
      key: index,
      name: 'localhost.cm3',
      mac: 'o4:pe:w6:hh:wc:2b',
      type: '服务器',
      status: '在线',
      os: 'Linux',
      group: '智园A1-服务器-非研发',
      ip: '10.246.88.196',
    })
  }
  return data
}

const dataSource = ref<TableData[]>(getData())
const onSelectedChange = () => {
  spining.value = true
  setTimeout(() => {
    dataSource.value = getData()
    spining.value = false
  }, 1000)
}

const onRequestData = (queryParams: QueryParams) => {
  // eslint-disable-next-line no-console
  console.log(queryParams)
  spining.value = true
  setTimeout(() => {
    dataSource.value = getData()
    spining.value = false
  }, 1000)
}
</script>
<template>
  <div class="tree-table-page h-full flex flex-col">
    <IxHeader class="dark:text-gray-300"> 左树列表 </IxHeader>
    <IxLayout class="flex-1">
      <IxLayoutSider v-model:collapsed="collapsed">
        <Tree v-model:collapsed="collapsed" @selectedChange="onSelectedChange"></Tree>
      </IxLayoutSider>
      <IxLayoutContent>
        <Table :spin="spining" :dataSource="dataSource" @requestDataChange="onRequestData"></Table>
      </IxLayoutContent>
    </IxLayout>
  </div>
</template>
<style lang="less">
@import url('./index.less');
</style>
