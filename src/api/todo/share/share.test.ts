import supertest from 'supertest';
import { beforeAll, describe, it, expect } from 'vitest';
import mongoose from 'mongoose';
import * as dotenv from 'dotenv';
dotenv.config();

import app from '../../../app';
import Share, { TodoType } from './share.model';
import Log from '../log/log.model';

const api = supertest(app);
const baseUrl = '/api/v2/todo/share';

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

const initialItem = {
  colId: initialCollection.col.id,
  createdAt: '2023-08-27T05:49:47.756Z',
  id: 'PHike6yJTkYY3xOhY8056',
  message: 'test',
  priority: 'low',
  status: false,
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
        .send(initialCollection.col)
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

  describe('POST ITEM', () => {
    it('should fail with wrong id', async () => {
      await api.post(baseUrl + '/fake-col-id/items').expect(404);
    });

    it('should create new item, no items before', async () => {
      await Share.deleteMany({});
      await api.post(baseUrl).send(initialCollection).expect(201);
      await api.post(`${baseUrl}/${initialCollection.col.id}/items`).send(initialItem).expect(201);
    });
  });

  describe('PUT ITEM', () => {
    it('should fail with wrong id', async () => {
      await api.put(baseUrl + '/fake-col-id/items/fake-item-id').expect(404);
    });

    it('should edit item status', async () => {
      await Share.deleteMany({});
      await api.post(baseUrl).send(initialCollection).expect(201);
      await api.post(`${baseUrl}/${initialCollection.col.id}/items`).send(initialItem).expect(201);
      await api
        .put(`${baseUrl}/${initialCollection.col.id}/items/${initialItem.id}`)
        .send({ ...initialItem, status: true });

      const response = await Share.findOne({
        'col.id': initialCollection.col.id,
      });
      expect(response?.items?.[0].status).toBe(true);
    });
  });

  describe('DELETE DONE ITEMS', () => {
    beforeEach(async () => {
      await Share.deleteMany({});
      await api
        .post(baseUrl)
        .send({ ...initialCollection, items: [initialItem] })
        .expect(201);
    });

    it('should fail with wrong id', async () => {
      await api.delete(baseUrl + '/fake-col-id/items').expect(404);
      const response = await Share.findOne({
        'col.id': initialCollection.col.id,
      });
      expect(response?.items?.length).toBe(1);
    });

    it('should not delete anything, no done items', async () => {
      await api.delete(`${baseUrl}/${initialCollection.col.id}/items`).expect(204);
      const response = await Share.findOne({
        'col.id': initialCollection.col.id,
      });
      expect(response?.items?.length).toBe(1);
    });

    it('should delete done item and return null', async () => {
      await api
        .put(`${baseUrl}/${initialCollection.col.id}/items/${initialItem.id}`)
        .send({ ...initialItem, status: true });
      await api.delete(`${baseUrl}/${initialCollection.col.id}/items`).expect(204);
      const response = await Share.findOne({
        'col.id': initialCollection.col.id,
      });
      expect(response?.items).toBe(null);
    });
  });

  // router.delete('/:cid/items/:id', logger('DELETE ITEM'), deleteSharedItem);
  describe('DELETE ITEM', () => {
    beforeEach(async () => {
      await Share.deleteMany({});
      await api
        .post(baseUrl)
        .send({ ...initialCollection, items: [initialItem] })
        .expect(201);
    });

    it('should fail with wrong id', async () => {
      await api.delete(baseUrl + '/fake-col-id/items/fake-item-id').expect(404);
    });

    it('should delete item', async () => {
      await api.delete(`${baseUrl}/${initialCollection.col.id}/items/${initialItem.id}`).expect(204);
      const response = await Share.findOne({
        'col.id': initialCollection.col.id,
      });
      expect(response?.items).toBe(null);
    });
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });
});
