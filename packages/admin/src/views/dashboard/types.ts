export interface DashboardPanel {
  key: string
  type: 'default' | 'custom'
  title: string
  description?: string
  order?: number
  isShow?: boolean
}

export interface DashboardCard {
  key: string
  title: string
  group: string
  x: number
  y: number
  w: number
  h: number
}
