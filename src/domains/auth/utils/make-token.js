import jwt from 'jwt-simple';
import moment from 'moment-timezone'
import env from 'helpers/env';

const makeToken = (user) => {
  const payload = {
    exp: moment().add(14, 'days').unix(),
    iat: moment().unix(),
    sub: { id: user.id },
  };

  return jwt.encode(payload, env('JWT_SECRET', process.env.JWT_SECRET).toString());
};

export default makeToken;
