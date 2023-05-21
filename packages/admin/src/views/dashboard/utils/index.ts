import type { DashboardPanel } from '../types'

export function panelSortFn(a: DashboardPanel, b: DashboardPanel) {
  return a.order - b.order
}
