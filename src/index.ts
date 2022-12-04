import mongoose from 'mongoose';
import * as dotenv from 'dotenv';
dotenv.config();

import app from './app';

const PORT = process.env.PORT || 5000;
mongoose
  .connect(process.env.DB_ADDRESS || '')
  .then(() => {
    app.listen(PORT);
    console.log(`DB connected and server running at port ${PORT}.`);
  })
  .catch((error) => console.log(error));
