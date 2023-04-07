<script setup lang="ts">
import { computed, h, onMounted, ref, shallowRef } from 'vue'
import { RouteRecordRaw, RouterLink, useRoute, useRouter } from 'vue-router'

import {
  IxIcon,
  IxLayoutSiderTrigger,
  MenuClickOptions,
  useLoadingBar,
  type MenuData,
} from '@idux/components'
import { IxProLayout } from '@idux/pro'
import { cloneDeep } from 'lodash-es'
import { storeToRefs } from 'pinia'


import Extra from './contents/Extra.vue'
import LayoutSettingDrawer from './contents/LayoutSettingDrawer.vue'
import Main from './contents/Main.vue'

import routes from '@/router/routes/dashboard'
import { useAppSettingStore } from '@/store/stores/appSetting'
import { normalizePath } from '@/utils'


const route = useRoute()
const router = useRouter()

const { start, finish } = useLoadingBar()

router.beforeEach(() => {
  start()
})

router.afterEach(() => {
  finish()
})

const activeKey = computed(() => route.path)
const logo = {
  image: `${import.meta.env.BASE_URL}logo.svg`,
  title: import.meta.env.VITE_APP_TITLE,
  link: import.meta.env.BASE_URL,
}
const menus = ref<MenuData[]>([])
const visible = shallowRef(false)

const appSetting$ = useAppSettingStore()
const { layoutTheme, layoutType, layoutCollapsed, layoutExtraInHeader } = storeToRefs(appSetting$)
const { setLayoutCollapsed } = appSetting$

const dynamicSlotName = computed(() => (layoutExtraInHeader.value ? 'headerExtra' : 'siderFooter'))

onMounted(() => {
  menus.value = walkMenus(routes, '/')
})

/**
 * traverse
 */
function walkMenus(routes: RouteRecordRaw | RouteRecordRaw[], parentPath: string) {
  let data: RouteRecordRaw[] = []
  const dataSource: MenuData[] = []

  if (!Array.isArray(routes)) {
    data = [routes]
  } else {
    data = routes
  }
  data.forEach(item => {
    const copy = cloneDeep(item)
    let { path, children, meta: { title = '', icon = undefined, hidden, flattened } = {} } = copy

    if (hidden) return

    if (flattened && children) {
      title = children[0].meta?.title ?? ''
      icon = children[0].meta?.icon
      path = children[0].path
      children = undefined
    }

    const _path = normalizePath(parentPath + '/' + path)

    if (children) {
      dataSource.push({
        type: 'sub',
        label: title,
        key: _path,
        icon,
        customIcon: () => {
          // 顶部导航不展示图标
          return ['header', 'both'].includes(layoutType.value) && parentPath === '/'
            ? null
            : h(IxIcon, { name: icon })
        },
        customSuffix: ({ expanded }) => {
          return layoutType.value !== 'both'
            ? h(IxIcon, { name: 'right', rotate: expanded ? -90 : 90 })
            : null
        },
        children: walkMenus(children, _path),
      })
    } else {
      dataSource.push({
        type: 'item',
        label: title,
        key: _path,
        icon,
        customIcon: () => {
          return ['header', 'both'].includes(layoutType.value) && parentPath === '/'
            ? null
            : h(IxIcon, { name: icon })
        },
      })
    }

    // 导航在顶部时不展示图标
  })
  return dataSource
}

const onMenuClick = ({ type, key }: MenuClickOptions) => {
  if (layoutCollapsed && type === 'item') {
    router.push(key as string)
  }
}
</script>

<template>
  <IxProLayout
    class="global-layout overflow-x-auto min-w-page"
    :activeKey="activeKey"
    :logo="logo"
    :menus="menus"
    :theme="layoutTheme"
    :type="layoutType"
    :collapsed="layoutCollapsed"
    @menuClick="onMenuClick"
    @update:collapsed="setLayoutCollapsed"
  >
    <template #itemLabel="item">
      <router-link :to="item.key">{{ item.label }}</router-link>
    </template>
    <template #[dynamicSlotName]>
      <Extra @settingLayout="visible = true" />
      <IxLayoutSiderTrigger v-if="!layoutExtraInHeader" />
    </template>
    <template #siderFooter v-if="layoutExtraInHeader">
      <IxLayoutSiderTrigger />
    </template>
    <Main />
    <LayoutSettingDrawer v-model:visible="visible" />
  </IxProLayout>
</template>
<style lang="less">
@import url('./index.less');
</style>
