import type { ComputedRef } from 'vue'

import { useState } from '@idux/cdk/utils'

const defaultHideDelay = 100
const alarmHideDelay = 300

interface SiderDropdownStateContext {
  overlayContent: ComputedRef<'menu' | 'alarm'>
  dropdownVislble: ComputedRef<boolean>
  handleRefMouseenter: () => void
  handleRefMouseleave: () => void
  handleOverlayMouseenter: () => void
  handleOverlayMouseleave: () => void
  setOverlayContent: (content: 'menu' | 'alarm') => void
}

export function useSiderDropdownState(): SiderDropdownStateContext {
  const [overlayContent, setOverlayContent] = useState<'menu' | 'alarm'>('alarm')
  const [dropdownVislble, setDropdownVisible] = useState(false)

  let tmr: number
  const showDropdown = () => {
    tmr && clearTimeout(tmr)
    setDropdownVisible(true)
  }
  const hideDropdown = () => {
    tmr && clearTimeout(tmr)
    tmr = setTimeout(
      () => {
        setDropdownVisible(false)
      },
      overlayContent.value === 'alarm' ? alarmHideDelay : defaultHideDelay,
    )
  }

  const handleRefMouseenter = () => {
    showDropdown()
  }
  const handleRefMouseleave = () => {
    hideDropdown()
  }
  const handleOverlayMouseenter = () => {
    showDropdown()
  }
  const handleOverlayMouseleave = () => {
    hideDropdown()
  }

  return {
    dropdownVislble,
    overlayContent,
    handleRefMouseenter,
    handleRefMouseleave,
    handleOverlayMouseenter,
    handleOverlayMouseleave,
    setOverlayContent,
  }
}
