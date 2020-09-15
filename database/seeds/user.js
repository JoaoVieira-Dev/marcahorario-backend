
exports.seed = function (knex) {
  // Deletes ALL existing entries
  return knex('users').del()
    .then(function () {
      // Inserts seed entries
      return knex('users').insert([
        {
          id: 1,
          name: 'Development',
          email: 'admin@admin.com',
          password: '$2b$10$bn5Iar4Y65XJ3q66itb1q.YXFTwkfLKj5LIihoouHTvf4JG9HhU4y',
          is_active: 1
        },
      ]);
    });
};
