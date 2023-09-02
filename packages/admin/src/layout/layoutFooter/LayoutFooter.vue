<script lang="ts" setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'

import { storeToRefs } from 'pinia'

import OperItem from './OperItem.vue'
import { useNavSettingsModal } from '../composables/useNavSettingsModal'
import { useSiderDropdownState } from '../composables/useSiderDropdownState'

import { Alarms, AlarmTrigger } from '@/components/business/alarms'
import { useAppSettingStore, useUserStore, useAlarmDataStore } from '@/store/modules'

const router = useRouter()

const { logout } = useUserStore()
const { layoutCollapsed } = storeToRefs(useAppSettingStore())
const { alarmDataCount } = storeToRefs(useAlarmDataStore())

const userImageUrl = computed(() => new URL('../assets/admin.svg', import.meta.url).href)

const { openNavSettingsModal } = useNavSettingsModal()
const {
  dropdownVislble,
  overlayContent,
  handleRefMouseenter,
  handleRefMouseleave,
  handleOverlayMouseenter,
  handleOverlayMouseleave,
  setOverlayContent,
} = useSiderDropdownState()

const handleAlarmTriggerMouseEnter = () => {
  setOverlayContent('alarm')
  handleRefMouseenter()
}
const handleAlarmTriggerMouseLeave = () => {
  handleRefMouseleave()
}
const handleMenuTriggerMouseEnter = () => {
  setOverlayContent('menu')
  handleRefMouseenter()
}
const handleMenuTriggerMouseLeave = () => {
  handleRefMouseleave()
}
const handleAlarmMenuItemClick = () => {
  setOverlayContent('alarm')
}
const handleLogout = () => {
  logout()
  router.replace('/login')
}
</script>

<template>
  <div class="global-layout__footer">
    <div class="global-layout__footer__opers">
      <template v-if="!layoutCollapsed">
        <OperItem icon="setting" label="设置" mode="icon" @click="openNavSettingsModal" />
        <OperItem icon="robot" label="智能客服" mode="icon" />
        <OperItem
          label="通知"
          mode="icon"
          @mouseenter="handleAlarmTriggerMouseEnter"
          @mouseleave="handleAlarmTriggerMouseLeave"
        >
          <template #icon>
            <AlarmTrigger />
          </template>
        </OperItem>
        <OperItem icon="swap" label="切换为融合版" mode="icon" />
      </template>
      <div
        v-else
        class="global-layout__footer__collapsed-menu-trigger"
        @mouseenter="handleMenuTriggerMouseEnter"
        @mouseleave="handleMenuTriggerMouseLeave"
      >
        <IxIcon name="custom:menu" />
      </div>
    </div>
    <IxDropdown
      :visible="dropdownVislble"
      trigger="manual"
      placement="rightEnd"
      :offset="[0, 0]"
      @mouseenter="handleOverlayMouseenter"
      @mouseleave="handleOverlayMouseleave"
    >
      <div class="global-layout__footer__dropdown-reference"></div>
      <template #overlay>
        <Alarms v-if="overlayContent === 'alarm'" />
        <div v-if="overlayContent === 'menu'" class="global-layout__footer__collapsed-menu">
          <OperItem icon="setting" label="设置" mode="all" @click="openNavSettingsModal" />
          <OperItem icon="robot" label="智能客服" mode="all" />
          <OperItem label="通知" mode="all" @click="handleAlarmMenuItemClick">
            <template #icon>
              <AlarmTrigger badgeType="dot" />
            </template>
            <template #suffix>
              <span v-if="alarmDataCount > 0" class="global-layout__footer__menu-alarm-count">
                {{ alarmDataCount }}
              </span>
            </template>
          </OperItem>
          <OperItem icon="swap" label="切换为融合版" mode="all" />
        </div>
      </template>
    </IxDropdown>
    <IxDropdown :offset="[0, 0]" placement="rightEnd">
      <div class="global-layout__footer__user">
        <img
          class="global-layout__footer__user__icon"
          width="16"
          height="16"
          :src="userImageUrl"
          alt="user image"
        />
        <span v-if="!layoutCollapsed" class="global-layout__footer__user__label"> Admin </span>
        <span v-if="!layoutCollapsed" class="global-layout__footer__user__suffix">
          <IxIcon name="right" />
        </span>
      </div>
      <template #overlay>
        <div class="global-layout__footer__user-menu">
          <div class="global-layout__footer__user-menu__item"> 更改密码 </div>
          <div class="global-layout__footer__user-menu__item" @click="handleLogout"> 退出登录 </div>
        </div>
      </template>
    </IxDropdown>
  </div>
</template>
