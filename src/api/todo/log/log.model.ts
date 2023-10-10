import { Schema, model } from 'mongoose';

const logSchema = new Schema(
  {
    colId: { type: String, required: true },
    message: { type: String, required: true },
  },
  { timestamps: true }
);

logSchema.set('toJSON', {
  transform: function (_doc, ret) {
    ret.id = ret._id;
    delete ret._id;
    delete ret.__v;
  },
});

export default model('oktaani-todo-v2_logs', logSchema, 'oktaani-todo-v2_logs');
