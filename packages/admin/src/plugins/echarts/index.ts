import {
  BarChart,
  type BarSeriesOption,
  LineChart,
  type LineSeriesOption,
  PieChart,
  type PieSeriesOption,
} from 'echarts/charts'
import {
  DatasetComponent,
  type DatasetComponentOption,
  GridComponent,
  type GridComponentOption,
  LegendComponent,
  TitleComponent,
  type TitleComponentOption,
  TooltipComponent,
  type TooltipComponentOption,
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
