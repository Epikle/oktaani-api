import { Request, Response } from 'express';

import Share, { Item, type Collection, type SharedEntry } from './share.model';

export const createSharedCollection = async (
  req: Request<{}, {}, SharedEntry>,
  res: Response
) => {
  const createdShare = new Share(req.body);
  await createdShare.save();

  res.sendStatus(201);
};

export const createSharedItem = async (
  req: Request<{ id: string }, {}, Item>,
  res: Response
) => {
  const { id } = req.params;
  const collection = await Share.findOne({ 'col.id': id });

  if (!collection) {
    res.status(404);
    throw new Error('Not Found');
  }

  collection.items = collection.items
    ? [req.body, ...collection.items]
    : [req.body];

  await collection.save();

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
  req: Request<{ id: string }, {}, Partial<Collection>>,
  res: Response
) => {
  const { id } = req.params;
  const collection = await Share.findOne({ 'col.id': id });

  if (!collection) {
    res.status(404);
    throw new Error('Not Found');
  }

  Object.assign(collection.col, req.body);
  await collection.save();

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

export const deleteSharedItems = async (
  req: Request<{ id: string }>,
  res: Response
) => {
  const { id } = req.params;
  const collection = await Share.findOne({ 'col.id': id });

  if (!collection) {
    res.status(404);
    throw new Error('Not Found');
  }

  if (collection.items) {
    const filteredItems = collection.items.filter((item) => !item.status);
    collection.items = filteredItems.length > 0 ? filteredItems : null;
    await collection.save();
  }

  res.sendStatus(204);
};
