const {
  enrollInCourse,
  getUserCourseProgress,
  updateCourseProgress,
  getUserCourses,
  cancelEnrollment,
  getCompletedCourses,
} = require("../models/userCoursesModel");

// Inscrever-se em um curso
const enrollCourse = async (req, res) => {
  const userId = req.user.id;
  const { curso_id } = req.body;

  if (!curso_id) {
    return res.status(400).json({ error: "ID do curso é obrigatório" });
  }

  try {
    const result = await enrollInCourse(userId, curso_id);
    res.status(200).json(result);
  } catch (err) {
    console.error("Erro ao inscrever no curso:", err);
    res.status(500).json({ error: "Erro interno do servidor" });
  }
};

// Buscar progresso de um curso específico
const getProgress = async (req, res) => {
  const userId = req.user.id;
  const { curso_id } = req.params;

  try {
    const progress = await getUserCourseProgress(userId, curso_id);

    if (!progress) {
      return res.status(404).json({
        message: "Usuário não está inscrito neste curso",
        enrolled: false
      });
    }

    res.json({
      enrolled: true,
      progress
    });
  } catch (err) {
    console.error("Erro ao buscar progresso:", err);
    res.status(500).json({ error: "Erro interno do servidor" });
  }
};

// Atualizar progresso do curso
const updateProgress = async (req, res) => {
  const userId = req.user.id;
  const { curso_id } = req.body;
  const { progress_percent } = req.body;

  if (!curso_id || progress_percent === undefined) {
    return res.status(400).json({
      error: "ID do curso e percentual de progresso são obrigatórios"
    });
  }

  if (progress_percent < 0 || progress_percent > 100) {
    return res.status(400).json({
      error: "Progresso deve ser entre 0 e 100"
    });
  }

  try {
    // Verifica se está inscrito
    const enrollment = await getUserCourseProgress(userId, curso_id);

    if (!enrollment) {
      // Se não está inscrito, inscreve automaticamente
      await enrollInCourse(userId, curso_id);
    }

    const result = await updateCourseProgress(userId, curso_id, progress_percent);
    res.json(result);
  } catch (err) {
    console.error("Erro ao atualizar progresso:", err);
    res.status(500).json({ error: "Erro interno do servidor" });
  }
};

// Listar todos os cursos do usuário
const listMyCourses = async (req, res) => {
  const userId = req.user.id;

  try {
    const courses = await getUserCourses(userId);
    res.json({ courses });
  } catch (err) {
    console.error("Erro ao listar cursos:", err);
    res.status(500).json({ error: "Erro interno do servidor" });
  }
};

// Cancelar inscrição em um curso
const cancelCourse = async (req, res) => {
  const userId = req.user.id;
  const { curso_id } = req.body;

  if (!curso_id) {
    return res.status(400).json({ error: "ID do curso é obrigatório" });
  }

  try {
    await cancelEnrollment(userId, curso_id);
    res.json({ message: "Inscrição cancelada com sucesso" });
  } catch (err) {
    console.error("Erro ao cancelar inscrição:", err);
    if (err.message.includes("não encontrada")) {
      return res.status(404).json({ error: err.message });
    }
    res.status(500).json({ error: "Erro interno do servidor" });
  }
};

// Listar cursos completados
const listCompletedCourses = async (req, res) => {
  const userId = req.user.id;

  try {
    const courses = await getCompletedCourses(userId);
    res.json({ courses, total: courses.length });
  } catch (err) {
    console.error("Erro ao listar cursos completados:", err);
    res.status(500).json({ error: "Erro interno do servidor" });
  }
};

module.exports = {
  enrollCourse,
  getProgress,
  updateProgress,
  listMyCourses,
  cancelCourse,
  listCompletedCourses,
};
