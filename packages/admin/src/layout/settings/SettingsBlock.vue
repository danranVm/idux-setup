<script lang="ts" setup>
const prefixCls = 'nav-settings__block'
</script>

<template>
  <div :class="prefixCls">
    <div :class="`${prefixCls}__header`">
      <slot name="header"></slot>
    </div>
    <div :class="`${prefixCls}__content`">
      <slot></slot>
    </div>
  </div>
</template>
