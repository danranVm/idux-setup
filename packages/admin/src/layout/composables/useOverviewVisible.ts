import { watch } from 'vue'
import { useRouter } from 'vue-router'

import { useState } from '@idux/cdk/utils'
import { storeToRefs } from 'pinia'


import type { OverviewVisibleContext } from '../types'

import { useNavSettingStore, useAppSettingStore } from '@/store/modules'

export function useOverviewVisible(): OverviewVisibleContext {
  const [overviewVisible, _setOverviewVisible] = useState<boolean>(false)
  const { setLayoutCollapsed } = useAppSettingStore()
  const { navOverviewEnabled } = storeToRefs(useNavSettingStore())

  const setOverviewVisible = (visible: boolean) => {
    _setOverviewVisible(visible)

    if (visible) {
      setLayoutCollapsed(false)
    }
  }

  const router = useRouter()

  router.afterEach(() => {
    setOverviewVisible(false)
  })
  watch(navOverviewEnabled, enabled => {
    if (!enabled) {
      setOverviewVisible(false)
    }
  })

  return {
    overviewVisible,
    setOverviewVisible,
  }
}
