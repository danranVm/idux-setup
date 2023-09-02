<script lang="ts" setup>
import { Tooltip } from '../components/tooltip'

defineProps<{
  mode: 'icon' | 'all'
  icon?: string
  label: string
}>()
</script>
<template>
  <div class="global-layout__footer__oper-item">
    <span v-if="mode === 'all'" class="global-layout__footer__oper-item__icon">
      <slot name="icon">
        <IxIcon :name="icon" />
      </slot>
    </span>
    <Tooltip v-if="mode === 'icon'" :title="label" placement="topStart">
      <span class="global-layout__footer__oper-item__icon">
        <slot name="icon">
          <IxIcon :name="icon" />
        </slot>
      </span>
    </Tooltip>
    <span v-if="mode === 'all'" class="global-layout__footer__oper-item__label">{{ label }}</span>
    <span v-if="mode === 'all' && $slots.suffix" class="global-layout__footer__oper-item__suffix">
      <slot name="suffix"></slot>
    </span>
  </div>
</template>
