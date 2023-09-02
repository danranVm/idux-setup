<script lang="ts" setup>
import { computed } from 'vue'

import SettingsBlock from './SettingsBlock.vue'
import SettingsTitle from './SettingsTitle.vue'
import { type CardCheckableGroupOption, CardCheckableGroup } from '../components/cardCheckableGroup'
import { useNavModeGuidePopover } from '../composables/useNavModeGuidePopover'
import { useNavModeSettingsState } from '../composables/useNavModeSettingsState'

import type { NavShortcutMode } from '@/types'

const { navOverviewMode, navShortcutMode, handeOverviewModeChange, handeShourtcutModeChange } =
  useNavModeSettingsState()
const { activeItem, popoverVisible, handleItemHover, handlePopoverMouseenter, handlePopoverMouseleave } =
  useNavModeGuidePopover()

const prefixCls = 'nav-settings__mode'

const overviewModeOptions: CardCheckableGroupOption[] = [
  {
    value: 'overview',
    label: '功能全览',
    class: `${prefixCls}__card-overview`,
  },
  {
    value: 'search',
    label: '导航搜索',
    disabled: true,
    tooltip: '暂未上线',
    class: `${prefixCls}__card-search`,
  },
]

const shortcutModeOptions: CardCheckableGroupOption[] = [
  {
    value: 'tab',
    label: '多标签切换',
    class: `${prefixCls}__card-tab`,
  },
  {
    value: 'shortcut',
    label: '快捷入口',
    class: `${prefixCls}__card-shortcut`,
  },
  {
    value: undefined,
    label: '不需要',
    class: `${prefixCls}__card-not-needed`,
  },
]

const shortcutModeValue = computed(() => [navShortcutMode.value])
const _handleShortcutModeChange = (mode: (string | undefined)[]) => {
  handeShourtcutModeChange(mode[0] as NavShortcutMode)
}
</script>
<template>
  <div :class="prefixCls">
    <SettingsBlock>
      <template #header>
        <SettingsTitle label="全局查看/搜索" />
      </template>
      <CardCheckableGroup
        type="checkbox"
        :options="overviewModeOptions"
        :value="navOverviewMode"
        @change="handeOverviewModeChange"
        @item-hover="handleItemHover"
      />
    </SettingsBlock>
    <SettingsBlock>
      <template #header>
        <SettingsTitle label="快捷跳转" />
      </template>
      <CardCheckableGroup
        type="radio"
        :options="shortcutModeOptions"
        :value="shortcutModeValue"
        @change="_handleShortcutModeChange"
        @item-hover="handleItemHover"
      />
    </SettingsBlock>
    <IxPopover
      :header="activeItem?.title"
      :visible="popoverVisible"
      @mouseenter="handlePopoverMouseenter"
      @mouseleave="handlePopoverMouseleave"
      placement="rightStart"
      trigger="manual"
    >
      <div :class="`${prefixCls}__guide__reference`"></div>
      <template #content>
        <div :class="`${prefixCls}__guide__content`">
          <p :class="`${prefixCls}__guide__description`">
            {{ activeItem?.description }}
          </p>
          <video
            :class="`${prefixCls}__guide__video`"
            :src="activeItem?.video"
            autoplay
            muted
          ></video>
        </div>
      </template>
    </IxPopover>
  </div>
</template>
