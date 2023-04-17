<script setup lang="ts">
import { watch } from 'vue'

import { Validators, uniqueId, useFormGroup } from '@idux/cdk'

import type { DashboardCard } from './types'

import { useI18n } from '@/plugins/i18n'
const { $i } = useI18n()

const props = defineProps<{
  value?: DashboardCard
  visible: boolean
  onOk: (data: DashboardCard) => void
  'onUpdate:visible': (visible: boolean) => void
}>()

const emits = defineEmits<{ 'update:visible': (visible: boolean) => void }>()

const { required } = Validators

const formGroup = useFormGroup<DashboardCard>({
  key: [uniqueId('DashboardCard')],
  title: ['', [required]],
  type: ['bar', [required]],
  dataSet: ['', [required]],
  legend: [[], [required]],
  dateRange: ['', [required]],
  userRange: ['', [required]],
})

watch(
  () => props.value,
  value => {
    if (value) {
      formGroup.setValue(value)
      formGroup.markAsPristine()
    } else {
      formGroup.reset()
      formGroup.get('key').setValue(uniqueId('DashboardCard'))
    }
  },
)

const onOk = () => {
  if (!formGroup.valid.value) {
    formGroup.markAsDirty()
    return false
  }
  props.onOk(formGroup.getValue())
}

const onUpdateVisible = (visible: boolean) => emits['update:visible'](visible)

const types = [
  { key: 'bar', label: '柱状图' },
  { key: 'line', label: '折线图' },
  { key: 'pie', label: '饼图' },
]

const dataSets = [
  {
    key: 'xxx',
    label: 'XXX数据集',
  },
]

const legends = [
  { key: 'a', name: '图例A' },
  { key: 'b', name: '图例B' },
  { key: 'c', name: '图例C' },
  { key: 'd', name: '图例D' },
  { key: 'e', name: '图例E' },
  { key: 'f', name: '图例F' },
]

const dateRanges = [
  { key: '24h', name: '近24小时' },
  { key: '7d', name: '近7天' },
  { key: '30', name: '近30天' },
  { key: 'custom', name: '自定义' },
]

const userRanges = [
  { key: 'all', name: '全部用户' },
  { key: 'some', name: '指定用户' },
]
</script>

<template>
  <IxModal
    :visible="visible"
    :header="value ? '编辑图表' : '新增图表'"
    @ok="onOk"
    @update:visible="onUpdateVisible"
  >
    <IxForm :control="formGroup">
      <h4>{{ $i('基础信息') }}</h4>
      <IxFormItem :label="$i('图表名称')" required>
        <IxInput control="title" />
      </IxFormItem>
      <IxFormItem :label="$i('图表类型')" required>
        <IxRadioGroup control="type" :dataSource="types" buttoned />
      </IxFormItem>
      <h4>{{ $i('图表内容') }}</h4>
      <IxFormItem :label="$i('数据集')" required>
        <IxSelect control="dataSet" :dataSource="dataSets" />
      </IxFormItem>
      <IxFormItem :label="$i('选择字段')" required>
        <IxSelect control="legend" :dataSource="legends" multiple />
      </IxFormItem>
      <h4>{{ $i('数据范围') }}</h4>
      <IxFormItem :label="$i('时间范围')" required>
        <IxRadioGroup control="dateRange" :dataSource="dateRanges" buttoned />
      </IxFormItem>
      <IxFormItem :label="$i('用户范围')" required>
        <IxRadioGroup control="userRange" :dataSource="userRanges" buttoned />
      </IxFormItem>
    </IxForm>
  </IxModal>
</template>
