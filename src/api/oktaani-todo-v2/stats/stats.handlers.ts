import { Request, Response } from 'express';

import Stats, { StatsTypes } from './stats.model';

export const getStats = async (req: Request, res: Response) => {
  const { type } = req.query as { type: string | undefined };

  if (!type || !(type in StatsTypes)) {
    res.status(400);
    throw new Error('Bad Request');
  }

  const sixMonthsAgo = new Date();
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

  const lastSixMonths = await Stats.aggregate([
    {
      $match: {
        type,
        createdAt: { $gte: sixMonthsAgo },
      },
    },
    {
      $group: {
        _id: { $month: '$createdAt' },
        point: { $sum: 1 },
      },
    },
    {
      $sort: {
        _id: 1,
      },
    },
    {
      $project: {
        _id: 0,
        point: 1,
      },
    },
  ]);

  res.json(lastSixMonths);
};

export const createStats = async (req: Request, res: Response) => {
  const newStats = new Stats(req.body);
  await newStats.save();

  res.sendStatus(201);
};
