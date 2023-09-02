import { computed, shallowRef } from 'vue'

import { defineStore } from 'pinia'

import { Message } from '@/plugins/idux'
import type { AlarmData } from '@/types'

export const useAlarmDataStore = defineStore('alarmData', () => {
  const alarmData = shallowRef<AlarmData[]>([])
  const loading = shallowRef<boolean>(false)
  const alarmDataCount = computed(() => alarmData.value.length)

  const setAlarmData = (data: AlarmData[]) => {
    alarmData.value = data
  }
  const setLoading = (_loading: boolean) => {
    loading.value = _loading
  }

  const loadAlarmData = async () => {
    setLoading(true)

    await sleep(1000)
    setAlarmData(
      Array.from(new Array(5))
        .map((_, idx) => {
          return [
            {
              key: `${idx}-1`,
              contents: ['基线检查“222”已检查完成'],
              time: '2023-05-11 22:54:45',
            },
            {
              key: `${idx}-2`,
              contents: ['基线检查“222”已检查完成'],
              time: '2023-05-11 22:32:42',
            },
            {
              key: `${idx}-2`,
              contents: [
                '共40个节点镜像扫描已完成，共花费4分钟',
                '发现 16 个高危镜像 2 个中危镜像',
              ],
              time: '2023-05-09 19:18:47',
            },
            {
              key: `${idx}-2`,
              contents: ['共23个节点镜像扫描已完成，共花费3分钟', '发现 9 个高危镜像 2 个中危镜像'],
              time: '2023-05-09 18:22:47',
            },
            {
              key: `${idx}-2`,
              contents: ['基线检查“一个自定义任务”已检查完成'],
              time: '2023-05-09 18:22:47',
            },
          ]
        })
        .flat(),
    )

    setLoading(false)
  }

  const setAlarmRead = async (data: AlarmData) => {
    setLoading(true)

    await sleep(500)
    setAlarmData(alarmData.value.filter(item => item.key !== data.key))
    Message.success('设置已读成功：' + data.key)

    setLoading(false)
  }

  const setAllAlarmRead = async () => {
    setLoading(true)

    await sleep(500)
    setAlarmData([])
    Message.success('设置全部已读成功')

    setLoading(false)
  }

  return {
    loading,
    alarmData,
    alarmDataCount,
    loadAlarmData,
    setAlarmRead,
    setAllAlarmRead,
  }
})

function sleep(duration: number) {
  return new Promise(resolve => setTimeout(resolve, duration))
}
