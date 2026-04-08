import type { NextFunction, Request, Response } from 'express';

export const errorHandlerMiddleware = (
  error: Error,
  _req: Request,
  res: Response,
  _next: NextFunction,
) => {
  return res.status(500).json({
    message: error.message || 'Internal server error',
  });
};
