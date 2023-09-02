<script lang="ts" setup>
import { ref, computed, watch } from 'vue'

import { IxIcon } from '@idux/components/icon'
import { useVModel } from '@vueuse/core'

import { createImg, drawGap, getRandomNumberByRange } from './utils.ts'

enum TipStatus {
  default, // 默认无状态
  succeed, // 成功状态
  failing, // 失败状态
}
const accuracy = 5 // 精确度5px
const gapCanvasSize = {
  w: 360,
  h: 210,
}
// 缺口由一个正方形，加三个圆弧组成，l为正方形的边长
const draggbleCanvasSize = {
  l: 42,
  r: 10,
}
// 静态图片，demo作用
const staticImgs = [new URL('./assets/slideVerify.png', import.meta.url).href]
const props = defineProps({
  visible: {
    type: Boolean,
  },
  onSuccess: {
    type: Function,
  },
  onFail: {
    type: Function,
  },
})
const emit = defineEmits(['update:visible'])
const visibleVMoel = useVModel(props, 'visible', emit)

const gapCanvasRef = ref<HTMLCanvasElement>()
const draggableCanvasRef = ref<HTMLCanvasElement>()

const offsetX = ref(0)
const gapX = ref(0) // 缺口偏移

const status = ref(TipStatus.default)
const tip = ref('')

const isInRange = (x: number) => {
  return x >= 0 && x <= gapCanvasSize.w - draggbleCanvasSize.l - draggbleCanvasSize.r * 2
}

const isMousedown = ref(false)

const mousedown = function () {
  isMousedown.value = true
  status.value = TipStatus.default
  tip.value = ''
}

const mousemove = function (e: MouseEvent) {
  if (isMousedown.value) {
    let x = offsetX.value
    x += e.movementX
    if (isInRange(x)) {
      offsetX.value = x
    } else {
      if (x < 0) {
        offsetX.value = 0
      }

      if (x > gapCanvasSize.w) {
        offsetX.value = gapCanvasSize.w
      }
    }
  }
}

const moveOver = function () {
  if (isMousedown.value) {
    isMousedown.value = false
    if (Math.abs(offsetX.value - gapX.value) <= accuracy) {
      tip.value = '成功'
      status.value = TipStatus.succeed
      props.onSuccess?.()
    } else {
      tip.value = '失败'
      status.value = TipStatus.failing
      props.onFail?.()
    }
  }
}

const tipClasses = computed(() => {
  return {
    'body-tip': true,
    succeed: status.value === TipStatus.succeed,
    failing: status.value === TipStatus.failing,
  }
})

const draw = () => {
  const imgDom = createImg(staticImgs, () => {
    if (gapCanvasRef.value && draggableCanvasRef.value) {
      const gapCanvasRefCtx = gapCanvasRef.value.getContext('2d')
      const draggbleCanvasRefCtx = draggableCanvasRef.value.getContext('2d')

      const L = draggbleCanvasSize.l + draggbleCanvasSize.r * 2
      const w = gapCanvasSize.w
      const h = gapCanvasSize.h
      const l = draggbleCanvasSize.l
      const r = draggbleCanvasSize.r

      gapCanvasRef.value.width = w
      gapCanvasRef.value.height = h
      draggableCanvasRef.value.width = w
      draggableCanvasRef.value.height = h

      gapX.value = getRandomNumberByRange(L + 10, w - (L + 10))
      const gapY = getRandomNumberByRange(10 + r * 2, h - (L + 10))

      // 将图片画在2个canvas上面，一个剪裁缺口，一个保留缺口
      drawGap(gapCanvasRefCtx, gapX.value, gapY, l, r, 'fill')
      drawGap(draggbleCanvasRefCtx, gapX.value, gapY, l, r, 'clip')

      gapCanvasRefCtx.drawImage(imgDom, 0, 0, w, h)
      draggbleCanvasRefCtx.drawImage(imgDom, 0, 0, w, h)

      // 将保留缺口的canvas只取缺口部分，重新绘制
      const y = gapY - r * 2
      const imgData = draggbleCanvasRefCtx.getImageData(gapX.value, y, L, L)
      draggableCanvasRef.value.width = L
      draggbleCanvasRefCtx.putImageData(imgData, 0, y)
    }
  })
}

const reset = function () {
  offsetX.value = 0
  status.value = TipStatus.default
  tip.value = ''
  draw()
}

watch(
  () => props.visible,
  val => {
    if (!val) return
    reset()
  },
  {
    immediate: true,
    flush: 'post',
  },
)
</script>

<template>
  <teleport to="body">
    <div
      class="slide-verify-wrapper"
      v-if="visible"
      @mousemove="mousemove"
      @mouseleave="moveOver"
      @mouseup="moveOver"
    >
      <div class="slide-verify">
        <div class="slide-verify-title">
          <span>开始验证</span>
          <IxIcon name="close" class="title-icon opr-icon" @click="visibleVMoel = false" />
        </div>
        <div class="slide-verify-body">
          <canvas ref="gapCanvasRef"></canvas>
          <canvas
            ref="draggableCanvasRef"
            class="draggable-canvas"
            :style="{ left: offsetX + 'px' }"
          ></canvas>
          <transition name="fade">
            <div :class="tipClasses">{{ tip }}</div>
          </transition>
        </div>
        <div class="slide-verify-slide">
          <div class="slide-bg"></div>
          <div class="slide-block" :style="{ left: offsetX + 'px' }" @mousedown="mousedown">
            <IxIcon name="right" class="arrows-icon" />
            <IxIcon name="right" class="arrows-icon arrows-icon-right" />
          </div>
        </div>
        <div class="slide-verify-opr">
          <IxIcon name="reload" class="refresh-icon opr-icon" @click="reset" />
        </div>
      </div>
    </div>
  </teleport>
</template>

<style lang="less">
@import './index.less';
</style>
