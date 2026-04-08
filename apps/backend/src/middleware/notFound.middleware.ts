import type { NextFunction, Request, Response } from 'express';

export const notFoundMiddleware = (
  _req: Request,
  _res: Response,
  next: NextFunction,
) => {
  const error = new Error('Route not found');

  next(error);
};
