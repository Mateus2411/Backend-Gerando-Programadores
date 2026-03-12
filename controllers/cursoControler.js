const db = require("../config/db");
const { addNovoCurso, dellCurso } = require("../models/cursosModel");

const crateNewCurso = async (req, res) => {
  const userId = req.user.id;
  const { nome_curso, descricao, grau, imagem } = req.body;

  if (!nome_curso || !descricao || !grau) {
    return res.status(400).json({ 
      error: "Nome do curso, descrição e grau são obrigatórios" 
    });
  }

  try {
    const curso = await addNovoCurso(nome_curso, descricao, grau, imagem || null, userId);
    res.status(201).json({ 
      message: "Curso adicionado com sucesso", 
      curso 
    });
  } catch (err) {
    console.error("Erro ao adicionar curso:", err);
    res.status(500).json({ error: "Erro interno do servidor" });
  }
};

const deletarCurso = async (req, res) => {
  const userId = req.user.id;
  const { id_curso } = req.body;

  if (!id_curso) {
    return res.status(400).json({ error: "ID do curso é obrigatório" });
  }

  try {
    await dellCurso(id_curso, userId);
    res.status(200).json({ message: "Curso deletado com sucesso" });
  } catch (err) {
    console.error("Erro ao deletar curso:", err);
    if (err.message.includes("não encontrado")) {
      return res.status(404).json({ error: err.message });
    }
    res.status(500).json({ error: "Erro interno do servidor" });
  }
};

const listarCursos = async (req, res) => {
  try {
    const cursos = await new Promise((resolve, reject) => {
      db.all("SELECT * FROM cursos ORDER BY created_at DESC", (err, rows) => {
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
      db.all(
        "SELECT * FROM cursos WHERE user_id = ? ORDER BY created_at DESC", 
        [userId], 
        (err, rows) => {
          if (err) reject(err);
          else resolve(rows);
        }
      );
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