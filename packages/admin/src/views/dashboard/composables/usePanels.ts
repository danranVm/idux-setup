import { onMounted, shallowRef } from 'vue'

import { isNil, uniqueId } from 'lodash-es'

import type { DashboardPanel } from '../types'

let defaultPanels: DashboardPanel[] = [
  {
    key: '1',
    title: '运营全景',
    description: '这里是简介，这里是简介，这里是简介',
    type: 'default',
    isShow: true,
    order: 1,
  },
  {
    key: '2',
    title: '主机安全',
    description: '这里是简介，这里是简介，这里是简介',
    type: 'default',
    isShow: false,
    order: 2,
  },

  {
    key: '10',
    title: '自定义面板',
    type: 'custom',
    isShow: false,
    order: 3,
  },
]

export function usePanels(): {
  panels: ShallowRef<DashboardPanel[]>
  loadPanels: () => DashboardPanel[]
  savePanel: (panel: DashboardPanel) => void
  deletePanel: (key: string) => void
} {
  const panels = shallowRef<DashboardPanel[]>([])
  const loading = shallowRef(false)

  // 初始化数据。
  const loadPanels = (): DashboardPanel[] => {
    loading.value = true
    setTimeout(() => {
      panels.value = [...defaultPanels]
      loading.value = false
    }, 300)
  }

  // 保存数据。
  const savePanel = (panel: DashboardPanel) => {
    // 没有 key 代表新增
    if (isNil(panel.key)) {
      // 新增接口, 默认后端生成新的key
      let newKey = uniqueId()
      while (defaultPanels.find(item => item.key === newKey)) {
        newKey = uniqueId()
      }
      defaultPanels.push({
        key: newKey,
        title: panel.title,
        type: 'custom',
        isShow: true,
        order: defaultPanels.length,
      })
    } else {
      // 编辑接口
      const currPanel = defaultPanels.find(item => item.key === panel.key)
      defaultPanels.push({ ...currPanel, ...panel })
    }

    loadPanels()
  }

  const deletePanel = (key: string) => {
    // 删除接口
    defaultPanels = defaultPanels.filter(panel => panel.key !== key)
    loadPanels()
  }

  onMounted(() => loadPanels())

  return {
    panels,
    loading,
    loadPanels,
    savePanel,
    deletePanel,
  }
}
