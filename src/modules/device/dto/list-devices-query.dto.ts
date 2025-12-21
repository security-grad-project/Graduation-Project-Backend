export interface ListDevicesQueryDto {
  ip?: string;
  hostName?: string;
  userId?: string;
  page: number;
  limit: number;
}
