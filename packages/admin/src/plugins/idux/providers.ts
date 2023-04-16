import type {
  DrawerProviderRef,
  LoadingBarProviderRef,
  MessageProviderRef,
  ModalProviderRef,
  NotificationProviderRef,
  SpinProviderRef,
} from '@idux/components'

let Drawer: DrawerProviderRef | undefined
let LoadingBar: LoadingBarProviderRef | undefined
let Notification: NotificationProviderRef | undefined
let Message: MessageProviderRef | undefined
let Modal: ModalProviderRef | undefined
let Spin: SpinProviderRef | undefined

export interface ProvidersOptions {
  drawer: DrawerProviderRef
  notification: NotificationProviderRef
  modal: ModalProviderRef
  message: MessageProviderRef
  loadingBar: LoadingBarProviderRef
  spin: SpinProviderRef
}

// 方便在 ts 中直接调用
export function registerProviders(option: ProvidersOptions): void {
  Drawer = option.drawer
  Notification = option.notification
  Modal = option.modal
  Message = option.message
  LoadingBar = option.loadingBar
  Spin = option.spin
}

export { Drawer, Notification, Modal, Message, LoadingBar, Spin }
