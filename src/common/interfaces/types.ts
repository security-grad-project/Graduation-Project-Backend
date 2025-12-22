import { Request } from 'express';
import { Analyst } from '@prisma/client';
import { JwtPayload } from 'jsonwebtoken';

export interface IRequest extends Request {
  user?: Analyst;
}

export interface ITokenPayload extends JwtPayload {
  id: string;
}
