import express from 'express';
import morgan from 'morgan';
import helmet from 'helmet';
import cors from 'cors';
require('express-async-errors');

import * as middlewares from './middlewares';
import api from './api';

const app = express();

if (process.env.MORGAN) {
  app.use(morgan('tiny'));
}
app.use(helmet());
app.use(cors());
app.use(express.json());

app.get('/health', (_req, res) => {
  res.json({ message: 'health ok!' });
});
app.use('/api/v2', api);

app.use(middlewares.notFound);
app.use(middlewares.errorHandler);

export default app;
