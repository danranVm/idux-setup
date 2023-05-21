<script setup lang="ts">
import { computed, shallowRef, nextTick } from 'vue'

import {
  type MenuData,
  type MenuClickOptions,
  type InputInstance,
  useModal,
} from '@idux/components'

import { usePanels } from './composables/usePanels'
import DashboardPanelComponent from './contents/DashboardPanel.vue'
import PanelPopover from './contents/PanelPopover.vue'
import type { DashboardPanel } from './types'

const { confirm } = useModal()

const {
  panels,
  selectedKey,
  editingKey,
  editingControl,
  handleAdd,
  handleEdit,
  handleEditEnd,
  handleDelete,
} = usePanels()

const inputRef = shallowRef<InputInstance>()

const menus = computed<MenuData[]>(() => {
  return [
    { key: 'edit', label: '编辑' },
    // 仅剩 1 个 panel 的时候，不允许删除
    { key: 'delete', label: '删除', disabled: panels.value.length <= 1 },
  ]
})

const onMenuClick = async ({ key }: MenuClickOptions, panel: DashboardPanel) => {
  if (key === 'edit') {
    handleEdit(panel)
    nextTick(() => inputRef.value?.focus())
  }

  if (key === 'delete') {
    confirm({
      title: `确定要删除 【${panel.title}】 吗?`,
      content: '删除后, 将无法恢复',
      onOk: () => handleDelete(panel.key),
    })
  }
}

const onAdd = () => {
  handleAdd()
  nextTick(() => inputRef.value?.focus())
}

const onBeforeLeave = () => {
  // 存在编辑中的 tab 时，且验证不通过时，不允许切换
  return !editingKey.value || editingControl.valid.value
}
</script>

<template>
  <div class="dashboard">
    <PanelPopover trigger="click"> </PanelPopover>
    <IxTabs
      class="dashboard-tabs"
      v-model:selectedKey="selectedKey"
      addable
      :dataSource="panels"
      size="lg"
      type="line"
      @add="onAdd"
      @beforeLeave="onBeforeLeave"
    >
      <template #title="panel">
        <div>
          <span v-if="editingKey !== panel.key">{{ panel.title }}</span>
          <IxFormItem v-else messageTooltip>
            <IxInput
              ref="inputRef"
              borderless
              :control="editingControl"
              placeholder="请输入面板名称"
              @blur="handleEditEnd"
              @keyup.enter="handleEditEnd"
            >
            </IxInput>
          </IxFormItem>

          <IxDropdown v-if="panel.selected && editingKey !== panel.key" trigger="click">
            <IxButton style="margin-left: 8px" icon="ellipsis-vertical" mode="text"></IxButton>
            <template #overlay>
              <IxMenu :dataSource="menus" @click="onMenuClick($event, panel)"></IxMenu>
            </template>
          </IxDropdown>
        </div>
      </template>
      <template #content="{ key, title }">
        <DashboardPanelComponent :key="key" :title="title"></DashboardPanelComponent>
      </template>
    </IxTabs>
  </div>
</template>

<style scoped lang="less">
.dashboard {
  position: relative;
  height: 100%;

  &-tabs {
    position: relative;
    height: 100%;
  }

  :deep(.ix-tabs-nav-wrapper) {
    background-color: var(--ix-background-color);
  }

  :deep(.ix-tabs-nav-add-icon) {
    background-color: var(--ix-background-color-light);
  }

  :deep(.ix-tabs-pane) {
    height: 100%;
  }
}
</style>
