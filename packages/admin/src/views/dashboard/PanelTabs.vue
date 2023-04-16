<script setup lang="ts">
import { ref, watch, nextTick, computed } from 'vue'

import { Validators, useFormControl, useResizeObserver } from '@idux/cdk'
import type { MenuData, MenuClickOptions } from '@idux/components'
import { uniqueId } from 'lodash-es'

import type { DashboardPanel } from './types'

import { useI18n } from '@/plugins/i18n'

const { $i } = useI18n()

const tabsRef = ref()
const tabsWidth = ref(0)
useResizeObserver(tabsRef, entry => {
  const { contentRect } = entry
  tabsWidth.value = contentRect.width
})
// 加号图标，动态距离
const addBtnLeftSize = computed(() => {
  return tabsWidth.value + 8 + 'px'
})

const panels = ref<DashboardPanel[]>([{ key: 'default', name: $i('自定义面板') }])
const selectedPanel = ref<string>()
const editPanel = ref<string>()
const editPanelControl = useFormControl('', [Validators.required])

const onEditEnd = () => {
  if (!editPanelControl.valid.value) {
    return
  }

  const currPanel = panels.value.find(panel => panel.key === editPanel.value)
  if (currPanel) {
    currPanel.name = editPanelControl.getValue()
  }

  editPanelControl.setValue('')
  editPanel.value = ''
}

const dataSource = computed<MenuData[]>(() => {
  return [
    { key: 'edit', label: $i('编辑') },
    // 仅剩 1 个 panel 的时候，不允许删除
    { key: 'delete', label: $i('删除'), disabled: panels.value.length <= 1 },
  ]
})

const onMenuClick = async ({ key }: MenuClickOptions, currPanel: DashboardPanel) => {
  if (key === 'edit') {
    editPanel.value = currPanel.key
    editPanelControl.setValue(currPanel.name)
  }

  if (key === 'delete') {
    panels.value = panels.value.filter(panel => panel.key !== currPanel.key)
  }
}

const onAddTab = () => {
  const newKey = uniqueId('dashboard-panel')
  panels.value = [...panels.value, { key: newKey, name: '' }]
  editPanel.value = newKey
  editPanelControl.reset()
}
</script>

<template>
  <div class="panel-tabs-wrapper">
    <IxTabs ref="tabsRef" class="panel-tabs" v-model:selectedKey="selectedPanel" type="line">
      <IxTab v-for="panel in panels" :key="panel.key">
        <template #title>
          <div class="panel-tabs-title">
            <span v-if="editPanel !== panel.key">{{ panel.name }}</span>
            <IxInput
              v-else
              style="width: 80%"
              borderless
              :control="editPanelControl"
              :placeholder="$i('请输入面板名称')"
              @blur="onEditEnd"
            >
            </IxInput>
            <IxDropdown trigger="click">
              <IxButton icon="ellipsis-vertical" mode="text"> </IxButton>
              <IxIcon name="ellipsis-vertical"></IxIcon>
              <template #overlay>
                <IxMenu :dataSource="dataSource" @click="onMenuClick($event, panel)"></IxMenu>
              </template>
            </IxDropdown>
          </div>
        </template>
        <div></div>
      </IxTab>
    </IxTabs>
    <IxButton
      class="panel-tabs-add-btn"
      :style="{ left: addBtnLeftSize }"
      icon="plus"
      mode="text"
      size="lg"
      @click="onAddTab"
    >
    </IxButton>
  </div>
</template>

<style lang="less" scoped>
.panel-tabs {
  height: 100%;

  &-wrapper {
    position: relative;
  }

  &-title {
    display: flex;
    justify-content: space-between;
    padding: 0 4px;
  }

  &-add-btn {
    position: absolute;
    top: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    height: 40px;
    right: 40px;
  }

  :deep(.ix-tabs-pane) {
    height: 100%;
    overflow: auto;
  }

  :deep(.ix-tabs-nav-wrapper.ix-tabs-nav-wrapper-has-scroll) {
    margin-right: 50px;
  }
}
</style>
