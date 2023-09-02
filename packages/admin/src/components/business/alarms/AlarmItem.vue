<script lang="ts" setup>
defineProps<{
  contents: string[]
  time: string
}>()
</script>
<template>
  <div class="global-alarms-item">
    <div class="global-alarms-item__content">
      <p v-for="line in contents" :key="line" class="global-alarms-item__content__line">
        {{ line }}
      </p>
    </div>
    <div class="global-alarms-item__footer">
      <span class="global-alarms-item__time">{{ time }}</span>
      <IxButton class="global-alarms-item__oper" mode="link">查看详情</IxButton>
    </div>
  </div>
</template>
