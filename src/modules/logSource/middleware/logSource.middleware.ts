import { Request, Response, NextFunction } from 'express';
import { prisma } from '../../../config/postgres';
import ApiErrorHandler from '../../../common/utils/ApiErrorHandler';
import { STATUS_CODE } from '../../../common/constants/responseCode';


export const checkLogSourceExists = async (req: Request, res: Response, next: NextFunction) => {
    try{
        const id = req.params.id as string;
        const logSource = await prisma.logSource.findUnique({where: {id}});

        if(!logSource){
            return next(new ApiErrorHandler(STATUS_CODE.NOT_FOUND, `Log Source with ID ${id} not found`))
        }

        res.locals.logSource = logSource;
        next();
    }catch (err){
        next(err);
    }
}
