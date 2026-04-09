import request from 'supertest';

import { app } from './app';

describe('app', () => {
  it('mounts api health route', async () => {
    const response = await request(app).get('/api/health');

    expect(response.status).toBe(200);
    expect(response.body.status).toBe('ok');
  });

  it('uses not found + error handlers for unknown routes', async () => {
    const response = await request(app).get('/some/unknown/path');

    expect(response.status).toBe(500);
    expect(response.body.message).toBe('Route not found');
  });
});
