export type PanelType = 'metric' | 'histogram' | 'breakdown';

export interface DashboardPanelDefinition {
  id: string;
  type: PanelType;
  title: string;
  spec: Record<string, unknown>;
}

export interface createDashboardData {
  title: string;
  description?: string;
  tags?: string[];
  panels?: any;
}

export type updateDashboardData = Partial<createDashboardData>;

export interface ListDashboardsQuery {
  search?: string;
  page: number;
  limit: number;
}
