<script lang="ts" setup>
import { computed } from 'vue'
const props = defineProps<{
  label: string
  match?: string
}>()

const resolvedLabel = computed(() => {
  const label = props.label ?? ''
  const searchValue = props.match
  const matchedIdx = searchValue ? label.indexOf(searchValue) : -1

  if (matchedIdx < 0) {
    return {
      left: label,
      matched: '',
      right: '',
    }
  }

  return {
    left: label.slice(0, matchedIdx),
    matched: searchValue,
    right: label.slice(matchedIdx + (searchValue?.length ?? 0)),
  }
})
</script>

<template>
  <span class="layout-item-label">
    <span v-if="resolvedLabel.left">{{ resolvedLabel.left }}</span>
    <span v-if="resolvedLabel.matched" class="layout-item-label__matched">{{
      resolvedLabel.matched
    }}</span>
    <span v-if="resolvedLabel.right">{{ resolvedLabel.right }}</span>
  </span>
</template>
