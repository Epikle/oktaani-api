import { Schema, model } from 'mongoose';

export enum StatsTypes {
  newCollection = 'newCollection',
  deleteCollection = 'deleteCollection',
  newItem = 'newItem',
  deleteItem = 'deleteItem',
  shareCollection = 'shareCollection',
}

const statsSchema = new Schema(
  {
    type: { $type: String, enum: StatsTypes, required: true },
  },
  { timestamps: true, typeKey: '$type' }
);

statsSchema.set('toJSON', {
  transform: function (_doc, ret) {
    ret.id = ret._id;
    delete ret._id;
    delete ret.__v;
  },
});

export default model(
  'oktaani-todo-v2_stats',
  statsSchema,
  'oktaani-todo-v2_stats'
);
