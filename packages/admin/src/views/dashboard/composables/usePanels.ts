import { ref, shallowRef } from 'vue'

import { Validators, useFormControl } from '@idux/cdk'

import type { DashboardPanel } from '../types'

import { useI18n } from '@/plugins/i18n'

export function usePanels() {
  const { $i } = useI18n()

  // 初始化数据。
  const initPanels = (): DashboardPanel[] => {
    const local = localStorage.getItem('dashboard')
    return local ? JSON.parse(local) : [{ key: 'default', title: $i('自定义面板') }]
  }

  // 保存数据。
  const savePanels = (newPanels: DashboardPanel[]) => {
    panels.value = newPanels
    localStorage.setItem('dashboard', JSON.stringify(newPanels))
  }

  const panels = shallowRef(initPanels())

  const selectedKey = ref<string>()
  const editingKey = ref<string>()
  const editingControl = useFormControl('', [Validators.required])

  const handleAdd = () => {
    const newKey = 'panel' + Math.random()
    panels.value = [...panels.value, { key: newKey, title: '' }]
    selectedKey.value = newKey
    editingKey.value = newKey
    editingControl.reset()
  }

  const handleEdit = (panel: DashboardPanel) => {
    editingKey.value = panel.key
    editingControl.setValue(panel.title)
  }

  const handleEditEnd = () => {
    if (!editingControl.valid.value) {
      editingControl.markAsDirty()
      return
    }

    const currPanel = panels.value.find(panel => panel.key === editingKey.value)
    if (currPanel) {
      currPanel.title = editingControl.getValue()
    }

    savePanels([...panels.value])

    editingKey.value = undefined
    editingControl.reset()
  }

  const handleDelete = (keu: string) => {
    panels.value = panels.value.filter(panel => panel.key !== keu)
    // 删除后跳转到第一个 panel, 理论上跳转到后一个或者前一个更好，看交互需求。
    selectedKey.value = panels.value[0].key
  }

  return {
    panels,
    selectedKey,
    editingKey,
    editingControl,
    handleAdd,
    handleEdit,
    handleEditEnd,
    handleDelete,
  }
}
