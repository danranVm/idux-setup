<script lang="ts" setup>
import { type PropType, computed, toRaw } from 'vue'

import { type MaybeArray, useControlledProp } from '@idux/cdk/utils'

import Item from './Item.vue'
import type { CardCheckableGroupOption } from './types'

const props = defineProps({
  type: { type: String as PropType<'radio' | 'checkbox'>, default: 'checkbox' },
  value: Array as PropType<(any | undefined)[]>,
  options: Array as PropType<CardCheckableGroupOption[]>,

  'onUpdate:value': [Function, Array] as PropType<MaybeArray<(value: any | undefined) => void>>,
})

const emit = defineEmits<{
  (e: 'change', value: (any | undefined)[], oldValue: (any | undefined)[]): void
  (e: 'itemHover', option: CardCheckableGroupOption | undefined): void
}>()

const [selectedValue, setSelectedValue] = useControlledProp(props, 'value')
const selectedValueSet = computed(() => new Set(selectedValue.value))

const handleChange = (value: any | undefined, checked: boolean) => {
  const oldValue = toRaw(selectedValue.value) ?? []
  const valueSet = new Set(selectedValueSet.value)

  if (props.type === 'radio') {
    valueSet.clear()
  }

  if (checked) {
    valueSet.add(value)
  } else {
    valueSet.delete(value)
  }

  const newValue = Array.from(valueSet)
  setSelectedValue(newValue)
  emit('change', newValue, oldValue)
}

const handleHoverStart = (item: CardCheckableGroupOption) => {
  emit('itemHover', item)
}
const handleHoverEnd = () => {
  emit('itemHover', undefined)
}
</script>

<template>
  <div class="card-checkable-group">
    <Item
      v-for="item in options"
      :key="item.label"
      :class="item.class"
      :type="type"
      :label="item.label"
      :disabled="item.disabled"
      :tooltip="item.tooltip"
      :selected="selectedValueSet.has(item.value)"
      @check="checked => handleChange(item.value, checked)"
      @hover-start="() => handleHoverStart(item)"
      @hover-end="handleHoverEnd"
    />
  </div>
</template>
