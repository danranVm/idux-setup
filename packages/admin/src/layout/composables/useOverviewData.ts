import { ref, computed, inject } from 'vue'

import { useResizeObserver } from '@idux/cdk/resize'
import { useState, filterTree, flattenTree } from '@idux/cdk/utils'
import { isNil } from 'lodash-es'

import type { OverviewDataContext, OverviewDataBlock, OverviewData } from '../types'

import { appContextToken } from '@/context'
import type { NavRecord } from '@/types'

export const overviewColumnWidth = 247.5
export const overviewColumnGap = 32

export function useOverviewData(): OverviewDataContext {
  const { filteredNavRecords } = inject(appContextToken)!
  const overviewContentRef = ref<HTMLElement>()
  const [columnCnt, setColumnCnt] = useState<number>(0)
  const [searchValue, setSearchValue] = useState<string | undefined>(undefined)

  useResizeObserver(overviewContentRef, ({ contentRect }) => {
    const { width } = contentRect
    setColumnCnt(calcColumnCnt(width))
  })

  const filteredRecords = computed(() => {
    if (!searchValue.value) {
      return filteredNavRecords.value
    }

    return filterTree(
      filteredNavRecords.value,
      'children',
      (record, parents) =>
        record.title?.includes(searchValue.value) ||
        parents.some(parent => parent.title?.includes(searchValue.value)),
    )
  })

  const overviewColumns = computed(() => {
    if (!columnCnt.value) {
      return []
    }

    const blocks = converNavRecordToBlocks(filteredRecords.value)

    return alocateColumns(columnCnt.value, blocks)
  })

  return {
    overviewColumns,
    overviewContentRef,
    searchValue,
    setSearchValue,
  }
}

// 根据列宽、间距和容器宽度计算列数
function calcColumnCnt(contentWidth: number) {
  // overviewColumnWidth * n + overviewColumnGap * (n - 1) = contentWidth
  return Math.floor((contentWidth + overviewColumnGap) / (overviewColumnWidth + overviewColumnGap))
}

// 瀑布流布局算法， 将全部的数据处理成带有权重（itemCount）的数据
function converNavRecordToBlocks(navRecords: NavRecord[]): OverviewDataBlock[] {
  return navRecords.map<OverviewDataBlock>(record => {
    let itemCount = 0
    let data: OverviewData[]

    if (record.children?.length) {
      data = record.children.map(child => {
        if (!child.children?.length) {
          itemCount += 1
          return { ...child, type: 'item' as const }
        }

        // 多余的层级会平展处理
        const children = flattenTree(
          child.children,
          'children',
          item => ({ ...item, type: 'item' as const }),
          true,
        )
        itemCount += children.length

        return {
          ...child,
          type: 'group' as const,
          children,
        }
      })
    } else {
      itemCount = 1
      data = [{ ...record, type: 'item' as const }]
    }

    return {
      title: record.title,
      itemCount,
      data,
    }
  })
}

// 瀑布流布局算法，根据block的权重，依次排列到当前容量最大的列中
function alocateColumns(columnCnt: number, blocks: OverviewDataBlock[]): OverviewDataBlock[][] {
  const columnItemCnts = new Array(columnCnt).fill(0)
  const columns = Array.from(new Array(columnCnt)).map(() => []) as OverviewDataBlock[][]

  let availableColumnIdx: number = 0

  // 计算当前优先级最高的列，即下一个元素需要放置的列
  // 这里的算法可以根据实际情况修改，或者改变blocks的初始排序达到想要的效果
  const calcAvailableColumn = () => {
    let minCnt: number | undefined
    let colIdx: number
    columnItemCnts.forEach((cnt, idx) => {
      if (isNil(minCnt) || minCnt > cnt) {
        minCnt = cnt
        colIdx = idx
      }
    })

    availableColumnIdx = colIdx
  }

  blocks.forEach(block => {
    columns[availableColumnIdx].push(block)
    columnItemCnts[availableColumnIdx] += block.itemCount + 1

    calcAvailableColumn()
  })

  return columns
}
