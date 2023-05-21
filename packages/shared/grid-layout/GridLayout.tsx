import { defineComponent, shallowRef, computed, provide, onMounted } from 'vue'

import { useState, flattenNode } from '@idux/cdk'

import GridItem from './GridItem'
import { useContainerSize } from './composables/useContainerSize'
import { useDataSource } from './composables/useDataSource'
import { useDraggable } from './composables/useDraggable'
import { layoutClassName, useDroppable } from './composables/useDroppable'
import { useResizable } from './composables/useResizable'
import { gridLayoutToken } from './token'
import { gridLayoutProps, type GridData } from './types'

export default defineComponent({
  name: 'GridLayout',
  props: gridLayoutProps,
  setup(props, { slots }) {
    const [placeholder, setPlaceholder] = useState<GridData | undefined>(undefined)

    const dataSourceContext = useDataSource(props)
    const { mergedDataSource } = dataSourceContext

    const { containerRef, mergedContainerWidth, mergedContainerHeight } = useContainerSize(
      props,
      mergedDataSource,
    )
    const { dropping, handleDragEnter, handleDragOver, handleDragLeave, handleDrop } = useDroppable(
      props,
      mergedDataSource,
      setPlaceholder,
    )
    const draggableContext = useDraggable(props, dataSourceContext, setPlaceholder)
    const resizableContext = useResizable(props, dataSourceContext, setPlaceholder)

    const mounted = shallowRef(false)

    onMounted(() => {
      mounted.value = true
    })

    provide(gridLayoutToken, {
      props,
      mergedContainerWidth,
      mounted,
      ...dataSourceContext,
      ...draggableContext,
      ...resizableContext,
    })

    const style = computed(() => {
      const containerHeight = mergedContainerHeight.value
      return containerHeight > 0 ? `height: ${containerHeight}px` : undefined
    })

    return () => {
      const { droppable } = props
      const dataSource = mergedDataSource.value
      const droppingData = dropping.value
      const placeholderData = placeholder.value
      const children = flattenNode(slots.default ? slots.default() : [])
      return (
        <div
          ref={containerRef}
          class={layoutClassName}
          style={style.value}
          onDragenter={droppable ? handleDragEnter : undefined}
          onDragover={droppable ? handleDragOver : undefined}
          onDragleave={droppable ? handleDragLeave : undefined}
          onDrop={droppable ? handleDrop : undefined}
        >
          {children.map(child => {
            const { key } = child.props
            const item = dataSource.find(data => data.key === key)
            if (!item) {
              // todo: throw error
              return child
            }
            return <GridItem {...item}>{child}</GridItem>
          })}
          {droppable && droppingData && (
            <GridItem {...droppingData}>
              <div></div>
            </GridItem>
          )}
          {placeholderData && (
            <GridItem
              class="x-grid-item-placeholder"
              {...placeholderData}
              boundary={'parent'}
              draggable={false}
              resizable={false}
            >
              <div></div>
            </GridItem>
          )}
        </div>
      )
    }
  },
})
