const db = require("../config/db");
const { addNovoCurso, dellCurso } = require("../models/cursosModel");

const crateNewCurso = async (req, res) => {
  const userId = req.user.id;
  const { nome_curso, descricao } = req.body;

  if (!nome_curso || !descricao) {
    return res.status(400).json({ error: "Nome do curso e descrição são obrigatórios" });
  }

  try {
    const curso = await addNovoCurso(nome_curso, descricao, userId);
    res.status(201).json({ mensage: "Curso adicionado ao usuário", curso });
  } catch (err) {
    console.error("Erro ao adicionar curso:", err);
    res.status(500).json({ error: "Erro interno do servidor" });
  }
};

const deletarCurso = async (req, res) => {
  const { nome_curso } = req.body;

  if (!nome_curso) {
    return res.status(400).json({ error: "Nome do curso é obrigatório" });
  }

  try {
    const curso = await dellCurso(nome_curso);
    res.status(200).json({ mensage: "Curso deletado com sucesso" });
  } catch (err) {
    console.error("Erro ao deletar curso:", err);
    res.status(500).json({ error: "Erro interno do servidor" });
  }
};

const listarCursos = async (req, res) => {
  try {
    const cursos = await new Promise((resolve, reject) => {
      db.all("SELECT * FROM cursos", (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      });
    });
    res.json({ cursos });
  } catch (err) {
    console.error("Erro ao listar cursos:", err);
    res.status(500).json({ error: "Erro interno do servidor" });
  }
};

const listarCursosDoUsuario = async (req, res) => {
  const userId = req.user.id;

  try {
    const cursos = await new Promise((resolve, reject) => {
      db.all("SELECT * FROM cursos WHERE user_id = ?", [userId], (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      });
    });
    res.json({ cursos });
  } catch (err) {
    console.error("Erro ao listar cursos do usuário:", err);
    res.status(500).json({ error: "Erro interno do servidor" });
  }
};

module.exports = {
  crateNewCurso,
  deletarCurso,
  listarCursos,
  listarCursosDoUsuario,
};