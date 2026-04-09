import type { NextFunction, Request, Response } from 'express';

import { errorHandlerMiddleware } from './errorHandler.middleware';

describe('errorHandler.middleware', () => {
  it('returns 500 with error message', () => {
    const status = jest.fn().mockReturnThis();
    const json = jest.fn().mockReturnThis();
    const res = { status, json } as unknown as Response;

    errorHandlerMiddleware(new Error('Boom'), {} as Request, res, jest.fn() as NextFunction);

    expect(status).toHaveBeenCalledWith(500);
    expect(json).toHaveBeenCalledWith({ message: 'Boom' });
  });
});
