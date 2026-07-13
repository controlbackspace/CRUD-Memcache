// src/models/Person.js
module.exports = (db) => {
  return {
    create: (personData, callback) => {
      const { user_id, firstname, lastname, dob, sex } = personData;
      const sql = `INSERT INTO persons (user_id, firstname, lastname, dob, sex) VALUES (?, ?, ?, ?, ?)`;
      db.run(sql, [user_id, firstname, lastname, dob, sex], function (err) {
        callback(err, this ? this.lastID : null);
      });
    },

    findAllByUserId: (user_id, callback) => {
      const sql = `SELECT * FROM persons WHERE user_id = ?`;
      db.all(sql, [user_id], (err, rows) => callback(err, rows));
    },

    findById: (id, user_id, callback) => {
      const sql = `SELECT * FROM persons WHERE id = ? AND user_id = ?`;
      db.get(sql, [id, user_id], (err, row) => callback(err, row));
    },

    update: (id, user_id, updateData, callback) => {
      const { firstname, lastname, dob, sex } = updateData;
      const sql = `UPDATE persons SET firstname = ?, lastname = ?, dob = ?, sex = ? WHERE id = ? AND user_id = ?`;
      db.run(sql, [firstname, lastname, dob, sex, id, user_id], function (err) {
        callback(err, this ? this.changes : 0);
      });
    },

    delete: (id, user_id, callback) => {
      const sql = `DELETE FROM persons WHERE id = ? AND user_id = ?`;
      db.run(sql, [id, user_id], function (err) {
        callback(err, this ? this.changes : 0);
      });
    }
  };
};