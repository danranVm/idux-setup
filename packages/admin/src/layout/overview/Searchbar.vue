<script lang="ts" setup>
import { inject } from 'vue'

import { layoutContextToken } from '../context'

const { searchValue, setSearchValue } = inject(layoutContextToken)!

const handleChange = (value: string) => {
  setSearchValue(value)
}
const handleClear = () => {
  setSearchValue(undefined)
}
</script>

<template>
  <IxInput
    class="layout-overview-searchbar"
    placeholder="请输入关键词"
    :value="searchValue"
    clearable
    suffix="search"
    @change="handleChange"
    @clear="handleClear"
  />
</template>
