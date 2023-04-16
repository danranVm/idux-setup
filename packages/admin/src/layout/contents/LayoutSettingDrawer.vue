<script setup lang="ts">
import { computed, ref, watch } from 'vue'

import { isObject } from 'lodash-es'
import { storeToRefs } from 'pinia'

import LayoutSettingPanel from './LayoutSettingPanel.vue'

import { useAppSettingStore } from '@/store/modules/appSetting'

const { layoutTheme, setLayoutType, setLayoutTheme } = useAppSettingStore()

const { layoutType } = storeToRefs(useAppSettingStore())

const layoutBothTheme = ref<'dark' | 'light' | undefined>(undefined)
const layoutHeaderTheme = ref(isObject(layoutTheme) ? layoutTheme.header : layoutTheme)
const layoutSiderTheme = ref(isObject(layoutTheme) ? layoutTheme.sider : layoutTheme)

if (isObject(layoutTheme)) {
  if (layoutTheme.header === 'dark' && layoutTheme.sider === 'light') {
    layoutBothTheme.value = 'dark'
  } else if (layoutTheme.header === 'light' && layoutTheme.sider === 'dark') {
    layoutBothTheme.value = 'light'
  }
}

const layoutBothThemeDisabled = computed(() => layoutType.value !== 'both')
const layoutHeaderThemeDisabled = computed(() => layoutType.value !== 'header')
const layoutSiderThemeDisabled = computed(() => layoutType.value !== 'sider')

function setLayoutBothTheme(theme?: 'dark' | 'light') {
  if (theme === 'dark') {
    setLayoutTheme({
      header: 'dark',
      sider: 'light',
    })
  } else if (theme === 'light') {
    setLayoutTheme({
      header: 'light',
      sider: 'dark',
    })
  }
}
watch(layoutType, val => {
  setLayoutType(val)
  if (val === 'both') {
    setLayoutBothTheme(layoutBothTheme.value)
  } else {
    setLayoutTheme({
      header: layoutHeaderTheme.value,
      sider: layoutSiderTheme.value,
    })
  }
})

watch(layoutBothTheme, val => {
  if (val) {
    setLayoutBothTheme(val)
  }
})

watch(layoutHeaderTheme, val => {
  setLayoutTheme({
    header: val,
    sider: layoutSiderTheme.value,
  })
})

watch(layoutSiderTheme, val => {
  setLayoutTheme({
    header: layoutHeaderTheme.value,
    sider: val,
  })
})

const bothLayoutDataSource = [
  {
    title: '深色',
    key: 'dark',
    img: new URL('../assets/both-layout-dark.png', import.meta.url).href,
  },
  {
    title: '浅色',
    key: 'light',
    img: new URL('../assets/both-layout-light.png', import.meta.url).href,
  },
]
const headerLayoutDataSource = [
  {
    title: '深色',
    key: 'dark',
    img: new URL('../assets/header-layout-dark.png', import.meta.url).href,
  },
  {
    title: '浅色',
    key: 'light',
    img: new URL('../assets/header-layout-light.png', import.meta.url).href,
  },
]
const siderLayoutDataSource = [
  {
    title: '深色',
    key: 'dark',
    img: new URL('../assets/sider-layout-dark.png', import.meta.url).href,
  },
  {
    title: '浅色',
    key: 'light',
    img: new URL('../assets/sider-layout-light.png', import.meta.url).href,
  },
]

const extraLayoutDataSource = [
  {
    title: '工具栏在底部',
    key: 'sider-footer',
    img: new URL('../assets/sider-layout-extra-footer-dark.png', import.meta.url).href,
  },
  {
    title: '工具栏在顶部（暂不支持）',
    key: 'sider-header',
    disabled: true,
    img: new URL('../assets/sider-layout-extra-header-dark.png', import.meta.url).href,
  },
]
</script>
<template>
  <IxDrawer header="导航模式配置">
    <IxSpace vertical block>
      <IxRadioGroup class="ml-4" v-model:value="layoutType" vertical :wrap="false" :gap="18" block>
        <IxRadio value="both">
          <span>L型导航（组合导航，适合承载较多子级导航）</span>
        </IxRadio>
        <LayoutSettingPanel
          :dataSource="bothLayoutDataSource"
          :disabled="layoutBothThemeDisabled"
          v-model:value="layoutBothTheme"
        />
        <IxRadio value="header">
          <span>顶部导航（对页面空间占用少，适合承载较多一级导航内容）</span>
        </IxRadio>
        <LayoutSettingPanel
          :dataSource="headerLayoutDataSource"
          :disabled="layoutHeaderThemeDisabled"
          v-model:value="layoutHeaderTheme"
        />
        <IxRadio value="sider">
          <span>左侧导航（轻量便捷，适合导航数量较少的产品使用）</span>
        </IxRadio>
        <LayoutSettingPanel
          :dataSource="siderLayoutDataSource"
          :disabled="layoutSiderThemeDisabled"
          v-model:value="layoutSiderTheme"
        />
        <div class="w-340px ml-14">
          <IxDivider />
        </div>
        <LayoutSettingPanel
          :dataSource="extraLayoutDataSource"
          :disabled="layoutSiderThemeDisabled"
          value="sider-footer"
        />
      </IxRadioGroup>
      <!-- <IxRadioGroup v-model:value="layoutHeaderTheme" vertical>
                <IxRadio value="dark">
                    <span>头部深色</span>
                </IxRadio>
                <IxRadio value="light">
                    <span>头部浅色</span>
                </IxRadio>
            </IxRadioGroup>
            <IxRadioGroup v-model:value="layoutSiderTheme" vertical>
                <IxRadio value="dark">
                    <span>导航深色</span>
                </IxRadio>
                <IxRadio value="light">
                    <span>导航浅色</span>
                </IxRadio>
            </IxRadioGroup> -->
    </IxSpace>
  </IxDrawer>
</template>
