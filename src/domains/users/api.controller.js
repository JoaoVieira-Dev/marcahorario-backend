import User from '../../models/User';
import makeToken from '../auth/utils/make-token';
import moment from 'moment-timezone';
const bcrypt = require('bcrypt');

const paginate = async (req, res) => {
  const pager = await User.paginate({
    page: Number(req.query.page || 1),
    pageSize: 10,
    filters: req.query.filter,
    order: req.query.order,
  });
  return res.status(200).responseComposer(pager)
}

const resetPassword = async (req, res) => {
  await User.query()
    .patchAndFetchById(
      req.user.id,
      {
        reset_password: true,
        password: await bcrypt.hash(req.body.password, 10),
        updated_at: moment().tz('America/Fortaleza').format('YYYY-MM-DD HH:mm:ss'),
      })
    .then(async (user) => {
      const token = makeToken(user);
      const dataSync = await dataUser({ user });

      return res.send({
        token,
        user,
        dataSync,
      });
    })
    .catch((error) => {
      console.log('change passwor error', error)
      return res.status(500).json({
        message: 'Um erro ocorreu.',
        data: error
      });
    });
}

export { resetPassword, paginate };
