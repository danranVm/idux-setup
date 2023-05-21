import type { ComputedRef, InjectionKey, Ref } from 'vue'

import type { DataSourceContext } from './composables/useDataSource'
import type { DraggableContext } from './composables/useDraggable'
import type { ResizableContext } from './composables/useResizable'
import type { GridLayoutInnerProps } from './types'

export interface GridLayoutContext extends DataSourceContext, DraggableContext, ResizableContext {
  props: GridLayoutInnerProps
  mergedContainerWidth: ComputedRef<number>
  mounted: Ref<boolean>
}

export const gridLayoutToken: InjectionKey<GridLayoutContext> = Symbol('GridLayout')
