const db = require("../config/db");

// #region Crate/Find

const createUser = (username, email, password) => {
  return new Promise((resolve, reject) => {
    db.run(
      `INSERT INTO users (username, email, password) VALUES (?, ?, ?)`,
      [username, email, password],
      (err) => {
        if (err) return reject(err);
        resolve({ id: this.lastID, username, email });
      },
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
// #endregion

// #region editar Nome Usuário
const updateName = (username, id) => {
  return new Promise((resolve, reject) => {
    db.run(
      `UPDATE users SET username = ? WHERE id = ?`,
      [username, id],
      function (err) {
        if (err) {
          reject(err);
        } else {
          resolve({ id, username });
        }
      },
    );
  });
};
// #endregion

// #region Biografia

const updateUserBio = (userId, bio) => {
  return new Promise((resolve, reject) => {
    db.run(`UPDATE users SET bio = ? WHERE id = ?`, [bio, userId], (err) => {
      if (err) return reject(err);
      resolve({ userId, bio });
    });
  });
};

const getUserBio = (userId) => {
  return new Promise((resolve, reject) => {
    db.get(`SELECT bio FROM users WHERE id = ?`, [userId], (err, row) => {
      if (err) return reject(err);
      resolve(row?.bio || null);
    });
  });
};

// #endregion

// #region editar password
  const updatePassword = (newPassword, id) => {
    return new Promise((resolve, reject) => {
      db.run(
        `UPDATE users SET password = ? WHERE id = ?`,
        [newPassword, id],
        function (err) {
          if (err) {
            reject(err);
          } else {
            resolve({ id, newPassword });
          }
        },
      );
    });
  };
// #endregion

// #region editar foto
const updateUserFoto = (userId, foto) => {
  return new Promise((resolve, reject) => {
    db.run(`UPDATE users SET foto = ? WHERE id = ?`, [foto, userId], (err) => {
      if (err) return reject(err);
      resolve({ userId, foto });
    });
  });
};
// #endregion

module.exports = {
  createUser,
  findUserByEmail,
  updateUserBio,
  getUserBio,
  updateName,
  updatePassword,
  updateUserFoto,
};
