<script setup lang="ts">
import { inject } from 'vue'

import { storeToRefs } from 'pinia'

import { loginContextToken } from './context'

import { useAppSettingStore } from '@/store/modules/appSetting'

const { bannerHeader, bannerContent } = inject(loginContextToken)!
const { version } = storeToRefs(useAppSettingStore())
</script>
<template>
  <div class="login-banner-wrapper">
    <div class="login-banner">
      <div class="login-banner-header">
        <template v-if="$slots.header">
          <slot name="header"></slot>
        </template>
        <template v-else>
          <div class="inline-flex">
            <img width="38" height="38" src="./assets/logo.png" alt="产品logo" />
            <span class="ml-2">{{ bannerHeader }}</span>
            <span class="ml-2 mt-4 version">{{ version }}</span>
          </div>
        </template>
      </div>
      <div class="login-banner-content">
        <template v-if="$slots.content">
          <slot name="content"></slot>
        </template>
        <template v-else>
          {{ bannerContent }}
        </template>
      </div>
    </div>
  </div>
</template>
