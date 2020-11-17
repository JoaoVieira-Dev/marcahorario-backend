import errorToResponse from '../../helpers/error-to-response';
import makeToken from './utils/make-token';
import { makeLogin, findUser } from './repository';
const bcrypt = require('bcrypt');
import * as Rep from './repository';

const login = (req, res) => makeLogin(req.body)
  .then(async user => {
    const token = makeToken(user);

    return res.send({
      token,
      user,
    });
  })
  .catch((error) => {
    const [status, response] = errorToResponse(error);
    return res.status(status).send(response);
  });

const renew = (req, res) => findUser({ id: req.user.id })
  .then(async user => {
    const token = makeToken(user);
    const dataSync = await dataUser({ user });

    return res.send({
      token,
      user,
      dataSync,
    });
  })
  .catch((error) => {
    const [status, response] = errorToResponse(error);
    return res.status(status).send(response);
  });

  const signup = async (req, res) => Rep.registerUser(req.body)
  .then(async (user) => {
    const token = makeToken(user);

    return res.send({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        is_active: user.is_active,
      }
    })
  })
  .catch((error) => {
    const [status, response] = errorToResponse(error);
    return res.status(status).send(response);
  });

export { login, renew, signup };
