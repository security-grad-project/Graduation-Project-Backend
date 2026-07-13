export interface FieldInfo {
  name: string;
  type: string;
  count?: number;
}

export interface ESField {
  type?: string;
  properties?: Record<string, ESField>;
  fields?: Record<string, { type?: string }>;
}

export interface ESIndexMapping {
  mappings?: {
    properties?: Record<string, ESField>;
  };
}

export interface DiscoverFieldsResponse {
  popular: FieldInfo[];
  available: FieldInfo[];
  empty: FieldInfo[];
  meta: FieldInfo[];
}

export interface FieldStatsValue {
  value: string | number | boolean;
  count: number;
  percentage: number;
}

export interface FieldStatsNumeric {
  count: number;
  min: number | string | null;
  max: number | string | null;
  avg?: number | null;
  sum?: number | null;
}

export interface FieldStatsResponse {
  field: string;
  type: string;
  documents: number;
  values?: FieldStatsValue[];
  stats?: FieldStatsNumeric;
}
