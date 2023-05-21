<script setup lang="ts">
import { shallowRef, watch, ref } from 'vue'

import { useFormControl, Validators } from '@idux/cdk'
import type { PopoverInstance } from '@idux/components'
import { uniqueId } from 'lodash-es'

import type { DashboardPanel } from '../types'
import { panelSortFn } from '../utils'

const props = defineProps<{
  loading: boolean
  offset: number
  panels: DashboardPanel[]
}>()
const emits = defineEmits<{
  (e: 'edit', panel: { key?: string; title: string }): void
  (e: 'delete', key: string): void
}>()

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
  },
  { immediate: true },
)

watch(
  () => props.offset,
  () => popoverRef.value?.updatePopper(),
)

const editingKey = ref<string>('')
const editingControl = useFormControl('', [Validators.required, Validators.maxLength(24)])

// 生成临时 key 的前缀，保证唯一性，可以用于区分是编辑还是新增
const addKeyPrefix = '__Dashboard_panel'
const onAdd = () => {
  // 生成一个随机的临时 key
  const newKey = uniqueId(addKeyPrefix)
  customPanels.value = [...customPanels.value, { key: newKey, title: '' }]
  editingKey.value = newKey
  editingControl.reset()
}

const onEdit = (panel: DashboardPanel) => {
  editingKey.value = panel.key
  editingControl.setValue(panel.title)
}

const onEditEnd = () => {
  if (!editingControl.valid.value) {
    editingControl.markAsDirty()
    return
  }

  const currKey = editingKey.value
  emits('edit', {
    key: currKey.startsWith(addKeyPrefix) ? undefined : currKey,
    title: editingControl.getValue(),
  })

  editingKey.value = ''
  editingControl.reset()
}

const onDelete = (key: string) => {
  emits('delete', key)
}
</script>

<template>
  <IxPopover
    ref="popoverRef"
    closable
    :header="{ size: 'md', title: '管理看板' }"
    placement="bottomStart"
    trigger="click"
  >
    <span class="panel-trigger" :style="{ left: `${offset}px` }">
      <IxIcon name="setting"></IxIcon>
    </span>
    <template #content>
      <IxSpin :spinning="loading">
        <div class="panel-default">
          <IxHeader size="xs" :title="'默认看板'"></IxHeader>
          <IxRow :gutter="12">
            <IxCol v-for="panel of defaultPanels" :key="panel.key" :span="12">
              <div class="panel-item">
                <div class="panel-item-title">
                  <IxCheckbox :key="panel.key" :checked="panel.isShow">
                    {{ panel.title }}
                  </IxCheckbox>
                  <IxButtonGroup mode="link" :gap="16">
                    <IxButton>创建副本</IxButton>
                    <IxButton>预览</IxButton>
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
              <span>({{ customPanels.length + 1 }}/5)</span>
            </span>
          </IxHeader>
          <IxRow :gutter="12">
            <IxCol v-for="panel of customPanels" :key="panel.key" :span="12">
              <div class="panel-item">
                <div class="panel-item-title" v-if="panel.key !== editingKey">
                  <span>{{ panel.title }}</span>
                  <IxButtonGroup mode="link" :gap="16">
                    <IxButton @click="onEdit">编辑</IxButton>
                    <IxPopconfirm
                      :title="`确定要删除 【${panel.title}】 吗?`"
                      content="删除后, 将无法恢复"
                      trigger="click"
                      :overlayContainer="element => element?.parentElement"
                      @ok="onDelete(panel.key)"
                    >
                      <IxButton>删除</IxButton>
                    </IxPopconfirm>
                  </IxButtonGroup>
                </div>
                <IxFormItem v-else messageTooltip>
                  <IxInput
                    autofocus
                    :control="editingControl"
                    @blur="onEditEnd"
                    @keyup.enter="onEditEnd"
                  >
                  </IxInput>
                </IxFormItem>
              </div>
            </IxCol>
            <IxCol :span="12">
              <div class="panel-item">
                <IxButton
                  :disabled="customPanels.length >= 5"
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
      </IxSpin>
    </template>
  </IxPopover>
</template>

<style scoped lang="less">
.panel-trigger {
  position: absolute;
  top: 12px;
  padding: 4px;
  cursor: pointer;
  z-index: 1;

  &:hover {
    color: var(--ix-color-primary);
    background-color: var(--ix-background-color-light);
  }
}

.panel-item {
  padding: 12px;
  border: 1px solid var(--ix-border-color);

  &:hover {
    border-color: var(--ix-color-primary);
    .ix-button-group {
      visibility: visible;
    }
  }

  &-title {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  &-description {
    margin-left: 20px;
  }

  .ix-button-group {
    visibility: hidden;
  }
}

.panel-default,
.panel-custom {
  padding: 0 12px;
  width: 616px;
}

.ix-header-xs {
  height: 32px;
}
</style>
