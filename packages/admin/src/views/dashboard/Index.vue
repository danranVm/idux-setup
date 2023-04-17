<script setup lang="ts">
import { ref, computed, shallowRef, nextTick } from 'vue'

import { Validators, useFormControl } from '@idux/cdk'
import type { MenuData, MenuClickOptions, InputInstance } from '@idux/components'
import { uniqueId } from 'lodash-es'

import PaneContent from './PaneContent.vue'
import type { DashboardPanel } from './types'

import { useI18n } from '@/plugins/i18n'

const { $i } = useI18n()

const panels = ref<DashboardPanel[]>([{ key: 'default', title: $i('自定义面板') }])
const selectedPanel = ref<string>()
const editPanel = ref<string>()
const editPanelControl = useFormControl('', [Validators.required])
const inputRef = shallowRef<InputInstance>()

const menus = computed<MenuData[]>(() => {
  return [
    { key: 'edit', label: $i('编辑') },
    // 仅剩 1 个 panel 的时候，不允许删除
    { key: 'delete', label: $i('删除'), disabled: panels.value.length <= 1 },
  ]
})

const onMenuClick = async ({ key }: MenuClickOptions, currPanel: DashboardPanel) => {
  if (key === 'edit') {
    onEdit(currPanel)
  }

  if (key === 'delete') {
    panels.value = panels.value.filter(panel => panel.key !== currPanel.key)
    selectedPanel.value = panels.value[0].key
  }
}

const onBeforeLeave = () => {
  // 存在编辑中的 tab 时，且验证不通过时，不允许切换
  return !editPanel.value || editPanelControl.valid.value
}

const onAdd = () => {
  const newKey = uniqueId('dashboard-panel')
  panels.value = [...panels.value, { key: newKey, title: '' }]
  selectedPanel.value = newKey
  editPanel.value = newKey
  editPanelControl.reset()
  nextTick(() => inputRef.value?.focus())
}

const onEdit = (panel: DashboardPanel) => {
  editPanel.value = panel.key
  editPanelControl.setValue(panel.title)
  nextTick(() => inputRef.value?.focus())
}

const onEditEnd = () => {
  if (!editPanelControl.valid.value) {
    editPanelControl.markAsDirty()
    return
  }

  const currPanel = panels.value.find(panel => panel.key === editPanel.value)
  if (currPanel) {
    currPanel.title = editPanelControl.getValue()
  }

  editPanelControl.setValue('')
  editPanel.value = ''
}
</script>

<template>
  <div class="panel-tabs-wrapper mt-4">
    <IxTabs
      class="panel-tabs"
      v-model:selectedKey="selectedPanel"
      addable
      :dataSource="panels"
      size="lg"
      @add="onAdd"
      @beforeLeave="onBeforeLeave"
    >
      <template #title="panel">
        <div class="panel-tabs-title">
          <span v-if="editPanel !== panel.key">{{ panel.title }}</span>
          <IxFormItem v-else messageTooltip>
            <IxInput
              ref="inputRef"
              borderless
              :control="editPanelControl"
              :placeholder="$i('请输入面板名称')"
              @blur="onEditEnd"
            >
            </IxInput>
          </IxFormItem>

          <IxDropdown v-if="panel.selected && editPanel !== panel.key" trigger="click">
            <IxButton style="margin-left: 8px" icon="ellipsis-vertical" mode="text"></IxButton>
            <template #overlay>
              <IxMenu :dataSource="menus" @click="onMenuClick($event, panel)"></IxMenu>
            </template>
          </IxDropdown>
        </div>
      </template>
      <template #content="{ key }">
        <PaneContent :key="key" :type="key"></PaneContent>
      </template>
    </IxTabs>
  </div>
</template>

<style scoped lang="less">
.panel-tabs {
  &-wrapper {
    position: relative;
  }

  :deep(.ix-tabs-nav-wrapper) {
    background-color: var(--ix-background-color);
  }

  :deep(.ix-tabs-nav-add-icon) {
    background-color: var(--ix-background-color-light);
  }
}
</style>
