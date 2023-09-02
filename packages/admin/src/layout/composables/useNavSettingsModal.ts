import { h } from 'vue'

import { useMessage } from '@idux/components/message'
import { type ModalRef, useModal } from '@idux/components/modal'

import { useNavDisplaySettingsState } from './useNavDisplaySettingsState'
import { useNavModeSettingsState } from './useNavModeSettingsState'
import { Settings } from '../settings'

export function useNavSettingsModal() {
  const {
    init: displayInit,
    confirm: displayConfirm,
    cancel: displayCancel,
  } = useNavDisplaySettingsState()
  const { init: modeInit, confirm: modeConfirm, cancel: modeCancel } = useNavModeSettingsState()
  const { open } = useModal()
  const { success } = useMessage()
  let modalRef: ModalRef | undefined

  const openNavSettingsModal = () => {
    if (modalRef) {
      return
    }

    displayInit()
    modeInit()

    modalRef = open({
      header: '导航配置',
      content: h(Settings),
      class: 'nav-settings__modal',
      width: 480,
      destroyOnHide: true,
      onClose: () => {
        modalRef = undefined
      },
      onOk: () => {
        displayConfirm()
        modeConfirm()
        modalRef?.close()
        success('导航设置成功')
      },
      onCancel: () => {
        displayCancel()
        modeCancel()
        modalRef?.close()
      },
    })
  }

  const closeNavSettingsModal = () => {
    if (modalRef) {
      modalRef.close()
      modalRef = undefined
    }
  }

  return { openNavSettingsModal, closeNavSettingsModal }
}
