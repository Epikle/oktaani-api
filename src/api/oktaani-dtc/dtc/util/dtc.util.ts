import { TDtc } from '../dtc.model';

export const trimDtc = ({ system, code }: TDtc): TDtc => ({
  system: {
    title: system.title.trim(),
    subCode: system.subCode.trim(),
    subName: system.subName.trim(),
  },
  code: {
    title: code.title.trim(),
    description: code.description.trim(),
    location: code.location?.trim(),
  },
});
