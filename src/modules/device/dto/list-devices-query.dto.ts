export interface ListDevicesQueryDto {
  ip?: string;
  hostName?: string;
  createdAt?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  includeServices: boolean;
  includeAlerts: boolean;
}
