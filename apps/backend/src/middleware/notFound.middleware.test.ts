import type { NextFunction, Request, Response } from 'express';

import { notFoundMiddleware } from './notFound.middleware';

describe('notFound.middleware', () => {
  it('forwards route not found error', () => {
    const next = jest.fn() as NextFunction;

    notFoundMiddleware({} as Request, {} as Response, next);

    expect(next).toHaveBeenCalledTimes(1);
    expect(next).toHaveBeenCalledWith(expect.any(Error));
    expect((next as jest.Mock).mock.calls[0][0].message).toBe('Route not found');
  });
});
