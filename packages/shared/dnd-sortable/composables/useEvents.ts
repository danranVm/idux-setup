import { shallowRef, type ComputedRef } from 'vue-demi'

import type { SortableEvent } from 'sortablejs'

import type { DataSourceContext } from './useDataSource'
import { convertElement } from '../../utils'
import { getContext } from '../utils'

export function useEvents(
  elementRef: ComputedRef<HTMLElement | undefined>,
  { mergedDataSource, setDataSource }: DataSourceContext,
) {
  const draggingRef = shallowRef()

  const onStart = (evt: SortableEvent) => {
    draggingRef.value = evt.item
  }

  const onEnd = (_: SortableEvent) => {
    draggingRef.value = undefined
  }

  const onAdd = (evt: SortableEvent) => {
    const context = getContext(evt.item)
    if (!context) {
      return
    }
    const { data } = context
    const parentElement = evt.item.parentElement || convertElement(elementRef)
    removeNode(evt.item)
    const dataSource = [...mergedDataSource.value]
    const newIndex = getDataIndex(parentElement!, evt.newIndex!, dataSource.length)
    dataSource.splice(newIndex, 0, data)
    setDataSource(dataSource, { data, newIndex, type: 'add' })
  }

  const onRemove = (evt: SortableEvent) => {
    const context = getContext(evt.item)
    if (!context) {
      return
    }
    const parentElement = evt.item.parentElement || convertElement(elementRef)
    insertNode(parentElement!, evt.item, evt.oldIndex!)
    if (evt.pullMode === 'clone') {
      removeNode(evt.clone)
      return
    }

    const { index: oldIndex, data } = context
    const dataSource = [...mergedDataSource.value]
    dataSource.splice(oldIndex, 1)
    setDataSource(dataSource, { data, oldIndex, type: 'remove' })
  }

  const onUpdate = (evt: SortableEvent) => {
    const context = getContext(evt.item)
    if (!context) {
      return
    }

    const { index: oldIndex, data } = context
    const parentElement = evt.item.parentElement || convertElement(elementRef)
    removeNode(evt.item)
    insertNode(evt.from, evt.item, evt.oldIndex!)

    const dataSource = [...mergedDataSource.value]
    const newIndex = getDataIndex(parentElement!, evt.newIndex!, dataSource.length)
    dataSource.splice(newIndex, 0, dataSource.splice(oldIndex, 1)[0])
    setDataSource(dataSource, { data, oldIndex, newIndex, type: 'update' })
  }

  return { onStart, onEnd, onAdd, onRemove, onUpdate }
}

function removeNode(node: HTMLElement) {
  if (node.parentElement !== null) {
    node.parentElement.removeChild(node)
  }
}

function insertNode(parentElement: HTMLElement, node: HTMLElement, position: number) {
  const targetNode =
    position === 0 ? parentElement.children[0] : parentElement.children[position - 1].nextSibling
  parentElement.insertBefore(node, targetNode)
}

function getDataIndex(parentElement: HTMLElement, domIndex: number, dataLength: number) {
  const element = parentElement.children.item(domIndex)
  if (element === null) {
    return dataLength
  }
  const context = getContext(element as HTMLElement)
  if (context) {
    return context.index
  }
  if (dataLength === 0) {
    return 0
  }
  const indexFirstElement = [...parentElement.children].findIndex(
    element => getContext(element as HTMLElement)?.index === 0,
  )
  return domIndex < indexFirstElement ? 0 : length
}
