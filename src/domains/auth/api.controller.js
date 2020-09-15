import errorToResponse from '../../helpers/error-to-response';
import makeToken from './utils/make-token';
import { makeLogin, findUser } from './repository';

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

export { login, renew };
