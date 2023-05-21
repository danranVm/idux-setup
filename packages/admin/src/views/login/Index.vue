<script lang="ts" setup>
import { provide, reactive, toRefs } from 'vue'

import Banner from './Banner.vue'
import Box from './Box.vue'
import { type Config, loginContextToken } from './context'

const config = reactive<Config>({
  bannerHeader: 'Seer Design',
  bannerContent: '数据安全访问代理系统以用户身份和数据资产为中心，基于主客体属性的动态化访问控制、AI智能化数据分类分级、云原生等技术，实现精准、灵活的访问控制策略持续保障数据安全。使数据管理者更容易管理对数据的访问，并使数据消费者（如工程师、数据科学家、产品经理、分析师和业务用户）更轻松地发现、使用和协作数据，以推动数据价值的释放。',
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
