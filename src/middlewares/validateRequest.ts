import { NextFunction, Request, Response } from 'express';
import { AnyZodObject } from 'zod';
import catchAsync from '../utils/catchAsync';

export const validateRequest = (scheme: AnyZodObject) => {
  return catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    // if everything ok then send to controller
    await scheme.parseAsync({
      body: req.body,
      cookies: req.cookies,
    }); //validation check
    next();
  });
};
