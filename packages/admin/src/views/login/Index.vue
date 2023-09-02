<script lang="ts" setup>
import { provide, reactive, toRefs } from 'vue'

import Banner from './Banner.vue'
import Box from './Box.vue'
import { type Config, loginContextToken } from './context'

const config = reactive<Config>({
  bannerHeader: 'Seer Design',
  bannerContent:
    '“Seer Design 最佳实践”是体验领先的业务指导型demo演示平台，旨在展示体验前沿的统一化业务方案、页面布局和UI组件，打造最佳应用案例，为深信服各产品提供设计借鉴。',
  boxServicePhone: '400-630-6430',
  boxOnlineService: true,
  boxQrCode: true,
})

provide(loginContextToken, toRefs(config))
</script>
<template>
  <div class="login-wrapper">
    <Banner></Banner>
    <Box></Box>
  </div>
</template>
<style lang="less">
@import url('./index.less');
</style>
