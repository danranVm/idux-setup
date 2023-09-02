import { type Slots, defineComponent, h } from 'vue'

import { useControlledProp } from '@idux/cdk/utils'
import { ɵOverlayPlacementDef, ɵOverlay } from '@idux/components/_private/overlay'

export default defineComponent({
  name: 'LayoutTooltip',
  props: {
    visible: {
      type: Boolean,
      default: undefined,
    },
    title: String,
    placement: ɵOverlayPlacementDef,
  },
  setup(props, { slots }) {
    const [visible, updateVisible] = useControlledProp(props, 'visible', false)

    return () => {
      const prefixCls = 'layout-tooltip'

      return h(
        ɵOverlay,
        {
          class: prefixCls,
          visible: visible.value,
          showArrow: false,
          autoAdjust: true,
          clickOutside: false,
          container: 'layout-tooltip-container',
          containerFallback: 'ix-overlay-container',
          offset: [0, 4],
          delay: 0,
          placement: props.placement ?? 'topStart',
          trigger: 'hover',
          'onUpdate:visible': updateVisible,
        },
        {
          default: slots.default,
          content: () => renderContent(props, slots, prefixCls),
        },
      )
    }
  },
})

const renderContent = (props: { title: string }, slots: Slots, prefixCls: string) => {
  if (!(slots.title || props.title)) {
    return null
  }

  return h('div', { class: `${prefixCls}-wrapper` }, slots.title ? slots.title() : props.title)
}
