export interface ListServicesQueryDto {
  type?: string;
  userId?: string;
  deviceId?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  createdAt?: string;
  startDate?: Date;
  endDate?: Date;
  includeUserData?: boolean;
  includeDeviceData?: boolean;
}
