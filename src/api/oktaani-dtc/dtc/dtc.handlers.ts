import { Request, Response } from 'express';

import Dtc from './dtc.model';

export const getAllDtcs = async (req: Request, res: Response) => {
  const dtcs = await Dtc.find({});

  if (dtcs.length === 0) {
    res.status(404);
    throw new Error('DTCs not found.');
  }

  res.json(dtcs);
};
