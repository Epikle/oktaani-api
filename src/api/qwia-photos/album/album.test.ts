import request from 'supertest';
import mongoose from 'mongoose';
import { JWKSMock } from 'mock-jwks';
import * as dotenv from 'dotenv';
dotenv.config();

import app from '../../../app';
import Album from './album.model';

import { startAuthServer, getToken, stopAuthServer } from '../util/setupTests';

let token: string;
let jwks: JWKSMock;

beforeAll(async () => {
  await mongoose.connect(process.env.DB_ADDRESS_TEST || '');
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
  it('responds with 401, unauthorized, no token', async () => {
    request(app)
      .get('/api/v2/qwia-photos/album/all')
      .expect('Content-Type', /json/)
      .expect(401);
  });

  it('with valid token, should return 200', async () => {
    request(app)
      .get('/api/v2/qwia-photos/album/all')
      .set('Authorization', 'bearer ' + token)
      .expect('Content-Type', /json/)
      .expect(200);
  });
});

describe('POST /api/v2/qwia-photos/album', () => {
  const newAlbum = {
    title: 'Test title 1',
  };

  it('no token, should fail with 401', async () => {
    request(app)
      .post('/api/v2/qwia-photos/album')
      .send(newAlbum)
      .expect('Content-Type', /json/)
      .expect(401);
  });

  // TODO: fix this
  // it('with token, should add new album with 201 created', async () => {
  //   const result = await request(app)
  //     .post('/api/v2/qwia-photos/album')
  //     .set('Authorization', 'bearer ' + token)
  //     .send(newAlbum)
  //     .expect('Content-Type', /json/)
  //     .expect(201);

  //   expect(result.body.title).toBe(newAlbum.title);
  // });

  it('with token, invalid title, should fail', async () => {
    request(app)
      .post('/api/v2/qwia-photos/album')
      .set('Authorization', 'bearer ' + token)
      .send({ title: '' })
      .expect('Content-Type', /json/)
      .expect(400);
  });
});

afterAll(async () => {
  await mongoose.connection.close();
  stopAuthServer(jwks);
});
