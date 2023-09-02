import {
  inject,
  computed,
  defineComponent,
  type CSSProperties,
  watchEffect,
  type ComputedRef,
} from 'vue'
import { shallowRef } from 'vue'

import {
  type DnDEvent,
  type DraggableOptions,
  type BoundaryType,
  type ResizableEvent,
  type ResizableOptions,
  CdkResizableHandle,
  useResizable,
  useDraggable,
} from '@idux/cdk'
import { useKey } from '@idux/cdk'
import { merge } from 'lodash-es'

import { gridLayoutToken } from './token'
import {
  gridItemProps,
  type GridItemInnerProps,
  type GridLayoutInnerProps,
  type Position,
} from './types'

export default defineComponent({
  name: 'GridItem',
  props: gridItemProps,
  setup(props, { slots }) {
    const {
      props: parentProps,
      mergedContainerWidth,
      mounted,
      handleDragStart,
      handleDrag,
      handleDragEnd,
      handleResizeStart,
      handleResize,
      handleResizeEnd,
    } = inject(gridLayoutToken)!

    const mergedBoundary = computed(() => props.boundary ?? parentProps.boundary)
    const mergedDraggable = computed(() => props.draggable ?? parentProps.draggable)
    const mergedDraggableHandle = computed(
      () => props.draggableHandle ?? parentProps.draggableHandle,
    )
    const mergedResizable = computed(() => props.resizable ?? parentProps.resizable)
    const mergedResizeHandles = computed(() => props.resizeHandles ?? parentProps.resizeHandles)
    const mergedUseCSSTransforms = computed(() => mounted.value && parentProps.useCssTransforms)

    const key = useKey()
    const elementRef = shallowRef<HTMLElement>()

    const onDragStart: DnDEvent = evt => handleDragStart(evt, key)
    const onDrag: DnDEvent = (evt, position) => {
      if (!position) {
        return
      }
      const { x: left, y: top } = position

      const { w, h } = props
      const { x, y } = calcXY(parentProps, mergedContainerWidth.value, top, left, w, h)
      handleDrag(evt, key, { x, y })
    }
    const onDragEnd: DnDEvent = evt => handleDragEnd(evt, key)
    const draggableHandle = computed(() => {
      const handle = mergedDraggableHandle.value
      return handle ? elementRef.value?.querySelector(handle) : undefined
    })

    const dragOption: DraggableOptions = {}
    watchEffect(() =>
      merge(dragOption, {
        backend: 'pointer',
        boundary: mergedBoundary.value,
        handle: draggableHandle,
        onDragStart,
        onDrag,
        onDragEnd,
      }),
    )
    const { dragging, position: dragPosition } = useDraggable(elementRef, dragOption)

    const onResizeStart: ResizableEvent = (_, evt) => handleResizeStart(evt, key)
    const onResizing: ResizableEvent = (position, evt) => {
      const { width, height } = position
      const { x, y, maxW, maxH, minW, minH } = props
      const { w, h } = calcWH(parentProps, mergedContainerWidth.value, width, height, x, y)
      handleResize(evt, key, {
        w: clamp(w, Math.max(minW, 1), Math.min(maxW, defaultCols - x)),
        h: clamp(h, minH, maxH),
      })
    }
    const onResizeEnd: ResizableEvent = (_, evt) => handleResizeEnd(evt, key)
    const resizeOption: ResizableOptions = {}
    watchEffect(() =>
      merge(
        resizeOption,
        calcResizeOption(
          props,
          parentProps,
          mergedContainerWidth,
          mergedBoundary,
          onResizeStart,
          onResizing,
          onResizeEnd,
        ),
      ),
    )
    const { resizing, position: resizePosition } = useResizable(elementRef, resizeOption)

    const position = computed(() =>
      calcPosition(
        props,
        parentProps,
        mergedContainerWidth.value,
        dragging.value ? dragPosition.value : undefined,
        resizing.value ? resizePosition.value : undefined,
      ),
    )

    const classes = computed(() => {
      return {
        'x-grid-item': true,
        'x-grid-item-css-transforms': mergedUseCSSTransforms.value,
        'x-grid-item-dragging': !!dragging.value,
        'x-grid-item-resizing': !!resizing.value,
        'x-grid-item-static': props.static,
      }
    })

    const style = computed(() => {
      const currPos = position.value
      if (mergedUseCSSTransforms.value) {
        return getTransformStyle(currPos)
      }

      const style = getNormalStyle(currPos)
      if (!mounted.value) {
        const width = mergedContainerWidth.value
        style.left = perc(currPos.left / width)
        style.width = perc(currPos.width / width)
      }
      return style
    })

    return () => {
      return (
        <div ref={elementRef} class={classes.value} style={style.value}>
          {slots.default && slots.default()}
          {mergedResizable.value &&
            mergedResizeHandles.value.map(placement => (
              <CdkResizableHandle key={placement} placement={placement} />
            ))}
        </div>
      )
    }
  },
})

function calcResizeOption(
  props: GridItemInnerProps,
  parentProps: GridLayoutInnerProps,
  mergedContainerWidth: ComputedRef<number>,
  mergedBoundary: ComputedRef<BoundaryType>,
  onResizeStart: ResizableEvent,
  onResizing: ResizableEvent,
  onResizeEnd: ResizableEvent,
) {
  const containerWidth = mergedContainerWidth.value
  const { x, minW, minH, maxW, maxH } = props
  const min = calcPosition({ x: 0, y: 0, w: minW, h: minH }, parentProps, containerWidth)
  const max = calcPosition({ x: 0, y: 0, w: maxW, h: maxH }, parentProps, containerWidth)
  const { width: maxWidth } = calcPosition(
    { x: 0, y: 0, w: defaultCols - x, h: 0 },
    parentProps,
    containerWidth,
  )
  return {
    boundary: mergedBoundary.value,
    minWidth: min.width,
    minHeight: min.height,
    maxWidth: Math.min(max.width, maxWidth),
    maxHeight: max.height,
    onResizeStart,
    onResizing,
    onResizeEnd,
  } as ResizableOptions
}

function calcPosition(
  { x, y, w, h }: { x: number; y: number; w: number; h: number },
  { margin, padding, rowHeight }: GridLayoutInnerProps,
  containerWidth: number,
  dragging?: { x: number; y: number },
  resizing?: { width: number; height: number },
): Position {
  const colWidth = calcGridColWidth(containerWidth, margin, padding)
  const out = {} as Position

  // If resizing, use the exact width and height as returned from resizing callbacks.
  if (resizing) {
    out.width = Math.round(resizing.width)
    out.height = Math.round(resizing.height)
  } else {
    // Otherwise, calculate from grid units.
    out.width = calcGridItemWHPx(w, colWidth, margin[0])
    out.height = calcGridItemWHPx(h, rowHeight, margin[1])
  }

  // If dragging, use the exact width and height as returned from dragging callbacks.
  if (dragging) {
    out.top = Math.round(dragging.y)
    out.left = Math.round(dragging.x)
  } else {
    // Otherwise, calculate from grid units.
    out.top = Math.round((rowHeight + margin[1]) * y + padding[1])
    out.left = Math.round((colWidth + margin[0]) * x + padding[0])
  }

  return out
}

const defaultCols = 24

function calcGridColWidth(containerWidth: number, margin: number[], padding: number[]): number {
  return (containerWidth - margin[0] * (defaultCols - 1) - padding[0] * 2) / defaultCols
}

function calcGridItemWHPx(gridUnits: number, colOrRowSize: number, marginPx: number): number {
  // 0 * Infinity === NaN, which causes problems with resize contraints
  if (!Number.isFinite(gridUnits)) return gridUnits
  return Math.round(colOrRowSize * gridUnits + Math.max(0, gridUnits - 1) * marginPx)
}

function calcXY(
  { margin, maxRows, padding, rowHeight }: GridLayoutInnerProps,
  containerWidth: number,
  top: number,
  left: number,
  w: number,
  h: number,
): { x: number; y: number } {
  const colWidth = calcGridColWidth(containerWidth, margin, padding)

  // left = colWidth * x + margin * (x + 1)
  // l = cx + m(x+1)
  // l = cx + mx + m
  // l - m = cx + mx
  // l - m = x(c + m)
  // (l - m) / (c + m) = x
  // x = (left - margin) / (coldWidth + margin)
  let x = Math.round((left - margin[0]) / (colWidth + margin[0]))
  let y = Math.round((top - margin[1]) / (rowHeight + margin[1]))

  // Capping
  x = clamp(x, 0, defaultCols - w)
  y = clamp(y, 0, maxRows - h)
  return { x, y }
}

function calcWH(
  { margin, maxRows, padding, rowHeight }: GridLayoutInnerProps,
  containerWidth: number,
  width: number,
  height: number,
  x: number,
  y: number,
): { w: number; h: number } {
  const colWidth = calcGridColWidth(containerWidth, margin, padding)

  // width = colWidth * w - (margin * (w - 1))
  // ...
  // w = (width + margin) / (colWidth + margin)
  let w = Math.round((width + margin[0]) / (colWidth + margin[0]))
  let h = Math.round((height + margin[1]) / (rowHeight + margin[1]))

  // Capping
  w = clamp(w, 0, defaultCols - x)
  h = clamp(h, 0, maxRows - y)
  return { w, h }
}

// Similar to _.clamp
function clamp(num: number, lowerBound: number, upperBound: number): number {
  return Math.max(Math.min(num, upperBound), lowerBound)
}

function getTransformStyle({ top, left, width, height }: Position): CSSProperties {
  // Replace unitless items with px
  const translate = `translate(${left}px,${top}px)`
  return {
    transform: translate,
    WebkitTransform: translate,
    MozTransform: translate,
    msTransform: translate,
    OTransform: translate,
    width: `${width}px`,
    height: `${height}px`,
    position: 'absolute',
  } as const
}

function getNormalStyle({ top, left, width, height }: Position): CSSProperties {
  return {
    top: `${top}px`,
    left: `${left}px`,
    width: `${width}px`,
    height: `${height}px`,
    position: 'absolute',
  }
}

function perc(num: number): string {
  return num * 100 + '%'
}
