import { ref, watchEffect } from 'vue-demi'

import { useMouseInElement, templateRef, useElementBounding } from '@vueuse/core'

import type { MousePopoverInnerProps } from '../types'

export const useOffset = (props: MousePopoverInnerProps) => {
  const mouseTarget = templateRef<HTMLElement | null>('mouseTarget', null)
  const { width, height } = useElementBounding(mouseTarget)
  const mouseData = useMouseInElement(mouseTarget)
  const { elementX, elementY, isOutside } = mouseData
  const offset = ref<[number, number]>([0, 0])

  watchEffect(() => {
    if (!isOutside.value) {
      const { placement } = props
      const _elementX = elementX.value
      const _elementY = elementY.value
      const _width = width.value
      const _height = height.value

      let newOffset = offset.value

      if (placement) {
        if (placement.startsWith('top')) {
          newOffset = [_elementX - _width / 2, -_elementY]
        } else if (placement.startsWith('bottom')) {
          newOffset = [_elementX - _width / 2, _elementY - _height]
        } else if (placement.startsWith('left')) {
          newOffset = [_elementY - _height / 2, -_elementX]
        } else if (placement.startsWith('right')) {
          newOffset = [_elementY - _height / 2, _elementX - _width]
        }
      } else {
        newOffset = [_elementX, _elementY - _height]
      }

      offset.value = newOffset
    }
  })

  return {
    offset,
    mouseData,
  }
}
