<script setup lang="ts">
import { nextTick, ref } from 'vue'

const treeData = [
  {
    label: '全部',
    key: '0',
    icon: 'folder',
    children: [
      {
        label: '本级中心',
        key: '0-0',
        icon: 'folder',
        children: [
          {
            label: 'PC终端',
            key: '0-0-0',
            icon: 'desktop',
            children: [{ label: '研发管理部', key: '0-0-0-0', icon: 'desktop' }],
          },
          {
            label: '产品线',
            key: '0-0-1',
            icon: 'desktop',
            children: [
              { label: '开发小组', key: '0-0-1-0', icon: 'desktop' },
              { label: '测试小组', key: '0-0-1-1', icon: 'desktop' },
            ],
          },
        ],
      },
      {
        label: '下级中心',
        key: '0-1',
        icon: 'folder',
        children: [
          { label: '开发小组', key: '0-1-0', icon: 'desktop' },
          { label: '测试小组', key: '0-1-1', icon: 'desktop' },
        ],
      },
    ],
  },
]

const checkedKeys = ref(['0'])
const selectedKeys = ref(['0'])
const expandedKeys = ref(['0', '0-0', '0-0-0', '0-0-1'])

const onSearch = (searchVal: string) => {
  // eslint-disable-next-line no-console
  console.log('searchVal', searchVal)
  if (searchVal === '') {
    // 处理每次搜索清空后选项全部收缩问题
    nextTick(() => {
      expandedKeys.value = ['0', '0-1']
    })
  }
}
</script>
<template>
  <IxProTree
    v-model:checkedKeys="checkedKeys"
    v-model:selectedKeys="selectedKeys"
    v-model:expandedKeys="expandedKeys"
    class="h-full"
    placeholder="搜索"
    :checkable="false"
    :dataSource="treeData"
    :onSearch="onSearch"
  >
    <template #header>
      <IxHeader size="sm">
        资产组
        <IxIcon name="filter-filled" />
        <template #suffix>
          <div class="add-btn"> 新增 </div>
        </template>
      </IxHeader>
    </template>
    <template #prefix="{ node }">
      <IxIcon :name="node.icon"></IxIcon>
    </template>
  </IxProTree>
</template>
