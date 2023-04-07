<script setup lang="ts">
import { getYear } from 'date-fns'

const thisYear = getYear(new Date())
</script>

<template>
  <div class="login-box-footer"> Copyright © 2020 - {{ thisYear }} IDuxFE Team 版权所有 </div>
</template>
