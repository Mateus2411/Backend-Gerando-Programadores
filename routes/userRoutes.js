const express = require("express");
const router = express.Router();
const {
  register,
  login,
  usersDb,
  tokenValidate,
  coffee,
} = require("../controllers/authControllers");
const auth = require("../middlewares/auth");

// Rotas públicas
router.post("/register", register);
router.post("/login", login);
router.get("/validate", tokenValidate);
router.get("/banco", usersDb);
router.get("/coffee", coffee);

router.get("/auth/me", auth, (req, res) => {
  res.json({
    logado: true,
    msg: "Usuário ok"
  });
});

module.exports = router;
