<script lang="ts" setup>
import { shallowRef, toRef } from 'vue'

import { useVModel, whenever } from '@vueuse/core'

import FormInput from './FormInput.vue'
import FormTip from './FormTip.vue'
import { roleOptions, DEFAULT_DATA } from './configuration/const'
import { ModalTypeEnum } from './configuration/enum'
import type { FormData } from './configuration/interface'
import { mockGetInterface, mockPostInterface } from './configuration/mock'
import { useCreateForm } from './hooks/useCreateForm'
import { useModalTitle } from './hooks/useModalTitle'

const props = defineProps<{
  visible: boolean
  type: ModalTypeEnum
  id?: number
  formValue?: FormData
}>()

const emit = defineEmits<{
  (e: 'update:visible', val: boolean): void
  (e: 'refresh', val: any): void
}>()

const isShow = useVModel(props, 'visible', emit)

const type = toRef(props, 'type')
const modalTitle = useModalTitle(type)

const { formGroup, validate } = useCreateForm()

const isLoading = shallowRef(false)
const updateLoading = (status: boolean) => {
  isLoading.value = status
}

/**
 * 直接往表单塞值的逻辑模板，业务一般跟自动请求的逻辑选用一个就好
 */
const updateFormData = () => {
  if (!props.formValue) return
  formGroup.setValue(props.formValue)
}

/**
 * 通过固定参数，表单自动请求的逻辑模板，业务一般跟表单直接塞值的逻辑选用一个就好
 */
const getFormInfo = async () => {
  if (!props.id) return
  updateLoading(true)
  const result = await mockGetInterface({
    id: props.id,
  })
  updateLoading(false)
  result.isSuccess && formGroup.setValue(result.data)
}

/**
 * 一般业务不会用多种塞值方式共存的方式，表单塞值跟自动请求的逻辑选用一个就好，这里为了展示多种模板，特意做了区分
 */
const initForm = () => {
  switch (type.value) {
    case ModalTypeEnum.edit:
      getFormInfo()
      break
    case ModalTypeEnum.copy:
      updateFormData()
      break
    default:
      formGroup.setValue(DEFAULT_DATA)
  }
}

const onConfirm = async () => {
  if (!validate()) {
    return false
  }
  updateLoading(true)
  const result = await mockPostInterface(formGroup.getValue())
  updateLoading(false)
  if (result.isSuccess) {
    emit('refresh', result)
  }
  return result.isSuccess
}

whenever(isShow, () => {
  formGroup.reset()
  initForm()
})
</script>

<template>
  <IxModal v-model:visible="isShow" class="form-modal" :header="modalTitle" :onOk="onConfirm">
    <IxSpin class="form-modal_mask" v-show="isLoading" :spinning="isLoading" />
    <IxForm
      label-align="start"
      :colonless="true"
      :control="formGroup"
      :label-col="{ flex: '66px' }"
    >
      <h4 class="form-modal_title">基本信息</h4>
      <IxFormItem required label="账户名">
        <IxInput control="user" />
        <FormTip>
          <template #tip>
            1. 仅支持中文字符、英文字母、数字和下划线
            <br />
            2. 长度限制1-95个字符
          </template>
        </FormTip>
      </IxFormItem>
      <IxFormItem required label="密码">
        <FormInput control="password" />
      </IxFormItem>
      <IxFormItem required label="确认密码">
        <FormInput control="confirmPwd" />
      </IxFormItem>
      <IxFormItem label="电话号码">
        <IxInput control="telphone" />
      </IxFormItem>
      <IxFormItem label="邮箱">
        <IxInput control="emial" />
      </IxFormItem>
      <IxFormItem label="描述">
        <IxInput control="desc" />
      </IxFormItem>

      <h4 class="form-modal_title">角色分配</h4>
      <IxFormItem required label="角色">
        <IxSelect multiple control="role" :overlay-match-width="true" :data-source="roleOptions" />
      </IxFormItem>
    </IxForm>
  </IxModal>
</template>

<style lang="less">
.form-modal {
  .ix-modal-body {
    padding-right: 40px;
    padding-left: 24px;
  }
  .ix-form-item-label {
    left: -8px;
  }
  &_title {
    font-size: 14px;
    font-weight: bold;
  }

  &_select {
    width: 110px;
  }

  .form-modal_tip-icon {
    position: absolute;
    top: 6px;
    right: -26px;
  }

  &_mask {
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    z-index: 100;
    background: rgb(255 255 255 / 50%);
  }
}
</style>
