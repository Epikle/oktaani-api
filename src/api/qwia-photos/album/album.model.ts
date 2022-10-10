import { Schema, model, PopulatedDoc, Document } from 'mongoose';

export type TAlbum = {
  title: string;
  isPublished: boolean;
  photos?: PopulatedDoc<Document>;
};

const albumSchema = new Schema({
  title: { type: String, required: true },
  isPublished: { type: Boolean, default: false },
  photos: [
    {
      type: Schema.Types.ObjectId,
      ref: 'qwia-photos_photos',
    },
  ],
});

export default model<TAlbum>(
  'qwia-photos_albums',
  albumSchema,
  'qwia-photos_albums'
);
