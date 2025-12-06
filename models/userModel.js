const db = require('../config/db');

const createUser = (username, email, password) => {
  return new Promise((resolve, reject) => {
    db.run(
      `INSERT INTO users (username, email, password) VALUES (?, ?, ?)`,
      [username, email, password],
      function(err) {
        if (err) return reject(err);
        resolve({ id: this.lastID, username, email });
      }
    );
  });
};

const findUserByEmail = (email) => {
  return new Promise((resolve, reject) => {
    db.get(`SELECT * FROM users WHERE email = ?`, [email], (err, row) => {
      if (err) return reject(err);
      resolve(row);
    });
  });
};

module.exports = { createUser, findUserByEmail };
