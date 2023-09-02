<script lang="ts" setup>
import { computed, shallowRef } from 'vue'

import { useVModel, whenever } from '@vueuse/core'

import FormInput from './FormInput.vue'
import {
  accessRadioOptions,
  gitConnectTypeOptions,
  repositoryTypeOptions,
  pullTypeOptions,
  DEFAULT_DATA,
} from './configuration'
import type { FormData, ApiReturn } from './configuration/interface'
import { useCreateForm } from './hooks/useCreateForm'

const props = defineProps<{
  visible: boolean
}>()

const emit = defineEmits<{
  (e: 'update:visible', val: boolean): void
  (e: 'refresh', val: ApiReturn<FormData> | null): void
}>()

const isShow = useVModel(props, 'visible', emit)

const { formGroup, isGitLabel, isFile, isToken, isSSh, validate } = useCreateForm()

const gitAddressPlaceholder = computed(() =>
  isSSh.value ? '请输入SSH格式的地址' : '请输入HTTP或HTTPS格式的地址',
)
const marginLeft = computed(() => (isGitLabel.value ? '110px' : '80px'))

const isLoading = shallowRef(false)

const initForm = async () => {
  formGroup.reset()
  const result = await mockInterface()
  result.isSuccess && formGroup.setValue(result.data)
}

whenever(isShow, () => {
  initForm()
})

const itemLabel = { flex: '58px' }

const mockInterface = (data?: FormData): Promise<ApiReturn> => {
  isLoading.value = true
  return new Promise(resolve => {
    setTimeout(() => {
      isLoading.value = false
      resolve({
        isSuccess: true,
        msg: '',
        data: data ?? DEFAULT_DATA,
      })
    }, 1000)
  })
}

const onConfirm = async () => {
  if (!validate()) {
    return false
  }
  const result = await mockInterface(formGroup.getValue())
  if (result.isSuccess) {
    emit('refresh', result)
  }
  return result.isSuccess
}
</script>

<template>
  <IxModal v-model:visible="isShow" class="form-modal" header="This is header" :onOk="onConfirm">
    <IxSpin class="form-modal_mask" v-show="isLoading" :spinning="isLoading" />
    <IxForm
      label-align="start"
      :control="formGroup"
      :colonless="true"
      :label-col="{ flex: marginLeft }"
    >
      <IxFormItem label="获取方式">
        <IxRadioGroup control="access">
          <IxRadio v-for="item in accessRadioOptions" :key="item.key" :value="item.key">
            {{ item.label }}
          </IxRadio>
        </IxRadioGroup>
      </IxFormItem>

      <div v-show="!isFile">
        <IxFormItem label="GIT类型">
          <IxSelect control="repositoryType" :data-source="repositoryTypeOptions" />
        </IxFormItem>

        <IxFormItem label="GIT地址">
          <IxRow :gutter="8">
            <IxCol :flex="2">
              <IxFormItem>
                <IxSelect
                  control="pullType"
                  :overlay-match-width="true"
                  :data-source="pullTypeOptions"
                />
              </IxFormItem>
            </IxCol>
            <IxCol :flex="3">
              <IxFormItem required>
                <IxInput control="gitAddress" :placeholder="gitAddressPlaceholder" />
              </IxFormItem>
            </IxCol>
          </IxRow>
        </IxFormItem>

        <IxFormItem v-show="isSSh" required label="密钥">
          <IxTextarea control="privateKey" placeholder="请输入正确的密钥" />
        </IxFormItem>

        <div v-show="isGitLabel">
          <IxFormItem required label="GitLab访问配置">
            <IxInput control="gitLabHead" />
          </IxFormItem>
          <IxFormItem required label="GitLab接口版本">
            <IxInput control="gitlabApiVersion" />
          </IxFormItem>
        </div>

        <div>
          <IxFormItem label="拉取方式">
            <IxRadioGroup control="gitConnectType">
              <IxRadio v-for="item in gitConnectTypeOptions" :key="item.key" :value="item.key">
                {{ item.label }}
              </IxRadio>
            </IxRadioGroup>
          </IxFormItem>

          <div v-show="!isToken" :style="{ marginLeft: marginLeft }">
            <div class="form-modal_wrapper">
              <IxFormItem required label="用户名" :label-col="itemLabel">
                <IxInput control="gitUsername" />
              </IxFormItem>
              <IxFormItem required label="密码" :label-col="itemLabel">
                <FormInput control="gitPassword" />
              </IxFormItem>
            </div>
          </div>

          <div v-show="isToken" :style="{ marginLeft: marginLeft }">
            <div class="form-modal_wrapper">
              <IxFormItem required label="Token" :label-col="itemLabel">
                <FormInput control="token" />
              </IxFormItem>
            </div>
          </div>
        </div>

        <IxFormItem required label="分支">
          <IxInput control="branch" placeholder="输入分支路径" />
        </IxFormItem>
      </div>

      <div v-show="isFile">
        <IxFormItem required label="文件路径">
          <IxInput control="file" />
        </IxFormItem>
      </div>
    </IxForm>
  </IxModal>
</template>

<style lang="less">
.form-modal {
  &_wrapper {
    position: relative;
    padding: 12px 9px 4px;
    padding-right: 24px;
    margin-bottom: 16px;
    background: red;
    background: #f7f9fc;
    border: 1px solid #e1e5eb;

    &::after {
      content: '';
      position: absolute;
      left: 2px;
      top: -6px;
      width: 12px;
      height: 12px;
      background: #f7f9fc;
      border-top: 1px solid #e1e5eb;
      border-left: 1px solid #e1e5eb;
      transform: rotate(45deg);
    }
  }

  &_select {
    width: 110px;
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
