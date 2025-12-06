const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { createUser, findUserByEmail } = require("../models/userModel");
const router = require("../routes/auth");
const db = require("../config/db");

const register = async (req, res) => {
  const { username, email, password } = req.body;
  try {
    const existingUser = await findUserByEmail(email);
    if (existingUser) return res.status(400).json({ msg: "Usuário já existe" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await createUser(username, email, hashedPassword);
    res.status(201).json({ user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const emailUser = await findUserByEmail(email);
    if (!emailUser)
      return res.status(400).json({ msg: "Email não encontrado" });

    const isMatch = await bcrypt.compare(password, emailUser.password);
    if (!isMatch) return res.status(400).json({ msg: "Senha incorreta" });

    const token = jwt.sign({ id: emailUser.id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });
    res.json({
      token,
      user: {
        id: emailUser.id,
        username: emailUser.username,
        email: emailUser.email,
      },
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
    res;
  }
};

const usersDb = async (req, res) => {
  try {
    const users = await new Promise((resolve, reject) => {
      db.all(
        "SELECT id, username, email, created_at FROM users",
        (err, rows) => {
          if (err) reject(err);
          else resolve(rows);
        }
      );
    });
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: "Erro ao buscar usuários" });
  }
};

const coffee = async (req, res) => {
  try {
    res.status(418).json({
      error: "I'm a teapot",
      mensage: "O servidor se recusa a preparar o café",
    });
  } catch (err) {
    res.status(418).json({
      error: "I'm a teapot",
      mensage: "O servidor se recusa a preparar o café",
    });
  }
};
module.exports = { register, login, usersDb, coffee };
