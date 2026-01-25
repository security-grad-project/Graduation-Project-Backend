export interface createRuleData {
  name: string;
  description: string;
  type: string;
}

export type updateRuleData = Partial<createRuleData>;

export interface GetRuleQueryOption {
  includeAlerts?: boolean;
}
