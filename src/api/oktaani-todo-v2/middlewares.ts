import { NextFunction, Request, Response } from 'express';

import Log from './log/log.model';

export const logger = (message: string) => {
  return async (req: Request, _res: Response, next: NextFunction) => {
    const { id } = req.params;
    const newLog = {
      shareId: id,
      message,
    };

    const createdLog = new Log(newLog);
    await createdLog.save();

    next();
  };
};
