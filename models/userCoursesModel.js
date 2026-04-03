const db = require("../config/db");

// Inscrever usuário em um curso
const enrollInCourse = (userId, cursoId) => {
  return new Promise((resolve, reject) => {
    db.run(
      `INSERT OR IGNORE INTO user_courses (user_id, curso_id, status) VALUES (?, ?, 'enrolled')`,
      [userId, cursoId],
      function(err) {
        if (err) return reject(err);

        if (this.changes === 0) {
          // Já estava inscrito, verifica se está cancelado
          db.get(
            `SELECT * FROM user_courses WHERE user_id = ? AND curso_id = ?`,
            [userId, cursoId],
            (err, row) => {
              if (err) return reject(err);
              if (row?.status === 'canceled') {
                resolve({ id: row.id, user_id: userId, curso_id: cursoId, status: 'reattached', message: 'Reinscrito no curso' });
              } else {
                resolve({ id: row.id, user_id: userId, curso_id: cursoId, status: 'already_enrolled', message: 'Já estava inscrito' });
              }
            }
          );
          return;
        }

        resolve({ id: this.lastID, user_id: userId, curso_id: cursoId, status: 'enrolled', message: 'Inscrito no curso com sucesso' });
      }
    );
  });
};

// Buscar inscrição do usuário em um curso
const getUserCourseProgress = (userId, cursoId) => {
  return new Promise((resolve, reject) => {
    db.get(
      `SELECT * FROM user_courses WHERE user_id = ? AND curso_id = ?`,
      [userId, cursoId],
      (err, row) => {
        if (err) return reject(err);
        resolve(row || null);
      }
    );
  });
};

// Atualizar progresso do curso
const updateCourseProgress = (userId, cursoId, progressPercent) => {
  return new Promise((resolve, reject) => {
    const status = progressPercent >= 100 ? 'completed' : 'in_progress';
    const completedAt = progressPercent >= 100 ? new Date() : null;

    db.run(
      `UPDATE user_courses SET progress_percent = ?, status = ?, completed_at = ? WHERE user_id = ? AND curso_id = ?`,
      [progressPercent, status, completedAt, userId, cursoId],
      function(err) {
        if (err) return reject(err);
        resolve({ user_id: userId, curso_id: cursoId, progress_percent: progressPercent, status });
      }
    );
  });
};

// Listar todos os cursos do usuário com progresso
const getUserCourses = (userId) => {
  return new Promise((resolve, reject) => {
    db.all(
      `SELECT uc.*, c.nome_curso, c.descricao, c.grau, c.imagem
       FROM user_courses uc
       INNER JOIN cursos c ON uc.curso_id = c.id_curso
       WHERE uc.user_id = ?
       ORDER BY uc.enrolled_at DESC`,
      [userId],
      (err, rows) => {
        if (err) return reject(err);
        resolve(rows);
      }
    );
  });
};

// Cancelar inscrição em um curso
const cancelEnrollment = (userId, cursoId) => {
  return new Promise((resolve, reject) => {
    db.run(
      `UPDATE user_courses SET status = 'canceled' WHERE user_id = ? AND curso_id = ?`,
      [userId, cursoId],
      function(err) {
        if (err) return reject(err);
        if (this.changes === 0) {
          return reject(new Error("Inscrição não encontrada"));
        }
        resolve({ message: "Inscrição cancelada com sucesso" });
      }
    );
  });
};

// Listar cursos completados pelo usuário
const getCompletedCourses = (userId) => {
  return new Promise((resolve, reject) => {
    db.all(
      `SELECT uc.*, c.nome_curso, c.descricao, c.grau, c.imagem
       FROM user_courses uc
       INNER JOIN cursos c ON uc.curso_id = c.id_curso
       WHERE uc.user_id = ? AND uc.status = 'completed'
       ORDER BY uc.completed_at DESC`,
      [userId],
      (err, rows) => {
        if (err) return reject(err);
        resolve(rows);
      }
    );
  });
};

module.exports = {
  enrollInCourse,
  getUserCourseProgress,
  updateCourseProgress,
  getUserCourses,
  cancelEnrollment,
  getCompletedCourses,
};
