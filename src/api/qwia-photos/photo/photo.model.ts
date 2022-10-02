import { Schema, model, PopulatedDoc, Document } from 'mongoose';

export type TPhoto = {
  title: string;
  url: string;
  likes?: string[];
  album?: PopulatedDoc<Document>;
};

const photoSchema = new Schema({
  title: { type: String, required: true },
  url: { type: String, required: true },
  likes: { type: Array },
  album: {
    type: Schema.Types.ObjectId,
    ref: 'Album',
  },
});

photoSchema.set('toJSON', {
  transform: (_document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

export default model<TPhoto>('Photo', photoSchema);
