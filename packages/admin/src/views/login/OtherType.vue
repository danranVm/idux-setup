<script lang="ts" setup>
import { type PropType, computed, shallowRef } from 'vue'

interface Data {
  icon: string
  title: string
  onClick: () => void
}

defineProps({
  dataSource: { type: Array as PropType<Data[]> },
})

const navWidth = 62

const navWrapperRef = shallowRef<HTMLElement>()
const navListRef = shallowRef<HTMLElement>()

const navOffset = shallowRef(0)

const navListStyle = computed(() => {
  return `transform: translateX(-${navOffset.value}px)`
})

const navPreShow = computed(() => {
  return navOffset.value > 0
})

const navNextShow = computed(() => {
  return (
    (navListRef.value?.offsetWidth ?? 0) - navOffset.value > navWrapperRef.value?.offsetWidth ?? 0
  )
})

const navPreClick = () => {
  const offset = navOffset.value - navWidth
  navOffset.value = offset < 0 ? 0 : offset
}

const navNextClick = () => {
  navOffset.value = navOffset.value + navWidth
}
</script>
<template>
  <div class="other-login-wrapper">
    <IxDivider label="其他登录方式" plain />
    <IxIcon
      class="other-login-nav-pre"
      name="left"
      v-show="navPreShow"
      @click="navPreClick"
    ></IxIcon>
    <IxIcon
      class="other-login-nav-next"
      name="right"
      v-show="navNextShow"
      @click="navNextClick"
    ></IxIcon>
    <div class="other-login-nav-wrapper" ref="navWrapperRef">
      <div class="other-login-nav-list" :style="navListStyle" ref="navListRef">
        <div
          class="other-login-nav text-center"
          :style="{ width: navWidth + 'px' }"
          v-for="(item, index) in dataSource"
          :key="index"
        >
          <IxTooltip :title="item.title" placement="top">
            <IxButton :icon="item.icon" shape="circle" @click="item.onClick"> </IxButton>
          </IxTooltip>
        </div>
      </div>
    </div>
  </div>
</template>
