import Model from './Model';

class User extends Model {
  static tableName = 'users'

  static booleans = [
    'is_active',
  ];

  static jsonSchema = {
    type: 'object',
    required: [
      'email',
      'name',
      'password'
    ],

    properties: {
      id: { type: 'integer' },
      name: { type: 'string' },
      email: { type: 'string', minLength: 1, maxLength: 255 },
      password: { type: 'string' },
      reset_password: { type: 'boolean' },
      is_active: { type: 'boolean' },
      language: { type: 'string' },
      onesignal_token: { type: 'string' },
      created_at: { type: 'timestamp' },
      updated_at: { type: 'timestamp' },
    },
  };
}

export default User;
