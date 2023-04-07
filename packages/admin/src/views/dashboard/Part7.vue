<script setup lang="ts">
import { ref } from 'vue'

import { format } from 'date-fns'

const devInfos = ref([
  {
    name: '系统时间',
    value: format(new Date().getTime(), 'yyyy-MM-dd HH:mm:ss'),
    imgSrc: new URL('./assets/dev-info1.svg', import.meta.url).href,
  },
  {
    name: '版本信息',
    value: 'v1.3.4',
    imgSrc: new URL('./assets/dev-info2.svg', import.meta.url).href,
  },
  {
    name: '高可用状态',
    value: '双机',
    imgSrc: new URL('./assets/dev-info3.svg', import.meta.url).href,
  },
  {
    name: '并发会话数',
    value: 23344,
    imgSrc: new URL('./assets/dev-info4.svg', import.meta.url).href,
  },
  {
    name: '集中管理状态',
    value: '已加入中心管理',
    imgSrc: new URL('./assets/dev-info5.svg', import.meta.url).href,
  },
])
</script>
<template>
  <IxCard header="设备状态" size="sm" class="h-full">
    <IxRow :gutter="16">
      <IxCol v-for="(item, index) in devInfos" :key="index" :span="8">
        <IxSpace align="center">
          <img :src="item.imgSrc" alt="devinfo" :width="32" :height="32" />
          <div>
            <div class="dev-info-name">{{ item.name }}</div>
            <div class="dev-info-value">{{ item.value.toLocaleString() }}</div>
          </div>
        </IxSpace>
      </IxCol>
    </IxRow>
  </IxCard>
</template>
