import { Prisma } from '@prisma/client';

export const buildAlertFilter = (query: {
  severity?: string;
  status?: string;
  search?: string;
  deviceId?: string;
}): Prisma.AlertWhereInput => {
  const { severity, status, search, deviceId } = query;
  const where: Prisma.AlertWhereInput = {};

  if (severity) where.severity = severity as Prisma.EnumSeverityFilter;
  if (status) where.status = status as Prisma.EnumStatusFilter;
  if (deviceId) where.deviceId = deviceId;
  if (search) {
    where.OR = [
      {
        name: {
          contains: search,
          mode: 'insensitive',
        },
      },
      {
        description: {
          contains: search,
          mode: 'insensitive',
        },
      },
    ];
  }

  return where;
};
