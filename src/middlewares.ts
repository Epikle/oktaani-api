import { NextFunction, Request, Response } from 'express';
import { expressjwt, GetVerificationKey } from 'express-jwt';
import jwksRsa from 'jwks-rsa';

import { ErrorResponse } from './types/ErrorResponse.type';

export const notFound = (req: Request, res: Response, next: NextFunction) => {
  res.status(404);
  const error = new Error(`Not Found - ${req.originalUrl}`);
  next(error);
};

export const errorHandler = (
  error: Error,
  _req: Request,
  res: Response<ErrorResponse>,
  _next: NextFunction
) => {
  let statusCode = res.statusCode !== 200 ? res.statusCode : 500;
  statusCode = error.name === 'CastError' ? 400 : statusCode;
  statusCode =
    error.name === 'UnauthorizedError' ||
    error.name === 'JsonWebTokenError' ||
    error.name === 'TokenExpiredError'
      ? 401
      : statusCode;

  res.status(statusCode);
  res.json({
    message: error.message,
    stack: process.env.NODE_ENV === 'production' ? '👋🌎' : error.stack,
  });
};

export const checkJwt = expressjwt({
  secret: jwksRsa.expressJwtSecret({
    cache: true,
    rateLimit: true,
    jwksRequestsPerMinute: 5,
    jwksUri: `${process.env.AUTH0_DOMAIN}/.well-known/jwks.json`,
  }) as GetVerificationKey,
  audience: process.env.AUTH0_AUDIENCE,
  issuer: `${process.env.AUTH0_DOMAIN}/`,
  algorithms: ['RS256'],
});
