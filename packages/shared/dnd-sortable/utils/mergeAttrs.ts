import { isVue2 } from 'vue-demi'

import { isEvent, isHtmlAttr } from './typeof'

export function mergeAttrs(attrs: Object, componentProps: Object = {}, extraAttrs: Object = {}) {
  const mergedAttrs = Object.keys(attrs)
    .filter(key => isHtmlAttr(key))
    .reduce((res, key) => {
      // @ts-ignore
      res[key] = attrs[key]
      return res
    }, {})

  if (isVue2) {
    const props = {}
    const listeners = {}
    Object.keys(componentProps).forEach(key => {
      if (isEvent(key)) {
        // @ts-ignore
        listeners[key] = componentProps[key]
      } else {
        // @ts-ignore
        props[key] = componentProps[key]
      }
    })
    return {
      ...extraAttrs,
      props: props,
      attrs: mergedAttrs,
      on: listeners,
    }
  }
  return {
    ...extraAttrs,
    ...mergedAttrs,
    ...componentProps,
  }
}
