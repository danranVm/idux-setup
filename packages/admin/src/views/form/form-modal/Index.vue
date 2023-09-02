<script lang="ts" setup>
import { ref, computed } from 'vue'

import { useToggle } from '@vueuse/core'

import FormModal from './components/FormModal.vue'
import { ModalTypeEnum } from './components/configuration/enum'
import type { FormData } from './components/configuration/interface'
import { mockData } from './components/configuration/mock'

const [isVisible, toggle] = useToggle()

const currentId = ref<number>()
const currentVal = ref<FormData>()
const modalType = ref(ModalTypeEnum.add)
const modalParams = computed(() => ({
  id: currentId.value,
  type: modalType.value,
  formValue: currentVal.value,
}))

const openModal = (type: ModalTypeEnum) => {
  modalType.value = type
  toggle()
}

const onEdit = (id: number) => {
  currentId.value = id
  currentVal.value = undefined
  openModal(ModalTypeEnum.edit)
}

const onAdd = () => {
  currentId.value = undefined
  currentVal.value = undefined
  openModal(ModalTypeEnum.add)
}

const onCopy = (data: FormData) => {
  currentId.value = undefined
  currentVal.value = data
  openModal(ModalTypeEnum.copy)
}
</script>

<template>
  <div class="basic-table-page">
    <IxHeader class="dark:text-gray-300"> 表单弹窗 </IxHeader>
    <IxSpace>
      <IxButton @click="() => onAdd()">新增</IxButton>
      <IxButton @click="() => onEdit(2)">编辑，传递id参数，表单自动请求</IxButton>
      <IxButton @click="() => onCopy(mockData(3))"
        >复制，传递整个formValue，表单不请求直接填入</IxButton
      >
    </IxSpace>
    <FormModal v-model:visible="isVisible" v-bind="modalParams" />
  </div>
</template>
