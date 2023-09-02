<script lang="ts" setup>
import { shallowRef } from 'vue'

import { useSortable } from '@idux/setup-shared'

const props = defineProps<{ record: any; rowIndex: number }>()

const elementRef = shallowRef<HTMLDivElement>()
useSortable(elementRef, () => ({ data: props.record, index: props.rowIndex }))
</script>
<template>
  <tr ref="elementRef">
    <slot></slot>
  </tr>
</template>
