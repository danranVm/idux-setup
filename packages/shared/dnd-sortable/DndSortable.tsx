import {
  h,
  computed,
  defineComponent,
  isVue2,
  onMounted,
  onUpdated,
  shallowRef,
  onBeforeMount,
  watch,
  type VNodeChild,
} from 'vue-demi'

import { flatMap } from 'lodash-es'
import Sortable from 'sortablejs'

import { useDataSource } from './composables/useDataSource'
import { useEvents } from './composables/useEvents'
import { useGetKey } from './composables/useGetKey'
import { dndSortableProps } from './types'
import { mergeAttrs, mergeOptions, resolveComponent, setContext } from './utils'
import { convertElement } from '../utils'

export default defineComponent({
  name: 'DndSortable',
  inheritAttrs: false,
  props: dndSortableProps,
  emits: ['change'],
  //@ts-ignore
  setup(props, { attrs, slots, refs, listeners, emit }) {
    const elementRef = shallowRef<HTMLElement>()
    const containerRef = computed(() => {
      const { container } = props
      const element = elementRef.value
      if (!container) {
        return element
      }
      return element ? (element.querySelector(container) as HTMLElement) : undefined
    })
    const sortableRef = shallowRef<Sortable>()
    const childrenRef = shallowRef<VNodeChild[]>([])

    const mergedGetKey = useGetKey(props)
    const dataContext = useDataSource(props, emit)
    const { mergedDataSource } = dataContext
    const events = useEvents(containerRef, dataContext)

    const convertSortable = () => {
      const element = convertElement(containerRef)
      if (!element) {
        return
      }
      const options = mergeOptions(attrs, events, listeners)
      const sortable = sortableRef.value
      if (!sortable) {
        sortableRef.value = new Sortable(element, options)
      } else {
        // @ts-ignore
        Object.keys(options).forEach(key => sortable.option(key, options[key]))
      }
    }

    watch(() => attrs, convertSortable, { deep: true })

    const updateContext = () => {
      const dataSource = mergedDataSource.value
      childrenRef.value.forEach((node, index) =>
        setContext(node, { data: dataSource[index], index }),
      )
    }

    onMounted(() => {
      if (isVue2) {
        elementRef.value = refs.elementRef
      }

      updateContext()
      convertSortable()
    })

    onUpdated(() => updateContext())

    onBeforeMount(() => {
      sortableRef.value?.destroy()
      sortableRef.value = undefined
    })

    return () => {
      try {
        const { isHTMLTag, tag } = resolveComponent(props.tag)
        const mergedAttrs = mergeAttrs(attrs, props.componentProps, {
          ref: isVue2 ? 'elementRef' : elementRef,
        })
        const { item } = slots
        if (item) {
          const dataSource = mergedDataSource.value
          const getKeyFn = mergedGetKey.value
          const children = flatMap(dataSource, (data, index) =>
            item({ data, index }).map(node => {
              node.key = getKeyFn(data)
              if (isVue2) {
                // @ts-ignore
                node.attrs = { 'data-draggable': true, ...node.attrs }
              } else {
                node.props = { 'data-draggable': true, ...node.props }
              }
              return node
            }),
          )
          if (children.length !== dataSource.length) {
            throw new Error('Item slot must have only one child')
          }
          childrenRef.value = children

          return h(tag as any, mergedAttrs, isHTMLTag ? children : () => children)
        }
        const children = slots.default ? slots.default() : undefined
        return h(tag as any, mergedAttrs, isHTMLTag ? children : () => children)
      } catch (err: any) {
        return h('pre', { style: { color: 'red' } }, err?.stack)
      }
    }
  },
})
