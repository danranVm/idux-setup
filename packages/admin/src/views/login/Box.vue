<script lang="ts" setup>
import { inject, ref, shallowRef } from 'vue'
import { useRouter } from 'vue-router'

import { useMessage } from '@idux/components'


import BoxFooter from './BoxFooter.vue'
import BoxHeader from './BoxHeader.vue'
import MessageForm from './MessageForm.vue'
import PasswordForm from './PasswordForm.vue'
import { loginContextToken } from './context'

import { useUserStore } from '@/store/stores/user'

const { boxProductName } = inject(loginContextToken)!

const router = useRouter()
const userStore = useUserStore()
const { success } = useMessage()

const messageFormRef = ref()
const passwordFormRef = ref()

const dataSource = [
  { key: 'message', label: '短信登录' },
  { key: 'password', label: '密码登录' },
]

const loginTypeRef = shallowRef('password')
const isAgreedRef = shallowRef(false)

const login = () => {
  const formGroup =
    loginTypeRef.value === 'message' ? messageFormRef.value.control : passwordFormRef.value.control
  if (formGroup.valid.value) {
    userStore.login()
    router.push('/table/basic')
    success('登录成功')
  } else {
    formGroup.markAsDirty()
  }
}
</script>
<template>
  <section class="login-box">
    <BoxHeader />
    <div class="login-box-content">
      <div class="login-inner-box">
        <div class="login-inner-box-product" :class="!boxProductName ? 'mb-6' : ''">
          <div class="login-inner-box-product-logo flex items-center justify-center">
            <img width="128" height="92" src="./assets/product-logo.svg" alt="产品logo" />
          </div>
          <div class="login-inner-box-product-name" v-if="boxProductName">
            {{ boxProductName }}
          </div>
        </div>
        <IxRow class="login-inner-box-form-wrapper" block vertical :gutter="24">
          <IxCol :span="24" class="mt-6">
            <IxRadioGroup
              v-model:value="loginTypeRef"
              class="login-inner-box-type-radio"
              buttoned
              :gap="8"
              :dataSource="dataSource"
            >
            </IxRadioGroup>
          </IxCol>
          <IxCol :span="24">
            <MessageForm v-show="loginTypeRef === 'message'" ref="messageFormRef" />
            <PasswordForm v-show="loginTypeRef === 'password'" ref="passwordFormRef" />
          </IxCol>
          <IxCol :span="24" class="-mt-6">
            <IxSpace :size="0" block>
              <IxCheckbox v-model:checked="isAgreedRef">我已阅读并同意</IxCheckbox>
              <a class="cursor-pointer">《用户协议&隐私协议》</a>
            </IxSpace>
          </IxCol>
          <IxCol :span="24">
            <IxButton size="lg" mode="primary" block @click="login" :disabled="!isAgreedRef"
              >立即登录</IxButton
            >
          </IxCol>
          <IxCol :span="24">
            <IxRow>
              <IxCol :span="12">
                <a class="cursor-pointer">忘记密码</a>
              </IxCol>
              <IxCol :span="12" class="text-right">
                <a class="cursor-pointer">立即注册</a>
              </IxCol>
            </IxRow>
          </IxCol>
        </IxRow>
        <!-- <div class="other-login-wrapper">
          <IxDivider label="其他登录方式" plain />
          <IxRow justify="space-around">
            <IxCol class="text-center">
              <IxIcon name="setting"></IxIcon>
            </IxCol>
            <IxCol class="text-center">
              <IxIcon name="setting"></IxIcon>
            </IxCol>
            <IxCol class="text-center">
              <IxIcon name="setting"></IxIcon>
            </IxCol>
            <IxCol class="text-center">
              <IxIcon name="setting"></IxIcon>
            </IxCol>
          </IxRow>
        </div> -->
      </div>
    </div>
    <BoxFooter />
  </section>
</template>
