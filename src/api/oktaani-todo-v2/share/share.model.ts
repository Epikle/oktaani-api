import { Schema, model } from 'mongoose';

export enum TodoType {
  todo = 'todo',
  note = 'note',
}
enum TodoItemPriority {
  low = 'low',
  medium = 'medium',
  high = 'high',
}
export type Collection = {
  id: string;
  title: string;
  color: string;
  shared: boolean;
  type: TodoType;
  createdAt: string;
};

export type Item = {
  colId: string;
  id: string;
  message: string;
  status: boolean;
  priority: TodoItemPriority;
  createdAt: string;
};

type Note = {
  colId: string;
  id: string;
  message: string;
  createdAt: string;
};

export type SharedEntry = {
  col: Collection;
  items: Item[] | null;
  note: Note | null;
};

const shareSchema = new Schema<SharedEntry>(
  {
    col: {
      $type: {
        id: { $type: String, required: true, unique: true, index: true },
        title: { $type: String, required: true },
        color: { $type: String, required: true },
        shared: { $type: Boolean, required: true },
        type: { $type: String, enum: TodoType, required: true },
        createdAt: { $type: String, required: true },
      },
      _id: false,
    },
    items: {
      $type: [
        {
          colId: { $type: String, required: true },
          id: { $type: String, required: true },
          message: { $type: String, required: true },
          status: { $type: Boolean, required: true },
          priority: {
            $type: String,
            enum: TodoItemPriority,
          },
          createdAt: { $type: String, required: true },
        },
      ],
      validate: {
        validator: (items: any) => {
          if (items === null) return true;
          return (
            Array.isArray(items) &&
            items.length > 0 &&
            !items.some((item: any) => item === null)
          );
        },
        message: 'Array should be empty or not contain null values.',
      },
      required: false,
      default: () => null,
      _id: false,
    },
    note: {
      $type: {
        colId: { $type: String, required: true },
        id: { $type: String, required: true },
        message: { $type: String, required: true },
        createdAt: { $type: String, required: true },
      },
      required: false,
      default: () => null,
      _id: false,
    },
  },
  { typeKey: '$type' }
);

export default model<SharedEntry>(
  'oktaani-todo-v2_shares',
  shareSchema,
  'oktaani-todo-v2_shares'
);
