import {
  BarChart,
  BarSeriesOption,
  LineChart,
  LineSeriesOption,
  PieChart,
  PieSeriesOption,
} from 'echarts/charts'
import {
  DatasetComponent,
  DatasetComponentOption,
  GridComponent,
  GridComponentOption,
  LegendComponent,
  TitleComponent,
  TitleComponentOption,
  TooltipComponent,
  TooltipComponentOption,
  TransformComponent,
} from 'echarts/components'
import * as echarts from 'echarts/core'
import { LabelLayout, UniversalTransition } from 'echarts/features'
import { CanvasRenderer } from 'echarts/renderers'

import { useEcharts } from './useEcharts'

export type ECOption = echarts.ComposeOption<
  | BarSeriesOption
  | LineSeriesOption
  | PieSeriesOption
  | TitleComponentOption
  | TooltipComponentOption
  | GridComponentOption
  | DatasetComponentOption
>

echarts.use([
  TitleComponent,
  TooltipComponent,
  GridComponent,
  DatasetComponent,
  TransformComponent,
  BarChart,
  LineChart,
  PieChart,
  LabelLayout,
  LegendComponent,
  UniversalTransition,
  CanvasRenderer,
])

export { echarts, useEcharts }
