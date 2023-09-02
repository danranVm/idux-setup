<script setup lang="ts">
import { shallowRef, watch } from 'vue'

import { DndSortable } from '@idux/setup-shared'
import { isNil } from 'lodash-es'

import { usePanels } from './composables/usePanels'
import PanelDisplay from './contents/PanelDisplay.vue'
import PanelEditing from './contents/PanelEditing.vue'
import PanelPopover from './contents/PanelPopover.vue'
import SortableTab from './contents/SortableTab.vue'
import type { DashboardPanel } from './types'
import { getNextSelectedKey } from './utils'

const elementRef = shallowRef<HTMLDivElement>()

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const { panels, loading: panelLoading, savePanel, deletePanel } = usePanels()
const showPanels = shallowRef(panels.value.filter(panel => panel.isShow))
const selectedKey = shallowRef()
watch(panels, currPanels => {
  showPanels.value = currPanels.filter(panel => panel.isShow)
  if (isNil(selectedKey.value)) {
    selectedKey.value = currPanels[0]?.key
  }
})

const editingPanel = shallowRef<DashboardPanel>()
const onEdit = (panel: DashboardPanel) => {
  editingPanel.value = panel
}
const onDelete = (panel: DashboardPanel) => {
  let nextKey: string
  if (panel.key === selectedKey.value) {
    nextKey = getNextSelectedKey(panels.value, panel.key)
  }
  deletePanel(panel.key)
  if (nextKey) {
    selectedKey.value = nextKey
  }
}
const onUpdateShow = (panel: DashboardPanel) => {
  const isShow = !panel.isShow
  let nextKey = isShow ? panel.key : getNextSelectedKey(panels.value, panel.key)
  savePanel({ key: panel.key, isShow } as DashboardPanel)
  if (nextKey) {
    selectedKey.value = panel.key
  }
}

const onEditCancel = (key?: string) => {
  editingPanel.value = undefined
  selectedKey.value = key
}
const onEditSave = (panel: DashboardPanel) => {
  const currKey = savePanel(panel)
  editingPanel.value = undefined
  selectedKey.value = currKey
}
const onSortChange = (data: TableData[]) => (showPanels.value = data)
</script>

<template>
  <div class="dashboard">
    <div v-if="!editingPanel" ref="elementRef" style="height: 100%">
      <DndSortable
        container=".ix-tabs-nav-list"
        :animation="200"
        :dataSource="showPanels"
        @change="onSortChange"
      >
        <IxTabs
          class="dashboard-tabs"
          v-model:selectedKey="selectedKey"
          addable
          :dataSource="showPanels"
          size="lg"
          type="line"
        >
          <template #title="{ key, title }">
            <SortableTab
              :key="key"
              :title="title"
              :index="showPanels.findIndex(panel => panel.key === key)"
            ></SortableTab>
          </template>
          <template #addIcon>
            <PanelPopover
              :panels="panels"
              @add="onEdit"
              @edit="onEdit"
              @delete="onDelete"
              @updateShow="onUpdateShow"
            >
            </PanelPopover>
          </template>
          <template #content="{ key }">
            <PanelDisplay :key="key"></PanelDisplay>
          </template>
        </IxTabs>
      </DndSortable>
    </div>
    <PanelEditing
      v-else
      :key="editingPanel.key"
      :isAdd="!editingPanel.key"
      :title="editingPanel.title"
      @cancel="onEditCancel"
      @save="onEditSave"
    ></PanelEditing>
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

  :deep(.sortable-drag) {
    opacity: 0;
  }

  :deep(.ix-tabs-nav) {
    height: 48px;
  }

  :deep(.ix-tabs-nav-list) {
    padding: 0 16px;
  }

  :deep(.ix-tabs-nav-wrapper) {
    background-color: var(--ix-background-color);
  }

  :deep(.ix-tabs-pane-wrapper) {
    padding: 0;
  }

  :deep(.ix-tabs-pane) {
    height: 100%;
  }
}
</style>
