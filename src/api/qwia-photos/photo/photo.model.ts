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

export default model<TPhoto>('Photo', photoSchema);
