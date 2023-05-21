import type { PropType } from 'vue'

import type {
  ExtractPublicPropTypes,
  ExtractInnerPropTypes,
  MaybeArray,
  VKey,
  ResizableHandlePlacement,
  BoundaryType,
} from '@idux/cdk'

export const gridLayoutProps = {
  allowOverlap: { type: Boolean, default: false },
  autoSize: { type: Boolean, default: true },
  boundary: { type: [String, Object] as PropType<BoundaryType>, default: 'parent' },
  collisible: { type: Boolean, default: true },
  compact: { type: String as PropType<CompactType>, default: 'horizontal' },
  dataSource: { type: Array as PropType<GridData[]>, required: true },
  draggable: { type: Boolean, default: true },
  draggableCancel: { type: String, default: undefined },
  draggableHandle: { type: String, default: undefined },
  droppable: { type: Boolean, default: false },
  droppingItem: { type: Object as PropType<GridData>, default: undefined },
  margin: { type: Array as PropType<number[]>, default: () => [16, 16] },
  maxRows: { type: Number, default: Infinity },
  padding: { type: Array as PropType<number[]>, default: () => [16, 16] },
  resizable: { type: Boolean, default: true },
  resizeHandles: {
    type: Array as PropType<ResizableHandlePlacement[]>,
    default: () => ['bottomEnd'],
  },
  rowHeight: { type: Number, default: 100 },
  transformScale: { type: Number, default: 1 },
  useCssTransforms: { type: Boolean, default: true },
  useStyleCursor: { type: Boolean, default: true },

  onDataChange: [Function, Array] as PropType<MaybeArray<(data: GridData[]) => void>>,
  onDragStart: [Function, Array] as PropType<MaybeArray<DragDropEvent>>,
  onDrag: [Function, Array] as PropType<MaybeArray<DragDropEvent>>,
  onDragOver: [Function, Array] as PropType<MaybeArray<DragDropEvent>>,
  onDragEnd: [Function, Array] as PropType<MaybeArray<DragDropEvent>>,
  onDrop: [Function, Array] as PropType<MaybeArray<DragDropEvent>>,
  onResizeStart: [Function, Array] as PropType<MaybeArray<ResizeEvent>>,
  onResize: [Function, Array] as PropType<MaybeArray<ResizeEvent>>,
  onResizeEnd: [Function, Array] as PropType<MaybeArray<ResizeEvent>>,
} as const

export type GridLayoutInnerProps = ExtractInnerPropTypes<typeof gridLayoutProps>
export type GridLayoutProps = ExtractPublicPropTypes<typeof gridLayoutProps>

export const gridItemProps = {
  w: { type: Number, required: true },
  h: { type: Number, required: true },
  x: { type: Number, required: true },
  y: { type: Number, required: true },

  minW: { type: Number, default: 1 },
  minH: { type: Number, default: 1 },
  maxW: { type: Number, default: Infinity },
  maxH: { type: Number, default: Infinity },

  boundary: { type: [String, Object] as PropType<BoundaryType>, default: undefined },
  draggable: { type: Boolean, default: undefined },
  draggableCancel: { type: String, default: undefined },
  draggableHandle: { type: String, default: undefined },
  resizable: { type: Boolean, default: undefined },
  resizeHandles: { type: Array as PropType<ResizableHandlePlacement[]>, default: undefined },
  static: { type: Boolean, default: false },
} as const

export type GridItemInnerProps = ExtractInnerPropTypes<typeof gridItemProps>
export type GridItemProps = ExtractPublicPropTypes<typeof gridItemProps>

export interface GridData extends GridItemProps {
  key: VKey
}

export interface Position {
  left: number
  top: number
  width: number
  height: number
}

export type CompactType = 'horizontal' | 'vertical'

export type DragDropEvent = (option: {
  event: Event
  data?: GridData
  dataSource?: GridData[]
}) => void

export type ResizeEvent = (option: {
  event: Event
  data?: GridData
  dataSource?: GridData[]
}) => void
