import type { DefineComponent, HTMLAttributes, PropType, Component } from 'vue-demi'

import type { ExtractPublicPropTypes, ExtractInnerPropTypes, MaybeArray } from '@idux/cdk'
import type { SortableOptions } from 'sortablejs'

export const dndSortableProps = {
  componentProps: { type: Object },
  container: { type: String, default: undefined },
  dataSource: { type: Array as PropType<any[]>, required: true },
  getKey: {
    type: [String, Function] as PropType<string | ((data: any) => any)>,
    default: 'key',
  },
  tag: { type: [String, Object] as PropType<string | Component>, default: 'div' },

  onChange: [Function, Array] as PropType<
    MaybeArray<(data: any, options: DndSortableChangeOptions) => void>
  >,
} as const

export type DndSortableInnerProps = ExtractInnerPropTypes<typeof dndSortableProps>
export type DndSortableProps = ExtractPublicPropTypes<typeof dndSortableProps> &
  Omit<SortableOptions, 'onChange' | 'onMove'>
export type DndSortableComponent = DefineComponent<
  Omit<HTMLAttributes, keyof DndSortableProps> & DndSortableProps
>
export type DndSortableInstance = InstanceType<DefineComponent<DndSortableProps>>

export interface DndSortableChangeOptions {
  type: 'add' | 'remove' | 'update'
  data: any
  oldIndex?: number
  newIndex?: number
}
