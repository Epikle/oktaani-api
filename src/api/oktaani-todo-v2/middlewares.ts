import { NextFunction, Request, Response } from 'express';

import Share from './share/share.model';
import Log from './log/log.model';

export const logger = (message: string) => {
  return async (req: Request, _res: Response, next: NextFunction) => {
    const { id } = req.params;

    const collection = await Share.findOne({ id });

    if (!collection) {
      return next();
    }

    const newLog = {
      shareId: id,
      message,
    };

    const createdLog = new Log(newLog);
    await createdLog.save();

    next();
  };
};
