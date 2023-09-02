// eslint-disable-next-line vue/prefer-import-from-vue
import { isHTMLTag } from '@vue/shared'
import { type Component, resolveComponent as _resolveComponent, TransitionGroup } from 'vue-demi'

import { isString } from 'lodash-es'

import { isTransition } from './typeof'

export function resolveComponent(tag: string | Component): {
  isHTMLTag: boolean
  tag: string | Component
} {
  if (!isString(tag)) {
    return { isHTMLTag: false, tag }
  }
  if (isHTMLTag(tag)) {
    return { isHTMLTag: true, tag }
  }

  return { isHTMLTag: false, tag: isTransition(tag) ? TransitionGroup : _resolveComponent(tag) }
}
