export interface ListLogSourcesQueryDto {
  category?: 'endpoint' | 'windows' | 'network' | 'cloud' | 'application';
  status?: 'active' | 'stale' | 'error';
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}
