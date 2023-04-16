export type DashboardCardType = 'bar' | 'line' | 'pie'

export interface DashboardCardOptions {}

export interface DashboardCard {
  key: number
  type: DashboardCardType
  name: string
  description?: string
  options: DashboardCardOptions
  minH?: number
  minW?: number
}

export interface DashboardPanel {
  key: string
  name: string
}
