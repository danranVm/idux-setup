<script lang="ts" setup>
import { computed, provide, reactive, toRefs } from 'vue'

import { useSharedBreakpoints } from '@idux/cdk/breakpoint'

import Banner from './Banner.vue'
import Box from './Box.vue'
import { Config, loginContextToken } from './context'

const breakpoints = useSharedBreakpoints()

const wrapperClasses = computed(() => {
  return {
    'login-wrapper': true,
    sm: breakpoints.sm,
    md: breakpoints.md,
    lg: breakpoints.lg || breakpoints.xl,
  }
})

const config = reactive<Config>({
  bannerHeader: '最佳实践 一应俱全',
  bannerContent: '围绕 Seer Design 设计规范体系打造的具备完善产品架构的 DEMO 原型',
  boxServicePhone: '400-630-6430',
  boxOnlineService: true,
  boxQrCode: true,
})

provide(loginContextToken, toRefs(config))
</script>
<template>
  <div :class="wrapperClasses">
    <Banner v-show="!breakpoints.sm"></Banner>
    <Box></Box>
  </div>
</template>
<style lang="less">
@import url('./index.less');
</style>
