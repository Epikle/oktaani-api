import mongoose from 'mongoose';

const shareSchema = new mongoose.Schema({
  shareId: { type: String, required: true },
  title: { type: String, required: true },
  color: { type: String, required: true },
  todos: { type: Array, required: true },
  created: { type: Date, default: new Date() },
});

export default mongoose.model(
  'oktaani-todo_shares',
  shareSchema,
  'oktaani-todo_shares'
);
