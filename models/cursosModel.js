const db = require("../config/db");

const addNovoCurso = (nome_curso, descricao, grau, imagem, user_id) => {
  return new Promise((resolve, reject) => {
    db.run(
      `INSERT INTO cursos (nome_curso, descricao, grau, imagem, user_id) VALUES(?, ?, ?, ?, ?)`,
      [nome_curso, descricao, grau, imagem, user_id],
      function (err) {
        if(err) return reject(err);
        resolve({
          id: this.lastID, 
          nome_curso, 
          descricao, 
          grau, 
          imagem, 
          user_id
        });
      },
    );
  });
};

const dellCurso = (id_curso, user_id) => {
  return new Promise((resolve, reject) => {
    db.run(
      `DELETE FROM cursos WHERE id_curso = ? AND user_id = ?`, 
      [id_curso, user_id], 
      function (err) {
        if (err) {
          return reject(err);
        }
        if (this.changes === 0) {
          return reject(new Error("Curso não encontrado ou você não tem permissão"));
        }
        resolve({ message: "Curso deletado com sucesso" });
      }
    );
  });
};

module.exports = {
  addNovoCurso,
  dellCurso
};