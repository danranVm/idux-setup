<script lang="ts" setup>
import { type PropType, watch } from 'vue'

import { CdkPortal } from '@idux/cdk/portal'
import { BlockScrollStrategy } from '@idux/cdk/scroll'
import { type MaybeArray, useControlledProp } from '@idux/cdk/utils'

const emit = defineEmits<{
  (e: 'finish'): void
}>()
const props = defineProps({
  visible: {
    type: Boolean,
    default: undefined,
  },

  'onUpdate:visible': [Function, Array] as PropType<MaybeArray<(visible: boolean) => void>>,
})

const [modalVisible, setModalVisible] = useControlledProp(props, 'visible')

const blockScrollStrategy = new BlockScrollStrategy()

watch(modalVisible, visible => {
  if (visible) {
    blockScrollStrategy.enable()
  } else {
    blockScrollStrategy.disable()
  }
})

const handleClose = () => {
  setModalVisible(false)
}
const handleFinish = () => {
  emit('finish')
}
</script>

<template>
  <CdkPortal target="body">
    <div class="idux-setup-modal-guide__mask" v-if="modalVisible"></div>
    <div class="idux-setup-modal-guide__wrapper" v-if="modalVisible">
      <IxCarousel class="idux-setup-modal-guide__carousel" showArrow>
        <div class="idux-setup-modal-guide__item">
          <h1 class="idux-setup-modal-guide__item__title"> 交互的Demo演示平台“最佳实践” </h1>
          <p class="idux-setup-modal-guide__item__description">
            在“最佳实践”中可以切身体验UI组件的使用方法，页面模板的布局效果，甚至统一化业务模块的交互体验。
          </p>
          <div class="idux-setup-modal-guide__item__img">
            <img src="./assets/1.png" />
          </div>
        </div>
        <div class="idux-setup-modal-guide__item">
          <h1 class="idux-setup-modal-guide__item__title"> 更自由灵活的看板-自定义Dashboard </h1>
          <p class="idux-setup-modal-guide__item__description">
            用户可以根据所需创建新的监控大盘，并添加监控图表，查看自定义监控数据。自定义Dashboard适用于不同用户针对性关注的内容不同的场景。
          </p>
          <div class="idux-setup-modal-guide__item__img">
            <img src="./assets/2.png" />
          </div>
        </div>
        <div class="idux-setup-modal-guide__item">
          <h1 class="idux-setup-modal-guide__item__title">新版左侧导航栏</h1>
          <p class="idux-setup-modal-guide__item__description">
            新版的左侧导航栏，升级成了全新的视觉风格，并增设了功能全览、快捷入口、多标签切换、导航配置等多项辅助功能，如下图所示为功能全览。
          </p>
          <div class="idux-setup-modal-guide__item__img">
            <img src="./assets/3.png" />
          </div>
        </div>
        <div class="idux-setup-modal-guide__item idux-setup-modal-guide__entry-page">
          <div class="idux-setup-modal-guide__entry-page__left">
            <div class="idux-setup-modal-guide__entry-page__logo"></div>
          </div>
          <div class="idux-setup-modal-guide__entry-page__right">
            <h1 class="idux-setup-modal-guide__entry-page__title">
              进入“最佳实践”
            </h1>
            <p class="idux-setup-modal-guide__entry-page__description">
              接下来请进入最佳实践，切身体验这些功能，若您对使用方法仍有疑惑，也可从右下角的浮层按钮触发引导。
            </p>
            <IxButton class="idux-setup-modal-guide__entry-page__btn" size="lg" mode="primary" @click="handleFinish">
              开始体验
            </IxButton>
          </div>
        </div>
        <template #arrow="{ type }">
          <div class="idux-setup-modal-guide__carousel__arrow">
            <IxIcon :name="type === 'next' ? 'right' : 'left'" />
          </div>
        </template>
      </IxCarousel>
      <div class="idux-setup-modal-guide__close" @click="handleClose">
        <IxIcon name="close" />
      </div>
    </div>
  </CdkPortal>
</template>
