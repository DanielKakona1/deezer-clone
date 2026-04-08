import type { Request, Response } from 'express';

import { getHealthPayload } from '../services/health.service';

export const getHealth = (_req: Request, res: Response) => {
  return res.status(200).json(getHealthPayload());
};
