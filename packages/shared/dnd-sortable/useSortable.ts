import { onMounted, onUpdated } from 'vue-demi'

import { setContext } from './utils'
import { convertElement, type MaybeRef } from '../utils'

export function useSortable(
  elementRef: MaybeRef<HTMLElement | undefined>,
  getContext: () => { data: any; index: number },
): void {
  const updateElement = () => {
    const element = convertElement(elementRef)
    if (!element) {
      return
    }
    element.setAttribute('data-draggable', '')
    setContext(convertElement(elementRef), getContext())
  }

  onMounted(() => updateElement())
  onUpdated(() => updateElement())
}
