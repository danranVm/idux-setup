<script setup lang="ts">
import { ref } from 'vue'

const eths = ref(
  new Array(10).fill(undefined).map((_, index) => {
    return {
      name: `eth${index}`,
      online: !!Math.round(Math.random() * 1),
    }
  }),
)

const onlineImgSrc = new URL('./assets/eth-online.svg', import.meta.url).href
const offlineImgSrc = new URL('./assets/eth-offline.svg', import.meta.url).href
</script>
<template>
  <IxCard header="接口状态" size="sm" class="h-full">
    <IxRow :gutter="12">
      <IxCol v-for="(item, index) in eths" :key="index" :span="6">
        <IxSpace align="center">
          <img
            :with="12"
            :height="12"
            :src="item.online ? onlineImgSrc : offlineImgSrc"
            alt="eth-status"
          />
          <span class="eth-name">{{ item.name }}</span>
        </IxSpace>
      </IxCol>
    </IxRow>
  </IxCard>
</template>
