<script setup lang="ts">
import { inject } from 'vue'

import { storeToRefs } from 'pinia'

import { loginContextToken } from './context'

import { useAppSettingStore } from '@/store/modules/appSetting'

const { boxQrCode, boxOnlineService, boxServicePhone } = inject(loginContextToken)!
const { version } = storeToRefs(useAppSettingStore())

</script>
<template>
  <div class="login-box-header">
    <IxRow>
      <IxCol flex="260px" class="login-box-header-logo">
        <img class="inline-block" width="162" height="42" src="./assets/box-header-logo.svg" alt="logo" />
        <span class="ml-2 version">{{ version }}</span>
      </IxCol>
      <IxCol flex="auto" class="text-right">
        <IxSpace align="center" :size="8">
          <div class="help-box" v-if="boxQrCode">
            <IxTooltip placement="bottom">
              <template #title>
                <IxSpace vertical class="text-center pt-2" :size="4">
                  <img
                    class="cursor-pointer"
                    width="90"
                    height="90"
                    src="./assets/QR-code.svg"
                    alt="公众号技术支持"
                  />
                  <span>技术支持</span>
                  <span>关注微信公众号</span>
                </IxSpace>
              </template>
              <img
                class="cursor-pointer"
                width="22"
                height="22"
                src="./assets/account.svg"
                alt="公众号技术支持"
              />
            </IxTooltip>
          </div>
          <div class="help-box" v-if="boxServicePhone">
            <IxTooltip placement="bottom">
              <template #title> 服务电话：{{ boxServicePhone }} </template>
              <img
                class="cursor-pointer"
                width="22"
                height="22"
                src="./assets/phone.svg"
                alt="客服热线支持"
              />
            </IxTooltip>
          </div>
          <img
            v-if="boxOnlineService"
            class="cursor-pointer"
            width="82"
            height="22"
            src="./assets/online-help.svg"
            alt="在线客户"
          />
        </IxSpace>
      </IxCol>
    </IxRow>
  </div>
</template>
