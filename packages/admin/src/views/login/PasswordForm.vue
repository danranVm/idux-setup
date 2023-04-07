<script lang="ts" setup>
import { shallowRef } from 'vue'

import { Validators, useFormGroup } from '@idux/cdk/forms'

const { required, minLength, maxLength } = Validators

const formGroup = useFormGroup({
  username: ['admin', required],
  password: ['123456', [required, minLength(6), maxLength(18)]],
})

const passwordVisibleRef = shallowRef(false)

defineExpose({
  control: formGroup,
})
</script>
<template>
  <IxForm class="login-inner-box-form" size="lg" :control="formGroup">
    <IxFormItem message="请输入用户名!">
      <IxInput control="username" placeholder="用户名: admin"></IxInput>
    </IxFormItem>
    <IxFormItem message="请输入密码, 长度为 6-18 位!">
      <IxInput
        control="password"
        :type="passwordVisibleRef ? 'text' : 'password'"
        placeholder="密码: 123456"
      >
        <template #suffix>
          <IxIcon
            :name="passwordVisibleRef ? 'eye-invisible' : 'eye'"
            @click="passwordVisibleRef = !passwordVisibleRef"
          >
          </IxIcon>
        </template>
      </IxInput>
    </IxFormItem>
  </IxForm>
</template>
