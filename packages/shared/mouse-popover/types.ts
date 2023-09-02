import type { PropType, DefineComponent, HTMLAttributes, VNode } from 'vue-demi'

import type { PopperPlacement } from '@idux/cdk/popper'
import type { ExtractPublicPropTypes, ExtractInnerPropTypes } from '@idux/cdk/utils'
import type { PopoverProps } from '@idux/components/popover'

export const mousePopoverProps = {
  content: [Object, String] as PropType<VNode | string>,
  placement: String as PropType<PopperPlacement>,
} as const

export type MousePopoverInnerProps = ExtractInnerPropTypes<typeof mousePopoverProps>

export type MousePopoverProps = ExtractPublicPropTypes<typeof mousePopoverProps> &
  Omit<PopoverProps, 'offset' | 'trigger' | 'showArrow' | 'content'>

export type MousePopoverComponent = DefineComponent<
  Omit<HTMLAttributes, keyof MousePopoverProps> & MousePopoverProps
>

export type MousePopoverInstance = InstanceType<DefineComponent<MousePopoverProps>>
