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
      foto TEXT,
      mensage_important TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS cursos (
      id_curso INTEGER PRIMARY KEY AUTOINCREMENT,
      nome_curso TEXT NOT NULL,
      descricao TEXT NOT NULL,
      grau TEXT NOT NULL,
      imagem TEXT,
      user_id INTEGER NOT NULL,
      progress TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      expires_at DATETIME DEFAULT (DATETIME(CURRENT_TIMESTAMP, '+30 days')),
      status BOOLEAN DEFAULT 1,
      FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE
    )
  `);

  // Tabela de progresso do aluno nos cursos
  db.run(`
    CREATE TABLE IF NOT EXISTS user_courses (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      curso_id INTEGER NOT NULL,
      enrolled_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      completed_at DATETIME,
      progress_percent INTEGER DEFAULT 0,
      status TEXT DEFAULT 'enrolled',
      UNIQUE(user_id, curso_id),
      FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE,
      FOREIGN KEY(curso_id) REFERENCES cursos(id_curso) ON DELETE CASCADE
    )
  `);

  // Migração: adicionar colunas grau e imagem se não existirem
  db.all("PRAGMA table_info(cursos)", (err, columns) => {
    if (err) {
      console.error('Erro ao verificar colunas de cursos:', err);
      return;
    }
    
    const hasGrau = columns.some(col => col.name === 'grau');
    const hasImagem = columns.some(col => col.name === 'imagem');
    
    if (!hasGrau) {
      db.run(`ALTER TABLE cursos ADD COLUMN grau TEXT`, (err) => {
        if (err) {
          console.error('Erro ao adicionar coluna grau:', err);
        } else {
          console.log('Coluna grau adicionada com sucesso!');
        }
      });
    }
    
    if (!hasImagem) {
      db.run(`ALTER TABLE cursos ADD COLUMN imagem TEXT`, (err) => {
        if (err) {
          console.error('Erro ao adicionar coluna imagem:', err);
        } else {
          console.log('Coluna imagem adicionada com sucesso!');
        }
      });
    }
  });

  // Migração: adicionar coluna foto se não existir
  db.all("PRAGMA table_info(users)", (err, columns) => {
    if (err) {
      console.error('Erro ao verificar colunas:', err);
      return;
    }
    
    const hasFoto = columns.some(col => col.name === 'foto');
    
    if (!hasFoto) {
      db.run(`ALTER TABLE users ADD COLUMN foto TEXT`, (err) => {
        if (err) {
          console.error('Erro ao adicionar coluna foto:', err);
        } else {
          console.log('Coluna foto adicionada com sucesso!');
        }
      });
    }
  });
});

module.exports = db;