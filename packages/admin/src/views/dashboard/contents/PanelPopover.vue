<script setup lang="ts">
import { shallowRef, watch, reactive } from 'vue'

import type { PopoverInstance } from '@idux/components'

import type { DashboardPanel } from '../types'
import { panelSortFn } from '../utils'

const props = defineProps<{
  panels: DashboardPanel[]
}>()
const emits = defineEmits<{
  (e: 'edit', panel: DashboardPanel): void
  (e: 'delete', panel: DashboardPanel): void
  (e: 'updateShow', panel: DashboardPanel): void
}>()

const visible = shallowRef(false)
const popoverVisibleMap = reactive<Record<string, boolean>>({})
const popoverRef = shallowRef<PopoverInstance>()
const defaultPanels = shallowRef<DashboardPanel[]>([])
const customPanels = shallowRef<DashboardPanel[]>([])

watch(
  () => props.panels,
  panels => {
    const currDefaultPanels: DashboardPanel[] = []
    const currCustomPanels: DashboardPanel[] = []
    panels.forEach(panel => {
      if (panel.type === 'custom') {
        currCustomPanels.push(panel)
      } else {
        currDefaultPanels.push(panel)
      }
    })

    defaultPanels.value = currDefaultPanels.sort(panelSortFn)
    customPanels.value = currCustomPanels.sort(panelSortFn)
    popoverRef.value?.updatePopper()
  },
  { immediate: true },
)

const onAdd = (panel?: DashboardPanel) => {
  const { key, title, ...restPanel } = panel || {}
  emits('edit', {
    ...restPanel,
    title: title ? `${title}副本` : '',
    type: 'custom',
  } as DashboardPanel)
  visible.value = false
}
const onEdit = (panel?: DashboardPanel) => {
  emits('edit', panel)
  visible.value = false
}
const onDelete = (panel: DashboardPanel) => emits('delete', panel)
const onUpdateShow = (panel: DashboardPanel) => emits('updateShow', panel)
</script>

<template>
  <IxPopover
    ref="popoverRef"
    v-model:visible="visible"
    closable
    :header="{ size: 'md', title: '管理看板' }"
    placement="bottomStart"
    trigger="click"
  >
    <span class="panel-trigger">
      <IxIcon name="setting" :size="16"></IxIcon>
    </span>
    <template #content>
      <div class="panel-default">
        <IxHeader size="xs" :title="'默认看板'"></IxHeader>
        <IxRow :gutter="12">
          <IxCol v-for="panel of defaultPanels" :key="panel.key" :span="12">
            <div class="panel-item">
              <div class="panel-item-title">
                <IxCheckbox
                  :key="panel.key"
                  :checked="panel.isShow"
                  @update:checked="onUpdateShow(panel)"
                >
                  {{ panel.title }}
                </IxCheckbox>
                <IxButtonGroup mode="link" :gap="16">
                  <IxButton :disabled="customPanels.length >= 5" @click="onAdd(panel)">
                    创建副本
                  </IxButton>
                  <!-- <IxButton>预览</IxButton> -->
                </IxButtonGroup>
              </div>
              <div class="panel-item-description" v-if="panel.description">
                {{ panel.description }}
              </div>
            </div>
          </IxCol>
        </IxRow>
      </div>
      <div class="panel-custom">
        <IxHeader size="xs">
          <span>
            自定义面板
            <span class="panel-custom-count">({{ customPanels.length }}/5)</span>
          </span>
        </IxHeader>
        <IxRow :gutter="12">
          <IxCol v-for="panel of customPanels" :key="panel.key" :span="12">
            <div class="panel-item">
              <div class="panel-item-title">
                <span>{{ panel.title }}</span>
                <IxButtonGroup
                  :class="popoverVisibleMap[panel.key] ? 'visible' : ''"
                  mode="link"
                  :gap="16"
                >
                  <IxButton @click="onEdit(panel)">编辑</IxButton>
                  <IxPopconfirm
                    v-model:visible="popoverVisibleMap[panel.key]"
                    :title="`确定要删除 【${panel.title}】 吗?`"
                    content="删除后, 将无法恢复"
                    trigger="click"
                    :overlayContainer="() => popoverRef.value"
                    @ok="onDelete(panel)"
                  >
                    <IxButton>删除</IxButton>
                  </IxPopconfirm>
                </IxButtonGroup>
              </div>
            </div>
          </IxCol>
          <IxCol :span="12">
            <div
              :class="['panel-item', customPanels.length >= 5 ? 'disabled' : '']"
              style="padding: 0; line-height: 1"
            >
              <IxButton
                style="padding: 12px"
                :disabled="customPanels.length >= 5"
                block
                icon="plus"
                mode="text"
                @click="onAdd"
              >
                新增自定义面板
              </IxButton>
            </div>
          </IxCol>
        </IxRow>
      </div>
    </template>
  </IxPopover>
</template>

<style scoped lang="less">
.panel-trigger {
  padding: 4px;
  line-height: 1;

  &:hover {
    color: var(--ix-color-primary);
    background-color: var(--ix-background-color-light);
  }
}

.panel-item {
  padding: 12px;
  border: 1px solid var(--ix-border-color);
  border-radius: 2px;

  &:not(.disabled):hover {
    border-color: var(--ix-color-primary);
    .ix-button-group:not(.visible) {
      visibility: visible;
    }
  }

  &-title {
    display: flex;
    align-items: center;
    justify-content: space-between;

    > label,
    > span {
      color: var(--ix-text-color-title);
      font-weight: var(--ix-font-weight-xl);
    }
  }

  &-description {
    margin-left: 20px;
  }

  .ix-button-group:not(.visible) {
    visibility: hidden;
  }
}

.panel-default,
.panel-custom {
  padding: 0 12px 12px;
  width: 616px;
}

.panel-custom-count {
  color: var(--ix-text-color-info);
  font-weight: var(--ix-font-weight-md);
}

.ix-header-xs {
  height: 32px;
}
</style>
