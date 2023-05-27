import supertest from 'supertest';

import app from './app';

const api = supertest(app);

describe('app', () => {
  it('responds with a not found message', async () => {
    await api
      .get('/wrong-url-not-found')
      .expect('Content-Type', /json/)
      .expect(404);
  });

  it('health endpoint responds with status code 200', async () => {
    await api.get('/health').expect('Content-Type', /json/).expect(200);
  });
});
