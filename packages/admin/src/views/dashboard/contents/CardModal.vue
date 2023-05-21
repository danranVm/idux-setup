<script setup lang="ts">
import { watch } from 'vue'

import { Validators, useFormGroup } from '@idux/cdk'

import Card from './Card.vue'
import type { DashboardCard } from '../types'

import { useI18n } from '@/plugins/i18n'
const { $i } = useI18n()

const props = defineProps<{
  value?: DashboardCard
  visible: boolean
}>()

const emits = defineEmits<{
  (e: 'ok', data: DashboardCard): void
  (e: 'update:visible', visible: boolean): void
}>()

const { required } = Validators

const defaultValue = {
  type: 'bar',
  dateRange: '24h',
  userRange: 'all',
} as const

const formGroup = useFormGroup<DashboardCard>({
  key: ['DashboardCard' + Math.random()],
  title: ['', [required]],
  type: [defaultValue.type, [required]],
  dataSet: ['', [required]],
  legend: [[], [required]],
  dateRange: [defaultValue.dateRange, [required]],
  userRange: [defaultValue.userRange, [required]],
})

watch(
  () => props.visible,
  visible => {
    if (visible) {
      const newValue = props.value ?? { key: 'DashboardCard' + Math.random(), ...defaultValue }
      formGroup.setValue(newValue)
    } else {
      formGroup.reset()
    }
  },
)

const onOk = () => {
  if (!formGroup.valid.value) {
    formGroup.markAsDirty()
    return false
  }
  emits('ok', formGroup.getValue())
}

const onUpdateVisible = (visible: boolean) => emits('update:visible', visible)

const types = [
  { key: 'bar', label: $i('柱状图') },
  { key: 'line', label: $i('折线图') },
  { key: 'pie', label: $i('饼图') },
]

const dataSets = [
  {
    key: 'xxx',
    label: 'XXX数据集',
  },
]

const legends = [
  { key: '图例A', label: $i('图例A') },
  { key: '图例B', label: $i('图例B') },
  { key: '图例C', label: $i('图例C') },
  { key: '图例D', label: $i('图例D') },
  { key: '图例E', label: $i('图例E') },
  { key: '图例F', label: $i('图例F') },
]

const dateRanges = [
  { key: '24h', label: $i('近24小时') },
  { key: '7d', label: $i('近7天') },
  { key: '30', label: $i('近30天') },
  { key: 'custom', label: $i('自定义') },
]

const userRanges = [
  { key: 'all', label: $i('全部用户') },
  { key: 'some', label: $i('指定用户') },
]
</script>

<template>
  <IxModal
    :visible="visible"
    :header="value ? $i('编辑图表') : $i('新增图表')"
    :width="800"
    @ok="onOk"
    @update:visible="onUpdateVisible"
  >
    <IxRow>
      <IxCol span="12">
        <IxForm class="card-form" :control="formGroup" :labelCol="{ flex: '80px' }">
          <h3>{{ $i('基础信息') }}</h3>
          <IxFormItem :label="$i('图表名称')" required>
            <IxInput control="title" />
          </IxFormItem>
          <IxFormItem :label="$i('图表类型')" required>
            <IxRadioGroup control="type" :dataSource="types" buttoned />
          </IxFormItem>
          <h3>{{ $i('图表内容') }}</h3>
          <IxFormItem :label="$i('数据集')" required>
            <IxSelect control="dataSet" :dataSource="dataSets" />
          </IxFormItem>
          <IxFormItem :label="$i('选择字段')" required>
            <IxSelect control="legend" :dataSource="legends" multiple />
          </IxFormItem>
          <h3>{{ $i('数据范围') }}</h3>
          <IxFormItem :label="$i('时间范围')" required>
            <IxRadioGroup control="dateRange" :dataSource="dateRanges" buttoned />
          </IxFormItem>
          <IxFormItem :label="$i('用户范围')" required>
            <IxRadioGroup control="userRange" :dataSource="userRanges" buttoned />
          </IxFormItem>
        </IxForm>
      </IxCol>
      <IxCol class="card-container" span="12">
        <div>
          <Card v-if="formGroup.valid.value" inModal v-bind:="formGroup.valueRef.value"></Card>
        </div>
      </IxCol>
    </IxRow>
  </IxModal> </template
>cx

<style scoped lang="less">
.card-container {
  padding: 24px;
  & > div {
    height: 100%;
    padding: 16px;

    background-color: var(--ix-background-color-light);
  }
}
</style>
