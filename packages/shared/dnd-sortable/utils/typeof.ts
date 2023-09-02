export function isTransition(name: string) {
  return ['transition-group', 'TransitionGroup'].includes(name)
}

export function isHtmlAttr(key: string) {
  return (
    ['id', 'class', 'style', 'role'].includes(key) ||
    /^data-[^a-z]/.test(key) ||
    /^aria-[^a-z]/.test(key)
  )
}

export function isEvent(key: string) {
  return /^on[^a-z]/.test(key)
}
