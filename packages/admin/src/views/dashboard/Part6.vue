<script setup lang="ts">
import { ref } from 'vue'

const progress = ref([
  {
    name: '杀软检查规则',
    value: 18,
    color: '#1C6EFF',
  },
  {
    name: '登录域检查规则',
    value: 16,
    color: '#458FFF',
  },
  {
    name: '进程文件规则',
    value: 14,
    color: '#6DADFF',
  },
  {
    name: '注册表规则',
    value: 8,
    color: '#96C7FF',
  },
  {
    name: '补丁检测规则',
    value: 2,
    color: '#96C7FF',
  },
])
</script>
<template>
  <IxCard class="h-full">
    <IxTabs type="segment" mode="primary" class="small-tabs">
      <IxTab key="tab1" title="TOP违规检查项">
        <IxRow v-for="(item, index) in progress" :key="index" class="mt-1">
          <IxCol class="ranking-number">
            <i>{{ index + 1 }}.</i>
          </IxCol>
          <IxCol flex="auto" class="ml-4">
            <IxRow>
              <IxCol :span="12" class="secondary-text-color"> {{ item.name }} </IxCol>
              <IxCol :span="12" class="text-right"> {{ item.value }} 人</IxCol>
            </IxRow>
            <IxProgress
              :percent="item.value"
              :strokeColor="item.color"
              hideInfo
              strokeLinecap="round"
            >
            </IxProgress>
          </IxCol>
        </IxRow>
      </IxTab>
      <IxTab key="tab2" title="TOP违规用户"> Content of Tab 2 </IxTab>
    </IxTabs>
  </IxCard>
</template>
