import bcrypt from 'bcrypt';
import { Readable } from 'stream';
import { Prisma } from '@prisma/client';

interface ModelWithId {
  id: string;
  [key: string]: unknown;
}

export interface PaginationOptions {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface PaginatedResult<T> {
  data: T[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
}

export const hashPassword = async (password: string) => {
  return await bcrypt.hash(password, 12);
};

export const comparePassword = async (password: string, hashedPassword: string) => {
  return await bcrypt.compare(password, hashedPassword);
};

export async function paginate<T, W extends Prisma.Enumerable<T>, I, S>(
  model: {
    findMany: (args: any) => Promise<W[]>;
    count: (args: any) => Promise<number>;
  },
  options: PaginationOptions = {},
  where?: unknown,
  include?: I,
  select?: S,
): Promise<PaginatedResult<W>> {
  const { page = 1, limit = 10, sortBy = 'createdAt', sortOrder = 'desc' } = options;

  const skip = (page - 1) * limit;
  const take = limit;

  const orderBy: Record<string, string> = {};
  if (sortBy) {
    orderBy[sortBy] = sortOrder;
  }

  const findManyArgs: Record<string, unknown> = {
    where,
    skip,
    take,
    orderBy,
  };

  if (include) {
    findManyArgs.include = include;
  }

  if (select) {
    findManyArgs.select = select;
  }

  const [data, total] = await Promise.all([model.findMany(findManyArgs), model.count({ where })]);

  const totalPages = Math.ceil(total / limit);

  return {
    data,
    meta: {
      total,
      page,
      limit,
      totalPages,
      hasNextPage: page < totalPages,
      hasPreviousPage: page > 1,
    },
  };
}

export const createPrismaStream = <T extends ModelWithId>(
  model: { findMany: (args: any) => Promise<T[]> },
  where: object = {},
  batchSize: number = 500,
): Readable => {
  async function* generator() {
    let lastId: string | undefined = undefined;
    yield '[';
    let isFirstBatch = true;

    while (true) {
      const items: T[] = await model.findMany({
        take: batchSize,
        where: {
          ...where,
          ...(lastId ? { id: { gt: lastId } } : {}),
        },
        orderBy: { id: 'asc' },
      });

      if (items.length === 0) break;

      const batchString = JSON.stringify(items).slice(1, -1);
      if (batchString.length > 0) {
        if (isFirstBatch) {
          yield batchString;
          isFirstBatch = false;
        } else {
          yield `,${batchString}`;
        }
      }

      lastId = items[items.length - 1].id;
      if (items.length < batchSize) break;
    }

    yield ']';
  }

  return Readable.from(generator());
};
