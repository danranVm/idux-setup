import { isVue2 } from 'vue-demi'

import { upperFirst } from 'lodash-es'

import { isHtmlAttr } from './typeof'

export function mergeOptions(attrs: Object, events: Object, listeners: Object = {}) {
  const mergedOptions = Object.keys(attrs)
    .filter(key => !isHtmlAttr(key))
    .reduce((res, key) => {
      //@ts-ignore
      res[key] = attrs[key]
      return res
    }, {})

  //@ts-ignore
  mergedOptions.draggable = `[data-draggable]${attrs.draggable || ''}`

  if (isVue2) {
    Object.keys(listeners).reduce((res, key) => {
      //@ts-ignore
      res[`on${upperFirst(key)}`] = listeners[key]
      return res
    }, mergedOptions)
  }

  Object.keys(events).forEach(key => {
    const innerHandle = events[key]
    const customHandle = mergedOptions[key]
    if (!customHandle) {
      mergedOptions[key] = innerHandle
    } else {
      mergedOptions[key] = (...args: unknown[]) => {
        innerHandle(...args)
        customHandle(...args)
      }
    }
  })

  return mergedOptions
}
