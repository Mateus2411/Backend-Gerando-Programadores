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

    // Valida se esta funcionando ou não o Token % gera
    const token = jwt.sign({ id: emailUser.id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    console.log("Token generated:", token.substring(0, 50) + "...");
    res.json({
      token,
      user: {
        id: emailUser.id,
        username: emailUser.username,
        email: emailUser.email,
      },
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ error: err.message });
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

const tokenValidate = async (req, res) => {
  try {
    console.log("Headers recebidos:", req.headers);
    console.log("Body recebido:", req.body);

    let token;
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith("Bearer ")) {
      token = authHeader.split(" ")[1];
      console.log("Token extraído do header Authorization");
    } else if (req.body.token) {
      token = req.body.token;
      console.log("Token extraído do body");
    } else {
      return res.status(401).json({ error: "Token não fornecido" });
    }

    console.log(
      "Token a validar:",
      token ? token.substring(0, 50) + "..." : "Nenhum"
    );
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("Token válido, usuário:", decoded);
    res.json({ valid: true, user: decoded });
  } catch (err) {
    console.log("Erro na validação:", err.message);
    res.status(401).json({ error: "Token inválido", details: err.message });
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
