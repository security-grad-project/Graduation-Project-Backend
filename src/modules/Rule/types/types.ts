export interface createRuleData {
  name: string;
  description: string;
  type: string;
}

export type updateRuleData = Partial<createRuleData>;

export interface GetRuleQueryOption {
  includeAlerts?: boolean;
}

export interface ListRulesQuery {
  type?: string;
  page: number;
  limit: number;
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  includeAlerts?: boolean;
  includeCount?: boolean;
}
