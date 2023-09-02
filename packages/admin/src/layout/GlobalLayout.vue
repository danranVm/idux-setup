<script setup lang="ts">
import { computed, inject, provide, ref } from 'vue'
import { useRouter } from 'vue-router'
import type { NavRecord } from '@/types'

import { IxLayoutSiderTrigger, type MenuClickOptions, type MenuData, type MenuCustomAdditional } from '@idux/components'
import { IxProLayout } from '@idux/pro'
import { storeToRefs } from 'pinia'

import NavItem from './components/NavItem.vue'
import { useNavMenuData, fakeIdSuffix } from './composables/useNavMenuData'
import { useNavShortcuts } from './composables/useNavShortcuts'
import { useNavTabs } from './composables/useNavTabs'
import { useOverviewData } from './composables/useOverviewData'
import { useOverviewVisible } from './composables/useOverviewVisible'
import { useRecentRecords } from './composables/useRecentRecords'
import Main from './contents/Main.vue'
import { layoutContextToken } from './context'
import { LayoutFooter } from './layoutFooter'
import { NavTabs } from './navTabs'
import { Overview, OverviewTrigger } from './overview'
import { Recents } from './recents'
import { Shortcuts } from './shortcuts'
import { appContextToken } from '../context'

import { useAppSettingStore, useNavSettingStore } from '@/store/modules'

const { activeNavRecords, getNavRecordById } = inject(appContextToken)!

const router = useRouter()
const activeKey = computed(() => activeNavRecords.value[0]?.id)

// const { start, finish } = useLoadingBar()

const overviewDataContext = useOverviewData()
const overviewVisibleContext = useOverviewVisible()
const shortcutsContext = useNavShortcuts()
const navTabsContext = useNavTabs()
const recentRecords = useRecentRecords()

const navMenuData = useNavMenuData()

provide(layoutContextToken, {
  recentRecords,
  ...shortcutsContext,
  ...navTabsContext,
  ...overviewDataContext,
  ...overviewVisibleContext,
})

const { shortcutRecords } = shortcutsContext
const { overviewVisible, setOverviewVisible } = overviewVisibleContext

// router.beforeEach(() => {
//   start()
// })

// router.afterEach(() => {
//   finish()
// })

const logo = {
  image: `${import.meta.env.BASE_URL}logo.svg`,
  title: '',
  link: import.meta.env.BASE_URL,
}

const appSetting$ = useAppSettingStore()
const { layoutTheme, layoutType, layoutCollapsed } = storeToRefs(appSetting$)
const { setLayoutCollapsed } = appSetting$
const { navOverviewEnabled, navShortcutEnabled, navTabsEnabled } = storeToRefs(useNavSettingStore())

const logoSrc = computed(() => {
  return layoutCollapsed.value
    ? `${import.meta.env.BASE_URL}logo.svg`
    : `${import.meta.env.BASE_URL}logo-text.svg`
})
const layoutClasses = computed(() => {
  const layoutCls = 'global-layout'

  return [
    layoutCls,
    'overflow-x-auto',
    'min-w-page',
    overviewVisible.value ? `${layoutCls}--overview-visible` : undefined,
    layoutCollapsed.value ? `${layoutCls}--collapsed` : undefined,
  ]
})

const shortcutsExpanded = ref<boolean>(true)
const siderContentScrollTop = ref<number>(0)
const siderContentScrollBottom = ref<number>(0)

const shortcutsVisible = computed(
  () =>
    navShortcutEnabled.value &&
    !layoutCollapsed.value &&
    (shortcutRecords.value.length || overviewVisible.value),
)
const dividerClasses = computed(() => {
  const dividerCls = 'global-layout__divider'

  return {
    [dividerCls]: true,
    [`${dividerCls}--hidden`]: shortcutsVisible.value && shortcutsExpanded.value,
  }
})
const siderContentClasses = computed(() => {
  const siderContentCls = 'global-layout__sider-content'

  return {
    [siderContentCls]: true,
    [`${siderContentCls}--overflow-top`]: siderContentScrollTop.value > 1,
    [`${siderContentCls}--overflow-bottom`]: siderContentScrollBottom.value > 1,
  }
})

const siderCustomAdditional: MenuCustomAdditional = ({ data }) => {
  const _opts = data as MenuData & NavRecord
  if (_opts.menuItemCls) {
    return {
      class: _opts.menuItemCls,
    }
  }
}

const handleSiderContentScroll = (evt: Event) => {
  const { scrollTop, scrollHeight, offsetHeight } = evt.target as HTMLElement

  siderContentScrollTop.value = scrollTop
  siderContentScrollBottom.value = scrollHeight - scrollTop - offsetHeight
}
const onMenuClick = ({ key, type }: MenuClickOptions) => {
  const id = (key as string).replace(fakeIdSuffix, '')
  const record = getNavRecordById(id)
  if (
    (layoutCollapsed.value && (type === 'item' || type === 'sub')) ||
    (!layoutCollapsed.value && type === 'item')
  ) {
    router.push(record!.path as string)
  }
}
</script>

<template>
  <IxProLayout
    :class="layoutClasses"
    :activeKey="activeKey"
    :logo="logo"
    :menus="navMenuData"
    :theme="layoutTheme"
    :type="layoutType"
    :collapsed="layoutCollapsed"
    :siderMenu="{ customAdditional: siderCustomAdditional }"
    @menuClick="onMenuClick"
    @update:collapsed="setLayoutCollapsed"
  >
    <template #logo>
      <div class="global-layout__logo">
        <div class="global-layout__logo__img">
          <img :src="logoSrc" />
        </div>
        <IxLayoutSiderTrigger
          v-if="!layoutCollapsed && !overviewVisible"
          class="global-layout__collapse-trigger"
          :icon="['right-double', 'left-double']"
        />
      </div>
    </template>
    <template v-if="layoutCollapsed && !overviewVisible" #siderHeader>
      <div class="global-layout__header">
        <IxLayoutSiderTrigger
          class="global-layout__collapse-trigger"
          :icon="['right-double', 'left-double']"
        />
      </div>
    </template>
    <template #siderContent="menuProps">
      <div :class="siderContentClasses">
        <div class="global-layout__sider-content__inner" @scroll="handleSiderContentScroll">
          <OverviewTrigger
            v-if="navOverviewEnabled"
            :collapsed="layoutCollapsed"
            :overviewVisible="overviewVisible"
            @update:overviewVisible="setOverviewVisible"
          />
          <Shortcuts
            v-if="shortcutsVisible"
            v-model:expanded="shortcutsExpanded"
            :mode="overviewVisible ? 'flattened' : 'embeded'"
          />
          <div v-if="navOverviewEnabled || shortcutsVisible" :class="dividerClasses"></div>
          <Recents v-if="!layoutCollapsed && overviewVisible" />
          <IxMenu v-if="!overviewVisible" v-bind="menuProps">
            <template #itemLabel="item">
              <NavItem
                class="layout-menu-item-label"
                :record="item"
                :enableOperation="!layoutCollapsed || navTabsEnabled"
              />
            </template>
          </IxMenu>
        </div>
      </div>
    </template>
    <template #siderFooter>
      <LayoutFooter />
    </template>
    <div class="global-layout__content">
      <Transition name="ix-move-start" appear>
        <Overview
          class="global-layout__overview"
          v-if="navOverviewEnabled"
          v-show="overviewVisible"
        />
      </Transition>
      <NavTabs v-if="navTabsEnabled" />
      <Main />
    </div>
  </IxProLayout>
</template>
