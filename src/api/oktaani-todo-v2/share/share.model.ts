import { Schema, model } from 'mongoose';

import type { TCollection } from '../../../../../oktaani-todo/src/types';

const shareSchema = new Schema<TCollection>({
  id: { type: String, required: true, unique: true },
  title: { type: String, required: true },
  color: { type: String, required: true },
  shared: { type: Boolean, required: true },
  todos: [
    {
      id: { type: String, required: true, unique: true },
      text: { type: String, required: true },
      done: { type: Boolean, required: true },
      created: { type: String, required: true },
    },
  ],
  created: { type: String, required: true },
});

export default model<TCollection>(
  'oktaani-todo-v2_shares',
  shareSchema,
  'oktaani-todo-v2_shares'
);
