const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Usar caminho absoluto para o banco de dados na raiz do projeto
const dbPath = path.join(__dirname, '..', 'users.db');
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Erro ao conectar ao banco de dados:', err);
  } else {
    console.log('Conectado ao banco de dados SQLite em:', dbPath);
  }
});

db.serialize(() => {
  db.run(`PRAGMA foreign_keys = ON`);
  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      bio TEXT,
      mensage_important TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS cursos (
      id_curso INTEGER PRIMARY KEY AUTOINCREMENT,
      nome_curso TEXT UNIQUE NOT NULL,
      descricao TEXT NOT NULL,
      user_id INTEGER NOT NULL,
      progress TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      expires_at DATETIME DEFAULT (DATETIME(CURRENT_TIMESTAMP, '+30 days')),
      status BOOLEAN DEFAULT 1,
      FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE
    )
  `);
});

module.exports = db;