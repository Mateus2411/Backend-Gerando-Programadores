const express = require("express");
const router = express.Router();

const {
  register,
  login,
  usersDb,
  tokenValidate,
  logout,
  testeUserRelational,
  getAuthenticatedUser,
  editBio,
  editUserName,
  editPassword,
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
router.get("/banco", usersDb);
router.get("/user/:email", testeUserRelational);
router.get("/auth/me", auth, getAuthenticatedUser);

// Bio, Name, Password
router.put("/auth/bio", auth, editBio);
router.put("/auth/username", auth, editUserName);
router.put("/auth/password", auth, editPassword);

// Rotas de cursos
router.post("/auth/create-cursos", auth, crateNewCurso);
router.delete("/auth/delete-cursos", auth, deletarCurso);
router.get("/auth/list-cursos", listarCursos);
router.get("/cursos/meus", auth, listarCursosDoUsuario);

module.exports = router;
