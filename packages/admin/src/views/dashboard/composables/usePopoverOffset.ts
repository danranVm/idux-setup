import { shallowRef, onMounted } from 'vue'

import { useResizeObserver } from '@idux/cdk'

export function usePopoverOffset(elementRef: ShallowRef<HTMLDivElement | undefined>) {
  const popoverOffset = shallowRef(0)

  onMounted(() => {
    useResizeObserver(elementRef.value?.querySelector('.ix-tabs-nav-list'), entry => {
      const { contentRect } = entry
      popoverOffset.value = contentRect.width + 16
    })
  })

  return popoverOffset
}
