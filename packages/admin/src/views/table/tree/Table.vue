<script lang="ts" setup>
import { reactive, toRef, watch } from 'vue'

import { type QueryParams, useTable } from './useTable'

const emit = defineEmits<{
  (e: 'requestDataChange', parmas: QueryParams): void
}>()

const { pagination, columns } = useTable()

const queryParams = reactive({
  pageSize: toRef(pagination, 'pageSize'),
  pageIndex: toRef(pagination, 'pageIndex'),
  searchValue: '',
}) as QueryParams

watch(
  queryParams,
  val => {
    emit('requestDataChange', { ...val })
  },
  {
    deep: true,
  },
)
</script>
<template>
  <IxProTable
    class="tree-table-page common-table"
    :columns="columns"
    :layoutTool="{ searchable: true }"
    :pagination="pagination"
    autoHeight
  >
    <template #header>
      <IxSpace class="mb-2" vertical block>
        <IxRow justify="space-between" align="center" :gutter="8">
          <IxCol>
            <IxButtonGroup :gap="8">
              <IxButton mode="primary">新增</IxButton>
              <IxButton disabled>删除</IxButton>
            </IxButtonGroup>
          </IxCol>
          <IxCol flex="auto" :offset="6">
            <IxInput
              class="search-input"
              placeholder="请搜索"
              v-model:value="queryParams.searchValue"
            >
              <template #addonAfter>
                <IxIcon name="search" />
              </template>
            </IxInput>
          </IxCol>
          <IxCol>
            <IxButtonGroup :gap="8" shape="square">
              <IxTooltip title="导出">
                <IxButton icon="export"></IxButton>
              </IxTooltip>
              <IxTooltip title="刷新">
                <IxButton
                  icon="reload"
                  @click="emit('requestDataChange', { ...queryParams })"
                ></IxButton>
              </IxTooltip>
            </IxButtonGroup>
          </IxCol>
        </IxRow>
      </IxSpace>
    </template>
    <template #status="{ value }">
      <a>
        <IxSpace :size="6">
          <IxIcon name="link"></IxIcon>
          {{ value }}
        </IxSpace>
      </a>
    </template>
  </IxProTable>
</template>
