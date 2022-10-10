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
    ref: 'qwia-photos_albums',
  },
});

export default model<TPhoto>(
  'qwia-photos_photos',
  photoSchema,
  'qwia-photos_photos'
);
