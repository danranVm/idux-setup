<script lang="ts" setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'

import ItemLabel from './ItemLabel.vue'

const props = defineProps<{
  label: string
  collapsed?: boolean
  icon?: string
  path?: string
  searchValue?: string
}>()

const router = useRouter()

const handleClick = () => {
  if (props.path) {
    router.push(props.path)
  }
}

const classes = computed(() => {
  const cls = 'layout-nav-item'

  return {
    [cls]: true,
    [`${cls}--collapsed`]: !!props.collapsed,
  }
})
</script>

<template>
  <div :class="classes" @click="handleClick">
    <IxIcon v-if="icon" class="layout-nav-item__icon" :name="icon" />
    <ItemLabel
      v-if="!collapsed"
      class="layout-nav-item__label"
      :label="label"
      :match="searchValue"
    />
    <span v-if="!collapsed" class="layout-nav-item__suffix">
      <slot name="suffix"></slot>
    </span>
  </div>
</template>
