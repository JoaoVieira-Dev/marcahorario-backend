import bcrypt from 'bcrypt';
import User from '../../models/User';
import HttpResponseError from '../../exceptions/HttpResponseError';
import loginValidator from './utils/login-validator';

const findUser = where => User.query()
  .where(where)
  .first();


const makeLogin = async (form) => {
  if (!loginValidator(form)) {
    throw new HttpResponseError({
      status: 401,
      message: 'Usuário e senha são necessários para o login',
    });
  }

  const user = await findUser({ email: form.email.toLowerCase().trim() });

  if (!user) {
    throw new HttpResponseError({
      status: 401,
      message: 'Usuário não consta em nossa base',
    });
  }

  if (!user.is_active) {
    throw new HttpResponseError({
      status: 401,
      message: 'Usuário inativo',
    });
  }

  if (!(await bcrypt.compare(form.password, user.password))) {
    throw new HttpResponseError({
      status: 401,
      message: 'Senha inválida',
    });
  }

  return user;
};


const renew = (req, res) => findUser({ id: req.user.id })
  .then(response => res.send({ result: response }))
  .catch((error) => {
    const [status, response] = errorToResponse(error);
    return res.status(status).send(response);
  });

  const registerUser = async (data, fkUser) => {
    const userCheck = await User.query()
      .where({
        email: data.email,
      })
      .first();
  
    if (userCheck) {
      throw new HttpResponseError({
        status: 422,
        message: 'Email já cadastrado em outro usuário.',
      });
    }
  
    const passwordHash = await bcrypt.hash(String(data.password), 10);
  
    const user = await User.query()
      .insert({
        ...data,
        name: data.name,
        email: data.email,
        password: passwordHash,
        is_active: true,
        reset_password: false,
      });
    return user;
  };

export { makeLogin, findUser, registerUser };
