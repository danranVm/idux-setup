<script lang="ts" setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'

import type { TreeDragDropOptions } from '@idux/components/tree'

import { changeRecordOrder } from '../utils'

import type { NavRecord } from '@/types'

const props = defineProps<{
  editEnabled: boolean
  dataSource: NavRecord[]
}>()
const emit = defineEmits<{
  (event: 'delete', id: string): void
  (event: 'change', records: NavRecord[]): void
}>()

const router = useRouter()

const dataMap = computed(
  () => new Map<string, NavRecord>(props.dataSource.map(record => [record.id, record])),
)
const treeData = computed(() =>
  props.dataSource.map(record => ({
    ...record,
    key: record.id,
    label: record.title,
  })),
)
const classes = computed(() => {
  const cls = 'nav-shortcuts__content'

  return {
    [cls]: true,
    [`${cls}--edit-enabled`]: !!props.editEnabled,
  }
})

const handleDelete = (id: string) => {
  emit('delete', id)
}
const handleDrop = (options: TreeDragDropOptions) => {
  const { dragNode, dropNode, dropType } = options
  if (dropType === 'inside') {
    return
  }

  const changedIds = changeRecordOrder(
    props.dataSource.map(record => record.id),
    dragNode.id as string,
    dropNode.id as string,
    dropType,
  )

  emit(
    'change',
    changedIds.map(id => dataMap.value.get(id)),
  )
}
const handleNodeClick = (_, node: NavRecord) => {
  router.push(node.path)
}
</script>

<template>
  <IxTree
    :class="classes"
    blocked
    :dataSource="treeData"
    :draggable="editEnabled"
    :selectedKeys="[]"
    :onNodeClick="handleNodeClick"
    @drop="handleDrop"
  >
    <template #label="{ node }">
      <span class="nav-shortcuts__content__label">
        {{ node.label }}
      </span>
    </template>
    <template #suffix="{ key }">
      <IxIcon
        v-if="editEnabled"
        name="custom:delete"
        @click="
          evt => {
            evt.stopImmediatePropagation()
            handleDelete(key)
          }
        "
      />
    </template>
  </IxTree>
</template>
