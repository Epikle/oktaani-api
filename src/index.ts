import mongoose from 'mongoose';
import * as dotenv from 'dotenv';
dotenv.config();

import app from './app';

const port = process.env.PORT || 5000;
mongoose
  .connect(process.env.DB_ADDRESS || '')
  .then(() => {
    app.listen(port);
  })
  .catch((error) => console.log(error));
