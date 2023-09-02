<script setup lang="ts">
import { shallowRef, onMounted } from 'vue'

import { useKey } from '@idux/cdk'
import { useSortable } from '@idux/setup-shared'

const props = defineProps<{ title: string; index: number }>()
const key = useKey()

const elementRef = shallowRef<HTMLElement>()
const sortableElementRef = shallowRef<HTMLElement>()

onMounted(() => (sortableElementRef.value = elementRef.value!.parentElement!.parentElement))

useSortable(sortableElementRef, () => ({ data: { key }, index: props.index }))
</script>

<template>
  <div ref="elementRef" class="dashboard-tabs-title">
    <span>{{ title }}</span>
  </div>
</template>

<style scoped lang="less">
.dashboard-tabs-title {
}
</style>
