<script setup lang="ts">
import { RouterView } from 'vue-router'
</script>
<template>
  <div class="global-layout__content__main">
    <router-view>
      <template #default="{ Component, route }">
        <keep-alive v-if="route.meta.keepAlive">
          <component :is="Component" :key="route.fullPath" />
        </keep-alive>
        <component v-else :is="Component" :key="route.fullPath" />
      </template>
    </router-view>
  </div>
</template>
