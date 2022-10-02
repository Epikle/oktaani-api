import createJWKSMock, { JWKSMock } from 'mock-jwks';

export const startAuthServer = (): JWKSMock => {
  const jwks = createJWKSMock(process.env.AUTH0_DOMAIN || '');
  jwks.start();

  return jwks;
};

export const getToken = (jwks: JWKSMock): string => {
  const token = jwks.token({
    aud: process.env.AUTH0_AUDIENCE,
    iss: `${process.env.AUTH0_DOMAIN}/`,
  });

  return token;
};

export const stopAuthServer = (jwks: JWKSMock): void => {
  jwks.stop();
};
