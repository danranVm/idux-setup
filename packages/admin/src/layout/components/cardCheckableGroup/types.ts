export interface CardCheckableGroupOption {
  value: string | number | boolean | undefined
  label: string
  
  class?: string
  style?: Record<string, string>
  disabled?: boolean
  tooltip?: string
}
