import request from 'supertest';
import mongoose from 'mongoose';
import { JWKSMock } from 'mock-jwks';
import * as dotenv from 'dotenv';
dotenv.config();

import app from '../../../app';
import Album from './album.model';

import { startAuthServer, getToken, stopAuthServer } from '../setupTests';

let token: string;
let jwks: JWKSMock;

beforeAll(async () => {
  await mongoose.connect(process.env.DB_ADDRESS || '');
  await Album.deleteMany({});
  jwks = startAuthServer();
  token = getToken(jwks);
});

describe('GET /api/v2/qwia-photos/album', () => {
  it('responds with an empty array', async () => {
    const response = await request(app)
      .get('/api/v2/qwia-photos/album/')
      .expect('Content-Type', /json/)
      .expect(200);

    expect(response.body).toHaveProperty('length');
    expect(response.body.length).toBe(0);
  });
});

describe('GET /api/v2/qwia-photos/album/all', () => {
  it('responds with 401, unauthorized, no token', (done) => {
    request(app)
      .get('/api/v2/qwia-photos/album/all')
      .expect('Content-Type', /json/)
      .expect(401, done);
  });

  it('with valid token, should return 200', (done) => {
    request(app)
      .get('/api/v2/qwia-photos/album/all')
      .set('Authorization', 'bearer ' + token)
      .expect('Content-Type', /json/)
      .expect(200, done);
  });
});

afterAll(async () => {
  await mongoose.connection.close();
  stopAuthServer(jwks);
});
