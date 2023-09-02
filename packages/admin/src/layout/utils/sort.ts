import { isNil } from 'lodash-es'

import type { NavRecord } from '@/types'

export function changeRecordOrder(
  ids: string[],
  sourceId: string,
  targetId: string,
  type: 'after' | 'before',
): string[] {
  const [sourceIdx, _targetIdx] = [sourceId, targetId].map(id => ids.findIndex(_id => _id === id))

  const targetIdx = type === 'before' ? _targetIdx : _targetIdx + 1

  const tempIds = [...ids]

  tempIds.splice(targetIdx, 0, sourceId as string)
  tempIds.splice(targetIdx > sourceIdx ? sourceIdx : sourceIdx + 1, 1)

  return tempIds
}

// 计算节点排序
export function calculateNavRecordOrder(
  navRecords: NavRecord[],
  orders: Record<string, number>,
  sourceId: string,
  targetId: string,
  placement: 'before' | 'after',
): Record<string, number> {
  // 不存在排序权重的节点，补充权重，生成全量的排序权重
  const mergedOrders = navRecords.reduce((res, record, index) => {
    res[record.id] = orders[record.id] ?? index
    return res
  }, {} as Record<string, number>)

  // 如果执行排序的两个节点不存在或者id相等，直接返回
  if (isNil(mergedOrders[sourceId]) || isNil(mergedOrders[targetId]) || sourceId === targetId) {
    return mergedOrders
  }

  // 转数组排序
  const newOrders = Object.entries(mergedOrders).sort(([, order1], [, order2]) => order1 - order2)

  const sourceIdx = newOrders.findIndex(order => order[0] === sourceId)
  const targetIdx = newOrders.findIndex(order => order[0] === targetId)

  // 计算新权重
  if (placement === 'before') {
    newOrders[sourceIdx][1] = newOrders[targetIdx][1] - 1

    for (let idx = targetIdx - 1; idx >= 0; idx--) {
      if (idx !== sourceIdx) {
        newOrders[idx][1] -= 1
      }
    }
  } else {
    newOrders[sourceIdx][1] = newOrders[targetIdx][1] + 1

    for (let idx = targetIdx + 1; idx < newOrders.length; idx++) {
      if (idx !== sourceIdx) {
        newOrders[idx][1] += 1
      }
    }
  }

  // 计算后排序
  newOrders.sort(([, order1], [, order2]) => order1 - order2)

  // 返回重新排序后并经过整理的权重
  return newOrders.reduce((res, order, index) => {
    res[order[0]] = index
    return res
  }, {} as Record<string, number>)
}
