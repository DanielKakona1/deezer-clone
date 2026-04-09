import { getHealthPayload } from './health.service';

describe('health.service', () => {
  it('returns ok status and iso timestamp', () => {
    const payload = getHealthPayload();

    expect(payload.status).toBe('ok');
    expect(typeof payload.timestamp).toBe('string');
    expect(new Date(payload.timestamp).toString()).not.toBe('Invalid Date');
  });
});
