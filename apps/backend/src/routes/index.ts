import { Router } from 'express';

import { deezerRouter } from './deezer.routes';
import { healthRouter } from './health.routes';

const apiRouter = Router();

apiRouter.use('/health', healthRouter);
apiRouter.use('/deezer', deezerRouter);

export { apiRouter };
