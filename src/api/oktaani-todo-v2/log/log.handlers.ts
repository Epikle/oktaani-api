import { Request, Response } from 'express';

import Log from './log.model';

export const getLogsByid = async (req: Request, res: Response) => {
  const { id } = req.params;

  const logs = await Log.find({ shareId: id }, '-updatedAt')
    .sort({
      createdAt: -1,
    })
    .limit(5);

  res.status(200).json(logs);
};
