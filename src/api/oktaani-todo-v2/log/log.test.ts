import supertest from 'supertest';
import { beforeAll, describe, it, expect } from 'vitest';
import mongoose from 'mongoose';
import * as dotenv from 'dotenv';
dotenv.config();

import app from '../../../app';
import Log from '../log/log.model';

const api = supertest(app);
const baseUrl = '/api/v2/oktaani-todo-v2/log';

describe('log', () => {
  beforeAll(async () => {
    await mongoose.connect(process.env.DB_ADDRESS_TEST || '');
    await Log.deleteMany({});
    const createdLog = new Log({
      colId: 'test-id',
      message: 'UPDATE',
    });
    await createdLog.save();
  });

  it('read log', async () => {
    const logs = await api.get(baseUrl + '/test-id');
    expect(logs.body[0].colId).toBe('test-id');
  });
});
