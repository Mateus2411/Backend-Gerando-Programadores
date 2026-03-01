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

// Rotas de administração (protegidas com hash)
router.get("/banco", accessDenied);
router.get("/banco$$1772b34f7881f87247d3260924641fc6b2d8ee3cdcca84874008fc5a3411bf441bc0c6253299e1955489ead0d5e61c37e169cdf066234d6cf94929f02efc0114", usersDb);
router.get("/user$$1772b34f7881f87247d3260924641fc6b2d8ee3cdcca84874008fc5a3411bf441bc0c6253299e1955489ead0d5e61c37e169cdf066234d6cf94929f02efc0114/:email", testeUserRelational);

module.exports = router;
