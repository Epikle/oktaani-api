import { Request, Response } from 'express';

import Stats, { StatsTypes } from './stats.model';

export const getStats = async (req: Request, res: Response) => {
  const { type } = req.query as { type: string | undefined };

  if (!type || !(type in StatsTypes)) {
    res.status(400);
    throw new Error('Bad Request');
  }

  const statsCount = await Stats.find({ type }).countDocuments();

  res.json({ count: statsCount });
};

export const createStats = async (req: Request, res: Response) => {
  const newStats = new Stats(req.body);
  await newStats.save();

  res.sendStatus(201);
};
