<script setup lang="ts">
import { onMounted, provide, ref } from 'vue'
import { useRouter } from 'vue-router'

import {
  type DrawerProviderInstance,
  type LoadingBarProviderInstance,
  type NotificationProviderInstance,
  type MessageProviderInstance,
  type ModalProviderInstance,
  type SpinProviderInstance,
  type DrawerProviderRef,
  type LoadingBarProviderRef,
  type NotificationProviderRef,
  type MessageProviderRef,
  type ModalProviderRef,
  type SpinProviderRef,
  DRAWER_PROVIDER_TOKEN,
  LOADING_BAR_PROVIDER_TOKEN,
  NOTIFICATION_PROVIDER_TOKEN,
  MESSAGE_PROVIDER_TOKEN,
  MODAL_PROVIDER_TOKEN,
  SPIN_PROVIDER_TOKEN,
} from '@idux/components'
import { isFunction, has } from 'lodash-es'

import { registerProviders } from './providers'

const drawerProviderRef = ref<DrawerProviderInstance>()
const loadingBarProviderRef = ref<LoadingBarProviderInstance>()
const notificationProviderRef = ref<NotificationProviderInstance>()
const messageProviderRef = ref<MessageProviderInstance>()
const modalProviderRef = ref<ModalProviderInstance>()
const spinProviderRef = ref<SpinProviderInstance>()

const drawer = {} as DrawerProviderRef
const loadingBar = {} as LoadingBarProviderRef
const notification = {} as NotificationProviderRef
const message = {} as MessageProviderRef
const modal = {} as ModalProviderRef
const spin = {} as SpinProviderRef

provide(DRAWER_PROVIDER_TOKEN, drawer)
provide(LOADING_BAR_PROVIDER_TOKEN, loadingBar)
provide(NOTIFICATION_PROVIDER_TOKEN, notification)
provide(MESSAGE_PROVIDER_TOKEN, message)
provide(MODAL_PROVIDER_TOKEN, modal)
provide(SPIN_PROVIDER_TOKEN, spin)

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const handleInstance = (instance: Record<string, unknown>, provider: any) => {
  Object.keys(instance).forEach(key => {
    if (has(instance, key) && isFunction(instance[key])) {
      provider[key] = instance[key]
    }
  })
}

const router = useRouter()

onMounted(() => {
  // 每次路由切换时销毁当前的抽屉和弹窗（仅对通过 useDrawer/useModal 创建的生效）
  router.afterEach(() => {
    drawerProviderRef.value!.destroyAll()
    modalProviderRef.value!.destroyAll()
  })

  handleInstance(drawerProviderRef.value!, drawer)
  handleInstance(loadingBarProviderRef.value!, loadingBar)
  handleInstance(notificationProviderRef.value!, notification)
  handleInstance(messageProviderRef.value!, message)
  handleInstance(modalProviderRef.value!, modal)
  handleInstance(spinProviderRef.value!, spin)

  registerProviders({ drawer, notification, modal, message, loadingBar, spin })
})
</script>

<template>
  <slot></slot>
  <IxDrawerProvider ref="drawerProviderRef" />
  <IxLoadingBarProvider ref="loadingBarProviderRef" />
  <IxNotificationProvider ref="notificationProviderRef" />
  <IxMessageProvider ref="messageProviderRef" />
  <IxModalProvider ref="modalProviderRef" />
  <IxSpinProvider ref="spinProviderRef" />
</template>
