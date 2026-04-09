import type { Request, Response } from 'express';

import { getHealth } from './health.controller';
import { getHealthPayload } from '../services/health.service';

jest.mock('../services/health.service', () => ({
  getHealthPayload: jest.fn(),
}));

describe('health.controller', () => {
  it('returns 200 with health payload', () => {
    const status = jest.fn().mockReturnThis();
    const json = jest.fn().mockReturnThis();
    const res = { status, json } as unknown as Response;

    (getHealthPayload as jest.Mock).mockReturnValue({
      status: 'ok',
      timestamp: '2026-04-09T00:00:00.000Z',
    });

    getHealth({} as Request, res);

    expect(status).toHaveBeenCalledWith(200);
    expect(json).toHaveBeenCalledWith({
      status: 'ok',
      timestamp: '2026-04-09T00:00:00.000Z',
    });
  });
});
