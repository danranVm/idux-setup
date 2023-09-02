<script lang="ts" setup>
import { computed } from 'vue'

const props = defineProps<{
  label: string
  type: 'radio' | 'checkbox'
  selected: boolean
  disabled?: boolean
  tooltip?: string
}>()

const emit = defineEmits<{
  (e: 'check', checked: boolean): void
  (e: 'hoverStart'): void
  (e: 'hoverEnd'): void
}>()

const itemCls = 'card-checkable-item'
const itemClasses = computed(() => {
  return {
    [itemCls]: true,
    [`${itemCls}--active`]: !!props.selected,
    [`${itemCls}--disabled`]: !!props.disabled,
  }
})

const handleCheck = () => {
  if (props.disabled) {
    return
  }

  emit('check', props.type === 'checkbox' ? !props.selected : true)
}
const handleCheckerClick = (evt: Event) => {
  evt.stopImmediatePropagation()
}
const handleClick = () => {
  handleCheck()
}
const handleMouseenter = () => {
  emit('hoverStart')
}
const handleMouseleave = () => {
  emit('hoverEnd')
}
const handleWheel = () => {
  emit('hoverEnd')
}
</script>

<template>
  <div
    :class="itemClasses"
    :title="tooltip"
    @click="handleClick"
    @mouseenter="handleMouseenter"
    @mouseleave="handleMouseleave"
    @wheel="handleWheel"
  >
    <div :class="`${itemCls}__checker`">
      <IxCheckbox
        v-if="type === 'checkbox'"
        :checked="selected"
        :disabled="disabled"
        @change="handleCheck"
        @click="handleCheckerClick"
      />
      <IxRadio
        v-if="type === 'radio'"
        :checked="selected"
        :disabled="disabled"
        @change="handleCheck"
        @click="handleCheckerClick"
      />
    </div>
    <span :class="`${itemCls}__label`">{{ label }}</span>
  </div>
</template>
