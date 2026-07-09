export interface MetricPanelDefinition {
  id: string;
  type: 'metric';
  title: string;
  spec: {
    index: string;
    aggType: 'count' | 'cardinality' | 'ratio';
    field?: string;
    filter?: Record<string, string>;
    numeratorFilter?: Record<string, string>;
  };
}

export interface HistogramPanelDefinition {
  id: string;
  type: 'histogram';
  title: string;
  spec: {
    index: string;
    interval?: string;
    filter?: Record<string, string>;
  };
}

export interface BreakdownPanelDefinition {
  id: string;
  type: 'breakdown';
  title: string;
  spec: {
    index: string;
    field: string;
    size?: number;
    filter?: Record<string, string>;
  };
}

export type DashboardPanelDefinition =
  | MetricPanelDefinition
  | HistogramPanelDefinition
  | BreakdownPanelDefinition;

export interface createDashboardData {
  title: string;
  description?: string;
  tags?: string[];
  panels?: DashboardPanelDefinition[];
}

export type updateDashboardData = Partial<createDashboardData>;

export interface ListDashboardsQuery {
  search?: string;
  page: number;
  limit: number;
}

export interface DashboardDataQuery {
  from?: string;
  to?: string;
}

export interface PanelStat {
  label: string;
  value: string | number;
}

export interface HistogramPoint {
  time: string;
  count: number;
}

export interface BreakdownItem {
  label: string;
  value: number;
}

export interface DashboardPanelsData {
  stats: PanelStat[];
  histogram: HistogramPoint[];
  breakdown: BreakdownItem[];
}
