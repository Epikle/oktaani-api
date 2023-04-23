import { Request, Response } from 'express';

import Share from './share.model';

export const createSharedCollection = async (req: Request, res: Response) => {
  const { id } = req.body;
  const collection = await Share.findOne({ id }, '-_id -__v -todos._id');

  if (!collection) {
    const createdShare = new Share(req.body);
    await createdShare.save();
  }

  res.sendStatus(201);
};

export const getSharedCollection = async (req: Request, res: Response) => {
  const { id } = req.params;

  const collection = await Share.findOne({ id }, '-_id -__v -todos._id');

  if (!collection) {
    res.status(404);
    throw new Error('Not Found');
  }

  res.status(200).json(collection);
};

export const updateSharedCollection = async (req: Request, res: Response) => {
  const { id } = req.params;

  const updatedCollection = await Share.findOneAndReplace(
    { id },
    { ...req.body, id },
    {
      runValidators: true,
    }
  );

  if (!updatedCollection) {
    res.status(404);
    throw new Error('Not Found');
  }

  res.sendStatus(204);
};

export const deleteSharedCollection = async (req: Request, res: Response) => {
  const { id } = req.params;

  await Share.deleteOne({ id });

  res.sendStatus(204);
};
