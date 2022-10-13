import { Schema, model } from 'mongoose';

export type TDtc = {
  system: {
    title: string;
    subCode: string;
    subName: string;
  };
  code: {
    title: string;
    description: string;
    location?: string;
  };
};

const dtcSchema = new Schema({
  system: {
    title: { type: String, required: true },
    subCode: { type: String, required: true },
    subName: { type: String, required: true },
  },
  code: {
    title: { type: String, required: true },
    description: { type: String, required: true },
    location: { type: String, required: false },
  },
});

dtcSchema.set('toJSON', {
  transform: (_document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

export default model<TDtc>('oktaani-dtc_dtcs', dtcSchema, 'oktaani-dtc_dtcs');
