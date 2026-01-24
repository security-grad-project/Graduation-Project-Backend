import { Request, Response, NextFunction } from 'express';
import catchAsync from '../../../common/utils/catchAsync';
import { prisma } from '../../../config/postgres';
import ApiErrorHandler from '../../../common/utils/ApiErrorHandler';

export const isRuleNameUniqueMiddleware = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    if (!req.body.name) return next();

    const nameExist = await prisma.rule.findFirst({
      where: { name: req.body.name },
    });

    if (nameExist) {
      return next(new ApiErrorHandler(409, 'Rule with this name already exists'));
    }

    next();
  },
);

export const isRuleExistMiddleware = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id;

    const ruleExist = await prisma.rule.findUnique({
      where: { id: id },
    });

    if (!ruleExist) return next(new ApiErrorHandler(404, 'Rule Not Found'));

    next();
  },
);
