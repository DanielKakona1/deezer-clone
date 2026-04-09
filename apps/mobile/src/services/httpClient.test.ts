type CreateConfig = {
  baseURL?: string;
  timeout?: number;
};

jest.mock('axios', () => ({
  create: jest.fn((config: CreateConfig) => ({ defaults: config })),
}));

import axios from 'axios';
import { httpClient } from './httpClient';

describe('httpClient', () => {
  it('creates axios instance with expected defaults', () => {
    expect(httpClient).toBeTruthy();
    const mockedAxios = axios as unknown as { create: jest.Mock };

    expect(mockedAxios.create).toHaveBeenCalledWith({
      baseURL: 'http://localhost:3333/api',
      timeout: 10000,
    });
  });
});
