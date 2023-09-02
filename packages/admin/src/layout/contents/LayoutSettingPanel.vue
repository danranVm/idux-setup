<script setup lang="ts">
import { type PropType } from 'vue'

import { type MaybeArray, useControlledProp } from '@idux/cdk/utils'

type VKey = string | number | symbol

interface Data {
  img: string
  title: string
  key: VKey
  disabled?: boolean
}

const props = defineProps({
  dataSource: { type: Array as PropType<Data[]> },
  disabled: { type: Boolean, default: false },
  value: { type: null, default: undefined },

  'onUpdate:value': { type: [Function, Array] as PropType<MaybeArray<(value: VKey) => void>> },
})

const [selectedValue, setSelectedValuee] = useControlledProp(props, 'value')

const handleClick = (key: VKey, disabled?: boolean) => {
  if (disabled || props.disabled) return
  setSelectedValuee(key)
}

function getClasses(key: VKey, disabled?: boolean) {
  return {
    'layout-setting-panel-wrapper': true,
    active: key === selectedValue.value,
    disabled: disabled || props.disabled,
  }
}
</script>
<template>
  <IxRow class="layout-setting-panels">
    <IxCol
      :span="12"
      v-for="(item, index) in props.dataSource"
      :key="index"
      @click="handleClick(item.key, item.disabled)"
      :class="getClasses(item.key, item.disabled)"
    >
      <IxSpace vertical block>
        <div class="layout-setting-panel">
          <img :width="90" :height="54" :src="item.img" />
        </div>
        <span class="layout-setting-panel-title">
          {{ item.title }}
        </span>
      </IxSpace>
    </IxCol>
  </IxRow>
</template>
