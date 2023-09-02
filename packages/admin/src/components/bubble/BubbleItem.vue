<script lang="ts" setup>
import { computed } from 'vue'

import type { MenuData, MenuClickOptions } from '@idux/components/menu'

import type { BubbleItem } from './types'


const props = defineProps<{ item: BubbleItem }>()

const subDataSource = computed<MenuData[] | undefined>(() => {
  if (!props.item.sub?.length) {
    return
  }

  return props.item.sub.map((subItem, idx) => ({
    key: idx,
    label: subItem.text,
  }))
})

const onMenuClick = ({ key }: MenuClickOptions) => {
  const onClick = props.item.sub?.[key as number].onClick

  if (onClick) {
    onClick()
  }
}
</script>

<template>
  <IxDropdown
    :disabled="!subDataSource"
    showArrow
    placement="left"
    :offset="[0, 16]"
    class="idux-setup-global-bubble-item__dropdown"
  >
    <div class="idux-setup-global-bubble-item" @click="item.onClick">
      <div class="idux-setup-global-bubble-item__icon">
        <IxIcon :name="item.icon" />
      </div>
      <span class="idux-setup-global-bubble-item__text">{{ item.text }}</span>
    </div>
    <template #overlay>
      <IxMenu
        v-if="subDataSource"
        :onClick="onMenuClick"
        :dataSource="subDataSource"
        :selectable="false"
      ></IxMenu>
    </template>
  </IxDropdown>
</template>
