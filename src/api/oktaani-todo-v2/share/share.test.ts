import supertest from 'supertest';
import { beforeAll, describe, it, expect } from 'vitest';
import mongoose from 'mongoose';
import * as dotenv from 'dotenv';
dotenv.config();

import app from '../../../app';
import Share, { TodoType } from './share.model';
import Log from '../log/log.model';

const api = supertest(app);
const baseUrl = '/api/v2/oktaani-todo-v2/share';

const initialCollection = {
  col: {
    id: 'CID1',
    title: 'Test todo title',
    color: '#FFFFFF',
    shared: true,
    type: TodoType.todo,
    createdAt: '1234',
  },
};

describe('share', () => {
  beforeAll(async () => {
    await mongoose.connect(process.env.DB_ADDRESS_TEST || '');
    await Share.deleteMany({});
    await Log.deleteMany({});
  });

  describe(`POST, ${baseUrl}`, () => {
    it('has valid data, responds with 201 code', async () => {
      await api.post(baseUrl).send(initialCollection).expect(201);
      const response = await Share.find({});
      expect(response.length).toBe(1);
    });

    it('try to create same collection again', async () => {
      await api.post(baseUrl).send(initialCollection).expect(500);
      const response = await Share.find({});
      expect(response.length).toBe(1);
    });

    it('has invalid data, responds with 400 code', async () => {
      const response = await api
        .post(baseUrl)
        .send({ ...initialCollection, col: { share: 'invalid' } })
        .expect(400);

      expect(response.body.stack).toContain('ValidationError');
    });

    it('should fail with empty items array', async () => {
      const response = await api
        .post(baseUrl)
        .send({ ...initialCollection, items: [] })
        .expect(400);

      expect(response.body.stack).toContain('ValidationError');
    });

    it('should fail with items array set to null array', async () => {
      const response = await api
        .post(baseUrl)
        .send({ ...initialCollection, items: [null] })
        .expect(400);

      expect(response.body.stack).toContain('ValidationError');
    });
  });

  describe(`GET, ${baseUrl}`, () => {
    it('get created shared todo', async () => {
      const response = await api
        .get(baseUrl + '/' + initialCollection.col.id)
        .expect('Content-Type', /json/)
        .expect(200);

      expect(response.body.col.color).toBe(initialCollection.col.color);
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
      initialCollection.col.title = 'UPDATED';
      await api
        .put(baseUrl + '/' + initialCollection.col.id)
        .send(initialCollection)
        .expect(204);

      const collection = await Share.findOne({
        'col.id': initialCollection.col.id,
      });
      expect(collection?.col.title).toBe('UPDATED');
    });
  });

  describe(`DELETE, ${baseUrl}`, () => {
    it('delete should fail, invalid id', async () => {
      await api.delete(baseUrl + '/invalid-id').expect(204);
      const response = await Share.find({});
      expect(response.length).toBe(1);
    });

    it('delete should pass, valid id', async () => {
      await api.delete(baseUrl + '/' + initialCollection.col.id).expect(204);
      const response = await Share.find({});
      expect(response.length).toBe(0);
    });
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });
});
