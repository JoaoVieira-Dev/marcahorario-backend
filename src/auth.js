import passport from 'passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import User from './models/User';
import logger from './helpers/logger';
import env from './helpers/env';

const params = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: env('JWT_SECRET', process.env.JWT_SECRET).toString()
};

const strategyHandlerApi = () => (payload, done) => {
  const { id } = payload.sub;

  User.query()
    .findById(id)
    .where('is_active', true)
    .first()
    .then(user => done(null, user))
    .catch(error => logger.error(error));
};

const adminStrategy = new Strategy(params, strategyHandlerApi());

passport.use('api-jwt', adminStrategy);

export const lockForApi = (options = {}) => passport.authenticate('api-jwt', {
  session: false,
  failWithError: true,
  ...options,
});
