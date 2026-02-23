const db = require("../config/db");

const addNovoCurso = (user_id, nome_curso, descricao) => {
  return new Promise((resolve, reject) => {
    db.run(
      `INSERT INTO cursos (nome_curso, descricao, user_id) VALUES(?, ?, ?)`,
      [nome_curso, descricao, user_id],
      function (err) {
        if(err) return reject(err);
        resolve({id: this.lastID, user_id, nome_curso, descricao})
      },
    );
  });
};

const dellCurso = (nome_curso) => {
  return new Promise((resolve, reject) => {
    db.run(`DELETE FROM cursos WHERE nome_curso = ?`, [nome_curso], function (err) {
      if (err) {
        return reject(err);
      }
      resolve({ message: "Curso deletado com sucesso" });
    });
  });
};

module.exports ={
  addNovoCurso,
  dellCurso
}