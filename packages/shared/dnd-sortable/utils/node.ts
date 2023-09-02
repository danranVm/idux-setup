export function removeNode(node: HTMLElement) {
  if (node.parentElement !== null) {
    node.parentElement.removeChild(node)
  }
}

export function insertNode(parentNode: HTMLElement, node: HTMLElement, position: number) {
  const targetNode =
    position === 0 ? parentNode.children[0] : parentNode.children[position - 1].nextSibling
  parentNode.insertBefore(node, targetNode)
}
