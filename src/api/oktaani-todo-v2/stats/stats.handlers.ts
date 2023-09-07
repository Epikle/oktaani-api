import { Request, Response } from 'express';

import Stats, { StatsTypes } from './stats.model';

export const getStats = async (req: Request, res: Response) => {
  const { type } = req.query as { type: string | undefined };

  if (!type || !(type in StatsTypes)) {
    res.status(400);
    throw new Error('Bad Request');
  }

  const lastYear = new Date();
  lastYear.setHours(0, 0, 0, 0);
  lastYear.setMonth(lastYear.getMonth() - 11, 1);

  const results = await Stats.aggregate([
    {
      $match: {
        type,
        createdAt: { $gte: lastYear },
      },
    },
    {
      $group: {
        _id: { $month: '$createdAt' },
        point: { $sum: 1 },
        createdAt: { $first: '$createdAt' },
      },
    },
    {
      $sort: {
        createdAt: 1,
      },
    },
    {
      $project: {
        _id: 1,
        point: 1,
      },
    },
  ]);

  const monthsArray = Array.from({ length: 12 }, (_v, idx) => {
    const resultIndex = results.findIndex((r) => r._id === idx + 1);

    if (resultIndex >= 0) {
      return results[resultIndex];
    }

    return {
      _id: idx + 1,
      point: 0,
    };
  });

  const currentMonthId = new Date().getMonth() + 1;
  const futureMonths = monthsArray.filter(
    (month) => month._id > currentMonthId
  );
  const currentAndPastMonths = monthsArray.filter(
    (month) => month._id <= currentMonthId
  );
  const arrangedMonths = [...futureMonths, ...currentAndPastMonths];

  res.json(arrangedMonths);
};

export const createStats = async (req: Request, res: Response) => {
  const newStats = new Stats(req.body);
  await newStats.save();

  res.sendStatus(201);
};
