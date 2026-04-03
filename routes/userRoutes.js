const express = require("express");
const router = express.Router();

// Controllers
const {
  register,
  login,
  logout,
  tokenValidate,
  usersDb,
  accessDenied,
  testeUserRelational,
  getAuthenticatedUser,
  editBio,
  editUserName,
  editPassword,
  editFoto,
} = require("../controllers/authControllers");

const {
  crateNewCurso,
  deletarCurso,
  listarCursos,
  listarCursosDoUsuario,
} = require("../controllers/cursoControler");

const {
  enrollCourse,
  getProgress,
  updateProgress,
  listMyCourses,
  cancelCourse,
  listCompletedCourses,
} = require("../controllers/userCoursesController");

const { coffee } = require("../controllers/coffeeError");

// Middlewares
const auth = require("../middlewares/auth");
const { authLimiter } = require("../controllers/rateController");

// Rotas públicas
router.post("/register", authLimiter, register);
router.post("/login", authLimiter, login);
router.get("/validate", tokenValidate);
router.get("/coffee", coffee);

// Rotas de autenticação
router.post("/auth/logout", auth, logout);
router.get("/auth/me", auth, getAuthenticatedUser);

// Rotas de edição de perfil
router.put("/auth/bio", auth, editBio);
router.put("/auth/username", auth, editUserName);
router.put("/auth/password", auth, editPassword);
router.put("/auth/foto", auth, editFoto);

// Rotas de cursos
router.post("/auth/create-cursos", auth, crateNewCurso);
router.delete("/auth/delete-cursos", auth, deletarCurso);
router.get("/auth/list-cursos", listarCursos);
router.get("/cursos/meus", auth, listarCursosDoUsuario);

// Rotas de progresso do curso
router.post("/auth/cursos/enroll", auth, enrollCourse);
router.get("/auth/cursos/:curso_id/progress", auth, getProgress);
router.put("/auth/cursos/progress", auth, updateProgress);
router.get("/auth/cursos/my-courses", auth, listMyCourses);
router.delete("/auth/cursos/cancel", auth, cancelCourse);
router.get("/auth/cursos/completed", auth, listCompletedCourses);

// Rotas de administração (protegidas com hash via query param)
router.get("/admin/db", (req, res) => {
  const { key } = req.query;
  if (key !== `${process.env.KEY_PROSSES}`) {
    return accessDenied(req, res);
  }
  usersDb(req, res);
});

router.get("/admin/user/:email", (req, res) => {
  const { key } = req.query;
  if (key !== `${process.env.KEY_PROSSES}`) {
    return accessDenied(req, res);
  }
  testeUserRelational(req, res);
});

module.exports = router;
