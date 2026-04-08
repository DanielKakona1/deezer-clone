import { Router } from 'express';

import { artistRouter } from './artist.routes';
import { healthRouter } from './health.routes';

const apiRouter = Router();

apiRouter.use('/health', healthRouter);
apiRouter.use('/deezer', artistRouter);

export { apiRouter };
