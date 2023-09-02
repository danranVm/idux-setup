<script lang="ts" setup>
import { type PropType, computed } from 'vue'

import { type MaybeArray, useControlledProp } from '@idux/cdk/utils'

import { Tooltip } from '../components/tooltip'

const props = defineProps({
  editEnabled: Boolean,
  opened: Boolean,
  'onUpdate:editEnabled': [Array, Function] as PropType<MaybeArray<(enabled: boolean) => void>>,
  'onUpdate:opened': [Array, Function] as PropType<MaybeArray<(opened: boolean) => void>>,
})
const emit = defineEmits<{
  (event: 'confirm'): void
  (event: 'cancel'): void
}>()
const [_editEnabled, setEditEnabled] = useControlledProp(props, 'editEnabled')
const [_opened, setOpened] = useControlledProp(props, 'opened')

const classes = computed(() => {
  const headerCls = 'nav-shortcuts__header'

  return {
    [headerCls]: true,
    [`${headerCls}--opened`]: !!_opened.value,
  }
})

const handleEnableIconClick = () => {
  setEditEnabled(true)
}
const handleConfirm = () => {
  emit('confirm')
  setEditEnabled(false)
}
const handleCancel = () => {
  emit('cancel')
  setEditEnabled(false)
}
const handleOpenChange = () => {
  setOpened(!_opened.value)
}
</script>

<template>
  <div :class="classes" @click="handleOpenChange">
    <IxIcon class="nav-shortcuts__header__prefix" name="custom:nav-shortcuts" />
    <span class="nav-shortcuts__header__label">快捷入口</span>
    <div class="nav-shortcuts__header__suffix">
      <div class="nav-shortcuts__header__operations" @click="evt => evt.stopImmediatePropagation()">
        <Tooltip v-if="!_editEnabled" title="编辑快捷入口">
          <IxIcon
            class="nav-shortcuts__header__operations__btn nav-shortcuts__header__operations__setting"
            name="setting"
            @click="handleEnableIconClick"
          />
        </Tooltip>
        <template v-else>
          <Tooltip title="完成设置">
            <IxIcon
              class="nav-shortcuts__header__operations__btn nav-shortcuts__header__operations__confirm"
              name="custom:ok"
              @click="handleConfirm"
            />
          </Tooltip>
          <Tooltip title="取消设置">
            <IxIcon
              class="nav-shortcuts__header__operations__btn nav-shortcuts__header__operations__cancel"
              name="custom:delete"
              @click="handleCancel"
            />
          </Tooltip>
        </template>
      </div>
      <IxIcon class="nav-shortcuts__header__expand-icon" name="right" />
    </div>
  </div>
</template>
