import supertest from 'supertest';
import mongoose from 'mongoose';
import { JWKSMock } from 'mock-jwks';
import * as dotenv from 'dotenv';
dotenv.config();

import app from '../../../app';
import { startAuthServer, getToken, stopAuthServer } from '../util/setupTests';

let token: string;
let jwks: JWKSMock;

const api = supertest(app);

beforeAll(async () => {
  await mongoose.connect(process.env.DB_ADDRESS_TEST || '');
  jwks = startAuthServer();
  token = getToken(jwks);
  console.log(token);
});

describe('POST /api/v2/qwia-photos/photo', () => {
  it('no token, should fail with code 401', () => {
    api
      .get('/api/v2/qwia-photos/album/all')
      .expect('Content-Type', /json/)
      .expect(401);
  });
});

afterAll(async () => {
  await mongoose.connection.close();
  stopAuthServer(jwks);
});
