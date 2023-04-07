<script setup lang="ts">
import { ref, reactive } from 'vue'

import { isNil } from 'lodash-es'

const platformData = reactive({
  header: '平台状态',
  status: '优',
  lists: [
    {
      name: 'CPU',
      value: 36,
      color: '#FF7E30',
    },
    {
      name: '内存',
      value: 60,
      color: '#1C6EFF',
    },
    {
      name: '存储',
      value: 80,
      color: '#1C6EFF',
    },
  ],
})

const normalCardData = ref([
  {
    header: '在线用户数',
    value: 329,
    increase: 21,
    decrease: null,
    lists: [
      {
        name: '在线PC',
        value: '308人',
      },
      {
        name: '在线共享终端',
        value: '-',
      },
      {
        name: '在线移动终端',
        value: '-',
      },
      {
        name: '已受EDR保护',
        value: '未开启',
      },
    ],
  },
  {
    header: '应用防护分析',
    value: 90,
    increase: null,
    decrease: 2,
    lists: [
      {
        name: '常见攻击工具',
        value: '-',
      },
      {
        name: '孤立进程',
        value: '-',
      },
      {
        name: '未签名进程',
        value: '-',
      },
    ],
  },
  {
    header: '业务风险分析',
    value: 2245,
    increase: 108,
    decrease: null,
    lists: [
      {
        name: '已失馅',
        value: 23,
      },
      {
        name: '遭受攻击',
        value: 2203,
      },
      {
        name: '存在漏洞',
        value: 15,
      },
    ],
  },
])
</script>
<template>
  <IxRow :gutter="8">
    <IxCol :span="6">
      <IxCard :header="platformData.header" size="sm" class="h-full">
        <div class="platform-status">
          <h1>{{ platformData.status }}</h1>
        </div>
        <IxRow :gutter="4">
          <IxCol
            :span="10"
            v-for="(item, index) in platformData.lists"
            :key="index"
            :offset="index % 2 === 0 ? 0 : 4"
          >
            <IxRow>
              <IxCol :span="12" class="secondary-text-color"> {{ item.name }} </IxCol>
              <IxCol :span="12" class="text-right"> {{ item.value }}% </IxCol>
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
      </IxCard>
    </IxCol>
    <IxCol v-for="(item, index) in normalCardData" :key="index" :span="6">
      <IxCard :header="item.header" size="sm" class="h-full">
        <IxStatistic :value="item.value.toLocaleString()">
          <template #suffix>
            <span :class="!isNil(item.increase) ? 'increase-tag' : 'decrease-tag'">
              <i></i>
              {{ !isNil(item.increase) ? item.increase : item.decrease }}
            </span>
          </template>
        </IxStatistic>
        <IxDivider />
        <IxRow>
          <IxCol v-for="(list, index) in item.lists" :key="index" :span="12" class="mb-4">
            <IxRow>
              <IxCol :span="12" class="secondary-text-color">{{ list.name }}</IxCol>
              <IxCol :span="8" class="text-right">{{ list.value.toLocaleString() }}</IxCol>
            </IxRow>
          </IxCol>
        </IxRow>
      </IxCard>
    </IxCol>
  </IxRow>
</template>
