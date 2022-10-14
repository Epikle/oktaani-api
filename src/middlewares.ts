import { NextFunction, Request, Response } from 'express';
import { expressjwt, GetVerificationKey } from 'express-jwt';
import jwksRsa from 'jwks-rsa';

type ErrorResponse = {
  message: string;
  stack?: string;
};

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
  let statusCode: number;

  switch (error.name) {
    case 'UnauthorizedError':
    case 'JsonWebTokenError':
    case 'TokenExpiredError':
      statusCode = 401;
      break;
    case 'CastError':
    case 'ValidationError':
      statusCode = 400;
      break;
    default:
      statusCode = res.statusCode !== 200 ? res.statusCode : 500;
  }

  res.status(statusCode);
  res.json({
    message: error.message,
    stack: process.env.NODE_ENV === 'production' ? '👋🌎' : error.stack,
  });
};

export const checkJwtQwia = expressjwt({
  secret: jwksRsa.expressJwtSecret({
    cache: true,
    rateLimit: true,
    jwksRequestsPerMinute: 5,
    jwksUri: `${process.env.AUTH0_DOMAIN_QWIA}/.well-known/jwks.json`,
  }) as GetVerificationKey,
  audience: process.env.AUTH0_AUDIENCE_QWIA,
  issuer: `${process.env.AUTH0_DOMAIN_QWIA}/`,
  algorithms: ['RS256'],
});

export const checkJwtOktaani = expressjwt({
  secret: jwksRsa.expressJwtSecret({
    cache: true,
    rateLimit: true,
    jwksRequestsPerMinute: 5,
    jwksUri: `${process.env.AUTH0_DOMAIN_OKTAANI}/.well-known/jwks.json`,
  }) as GetVerificationKey,
  audience: process.env.AUTH0_AUDIENCE_OKTAANI,
  issuer: `${process.env.AUTH0_DOMAIN_OKTAANI}/`,
  algorithms: ['RS256'],
});
