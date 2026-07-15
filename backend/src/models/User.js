const bcrypt = require('bcryptjs');

module.exports = (db) => {
  return {
    findByUsername: (username, callback) => {
      const sql = `SELECT * FROM users WHERE username = ?`;
      db.get(sql, [username], (err, row) => callback(err, row));
    },

    create: async (username, plainPassword, callback) => {
      try {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(plainPassword, salt);

        const sql = `INSERT INTO users (username, password) VALUES (?, ?)`;
        db.run(sql, [username, hashedPassword], function (err) {
          callback(err, this ? this.lastID : null);
        });
      } catch (error) {
        callback(error, null);
      }
    },

    verifyPassword: async (plainPassword, hashedPassword) => {
      return await bcrypt.compare(plainPassword, hashedPassword);
    }
  };
};