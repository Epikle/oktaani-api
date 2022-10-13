import { Request, Response } from 'express';

import Share, { TShare } from './share.model';

export const createNewShare = async (req: Request, res: Response) => {
  const { shareData }: { shareData: TShare } = req.body;
  const createdShare = new Share(shareData);

  await createdShare.save();

  res.status(201).end();
};

export const getShareById = async (req: Request, res: Response) => {
  const shareId = req.params.id;

  const sharedCollection = await Share.findOne(
    { shareId: shareId },
    { __v: 0, _id: 0, shareId: 0 }
  );

  if (!sharedCollection) {
    res.status(404);
    throw new Error('Share not found.');
  }

  res.json({ sharedCollection });
};

export const deleteShareById = async (req: Request, res: Response) => {
  const shareId = req.params.id;

  await Share.deleteOne({ shareId: shareId });

  res.status(204).end();
};
