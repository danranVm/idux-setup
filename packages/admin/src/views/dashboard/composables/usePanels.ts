import { onMounted, shallowRef, type ShallowRef } from 'vue'

import { uniqueId } from 'lodash-es'

import type { DashboardPanel } from '../types'

let defaultPanels: DashboardPanel[] = [
  {
    key: '1',
    type: 'default',
    title: '运营全景',
    description: '这里是简介，这里是简介，这里是简介',
    isShow: true,
    order: 1,
  },
  {
    key: '2',
    type: 'default',
    title: '主机安全',
    description: '这里是简介，这里是简介，这里是简介',
    isShow: false,
    order: 2,
  },
  {
    key: '10',
    type: 'custom',
    title: '自定义面板',
    isShow: true,
    order: 3,
  },
]

export function usePanels(): {
  panels: ShallowRef<DashboardPanel[]>
  loading: ShallowRef<boolean>
  savePanel: (panel: DashboardPanel) => string
  deletePanel: (key: string) => void
} {
  const panels = shallowRef<DashboardPanel[]>([])
  const loading = shallowRef(false)

  // 初始化数据。
  const loadPanels = () => {
    loading.value = true
    setTimeout(() => {
      panels.value = [...defaultPanels]
      loading.value = false
    }, 300)
  }

  // 保存数据。
  const savePanel = (panel: DashboardPanel) => {
    let currKey = panel.key
    // 没有 key 代表新增
    if (!currKey) {
      // 新增接口, 默认后端生成新的key
      currKey = uniqueId()
      while (defaultPanels.find(item => item.key === currKey)) {
        currKey = uniqueId()
      }
      defaultPanels.push({
        key: currKey,
        title: panel.title,
        type: 'custom',
        isShow: true,
        order: defaultPanels.length,
      })
    } else {
      // 编辑接口
      defaultPanels = defaultPanels.map(item => {
        if (item.key === panel.key) {
          return { ...item, ...panel }
        }
        return item
      })
    }

    loadPanels()

    return currKey
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
    savePanel,
    deletePanel,
  }
}
