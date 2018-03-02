import * as jwt from 'express-jwt';
import * as jwks from 'jwks-rsa';

import { CLIENT_URL } from '../config/express.config';

const AUTH_CONFIG = {
  AUTH_DOMAIN: 'live-starter.auth0.com',
  AUDIENCE_ATTRIBUTE: CLIENT_URL
};

export const authCheck = jwt({
  secret: jwks.expressJwtSecret({
    cache: true,
    rateLimit: true,
    jwksRequestsPerMinute: 5,
    jwksUri: `https://${AUTH_CONFIG.AUTH_DOMAIN}.auth0.com/.well-known/jwks.json`
  }),
  // This is the identifier we set when we created the API
  audience: AUTH_CONFIG.AUDIENCE_ATTRIBUTE,
  issuer: AUTH_CONFIG.AUTH_DOMAIN, // e.g., you.auth0.com
  algorithms: ['RS256']
});
