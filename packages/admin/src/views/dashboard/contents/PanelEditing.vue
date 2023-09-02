<script setup lang="ts">
import { shallowRef, watch, onMounted } from 'vue'

import { Validators, useFormControl, useKey } from '@idux/cdk'
import type { InputInstance } from '@idux/components'

import Card from '../cards/Card.vue'
import { useCards } from '../composables/useCards'
import type { DashboardCard, DashboardPanel } from '../types'
import { getNewCard, groupCards } from '../utils'

const props = defineProps<{
  title: string
  isAdd: boolean
}>()
const emits = defineEmits<{
  (e: 'cancel', key?: string): void
  (e: 'save', panel: DashboardPanel): void
}>()

const key = useKey() as string
const inputRef = shallowRef<InputInstance>()

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const { cards, loading, saveCards } = useCards()

const allCards = [
  {
    key: 'basic-bar',
    title: '基础柱状图',
    group: '柱状图',
  },
  {
    key: 'category-bar',
    title: '横向柱状图',
    group: '柱状图',
  },
  {
    key: 'basic-line',
    title: '基础折线图',
    group: '折线图',
  },
  {
    key: 'smooth-line',
    title: '平滑折线图',
    group: '折线图',
  },
  {
    key: 'basic-pie',
    title: '基础饼图',
    group: '饼图',
  },
  {
    key: 'rose-pie',
    title: '玫瑰饼图',
    group: '饼图',
  },
] as DashboardCard[]

const allCardsByGrouped = groupCards(allCards)

const selectedCards = shallowRef([])
watch(cards, value => (selectedCards.value = value.map(card => card.key)))
const titleControl = useFormControl(props.title, [
  Validators.required,
  Validators.rangeLength(1, 10),
])

const onSelectedCardsChange = (keys: string[]) => {
  const currKeys = cards.value.map(card => card.key)
  // 只考虑新增或者删除单个的情况，不考虑既有新增又有删除。
  const isAdd = keys.length > currKeys.length
  const targetKey = isAdd
    ? keys.find(type => !currKeys.includes(type))
    : currKeys.find(type => !keys.includes(type))

  if (!targetKey) {
    return
  }

  if (isAdd) {
    const newCard = getNewCard(
      cards.value,
      allCards.find(card => card.key === targetKey) as DashboardCard,
    )
    cards.value = [...cards.value, newCard]
  } else {
    cards.value = cards.value.filter(card => card.key !== targetKey)
  }

  // selectedCards 采用受控模式
  selectedCards.value = keys
}

const onCancel = () => {
  emits('cancel', props.isAdd ? undefined : key)
}
const onSave = () => {
  if (!titleControl.valid.value) {
    titleControl.markAsDirty()
    return
  }

  saveCards([...cards.value])

  emits('save', {
    key: props.isAdd ? undefined : key,
    title: titleControl.getValue(),
  } as DashboardPanel)
}
const onUpdateCards = (value: DashboardCard[]) => {
  cards.value = value
}

onMounted(() => {
  if (props.isAdd) {
    inputRef.value.focus()
  }
})
</script>
<template>
  <IxLayout>
    <IxLayoutHeader>
      <div class="panel-header">
        <IxFormItem messageTooltip>
          <IxInput ref="inputRef" :control="titleControl" placeholder="请输入面板名称"></IxInput>
        </IxFormItem>
        <IxButtonGroup :gap="16">
          <IxButton mode="primary" @click="onSave">保存</IxButton>
          <IxPopconfirm
            :title="`确定取消当前面板的编辑？`"
            content="取消后，目前编辑的内容将无法保存"
            trigger="click"
            @ok="onCancel"
          >
            <IxButton>取消</IxButton>
          </IxPopconfirm>
        </IxButtonGroup>
      </div>
    </IxLayoutHeader>
    <IxLayoutSider>
      <IxCheckboxGroup
        block
        :gap="12"
        vertical
        :value="selectedCards"
        @update:value="onSelectedCardsChange"
      >
        <template v-for="(cards, title) of allCardsByGrouped" :key="title">
          <span class="panel-sider-title">{{ title }}</span>
          <IxCheckbox v-for="card of cards" :key="card.key">{{ card.title }}</IxCheckbox>
        </template>
      </IxCheckboxGroup>
    </IxLayoutSider>
    <IxLayoutContent>
      <grid-layout
        :layout="cards"
        :colNum="3"
        :margin="[12, 12]"
        :rowHeight="48"
        @update:layout="onUpdateCards"
      >
        <template #gridItemContent="{ item }">
          <Card :key="item.key" :title="item.title"></Card>
        </template>
      </grid-layout>
    </IxLayoutContent>
  </IxLayout>
</template>

<style scoped lang="less">
.ix-layout-header {
  background-color: var(--ix-background-color);

  z-index: 1;
  .panel-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 8px 16px;
    border-bottom: 1px solid var(--ix-border-color);
  }
}

.ix-layout-sider {
  padding: 8px 16px;
  background-color: var(--ix-background-color);

  .panel-sider-title {
    display: inline-block;
    margin-top: 8px;
    color: var(--ix-text-color-info);
  }
}

:deep(.vue-grid-item.vue-grid-placeholder) {
  background: var(--ix-background-color-deep);
  opacity: 1;
}
</style>
