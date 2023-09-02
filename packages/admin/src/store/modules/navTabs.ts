import { computed, shallowRef, ref } from 'vue'

import { defineStore } from 'pinia'

export const useNavTabsStore = defineStore(
  'navigationTabs',
  () => {
    const navTabsRecordIds = shallowRef<string[]>([])
    const pinedNavTabsRecordIds = ref<string[]>([])

    const pinedNavTabsRecordIdSet = computed(() => new Set(pinedNavTabsRecordIds.value))

    const setNavTabsRecordIds = (ids: string[]) => {
      navTabsRecordIds.value = ids
    }
    const setPinedNavTabsRecordIds = (ids: string[]) => {
      pinedNavTabsRecordIds.value = ids
    }
    const setNavTabPined = (id: string, pined: boolean) => {
      const tempSet = new Set(pinedNavTabsRecordIdSet.value)

      if (pined) {
        tempSet.add(id)
      } else {
        tempSet.delete(id)
      }

      setPinedNavTabsRecordIds(Array.from(tempSet))
    }

    return {
      navTabsRecordIds,
      pinedNavTabsRecordIds,
      pinedNavTabsRecordIdSet,

      setNavTabsRecordIds,
      setPinedNavTabsRecordIds,
      setNavTabPined,
    }
  },
  {
    persist: {
      enabled: true,
      strategies: [
        {
          storage: localStorage,
          paths: ['navTabsRecordIds', 'pinedNavTabsRecordIds', 'navTabOrders'],
        },
      ],
    },
  },
)
