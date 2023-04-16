import { reactive, type Ref, ref } from 'vue'

import { type TablePagination } from '@idux/components'
import { type ProTableColumn } from '@idux/pro'

export interface TableData {
  key: number
  name: string
  mac: string
  type: string
  status: string
  os: string
  ip: string
  group: string
}

export interface QueryParams {
  pageSize: number
  pageIndex: number
  searchValue: string
}

export function useTable() {
  const pagination = reactive<TablePagination>({
    showSizeChanger: true,
    showQuickJumper: true,
    pageSize: 20,
    pageIndex: 1,
    onChange: (pageIndex, pageSize) => {
      if (pagination.pageSize !== pageSize) {
        pagination.pageIndex = 1
        pagination.pageSize = pageSize
      } else {
        pagination.pageIndex = pageIndex
      }
    },
  })

  const columns: Ref<ProTableColumn<TableData>[]> = ref([
    {
      type: 'selectable',
    },
    {
      type: 'indexable',
      title: '序号',
    },
    {
      title: 'IP地址',
      dataKey: 'ip',
      changeFixed: false,
    },
    {
      title: '主机名',
      dataKey: 'name',
      minWidth: 100,
      maxWidth: 300,
      resizable: true,
      ellipsis: true,
    },
    {
      title: 'mac地址',
      dataKey: 'mac',
      changeFixed: false,
    },
    {
      title: '操作系统',
      dataKey: 'os',
      changeFixed: false,
    },
    {
      title: '资产类型',
      dataKey: 'type',
      changeFixed: false,
      minWidth: 100,
      maxWidth: 300,
      resizable: true,
    },
    {
      title: '终端接入状态',
      dataKey: 'status',
      changeFixed: false,
      customCell: 'status',
      minWidth: 100,
      maxWidth: 300,
      resizable: true,
    },
    {
      title: '资产组',
      dataKey: 'group',
      changeFixed: false,
    },
  ])

  return {
    pagination,
    columns,
  }
}
