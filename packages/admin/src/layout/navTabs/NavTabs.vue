<script lang="ts" setup>
import { computed, inject } from 'vue'

import { useState } from '@idux/cdk/utils'
import { type DndSortableChangeOptions, DndSortable } from '@idux/setup-shared'
import { isNil } from 'lodash-es'

import NavTabItem from './NavTabItem.vue'
import { layoutContextToken } from '../context'
import type { NavTab } from '../types'

const { navTabRecords, isNavTabMovable, moveNavTab } = inject(layoutContextToken)!

const [isMoved, setIsMoved] = useState(false)
const [isDragging, setIsDragging] = useState(false)

const tabCls = 'layout-nav-tabs'
const tabsClasses = computed(() => ({
  [tabCls]: true,
  [`${tabCls}--moved`]: !!isMoved.value,
  [`${tabCls}--dragging`]: !!isDragging.value,
}))

const handleSortChange = (data: NavTab[], options: DndSortableChangeOptions) => {
  const { oldIndex, newIndex, type } = options

  if (type !== 'update' || isNil(oldIndex) || isNil(newIndex)) {
    return
  }

  moveNavTab(oldIndex, newIndex)

  setIsMoved(true)
  setTimeout(() => {
    setIsMoved(false)
  }, 200)
}
const handleMove = (evt: {
  dragged: HTMLElement
  related: HTMLElement
  willInsertAfter: boolean
}) => {
  const { dragged, related, willInsertAfter } = evt

  const sourceId = dragged.dataset.id
  const targetId = related.dataset.id

  const result =
    sourceId && targetId && isNavTabMovable(sourceId, targetId) ? (willInsertAfter ? 1 : -1) : false

  if (result) {
    setTimeout(() => {
      dragged.focus()
    })
  }

  return result
}
const handleStart = () => {
  setIsDragging(true)
}
const handleEnd = () => {
  setIsDragging(false)
}
</script>

<template>
  <DndSortable
    v-show="navTabRecords.length"
    :class="tabsClasses"
    tag="TransitionGroup"
    :animation="180"
    :dataSource="navTabRecords"
    :componentProps="{ name: 'tabs', tag: 'div' }"
    :getKey="record => record.id"
    @change="handleSortChange"
    @move="handleMove"
    @start="handleStart"
    @end="handleEnd"
  >
    <NavTabItem
      v-for="(record, idx) in navTabRecords"
      :record="record"
      :index="idx"
      :key="record.id"
    />
  </DndSortable>
</template>
