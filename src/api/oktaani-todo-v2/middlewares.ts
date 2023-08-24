import { NextFunction, Request, Response } from 'express';

import Share from './share/share.model';
import Log from './log/log.model';

export const logger = (message: string) => {
  return async (req: Request, _res: Response, next: NextFunction) => {
    const { id } = req.params;
    const collection = await Share.findOne({ 'col.id': id });

    if (!collection) return next();

    const createdLog = new Log({
      colId: id,
      message,
    });
    await createdLog.save();

    next();
  };
};
