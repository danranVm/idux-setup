import { type ComputedRef, computed, inject } from 'vue'
import { useRouter } from 'vue-router'

import { storeToRefs } from 'pinia'

import { appContextToken } from '@/context'
import { useNavSettingStore } from '@/store/modules'
import type { NavRecord } from '@/types'

const maxRecordCnt = 5

export function useRecentRecords(): ComputedRef<NavRecord[]> {
  const { getNavRecordById, getNavRecordByPath } = inject(appContextToken)!

  const navSettingStore = useNavSettingStore()
  const { setRecentRecordIds } = navSettingStore
  const { recentRecordIds } = storeToRefs(navSettingStore)
  const recentRecords = computed(() =>
    recentRecordIds.value.map(id => getNavRecordById(id)).filter(Boolean),
  )

  const router = useRouter()

  router.afterEach(to => {
    const { path } = to

    if (path === '/' || path === '/dashboard') {
      return
    }

    const record = getNavRecordByPath(path)

    if (!record) {
      return
    }

    let newRecentRecordIds = [...recentRecordIds.value]
    const currentIdx = newRecentRecordIds.findIndex(id => id === record.id)

    if (currentIdx > -1) {
      newRecentRecordIds.splice(currentIdx, 1)
    }

    newRecentRecordIds.push(record.id)

    if (newRecentRecordIds.length > maxRecordCnt) {
      newRecentRecordIds = newRecentRecordIds.slice(newRecentRecordIds.length - maxRecordCnt)
    }

    setRecentRecordIds(newRecentRecordIds)
  })

  return recentRecords
}
