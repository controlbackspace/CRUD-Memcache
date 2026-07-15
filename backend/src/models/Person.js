// C:\Users\jakea\Basic_CRUD_Application\backend\src\models\Person.js
const db = require('../config/db'); // FIX: Step up and reference your clean database configuration!
// ^^^ FIX: Restores the connection path from the models folder back to the config directory

// Helper utility function to dynamically compute age on database reads
function calculateAge(dobString) {
  if (!dobString) return 0;
  const birthDate = new Date(dobString);
  const today = new Date();
  let calculatedAge = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    calculatedAge--;
  }
  return calculatedAge < 0 ? 0 : calculatedAge;
}

const Person = {
  // Create a new record bound to the authenticated user ID
  create: (personData, userId) => {
    return new Promise((resolve, reject) => {
      const { firstname, lastname, dob, sex } = personData;
      const sql = `
        INSERT INTO persons (firstname, lastname, dob, sex, user_id)
        VALUES (?, ?, ?, ?, ?)
      `;
      db.run(sql, [firstname, lastname, dob, sex, userId], function(err) {
        if (err) {
          reject(err);
        } else {
          resolve({ 
            id: this.lastID, 
            firstname, 
            lastname, 
            dob, 
            sex, 
            age: calculateAge(dob), 
            user_id: userId 
          });
        }
      });
    });
  },

  // Read all records belonging to the authenticated user with dynamic runtime age derivation
  findAllByUserId: (userId) => {
    return new Promise((resolve, reject) => {
      const sql = `SELECT * FROM persons WHERE user_id = ?`;
      db.all(sql, [userId], (err, rows) => {
        if (err) {
          reject(err);
        } else {
          const mappedRows = rows.map(row => ({
            ...row,
            age: calculateAge(row.dob) 
          }));
          resolve(mappedRows);
        }
      });
    });
  },

  // Update an existing record verifying ownership bounds
  update: (id, personData, userId) => {
    return new Promise((resolve, reject) => {
      const { firstname, lastname, dob, sex } = personData;
      const sql = `
        UPDATE persons 
        SET firstname = ?, lastname = ?, dob = ?, sex = ?
        WHERE id = ? AND user_id = ?
      `;
      db.run(sql, [firstname, lastname, dob, sex, id, userId], function(err) {
        if (err) {
          reject(err);
        } else {
          resolve({ changes: this.changes });
        }
      });
    });
  },

  // Delete a record safely
  delete: (id, userId) => {
    return new Promise((resolve, reject) => {
      const sql = `DELETE FROM persons WHERE id = ? AND user_id = ?`;
      db.run(sql, [id, userId], function(err) {
        if (err) {
          reject(err);
        } else {
          resolve({ changes: this.changes });
        }
      });
    });
  }
};

module.exports = Person;