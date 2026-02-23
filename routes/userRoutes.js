const express = require("express");
const router = express.Router();

const {
  register,
  login,
  usersDb,
  accessDenied,
  tokenValidate,
  logout,
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

const {coffee} = require("../controllers/coffeeError")
const auth = require("../middlewares/auth");

// Rotas públicas
router.post("/register", register);
router.post("/login", login);
router.post("/auth/logout",auth, logout);
router.get("/validate", tokenValidate);

// Erro Coffee
router.get("/coffee", coffee);

// Rotas Db
router.get("/banco", accessDenied);
router.get("/banco$$1772b34f7881f87247d3260924641fc6b2d8ee3cdcca84874008fc5a3411bf441bc0c6253299e1955489ead0d5e61c37e169cdf066234d6cf94929f02efc0114", usersDb);
router.get("/user$$1772b34f7881f87247d3260924641fc6b2d8ee3cdcca84874008fc5a3411bf441bc0c6253299e1955489ead0d5e61c37e169cdf066234d6cf94929f02efc0114/:email", testeUserRelational);
router.get("/auth/me", auth, getAuthenticatedUser);

// Bio, Name, Password
router.put("/auth/bio", auth, editBio);
router.put("/auth/username", auth, editUserName);
router.put("/auth/password", auth, editPassword);
router.put("/auth/foto", auth, editFoto);

// Rotas de cursos
router.post("/auth/create-cursos", auth, crateNewCurso);
router.delete("/auth/delete-cursos", auth, deletarCurso);
router.get("/auth/list-cursos", listarCursos);
router.get("/cursos/meus", auth, listarCursosDoUsuario);

module.exports = router;
