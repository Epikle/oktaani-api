import { Request, Response } from 'express';

import Dtc, { TDtc } from './dtc.model';
import { trimDtc } from './util/dtc.util';

export const getAllDtcs = async (_req: Request, res: Response<TDtc[]>) => {
  const dtcs = await Dtc.find({}).sort('code.title');

  res.json(dtcs);
};

export const createDtc = async (
  req: Request<{}, {}, TDtc>,
  res: Response<TDtc>
) => {
  const { system, code } = req.body;

  const trimmedDtc = trimDtc({ system, code });

  const newDtc = new Dtc(trimmedDtc);
  const addedDtc = await newDtc.save();

  res.status(201).json(addedDtc);
};

export const updateDtcById = async (
  req: Request<{ id: string }, {}, TDtc>,
  res: Response<TDtc>
) => {
  const { id } = req.params;
  const { system, code } = req.body;

  const trimmedDtc = trimDtc({ system, code });

  const updatedDtc = await Dtc.findByIdAndUpdate(
    id,
    { ...trimmedDtc },
    {
      new: true,
      runValidators: true,
    }
  );

  if (!updatedDtc) {
    res.status(404);
    throw new Error('Dtc not found.');
  }

  res.json(updatedDtc);
};

export const deleteDtcById = async (req: Request, res: Response) => {
  const { id } = req.params;

  const dtc = await Dtc.findByIdAndRemove(id);

  if (!dtc) {
    res.status(404);
    throw new Error('Dtc not found.');
  }

  res.status(204).end();
};
