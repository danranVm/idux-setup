<script lang="ts" setup>
import { computed, inject, ref, shallowRef } from 'vue'
import { useRouter } from 'vue-router'

import { useMessage } from '@idux/components'

import BoxFooter from './BoxFooter.vue'
import BoxHeader from './BoxHeader.vue'
import MessageForm from './MessageForm.vue'
import OtherType from './OtherType.vue'
import PasswordForm from './PasswordForm.vue'
import { loginContextToken } from './context'

import { useUserStore } from '@/store/modules/user'


const { boxProductName } = inject(loginContextToken)!

const router = useRouter()
const userStore = useUserStore()
const { success } = useMessage()

const messageFormRef = ref()
const passwordFormRef = ref()

const loginTypeDataSource = [
  { key: 'password', title: '密码登录' },
  { key: 'message', title: '短信登录' },
]

const otherTypeDataSource = [
  {
    icon: 'custom:wechart',
    title: '企业微信登录',
    onClick: () => {
      loginTypeRef.value = 'wechart'
    }
  },
]

const loginTypeRef = shallowRef('password')
const isAgreedRef = shallowRef(false)

const showLoginForm = computed(() => {
  return loginTypeDataSource.map(({ key }) => key).includes(loginTypeRef.value)
})

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

const returnLoginType = () => {
  loginTypeRef.value = 'password'
}
</script>
<template>
  <section class="login-box">
    <BoxHeader />
    <div class="login-box-content">
      <div class="login-inner-box">
        <div class="login-inner-box-product" :class="!boxProductName ? 'mb-5' : ''">
          <!-- <div class="login-inner-box-product-logo flex items-center justify-center">
                                            <img width="128" height="92" src="./assets/product-logo.svg" alt="产品logo" />
                                          </div> -->
          <div class="login-inner-box-product-name" v-if="boxProductName">
            {{ boxProductName }}
          </div>
          <template v-else>
            <h1 class="text-xl font-semibold">欢迎登录</h1>
            <h1 class="text-xl font-semibold">Seer Design Setup</h1>
          </template>
        </div>
        <IxRow class="login-inner-box-form-wrapper" :gutter="8" v-show="showLoginForm">
          <IxCol :span="24" class="mt-6">
            <IxTabs v-model:selectedKey="loginTypeRef" class="login-inner-box-type-tabs" type="line" size="lg"
              :dataSource="loginTypeDataSource">
            </IxTabs>
          </IxCol>
          <IxCol :span="24">
            <MessageForm v-show="loginTypeRef === 'message'" ref="messageFormRef" />
            <PasswordForm v-show="loginTypeRef === 'password'" ref="passwordFormRef" />
          </IxCol>
          <IxCol :span="24">
            <IxSpace :size="0" block>
              <IxCheckbox v-model:checked="isAgreedRef">我已阅读并同意</IxCheckbox>
              <a class="cursor-pointer">《用户协议&隐私协议》</a>
            </IxSpace>
          </IxCol>
          <IxCol :span="24" class="mt-6">
            <IxButton size="lg" mode="primary" block @click="login" :disabled="!isAgreedRef">立即登录</IxButton>
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
        <OtherType v-show="showLoginForm" :dataSource="otherTypeDataSource" />
        <div v-show="loginTypeRef === 'wechart'" class="login-inner-box-qrcode">
          <span class="login-inner-box-qrcode-title">企业微信扫码</span>
          <img src="" alt="二维码">
          <span class="login-inner-box-qrcode-tip">请使用企业微信扫描二维码登录</span>
        </div>
        <IxButton v-show="!showLoginForm" class="switch-type-btn" block mode="text" icon="left" @click="returnLoginType">
          切换到其他登录方式
        </IxButton>
      </div>
    </div>
    <BoxFooter />
  </section>
</template>
