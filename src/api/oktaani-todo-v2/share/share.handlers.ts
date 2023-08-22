import { Request, Response } from 'express';

import Share, { SharedEntry } from './share.model';

export const createSharedCollection = async (
  req: Request<{}, {}, SharedEntry>,
  res: Response
) => {
  const createdShare = new Share(req.body);
  await createdShare.save();

  res.sendStatus(201);
};

export const getSharedCollection = async (
  req: Request<{ id: string }>,
  res: Response<SharedEntry>
) => {
  const { id } = req.params;
  const collection = await Share.findOne({ 'col.id': id }, '-_id -__v');

  if (!collection) {
    res.status(404);
    throw new Error('Not Found');
  }

  res.status(200).json(collection);
};

export const updateSharedCollection = async (
  req: Request<{ id: string }, {}, SharedEntry>,
  res: Response
) => {
  const { id } = req.params;
  const collection = await Share.findOne({ 'col.id': id });

  if (!collection) {
    res.status(404);
    throw new Error('Not Found');
  }

  await Share.findOneAndReplace({ 'col.id': id }, req.body, {
    runValidators: true,
  });

  res.sendStatus(204);
};

export const deleteSharedCollection = async (
  req: Request<{ id: string }>,
  res: Response
) => {
  const { id } = req.params;
  await Share.deleteOne({ 'col.id': id });

  res.sendStatus(204);
};
