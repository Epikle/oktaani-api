import { Request, Response } from 'express';

import Share, { Item, type Collection, type SharedEntry } from './share.model';

export const createSharedCollection = async (req: Request<{}, {}, SharedEntry>, res: Response) => {
  let cancel = false;

  res.on('close', () => {
    cancel = true;
  });

  // Wait a second, if the user wants to cancel the share.
  await new Promise((resolve) => setTimeout(resolve, 1000));

  if (!cancel) {
    const createdShare = new Share(req.body);
    await createdShare.save();
  }

  res.sendStatus(201);
};

export const createSharedItem = async (req: Request<{ cid: string }, {}, Item>, res: Response) => {
  const { cid } = req.params;
  const collection = await Share.findOne({ 'col.id': cid });

  if (!collection) {
    res.status(404);
    throw new Error('Not Found');
  }

  collection.items = collection.items ? [req.body, ...collection.items] : [req.body];

  await collection.save();

  res.sendStatus(201);
};

export const getSharedCollection = async (req: Request<{ cid: string }>, res: Response<SharedEntry>) => {
  const { cid } = req.params;
  const collection = await Share.findOne({ 'col.id': cid }, '-_id -__v');

  if (!collection) {
    res.status(404);
    throw new Error('Not Found');
  }

  res.status(200).json(collection);
};

export const updateSharedCollection = async (req: Request<{ cid: string }, {}, Partial<Collection>>, res: Response) => {
  const { cid } = req.params;
  const collection = await Share.findOne({ 'col.id': cid });

  if (!collection) {
    res.status(404);
    throw new Error('Not Found');
  }

  Object.assign(collection.col, req.body);
  await collection.save();

  res.sendStatus(204);
};

export const updateSharedItem = async (req: Request<{ cid: string; id: string }, {}, Partial<Item>>, res: Response) => {
  const { cid, id } = req.params;
  const collection = await Share.findOne({ 'col.id': cid });

  if (!collection) {
    res.status(404);
    throw new Error('Not Found');
  }

  const item = collection.items?.find((i) => i.id === id);
  if (item) {
    Object.assign(item, req.body);
    await collection.save();
  }

  res.sendStatus(204);
};

export const deleteSharedCollection = async (req: Request<{ cid: string }>, res: Response) => {
  const { cid } = req.params;
  let cancel = false;

  res.on('close', () => {
    cancel = true;
  });

  // Wait a second, if the user wants to cancel the delete.
  await new Promise((resolve) => setTimeout(resolve, 1000));

  if (!cancel) {
    await Share.deleteOne({ 'col.id': cid });
  }

  res.sendStatus(204);
};

export const deleteSharedItems = async (req: Request<{ cid: string }>, res: Response) => {
  const { cid } = req.params;
  const collection = await Share.findOne({ 'col.id': cid });

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

export const deleteSharedItem = async (req: Request<{ cid: string; id: string }>, res: Response) => {
  const { cid, id } = req.params;
  const collection = await Share.findOne({ 'col.id': cid });

  if (!collection) {
    res.status(404);
    throw new Error('Not Found');
  }

  if (collection.items) {
    const filteredItems = collection.items.filter((item) => item.id !== id);
    collection.items = filteredItems.length > 0 ? filteredItems : null;
    await collection.save();
  }

  res.sendStatus(204);
};
