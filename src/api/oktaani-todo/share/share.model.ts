import { Schema, model } from 'mongoose';

export type TShare = {
  shareId: string;
  title: string;
  color: string;
  todos: [];
  created?: Date;
};

const shareSchema = new Schema({
  shareId: { type: String, required: true },
  title: { type: String, required: true },
  color: { type: String, required: true },
  todos: { type: Array, required: true },
  created: { type: Date, default: new Date() },
});

export default model<TShare>(
  'oktaani-todo_shares',
  shareSchema,
  'oktaani-todo_shares'
);
