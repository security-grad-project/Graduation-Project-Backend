export interface RunQueryDto {
  query: string;
  language: 'esql' | 'kql';
}

export interface QueryResult {
  mode: 'events' | 'stats';
  columns: string[];
  rows: any[];
  total: number;
  took: number;
}
