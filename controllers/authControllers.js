const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { createUser, findUserByEmail } = require("../models/userModel");
const db = require("../config/db");

const register = async (req, res) => {
  const { username, email, password } = req.body;
  try {
    const existingUser = await findUserByEmail(email);
    if (existingUser) return res.status(400).json({ msg: "Usuário já existe" });

    const hashedPassword = await bcrypt.hash(password, 10); // Hash da senha
    const user = await createUser(username, email, hashedPassword);
    res.status(201).json({ user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const login = async (req, res) => {
  console.log("Login attempt:", req.body);
  const { email, password } = req.body;

  try {
    const emailUser = await findUserByEmail(email);
    console.log("User found:", emailUser);
    if (!emailUser)
      return res.status(400).json({ msg: "Email não encontrado" });

    // Comparador de senha criptografada
    const isMatch = await bcrypt.compare(password, emailUser.password);
    console.log("Password match:", isMatch);
    if (!isMatch) return res.status(400).json({ msg: "Senha incorreta" });

    // Valida se esta funcionando ou não o Token
    const token = jwt.sign({ id: emailUser.id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    const isProd = process.env.NODE_ENV === "production";

    res.cookie("token", token, {
      httpOnly: true,
      secure: isProd,
      sameSite: isProd ? "none" : "lax",
      maxAge: 24 * 60 * 60 * 1000,
    });

    res.json({ sucesso: true });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ error: err.message });
  }
};

const usersDb = async (req, res) => {
  try {
    const users = await new Promise((resolve, reject) => {
      db.all(
        "SELECT id, username, email, password, created_at FROM users",
        (err, rows) => {
          if (err) reject(err);
          else resolve(rows);
        },
      );
    });
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: "Erro ao buscar usuários" });
  }
};

const tokenValidate = async (req, res) => {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({ valid: false, msg: "Sem token" });
  }

  try {
    const user = jwt.verify(token, process.env.JWT_SECRET);
    res.json({ valid: true, user });
  } catch {
    res.status(401).json({ valid: false, msg: "Token inválido" });
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

module.exports = { register, login, usersDb, tokenValidate, coffee };
