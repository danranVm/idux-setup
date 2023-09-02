import type { VNodeChild } from 'vue-demi'

import { isHTMLElement } from '../../utils'

const contextFlag = '__dnd_sortable_context'

export const setContext = (
  element: VNodeChild | HTMLElement | undefined,
  context: { index: number; data: any },
) => {
  while (element && !isHTMLElement(element)) {
    // @ts-ignore
    element = element.el
  }
  if (element) {
    // @ts-ignore
    element[contextFlag] = context
  }
}

export const getContext = (
  element: VNodeChild | HTMLElement | undefined,
): { index: number; data: any } | undefined => {
  while (element && !isHTMLElement(element)) {
    // @ts-ignore
    element = element.el
  }
  if (element) {
    // @ts-ignore
    return element[contextFlag]
  }
}
