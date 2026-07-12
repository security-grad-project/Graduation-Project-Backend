import { RunQueryDto, QueryResult } from '../../../common/interfaces/query.types';
export { RunQueryDto, QueryResult };

export interface createSavedQueryData {
  category: string;
  name: string;
  esql: string;
  kql?: string;
}

export type updateSavedQueryData = Partial<createSavedQueryData>;

export interface ListSavedQueriesQuery {
  page: number;
  limit: number;
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  category?: string;
}
