import createJWKSMock, { JWKSMock } from 'mock-jwks';

export const startAuthServer = (): JWKSMock => {
  const jwks = createJWKSMock(process.env.AUTH0_DOMAIN_QWIA || '');
  jwks.start();

  return jwks;
};

export const getToken = (jwks: JWKSMock): string => {
  const token = jwks.token({
    aud: process.env.AUTH0_AUDIENCE_QWIA,
    iss: `${process.env.AUTH0_DOMAIN_QWIA}/`,
  });

  return token;
};

export const stopAuthServer = (jwks: JWKSMock): void => {
  jwks.stop();
};
