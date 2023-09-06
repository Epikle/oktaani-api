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

  const results = await Stats.aggregate([
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
  ]);

  const monthNames = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];
  const countsByMonthMap = new Map();
  const finalResults: any[] = [];

  results.forEach((result) => {
    const monthIndex = result._id - 1;
    countsByMonthMap.set(monthNames[monthIndex], result.point);
  });

  monthNames
    .slice(sixMonthsAgo.getMonth() + 1, new Date().getMonth() + 1)
    .forEach((monthName) => {
      const count = countsByMonthMap.get(monthName) || 0;
      finalResults.push({ point: count });
    });

  res.json(finalResults);
};

export const createStats = async (req: Request, res: Response) => {
  const newStats = new Stats(req.body);
  await newStats.save();

  res.sendStatus(201);
};
