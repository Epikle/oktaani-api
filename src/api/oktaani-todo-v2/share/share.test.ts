import supertest from 'supertest';
import mongoose from 'mongoose';
import * as dotenv from 'dotenv';
dotenv.config();

import app from '../../../app';
import Share from './share.model';

const api = supertest(app);
const baseUrl = '/api/v2/oktaani-todo-v2/share';

const initialCollection = {
  id: 'CID1',
  title: 'Test todo title',
  color: '#FFFFFF',
  shared: true,
  todos: [],
  note: '',
  type: 'todo',
  created: 'date',
};

beforeAll(async () => {
  await mongoose.connect(process.env.DB_ADDRESS_TEST || '');
  await Share.deleteMany({});
});

describe(`POST, ${baseUrl}`, () => {
  it('has valid data, responds with 201 code', async () => {
    await api.post(baseUrl).send(initialCollection).expect(201);

    const response = await Share.find({});

    expect(response.length).toBe(1);
  });

  it('try to create same collection again', async () => {
    await api.post(baseUrl).send(initialCollection).expect(201);

    const response = await Share.find({});

    expect(response.length).toBe(1);
  });

  it('has invalid data, responds with 400 code', async () => {
    const response = await api
      .post(baseUrl)
      .send({ ...initialCollection, id: 'CID2', title: '' })
      .expect(400);

    expect(response.body.stack).toContain('ValidationError');
  });
});

describe(`GET, ${baseUrl}`, () => {
  it('get created shared todo', async () => {
    const response = await api
      .get(baseUrl + '/' + initialCollection.id)
      .expect('Content-Type', /json/)
      .expect(200);

    expect(response.body.color).toBe(initialCollection.color);
  });

  it('get todo with invalid id, should fail with 404 code', async () => {
    const response = await api
      .get(baseUrl + '/invalid-id')
      .expect('Content-Type', /json/)
      .expect(404);

    expect(response.body.message).toBe('Not Found');
  });
});

describe(`PUT, ${baseUrl}`, () => {
  it('should fail with wrong id', async () => {
    const response = await api
      .put(baseUrl + '/invalid-id')
      .send({ ...initialCollection, title: 'UPDATED' })
      .expect('Content-Type', /json/)
      .expect(404);

    expect(response.body.message).toBe('Not Found');
  });

  it('should update collection with id', async () => {
    await api
      .put(baseUrl + '/' + initialCollection.id)
      .send({ ...initialCollection, title: 'UPDATED' })
      .expect(204);

    const collection = await Share.findOne({ id: initialCollection.id });

    expect(collection?.title).toBe('UPDATED');
  });
});

describe(`DELETE, ${baseUrl}`, () => {
  it('delete should fail, invalid id', async () => {
    await api.delete(baseUrl + '/invalid-id').expect(204);

    const response = await Share.find({});

    expect(response.length).toBe(1);
  });

  it('delete should pass, valid id', async () => {
    await api.delete(baseUrl + '/' + initialCollection.id).expect(204);

    const response = await Share.find({});

    expect(response.length).toBe(0);
  });
});

afterAll(async () => {
  await mongoose.connection.close();
});
