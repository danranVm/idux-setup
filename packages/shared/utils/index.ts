// eslint-disable-next-line vue/prefer-import-from-vue
import { toRawType } from '@vue/shared'
import { type ComponentPublicInstance, unref, type Ref } from 'vue-demi'

export const isHTMLElement = (val: unknown): val is HTMLElement => toRawType(val).startsWith('HTML')

export type MaybeRef<T> = T | Ref<T>
export type MaybeElement = ComponentPublicInstance | HTMLElement | null | undefined
export type MaybeElementRef<T extends MaybeElement = MaybeElement> = MaybeRef<T>

export function convertElement<T extends MaybeElement>(
  elementOrInstance: MaybeElementRef<T>,
): T extends ComponentPublicInstance
  ? Exclude<MaybeElement, ComponentPublicInstance>
  : T | undefined {
  const element = unref(elementOrInstance)
  return isHTMLElement(element) ? element : element?.$el ?? element
}

export function callEmit<T extends (...args: any[]) => any>(
  funcs: T[] | T | undefined,
  ...args: Parameters<T>
): ReturnType<T> | void {
  if (!funcs) {
    return
  }
  if (Array.isArray(funcs)) {
    funcs.forEach(fn => fn(...args))
  } else {
    return funcs(...args)
  }
}
