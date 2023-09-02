<script lang="ts" setup>
import { withDefaults } from 'vue'

withDefaults(
  defineProps<{
    tip?: string
  }>(),
  {},
)
</script>

<template>
  <IxTooltip
    class="form-modal_tip"
    placement="bottomStart"
    close-on-deactivated
    destroy-on-hide
    :delay="300"
    v-bind="$attrs"
  >
    <template v-if="tip || $slots.tip" #title>
      <slot name="tip">
        {{ tip }}
      </slot>
    </template>
    <IxIcon name="exclamation-circle" class="Info-Circle form-modal_tip-icon" />
  </IxTooltip>
</template>

<style lang="less">
.form-modal_tip {
  max-width: 360px;
  &-icon {
    font-size: 16px;
    color: #1c6eff;
  }
}
</style>
