<script lang="ts" setup>
import { inject } from 'vue'

import BasicNavItem from '../components/BasicNavItem.vue'
import { layoutContextToken } from '../context'

const { recentRecords } = inject(layoutContextToken)!
</script>
<template>
  <div class="layout-recent-records">
    <BasicNavItem
      class="layout-recent-records__header"
      label="最近访问"
      icon="custom:nav-recents"
    />
    <div v-show="recentRecords.length" class="layout-recent-records__content">
      <BasicNavItem
        class="layout-recent-records__item"
        v-for="item in recentRecords"
        :key="item.id"
        :label="item.title"
        :path="item.path"
      />
    </div>
    <div v-show="!recentRecords.length" class="layout-recent-records__empty">
      <div class="layout-recent-records__empty__inner">
        最近访问过的页面会在这里展示，点击可快速前往
      </div>
    </div>
  </div>
</template>
