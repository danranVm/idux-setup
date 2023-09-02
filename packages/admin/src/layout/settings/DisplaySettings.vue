<script lang="ts" setup>
import { DndSortable } from '@idux/setup-shared'

import SettingsBlock from './SettingsBlock.vue'
import SettingsTitle from './SettingsTitle.vue'
import { useNavDisplaySettingsState } from '../composables/useNavDisplaySettingsState'

import type { NavRecord } from '@/types'
const {
  dataSource,
  isExpanded,
  handleExpanded,
  isNavRecordDisabled,
  handleEnableStatusChange,
  handleMove,
  handleStart,
  handleEnd,
  reset,
} = useNavDisplaySettingsState()

const prefixCls = 'nav-settings__display'
const getNodeCls = (record: NavRecord) => {
  return {
    [`${prefixCls}__node`]: true,
    [`${prefixCls}__node-level-${record.level}`]: true,
    [`${prefixCls}__node--drag-disabled`]: !!record.settings?.dragDisabled,
  }
}
</script>

<template>
  <SettingsBlock :class="prefixCls">
    <template #header>
      <SettingsTitle
        label="显示设置"
        info="可自定义导航标题的显示/隐藏，通过拖拽调整顺序，让日常使用更方便。这项更改只作用于当前用户，不会影响其他用户。"
      >
        <template #suffix>
          <IxButton mode="link" @click="reset"> 恢复默认设置 </IxButton>
        </template>
      </SettingsTitle>
    </template>
    <div :class="`${prefixCls}__content`">
      <DndSortable
        :dataSource="dataSource"
        :animation="180"
        :getKey="data => data.record.id"
        :handle="`.${prefixCls}__node__drag-handle`"
        :dragClass="`${prefixCls}__dragging`"
        @move="handleMove"
        @start="handleStart"
        @end="handleEnd"
      >
        <template #item="{ data }">
          <div
            :key="data.record.id"
            :data-id="data.record.id"
            :data-dragdisabled="!!data.record.settings?.dragDisabled"
          >
            <div :class="getNodeCls(data.record)">
              <span
                v-if="!data.record.settings?.dragDisabled"
                :class="`${prefixCls}__node__drag-handle`"
              >
                <IxIcon name="holder" />
              </span>
              <span :class="`${prefixCls}__node__label`">{{ data.record.title }}</span>
              <IxIcon
                :class="`${prefixCls}__node__expand-icon`"
                v-if="data.children?.length"
                :name="isExpanded(data.record.id) ? 'up' : 'down'"
                @click="() => handleExpanded(!isExpanded(data.record.id), data.record)"
              />
            </div>
            <Transition name="ix-slide-up">
              <div v-show="isExpanded(data.record.id)" :class="`${prefixCls}__sub`">
                <div v-for="record in data.children" :key="record.id" :class="getNodeCls(record)">
                  <span :class="`${prefixCls}__node__label`" :key="record.id">
                    {{ record.title }}
                  </span>
                  <span :class="`${prefixCls}__node__suffix`">
                    <IxSwitch
                      size="sm"
                      :checked="!isNavRecordDisabled(record.id)"
                      @change="checked => handleEnableStatusChange(checked, record)"
                    />
                  </span>
                </div>
              </div>
            </Transition>
          </div>
        </template>
      </DndSortable>
    </div>
  </SettingsBlock>
</template>
