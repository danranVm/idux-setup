import { h, reactive, Ref, ref } from 'vue'


import { IxIcon, IxSpace, IxTag, TablePagination } from '@idux/components'
import { ProTableColumn } from '@idux/pro'
import { format } from 'date-fns'

export interface TableData {
  key: number
  time: number
  name: string
  grade: string
  tags: string[]
  classification1: string
  classification2: string
  classification3: string
  stage: string
  ip: string
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
      title: '最近发生时间',
      dataKey: 'time',
      changeFixed: false,
      customCell: ({ value }: { value: number }) => format(value, 'yyyy-MM-dd HH:mm:ss'),
      sortable: {
        sorter: (curr, next) => curr.time - next.time,
      },
    },
    {
      title: '告警名称',
      dataKey: 'name',
      minWidth: 150,
      maxWidth: 300,
      resizable: true,
      ellipsis: true,
    },
    {
      title: '告警等级',
      dataKey: 'grade',
      changeFixed: false,
      width: 90,
      customCell: ({ value }: { value: 'middle' | 'high' }) => {
        const grade = {
          middle: {
            class: 'middle',
            text: '中危',
          },
          high: {
            class: 'high',
            text: '高危',
          },
          serious: {
            class: 'serious',
            text: '严重',
          },
        }
        return h(
          'div',
          { class: ['alarm-tag', grade[value].class] },
          { default: () => grade[value].text },
        )
      },
    },
    {
      title: '标签',
      dataKey: 'tags',
      changeFixed: false,
      customCell: ({ value }: { value: string[] }) => {
        const showTags = value.slice(0, 2).map((tag: string) => {
          return h(IxTag, {}, { default: () => tag })
        })

        return [
          ...showTags,
          value.length > 2 ? h(IxTag, {}, { default: () => `+${value.length - 2}` }) : null,
        ]
      },
    },
    {
      title: '告警一级分类',
      dataKey: 'classification1',
      changeFixed: false,
    },
    {
      title: '告警二级分类',
      dataKey: 'classification2',
      changeFixed: false,
    },
    {
      title: '告警三级分类',
      dataKey: 'classification3',
      changeFixed: false,
    },
    {
      title: '告警阶段',
      dataKey: 'stage',
      changeFixed: false,
    },
    {
      title: '源IP',
      dataKey: 'ip',
      changeFixed: false,
      ellipsis: true,
      customCell: ({ value }: { value: string }) =>
        h(
          IxSpace,
          { size: 4 },
          {
            default: () => [
              [h(IxIcon, { name: 'desktop' }), h('span', {}, { default: () => value })],
            ],
          },
        ),
    },
  ])

  return {
    pagination,
    columns,
  }
}
