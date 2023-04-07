<script setup lang="ts">
import { watch, ref, shallowRef } from 'vue'

import { SearchField, SearchValue } from '@idux/pro'

import { useLists } from './useLists'
import { TableData, useTable } from './useTable'

const refreshTimeDataSource = [
  { key: 'none', label: '刷新间隔：不刷新' },
  { key: '60', label: '刷新间隔：60s' },
  { key: '120', label: '刷新间隔：120s' },
]

const refreshBtnLoding = shallowRef(false)
const refreshTime = shallowRef('none')
let timer: number | null = null

watch(refreshTime, time => {
  clearRefresh()
  if (time !== 'none') {
    handleRefresh()
  }
})

const handleRefresh = () => {
  refreshBtnLoding.value = true
  timer = setTimeout(() => {
    refreshBtnLoding.value = false
  }, 1000)
}

const clearRefresh = () => {
  timer && clearTimeout(timer)
  refreshBtnLoding.value = false
}

function getData() {
  const data: TableData[] = []
  for (let index = 0; index < 100; index++) {
    data.push({
      key: index,
      time: new Date().getTime() + index * 1000,
      name: ['访问lemonduck挖矿的通信域名', '通过incognito工具创建可疑特权进程'][
        Math.floor(Math.random() * 2)
      ],
      grade: ['serious', 'high', 'middle'][Math.floor(Math.random() * 3)],
      tags: ['挖矿', '防御规避', '执行'].slice(Math.floor(Math.random() * 3)),
      classification1: '终端行为异常',
      classification2: '可疑进程行为',
      classification3: '其他可疑行为',
      stage: '主机异常',
      ip: '10.246.88.196(网信办)',
    })
  }

  return data
}

const staticList = ref(new Array(12).fill({ name: 'WebShell', number: 2019 }))
const { lists, listsSpan } = useLists()
const tableDataSource = ref<TableData[]>(getData())

const { pagination, columns } = useTable()

const oneDayDuration = 24 * 60 * 60 * 1000

const now = new Date()
const nowValue = now.valueOf()
const lastDay = new Date(nowValue - oneDayDuration)
const _7daysAgo = new Date(nowValue - oneDayDuration * 7)
const _30daysAgo = new Date(nowValue - oneDayDuration * 30)
const _180daysAgo = new Date(nowValue - oneDayDuration * 180)

const shortcutsMap = {
  today: [now, now],
  lastday: [lastDay, lastDay],
  '7days': [_7daysAgo, now],
  '30days': [_30daysAgo, now],
  '180days': [_180daysAgo, now],
  custom: 'custom',
}

const shortcuts = [
  {
    key: 'today',
    value: 'today',
    label: '今天',
  },
  {
    key: 'lastday',
    value: 'lastday',
    label: '昨天',
  },
  {
    key: '7days',
    value: '7days',
    label: '近7天',
  },
  {
    key: '30days',
    value: '30days',
    label: '近30天',
  },
  {
    key: '180days',
    value: '180days',
    label: '近180天',
  },
  {
    key: 'custom',
    value: 'custom',
    label: '自定义',
  },
]

const selectValue = ref<keyof typeof shortcutsMap>('180days')
const dateValue = ref<Date[] | undefined>(shortcutsMap['180days'])
const open = ref(false)

const handleSelectValueUpdate = (value: keyof typeof shortcutsMap) => {
  if (value !== 'custom') {
    dateValue.value = shortcutsMap[value]
  } else {
    setTimeout(() => {
      open.value = true
    }, 100)
  }

  selectValue.value = value
}
const handleValueUpdate = (value: Date[] | undefined) => {
  dateValue.value = value
  selectValue.value = 'custom'
}

const proSearchValue = ref<SearchValue[]>([
  {
    key: 'security_state',
    name: 'Security State',
    value: ['high', 'middle'],
  },
  {
    key: 'keyword',
    name: '',
    value: '自定义关键词',
  },
])
const searchFields: SearchField[] = [
  {
    key: 'keyword',
    type: 'input',
    label: '关键词',
    multiple: true,
    placeholder: '请输入关键词',
    fieldConfig: {
      trim: true,
    },
  },
  {
    type: 'select',
    label: '安全状态',
    key: 'security_state',
    fieldConfig: {
      multiple: true,
      searchable: true,
      dataSource: [
        {
          key: 'serious',
          label: '严重',
        },
        {
          key: 'high',
          label: '高危',
        },
        {
          key: 'mediumn',
          label: '中危',
        },
      ],
    },
  },
]

const onChange = (value: SearchValue[] | undefined, oldValue: SearchValue[] | undefined) => {
  // eslint-disable-next-line no-console
  console.log(value, oldValue)
}
const onSearch = () => {
  // eslint-disable-next-line no-console
  console.log('onSearch')
}
</script>
<template>
  <div class="real-time-table-page">
    <IxHeader class="dark:text-gray-300"> 实时列表 </IxHeader>
    <IxSpace vertical block :size="8">
      <IxRow :gutter="8">
        <IxCol>
          <IxSpace :size="0" class="shortcut-date-picker">
            <IxSelect
              style="width: 90px"
              :value="selectValue"
              :onUpdate:value="handleSelectValueUpdate"
              :data-source="shortcuts"
            />
            <IxDateRangePicker
              allow-input="overlay"
              v-model:open="open"
              :value="dateValue"
              :onUpdate:value="handleValueUpdate"
              style="width: 350px"
            />
          </IxSpace>
        </IxCol>
        <IxCol flex="auto">
          <IxProSearch
            style="width: 100%"
            placeholder="可进行多条件的筛选；多个条件用“,”分隔，多个筛选条件用回车键分隔"
            v-model:value="proSearchValue"
            :searchFields="searchFields"
            :onChange="onChange"
            :onSearch="onSearch"
          ></IxProSearch>
        </IxCol>
        <IxCol>
          <IxButtonGroup :gap="0">
            <IxButton
              icon="reload"
              shape="square"
              :loading="refreshBtnLoding"
              @click="handleRefresh"
            />
            <IxSelect
              v-model:value="refreshTime"
              :dataSource="refreshTimeDataSource"
              style="width: 140px"
              placeholder="请选择刷新间隔"
            />
          </IxButtonGroup>
        </IxCol>
      </IxRow>
      <IxRow :gutter="8">
        <IxCol flex="388px">
          <IxCard header="攻击统计" class="h-full">
            <IxRow>
              <IxCol :span="listsSpan" v-for="(item, index) in lists" :key="index">
                <IxSpace align="center" :size="12">
                  <img :width="48" :height="48" :src="item.img" />
                  <IxStatistic :value="item.value" :suffix="item.suffix">
                    <template #title>
                      {{ item.title }}
                    </template>
                  </IxStatistic>
                </IxSpace>
              </IxCol>
            </IxRow>
          </IxCard>
        </IxCol>
        <IxCol flex="auto">
          <IxCard header="重点关注攻击类型" class="h-full">
            <IxRow :gutter="8">
              <IxCol :span="6" v-for="(item, index) in staticList" :key="index">
                <IxRow class="type">
                  <IxCol flex="auto">{{ item.name }}</IxCol>
                  <IxCol>{{ item.number }}</IxCol>
                </IxRow>
              </IxCol>
            </IxRow>
          </IxCard>
        </IxCol>
      </IxRow>
      <IxProTable
        sticky
        :columns="columns"
        :dataSource="tableDataSource"
        :layoutTool="{ searchable: true }"
        :pagination="pagination"
        class="common-table"
      >
        <template #header>
          <IxRow class="mb-2" justify="space-between" align="center">
            <IxCol>
              <IxButtonGroup :gap="8">
                <IxButton mode="primary" disabled>封禁地址</IxButton>
                <IxButton mode="primary" disabled>隔离主机</IxButton>
                <IxButton mode="primary" disabled>处置文件</IxButton>
              </IxButtonGroup>
            </IxCol>
            <IxCol>
              <IxSpace :size="4">
                <IxButtonGroup :gap="4" shape="square">
                  <IxTooltip title="导出">
                    <IxButton icon="export"></IxButton>
                  </IxTooltip>
                  <IxTooltip title="刷新">
                    <IxButton icon="reload"></IxButton>
                  </IxTooltip>
                </IxButtonGroup>
              </IxSpace>
            </IxCol>
          </IxRow>
        </template>
      </IxProTable>
    </IxSpace>
  </div>
</template>
<style lang="less">
@import url('./index.less');
</style>
