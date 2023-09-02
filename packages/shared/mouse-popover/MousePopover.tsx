import { defineComponent, ref, isVue2 } from 'vue-demi'

import { IxPopover } from '@idux/components'

import { useOffset } from './composables/useOffset'
import { mousePopoverProps } from './types'

const defaultPlacement = 'bottomStart'

export default defineComponent({
  name: 'MousePopover',
  props: mousePopoverProps,
  setup(props, { attrs, slots }) {
    const { offset, mouseData } = useOffset(props)
    const placement = ref(props.placement || defaultPlacement)
    const popoverSlot = {
      default: () => <div ref="mouseTarget">{slots.default && slots.default()}</div>,
      content: () => {
        if (slots.content || props.content) {
          return slots.content ? slots.content(mouseData) : props.content
        }
      },
    }

    return () => (
      <IxPopover
        v-slots={popoverSlot}
        placement={placement.value}
        showArrow={false}
        offset={offset.value}
        {...(isVue2 ? { props: attrs } : { ...attrs })}
      />
    )
  },
})
