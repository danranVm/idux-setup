<script lang="ts" setup>
import { shallowRef } from 'vue'

import { Validators, useFormGroup } from '@idux/cdk/forms'

const phoneAreaCodeSource = [
  { key: '86', label: '+86' },
  { key: '85', label: '+85' },
]

const captchaDisabled = shallowRef(true)

const { required } = Validators

const formGroup = useFormGroup({
  phoneAreaCode: ['86'],
  phone: ['13100000000', required],
  captcha: ['123456', required],
})

defineExpose({
  control: formGroup,
})

const phoneControl = formGroup.get('phone')
phoneControl.watchValue(
  value => {
    captchaDisabled.value = !value
  },
  {
    immediate: true,
  },
)
</script>
<template>
  <IxForm class="login-inner-box-form" size="lg" :control="formGroup">
    <IxFormItem message="请输入手机号!">
      <IxInput control="phone" class="phone-input" placeholder="请输入手机号">
        <template #addonBefore>
          <IxSelect control="phoneAreaCode" :dataSource="phoneAreaCodeSource" style="width: 80px">
          </IxSelect>
        </template>
      </IxInput>
    </IxFormItem>
    <IxFormItem message="请输入正确的验证码!">
      <IxRow gutter="8">
        <IxCol span="16">
          <IxInput id="captcha" control="captcha" placeholder="请输入验证码"> </IxInput>
        </IxCol>
        <IxCol span="8">
          <IxButton style="min-width: 100%; width: 100%" :disabled="captchaDisabled">
            获取验证码
          </IxButton>
        </IxCol>
      </IxRow>
    </IxFormItem>
  </IxForm>
</template>
