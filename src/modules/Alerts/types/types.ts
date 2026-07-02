import { Severity, Status } from '@prisma/client';

export interface ListAlertsQuery {
  page: number;
  limit: number;
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  severity?: Severity;
  status?: Status;
  deviceId?: string;
}
