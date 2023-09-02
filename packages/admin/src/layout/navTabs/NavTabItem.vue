<script lang="ts" setup>
import { computed, inject, normalizeStyle, ref } from 'vue'
import { useRouter } from 'vue-router'

import { useState, useEventListener, convertCssPixel } from '@idux/cdk/utils'
import { useSortable } from '@idux/setup-shared'

import ContextMenu from './ContextMenu.vue'
import { layoutContextToken } from '../context'
import type { NavTab } from '../types'

const { setNavTabPined, removeNavTab } = inject(layoutContextToken)!

const props = defineProps<{
  record: NavTab
  index: number
}>()

const router = useRouter()

const tabItemRef = ref<HTMLElement>()
useSortable(tabItemRef, () => ({ data: props.record, index: props.index }))

const [menuRefPosition, setMenuRefPosition] = useState<{ x: number; y: number }>({ x: 0, y: 0 })
const [menuVisible, setMenuVisible] = useState(false)

const navTabItemCls = 'layout-nav-tabs-item'
const navTabItemClasses = computed(() => {
  const { pined, active } = props.record
  return {
    [navTabItemCls]: true,
    [`${navTabItemCls}--pined`]: !!pined,
    [`${navTabItemCls}--active`]: !!active,
  }
})

const operationIconName = computed(() =>
  props.record.pined ? 'custom:pin-filled' : 'custom:delete',
)

const menuRefStyle = computed(() =>
  normalizeStyle({
    top: convertCssPixel(menuRefPosition.value.y),
    left: convertCssPixel(menuRefPosition.value.x),
  }),
)

const handleClick = () => {
  const { active, path } = props.record

  if (!active) {
    router.push(path)
  }
}
const handleContextMenu = (evt: MouseEvent) => {
  evt.preventDefault()

  const { offsetX, offsetY } = evt
  setMenuRefPosition({
    x: offsetX,
    y: offsetY,
  })

  setMenuVisible(true)
}
const handleOperationClick = (evt: Event) => {
  evt.stopImmediatePropagation()
  const { pined, id } = props.record

  if (pined) {
    setNavTabPined(id, false)
  } else {
    removeNavTab(id)
  }
}

useEventListener(window.document, 'contextmenu', evt => {
  if (tabItemRef.value && evt.composedPath().includes(tabItemRef.value)) {
    return
  }

  setMenuVisible(false)
})
</script>

<template>
  <div
    ref="tabItemRef"
    :class="navTabItemClasses"
    @click="handleClick"
    @contextmenu="handleContextMenu"
    :data-id="record.id"
  >
    <span :class="`${navTabItemCls}__label`">
      {{ record.title }}
    </span>
    <span :class="`${navTabItemCls}__operation`" @click="handleOperationClick">
      <IxIcon :name="operationIconName" />
    </span>
    <svg :class="`${navTabItemCls}__corner-left`" view-box="0 0 8 8">
      <path d="M 0,8 Q 8,8 8,0 L 8,8 L 0,8 Z" />
    </svg>
    <svg :class="`${navTabItemCls}__corner-right`">
      <path d="M 0,0 Q 0,8 8,8 L 0,8 L 0,0 Z" />
    </svg>
    <IxDropdown
      class="layout-nav-tabs-context-menu__overlay"
      trigger="contextmenu"
      :visible="menuVisible"
      @update:visible="setMenuVisible"
    >
      <div :class="`${navTabItemCls}__menu-ref`" :style="menuRefStyle"></div>
      <template #overlay>
        <ContextMenu :record="props.record" />
      </template>
    </IxDropdown>
  </div>
</template>
