<script lang="ts" setup>
import { type PropType, computed } from 'vue'

import { type MaybeArray, useControlledProp } from '@idux/cdk/utils'

import BasicNavItem from '../components/BasicNavItem.vue'

const props = defineProps({
  collapsed: Boolean,
  overviewVisible: Boolean,
  'onUpdate:overviewVisible': [Array, Function] as PropType<MaybeArray<(visible: boolean) => void>>,
})

const [_overviewVisible, setOverviewVisible] = useControlledProp(props, 'overviewVisible')

const classes = computed(() => {
  const cls = 'layout-overview-trigger'

  return {
    [cls]: true,
    [`${cls}--active`]: _overviewVisible.value,
  }
})
const navIcon = computed(() =>
  _overviewVisible.value ? 'custom:nav-overview-active' : 'custom:nav-overview',
)
const suffixIconStyle = computed(() => {
  if (!_overviewVisible.value) {
    return
  }

  return {
    transform: 'rotate(180deg)',
  }
})

const handleClick = () => {
  setOverviewVisible(!_overviewVisible.value)
}
</script>

<template>
  <BasicNavItem
    :class="classes"
    label="功能全览"
    :icon="navIcon"
    :collapsed="collapsed"
    @click="handleClick"
  >
    <template #suffix>
      <IxIcon name="right" :style="suffixIconStyle" />
    </template>
  </BasicNavItem>
</template>
