<script lang="ts" setup>
import { type PropType, computed } from 'vue'

import type { MaybeArray } from '@idux/cdk/utils'

import ShortcutHeader from './ShortcutHeader.vue'
import ShortcutTree from './ShortcutTree.vue'
import { useShortcutsState } from '../composables/useShortcutsState'
import type { ShortcutsMode } from '../types'

const props = defineProps({
  mode: String as PropType<ShortcutsMode>,
  expanded: {
    type: Boolean,
    default: undefined,
  },
  'onUpdate:expanded': [Array, Function] as PropType<MaybeArray<(expanded: boolean) => void>>,
})

const {
  editEnabled,
  expanded,
  dataSource,
  handleConfirm,
  handleCancel,
  handleDelete,
  handleChange,
  setEditEnabled,
  setExpanded,
} = useShortcutsState(props)

const panelKey = '__panel__'
const expandedKeys = computed(() => (expanded.value ? [panelKey] : []))
const shortcutsCls = computed(() => {
  const cls = 'nav-shortcuts'

  return {
    [cls]: true,
    [`${cls}-${props.mode}`]: !!props.mode,
  }
})
</script>

<template>
  <IxCollapse :class="shortcutsCls" ghost :expandedKeys="expandedKeys">
    <IxCollapsePanel class="nav-shortcuts__panel" :key="panelKey">
      <template #header>
        <ShortcutHeader
          :editEnabled="editEnabled"
          :opened="expanded"
          @confirm="handleConfirm"
          @cancel="handleCancel"
          @update:opened="setExpanded"
          @update:editEnabled="setEditEnabled"
        />
      </template>
      <ShortcutTree
        v-show="!!dataSource.length"
        :dataSource="dataSource"
        :editEnabled="editEnabled"
        @change="handleChange"
        @delete="handleDelete"
      />
      <div v-show="!dataSource.length && mode === 'flattened'" class="nav-shortcuts__empty">
        <div class="nav-shortcuts__empty__inner">
          将右侧导航标题加入快捷入口后，可在这里查看并快速前往
        </div>
      </div>
    </IxCollapsePanel>
  </IxCollapse>
</template>
