export interface DashboardPanel {
  key: string
  type: 'default' | 'custom'
  title: string
  description: string
  order: number
  isShow?: boolean
}

export interface DashboardCard {
  key: string
  type: string
  title: string
  dataSet: string
  legend: string[]
  dateRange: string
  userRange: string
  x: number
  y: number
  w: number
  h: number
}
