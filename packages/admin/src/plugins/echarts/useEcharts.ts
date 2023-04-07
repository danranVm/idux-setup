import { type Ref, onBeforeUnmount, watch } from 'vue'

import { useResizeObserver } from '@idux/cdk'
import { type ECharts } from 'echarts/core'


import { echarts, type ECOption } from './index'

export function useEcharts(
  dom: Ref<HTMLElement | undefined>,
  opts?: ECOption,
  initCallBack?: (echartInstance: ECharts | undefined) => void,
): {
  setOptions: (opts: ECOption) => void
} {
  let echartInstance: ECharts | undefined

  const setOptions = (opts: ECOption) => {
    echartInstance?.setOption(opts)
  }

  const stopResizeObserver = useResizeObserver(dom, () => {
    echartInstance?.resize()
  })

  watch(dom, el => {
    if (el) {
      echartInstance = echarts.init(el)
      opts && setOptions(opts)
      initCallBack && initCallBack(echartInstance)
    }
  })

  if (opts) {
    watch(
      () => opts,
      newOpts => {
        setOptions(newOpts)
      },
      {
        deep: true,
      },
    )
  }

  onBeforeUnmount(() => {
    stopResizeObserver()
  })

  return {
    setOptions,
  }
}
