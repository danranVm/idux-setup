<script setup lang="ts">
import { inject } from 'vue'

import { loginContextToken } from './context'

const { bannerHeader, bannerContent } = inject(loginContextToken)!
</script>
<template>
  <div class="login-banner-wrapper">
    <div class="login-banner">
      <div class="login-banner-header">
        <template v-if="$slots.header">
          <slot name="header"></slot>
        </template>
        <template v-else>
          {{ bannerHeader }}
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
