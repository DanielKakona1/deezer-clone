import { app } from './app';
import { connectDatabase } from './config/database';
import { env } from './config/env';
import { logger } from './utils/logger';

const bootstrap = async () => {
  try {
    await connectDatabase();

    app.listen(env.PORT, () => {
      logger.info(`Backend running on port ${env.PORT}`);
    });
  } catch (error) {
    logger.error('Failed to start backend server', {
      error: error instanceof Error ? error.message : 'Unknown error',
    });
    process.exit(1);
  }
};

void bootstrap();
