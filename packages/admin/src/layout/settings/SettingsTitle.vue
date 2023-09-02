<script lang="ts" setup>
defineProps<{
  label?: string
  info?: string
}>()

const prefixCls = 'nav-settings__title'
</script>

<template>
  <div :class="prefixCls">
    <span :class="`${prefixCls}__label`">
      <slot name="label">
        {{ label }}
      </slot>
    </span>
    <IxTooltip v-if="info" :title="info">
      <IxIcon :class="`${prefixCls}__info-icon`" name="info-circle" />
    </IxTooltip>
    <span v-if="$slots.suffix" :class="`${prefixCls}__suffix`">
      <slot name="suffix"></slot>
    </span>
  </div>
</template>
