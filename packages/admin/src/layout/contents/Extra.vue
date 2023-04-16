<script setup lang="ts">
import { computed, shallowRef } from 'vue'
import { useRouter } from 'vue-router'

import { type MenuClickOptions, useMessage, type MenuData } from '@idux/components'
import { isObject } from 'lodash-es'
import { storeToRefs } from 'pinia'

import { useAppSettingStore } from '@/store/modules/appSetting'
import { useUserStore } from '@/store/modules/user'

const dropdownDataSource: MenuData[] = [
  { type: 'item', key: 'info', label: '个人中心' },
  { type: 'item', key: 'doc', label: '我的文档' },
  { type: 'divider' },
  { type: 'item', key: 'logout', label: '退出' },
]

const emit = defineEmits(['settingLayout'])

const router = useRouter()
const { success } = useMessage()
const userStore = useUserStore()
const appSettingStore = useAppSettingStore()
const { appTheme, layoutTheme, layoutCollapsed, layoutExtraInHeader } = storeToRefs(appSettingStore)
const { setLayoutCollapsed, setAppTheme } = appSettingStore

const dropdownVisible = shallowRef(false)

const mergedTheme = computed(() => {
  return isObject(layoutTheme.value)
    ? layoutExtraInHeader.value
      ? layoutTheme.value.header
      : layoutTheme.value.sider
    : layoutTheme.value
})
const isDark = computed(() => mergedTheme.value === 'dark')

const searchClasses = computed(() => {
  return {
    'global-search': true,
    dark: isDark.value,
  }
})

const itemClasses = computed(() => {
  return {
    'footer-item': !layoutExtraInHeader.value,
  }
})

const arrowIconName = computed(() =>
  layoutExtraInHeader.value ? (dropdownVisible.value ? 'up' : 'down') : 'right',
)

const overlayPlacement = computed(() => (layoutExtraInHeader.value ? 'bottom' : 'right'))

const userImageUrl = computed(() =>
  isDark.value
    ? new URL('../../assets/user-dark.svg', import.meta.url).href
    : new URL('../../assets/user-light.svg', import.meta.url).href,
)

const settingLayout = () => {
  emit('settingLayout')
}

const expandMenu = () => {
  if (layoutCollapsed.value) {
    setLayoutCollapsed(false)
  }
}

const onMenuClick = async (item: MenuClickOptions) => {
  if (item.key === 'logout') {
    router.push('/login')
    userStore.logout()
    success('退出成功')
  }
}

const switchTheme = () => {
  if (appTheme.value === 'light') {
    setAppTheme('dark')
    document.body.classList.add('light-to-dark')
    document.body.classList.remove('dark-to-light')
  } else {
    setAppTheme('light')
    document.body.classList.add('dark-to-light')
    document.body.classList.remove('light-to-dark')
  }
}

const title = computed(() => {
  return `实验性功能，点击切换为${appTheme.value === 'dark' ? '浅色' : '深色'}主题`
})
</script>
<template>
  <IxSpace :vertical="!layoutExtraInHeader" :size="8">
    <IxSpace
      :class="layoutExtraInHeader ? 'flex-row-reverse' : ''"
      :vertical="!layoutExtraInHeader"
      :block="!layoutExtraInHeader"
      :size="4"
    >
      <IxTooltip :title="title" :placement="overlayPlacement">
        <IxButton
          :class="itemClasses"
          size="md"
          :icon="appTheme === 'dark' ? 'custom:sun' : 'custom:moon'"
          mode="text"
          @click="switchTheme"
        >
          <span v-show="!layoutCollapsed && !layoutExtraInHeader">{{
            appTheme === 'dark' ? '浅色' : '深色'
          }}</span>
        </IxButton>
      </IxTooltip>
      <IxTooltip title="点击切换导航模式" :placement="overlayPlacement">
        <IxButton :class="itemClasses" size="md" icon="setting" mode="text" @click="settingLayout">
          <span v-show="!layoutCollapsed && !layoutExtraInHeader">导航</span>
        </IxButton>
      </IxTooltip>
      <IxButton :class="itemClasses" size="md" icon="question-circle" mode="text">
        <span v-show="!layoutCollapsed && !layoutExtraInHeader">帮助</span>
      </IxButton>
      <IxButton :class="itemClasses" size="md" icon="alert" mode="text">
        <span v-show="!layoutCollapsed && !layoutExtraInHeader">告警</span>
      </IxButton>
      <div :class="itemClasses" class="search-item">
        <IxInput
          v-show="layoutExtraInHeader || !layoutCollapsed"
          :class="searchClasses"
          suffix="search"
          size="sm"
          placeholder="请搜索"
        />
        <IxButton
          v-show="!layoutExtraInHeader && layoutCollapsed"
          icon="search"
          mode="text"
          @click="expandMenu"
        />
      </div>
    </IxSpace>
    <IxDropdown :placement="overlayPlacement" :offset="[-12, 4]" v-model:visible="dropdownVisible">
      <IxRow align="center" :class="itemClasses" class="user">
        <IxCol :class="!layoutCollapsed || layoutExtraInHeader ? 'mr-2' : ''">
          <img width="24" height="24" :src="userImageUrl" alt="user image" />
        </IxCol>
        <IxCol flex="auto">
          <span v-show="layoutExtraInHeader || !layoutCollapsed">Admin</span>
        </IxCol>
        <IxCol>
          <IxIcon
            v-show="layoutExtraInHeader || !layoutCollapsed"
            class="ml-2 arrow"
            :name="arrowIconName"
          >
          </IxIcon>
        </IxCol>
      </IxRow>
      <template #overlay>
        <IxMenu
          :dataSource="dropdownDataSource"
          :selectable="false"
          :theme="mergedTheme"
          @click="onMenuClick"
        >
        </IxMenu>
      </template>
    </IxDropdown>
  </IxSpace>
</template>
