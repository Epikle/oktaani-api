import { Schema, model } from 'mongoose';

type TCollection = {
  id: string;
  title: string;
  color: string;
  shared: boolean;
  todos: TItem[];
  created: string;
};

type TItem = {
  id: string;
  text: string;
  done: boolean;
  created: string;
};

const shareSchema = new Schema<TCollection>({
  id: { type: String, required: true, unique: true },
  title: { type: String, required: true },
  color: { type: String, required: true },
  shared: { type: Boolean, required: true },
  todos: {
    type: [
      {
        id: { type: String, required: true },
        text: { type: String, required: true },
        done: { type: Boolean, required: true },
        created: { type: String, required: true },
      },
    ],
    default: undefined,
    sparse: true,
  },
  created: { type: String, required: true },
});

export default model<TCollection>(
  'oktaani-todo-v2_shares',
  shareSchema,
  'oktaani-todo-v2_shares'
);
