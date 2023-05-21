<script setup lang="ts">
import { computed, shallowRef, watch } from 'vue'

import type { DashboardPanel } from '../types'

const props = defineProps<{ panels: DashboardPanel[] }>()

const defaultPanels = shallowRef<DashboardPanel[]>([])
const customPanels = shallowRef<DashboardPanel[]>([])
const showPanels = computed(() =>
  defaultPanels.value.filter(panel => panel.isShow).map(panel => panel.key),
)

watch(
  () => props.panels,
  panels => {
    const currDefaultPanels = []
    const currCustomPanels = []
    panels.forEach(panel => {
      if (panel.type === 'custom') {
        currCustomPanels.push(panel)
      } else {
        currDefaultPanels.push(panel)
      }
    })
    defaultPanels.value = currDefaultPanels
    customPanels.value = currCustomPanels
  },
)
</script>

<template>
  <IxPopover
    closable
    :header="{ size: 'md', title: '管理看板' }"
    placement="bottomStart"
    trigger="click"
  >
    <span>
      <IxIcon name="setting"></IxIcon>
    </span>
    <template #content>
      <div class="panel-default">
        <IxHeader size="xs" :title="'默认看板'"></IxHeader>
        <IxCheckboxGroup :size="12">
          <div class="panel-item" v-for="panel of defaultPanels" :key="panel.key">
            <IxCheckbox :key="panel.key">{{ panel.title }}</IxCheckbox>
            <div class="panel-item-description" v-if="panel.description">
              {{ panel.description }}
            </div>
          </div>
        </IxCheckboxGroup>
      </div>
      <div class="panel-custom">
        <IxHeader size="xs">
          <span>
            自定义面板
            <span>({{ customPanels.length + 1 }}/5)</span>
          </span>
        </IxHeader>
        <IxCheckboxGroup :value="showPanels" :size="12">
          <div class="panel-item" v-for="panel of customPanels" :key="panel.key">
            <IxCheckbox :key="panel.key">{{ panel.title }}</IxCheckbox>
            <div class="panel-item-description" v-if="panel.description">
              {{ panel.description }}
            </div>
          </div>
          <div class="panel-item">
            <IxButton icon="plus" mode="text">新增自定义面板</IxButton>
          </div>
        </IxCheckboxGroup>
      </div>
    </template>
  </IxPopover>
</template>

<style scoped lang="less">
.panel-item {
  padding: 12px;

  &-description {
    margin-left: 24px;
  }
}

.panel-default,
.panel-custom {
  padding: 12px;
  width: 428px;
}

.ix-header-xs {
  height: 32px;
}
</style>
