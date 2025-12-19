import bcrypt from 'bcrypt';

import { Readable } from 'stream';
import { prisma } from '../../config/postgres';
import { Cursor } from 'mongoose';

interface ModelWithId {
  id: string;
  [key: string]: any;
}

export const hashPassword = async (password: string) => {
  return await bcrypt.hash(password, 12);
};

export const createPrismaStream = <T extends ModelWithId>(
  model: any,
  where: object = {},
  batchSize: number = 500,
): Readable => {
  async function* generator() {
    try {
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
    } catch (error) {
      throw error;
    }
  }

  return Readable.from(generator());
};
