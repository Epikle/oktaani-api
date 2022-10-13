import request from 'supertest';
import mongoose from 'mongoose';
import * as dotenv from 'dotenv';
dotenv.config();

import app from '../../../app';
import Share from './share.model';

const baseUrl = '/api/v2/oktaani-todo/share';

const initialData = {
  shareData: {
    shareId: 'ID1',
    title: 'Test todo title',
    color: '#FFFFFF',
    todos: [],
  },
};

beforeAll(async () => {
  await mongoose.connect(process.env.DB_ADDRESS_TEST || '');
  await Share.deleteMany({});
});

describe(`POST, ${baseUrl}`, () => {
  it('has valid data, responds with 201 code', async () => {
    await request(app).post(baseUrl).send(initialData).expect(201);
  });

  it('has invalid data, responds with 400 code', async () => {
    initialData.shareData.title = '';
    const response = await request(app)
      .post(baseUrl)
      .send(initialData)
      .expect(400);

    expect(response.body.stack).toContain('validation failed');
  });
});

describe(`GET, ${baseUrl}`, () => {
  it('get created shared todo', async () => {
    const response = await request(app)
      .get(baseUrl + '/' + initialData.shareData.shareId)
      .expect('Content-Type', /json/)
      .expect(200);

    expect(response.body.sharedCollection.color).toBe(
      initialData.shareData.color
    );
  });
});

describe(`DELETE, ${baseUrl}`, () => {
  it('delete should fail, invalid id', async () => {
    await request(app)
      .delete(baseUrl + '/invalid-id')
      .expect(204);

    const response = await Share.find({});

    expect(response.length).toBe(1);
  });

  it('delete should pass, valid id', async () => {
    await request(app)
      .delete(baseUrl + '/' + initialData.shareData.shareId)
      .expect(204);

    const response = await Share.find({});

    expect(response.length).toBe(0);
  });
});

afterAll(async () => {
  await mongoose.connection.close();
});
