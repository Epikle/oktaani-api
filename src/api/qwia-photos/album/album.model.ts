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
      ref: 'Photo',
    },
  ],
});

export default model<TAlbum>('Album', albumSchema);
