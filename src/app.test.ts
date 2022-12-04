import request from 'supertest';

import app from './app';

describe('app', () => {
  it('responds with a not found message', (done) => {
    request(app)
      .get('/wrong-url-not-found')
      .expect('Content-Type', /json/)
      .expect(404, done);
  });

  it('health endpoint responds with status code 200', (done) => {
    request(app)
      .get('/health')
      .expect('Content-Type', /json/)
      .expect(200, done);
  });
});
