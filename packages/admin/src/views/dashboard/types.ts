export type DashboardCardType = 'bar' | 'line' | 'pie'

export interface DashboardCardOptions {}

export interface DashboardCard {
  key: string
  type: DashboardCardType
  title: string
  dataSet: string
  legend: string[]
  dateRange: string
  userRange: string
}

export interface DashboardPanel {
  key: string
  title: string
}
