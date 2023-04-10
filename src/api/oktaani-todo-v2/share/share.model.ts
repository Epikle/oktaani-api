import { Schema, model } from 'mongoose';

enum TodoType {
  todo = 'todo',
  note = 'note',
  unset = 'unset',
}
type TCollection = {
  id: string;
  title: string;
  color: string;
  shared: boolean;
  todos: TItem[];
  note: string;
  type: TodoType;
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
  note: { type: String, default: '' },
  type: { type: String, enum: TodoType, default: TodoType.unset },
  created: { type: String, required: true },
});

export default model<TCollection>(
  'oktaani-todo-v2_shares',
  shareSchema,
  'oktaani-todo-v2_shares'
);
