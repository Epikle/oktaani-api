import { NextFunction, Request, Response } from 'express';

import Share from './share/share.model';
import Log from './log/log.model';

export const logger = (message: string) => {
  return async (
    req: Request<{ cid: string }>,
    _res: Response,
    next: NextFunction
  ) => {
    const { cid } = req.params;
    const collection = await Share.findOne({ 'col.id': cid });

    if (!collection) return next();

    const createdLog = new Log({
      colId: cid,
      message,
    });
    await createdLog.save();

    next();
  };
};

export const checkStatsAuth = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { key } = req.query as { key: string | undefined };

  if (!key || key !== process.env.OKTAANI_TODO_KEY) {
    res.status(401);
    throw new Error('Unauthorized');
  }

  next();
};
