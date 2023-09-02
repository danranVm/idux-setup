import { computed, unref } from 'vue'

import type { MaybeRef } from '@vueuse/core'

import { ModalTypeEnum } from '../configuration/enum'

export const useModalTitle = (modalType: MaybeRef<ModalTypeEnum>, lable?: string) => {
  return computed(() => {
    const modalTypeVal = unref(modalType)
    const title = lable ?? ''
    switch (modalTypeVal) {
      case ModalTypeEnum.add:
        return `新增${title}`
      case ModalTypeEnum.edit:
        return `编辑${title}`
      case ModalTypeEnum.detail:
        return `查看${title}`
      case ModalTypeEnum.copy:
        return `复制${title}`
      default:
        // eslint-disable-next-line @typescript-eslint/no-unused-vars, no-unused-vars, no-case-declarations
        const n: never = modalTypeVal
    }
    return title
  })
}
