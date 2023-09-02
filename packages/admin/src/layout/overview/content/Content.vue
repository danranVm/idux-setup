<script lang="ts" setup>
import { inject } from 'vue'

import { convertCssPixel } from '@idux/cdk/utils'

import Block from './Block.vue'
import { overviewColumnWidth } from '../../composables/useOverviewData'
import { layoutContextToken } from '../../context'

const { overviewColumns, overviewContentRef } = inject(layoutContextToken)!

const columnStyle = {
  width: convertCssPixel(overviewColumnWidth),
}
</script>

<template>
  <div class="layout-overview__content" ref="overviewContentRef">
    <div
      v-for="(column, index) in overviewColumns"
      :key="index"
      class="layout-overview__content__column"
      :style="columnStyle"
    >
      <Block v-for="(block, index) in column" :key="index" :block="block" />
    </div>
  </div>
</template>
