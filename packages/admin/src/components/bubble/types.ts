export interface BubbleItem {
  text: string
  icon: string
  sub?: { text: string, onClick: () => void }[]
  onClick?: () => void
}