<script lang="ts" setup>
import { inject } from 'vue'

import Searchbar from './Searchbar.vue'
import Content from './content/Content.vue'
import { layoutContextToken } from '../context'

const { setOverviewVisible } = inject(layoutContextToken)!

const handleCloseIconClick = () => {
  setOverviewVisible(false)
}
</script>

<template>
  <div class="layout-overview">
    <div class="layout-overview__header">
      <Searchbar />
    </div>
    <Content />
    <IxIcon class="layout-overview__close" name="close" @click="handleCloseIconClick" />
  </div>
</template>
