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

albumSchema.set('toJSON', {
  transform: (_document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

export default model<TAlbum>('Album', albumSchema);
