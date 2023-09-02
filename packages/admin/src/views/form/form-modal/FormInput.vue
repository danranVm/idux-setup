<script lang="ts" setup>
import { useToggle } from '@vueuse/core'

const [passwordVisible, toggle] = useToggle()
</script>

<template>
  <IxInput :type="passwordVisible ? 'text' : 'password'" v-bind="$attrs">
    <template #suffix>
      <IxIcon :name="!passwordVisible ? 'eye-invisible' : 'eye'" @click="() => toggle()" />
    </template>
  </IxInput>
</template>
