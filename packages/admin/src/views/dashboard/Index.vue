<script setup lang="ts">
import { shallowRef } from 'vue'

import { usePanels } from './composables/usePanels'
import { usePopoverOffset } from './composables/usePopoverOffset'
import Panel from './contents/Panel.vue'
import PanelPopover from './contents/PanelPopover.vue'

const elementRef = shallowRef<HTMLDivElement>()
const popoverOffset = usePopoverOffset(elementRef)
const { panels, loading: panelLoading, savePanel, deletePanel } = usePanels()
</script>

<template>
  <IxSpin :spinning="panelLoading">
    <div ref="elementRef" class="dashboard">
      <PanelPopover
        v-if="panels.length > 0"
        :loading="panelLoading"
        :offset="popoverOffset"
        :panels="panels"
        @edit="savePanel"
        @delete="deletePanel"
      >
      </PanelPopover>
      <IxTabs class="dashboard-tabs" :dataSource="panels" size="lg" type="line">
        <template #title="panel">
          <div>
            <span>{{ panel.title }}</span>
          </div>
        </template>
        <template #content="{ key }">
          <Panel :key="key"></Panel>
        </template>
      </IxTabs>
    </div>
  </IxSpin>
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
