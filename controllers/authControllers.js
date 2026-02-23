const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { createUser, findUserByEmail, updateUserBio, updateName, updatePassword, updateUserFoto } = require("../models/userModel");
const db = require("../config/db");

// #region Operações do Usuario
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

    // Retorna os dados do usuário após login bem-sucedido
    const userData = {
      sucesso: true,
      user: {
        id: emailUser.id,
        username: emailUser.username,
        email: emailUser.email,
        bio: emailUser.bio,
        foto: emailUser.foto,
        created_at: emailUser.created_at,
      },
    };
    console.log("Sending response:", userData);
    res.json(userData);
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ error: err.message });
  }
};

const logout = async (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
  });

  return res.status(200).json({
    message: "Logout realizado com sucesso",
    logado: false,
  });
};

// Edits: Bio, User Name, senha

const editBio = async (req, res) => {
  const userId = req.user.id;
  const { bio } = req.body;

  if (bio === undefined) {
    return res.status(400).json({ msg: "Bio é obrigatória" });
  }

  try {
    await updateUserBio(userId, bio);
    return res.status(200).json({ msg: "Biografia atualizada com sucesso", bio });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const editUserName = async (req, res) => {
  const userId = req.user.id;
  const { userName } = req.body;

  if (!userName) {
    return res.status(400).json({ msg: "Username é obrigatório" });
  }

  try {
    await updateName(userName, userId);
    res.status(200).json({ msg: "Nome de usuário alterado com sucesso", username: userName });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const editPassword = async (req, res) => {
  const userId = req.user.id;
  const { currentPassword, newPassword } = req.body;

  if (!currentPassword || !newPassword) {
    return res.status(400).json({ msg: "Senha atual e nova senha são obrigatórias" });
  }

  if (newPassword.length < 6) {
    return res.status(400).json({ msg: "A nova senha deve ter no mínimo 6 caracteres" });
  }

  try {
    // Buscar usuário para verificar senha atual
    const user = await new Promise((resolve, reject) => {
      db.get("SELECT * FROM users WHERE id = ?", [userId], (err, row) => {
        if (err) reject(err);
        else resolve(row);
      });
    });

    if (!user) {
      return res.status(404).json({ msg: "Usuário não encontrado" });
    }

    // Verificar senha atual
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: "Senha atual incorreta" });
    }

    // Hash da nova senha
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Atualizar senha
    await updatePassword(hashedPassword, userId);

    res.status(200).json({ msg: "Senha alterada com sucesso" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const editFoto = async (req, res) => {
  const userId = req.user.id;
  const { foto } = req.body;

  if (!foto) {
    return res.status(400).json({ msg: "Nome da foto é obrigatório" });
  }

  try {
    await updateUserFoto(userId, foto);
    res.status(200).json({ msg: "Foto atualizada com sucesso", foto });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
// #endregion

// #region Token
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

// #endregion

// #region DB Utilitis
  
const usersDb = async (req, res) => {
  try {
    const users = await new Promise((resolve, reject) => {
      db.all("SELECT * FROM users", (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      });
    });
    
    const cursos = await new Promise((resolve, reject) => {
      db.all("SELECT * FROM cursos", (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      });
    });
    res.json({ users, cursos});
  } catch (err) {
    res.status(500).json({ error: "Erro ao buscar usuários" });
  }
};

const testeUserRelational = async (req, res) => {
  const { email } = req.params;

  try {
    const user = await new Promise((resolve, reject) => {
      db.get("SELECT * FROM users WHERE email = ?", [email], (err, row) => {
        if (err) reject(err);
        else resolve(row);
      });
    });

    if (!user) {
      return res.status(404).json({ msg: "Usuário não encontrado" });
    }

    const cursos = await new Promise((resolve, reject) => {
      db.all("SELECT * FROM cursos WHERE user_id = ?", [user.id], (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      });
    });

    res.json({
      ...user,
      cursos: cursos
    });
  } catch (err) {
    res.status(500).json({ error: "Erro ao buscar usuário e cursos" });
  }
};

const  getAuthenticatedUser = async (req, res) => {
  const userId = req.user.id;

  try {
    const user = await new Promise((resolve, reject) => {
      db.get("SELECT id, username, email, bio, foto, created_at FROM users WHERE id = ?", [userId], (err, row) => {
        if (err) reject(err);
        else resolve(row);
      });
    });

    if (!user) {
      return res.status(404).json({ logado: false, msg: "Usuário não encontrado" });
    }

    const cursos = await new Promise((resolve, reject) => {
      db.all("SELECT * FROM cursos WHERE user_id = ?", [userId], (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      });
    });

    res.json({
      logado: true,
      user: {
        ...user,
        cursos: cursos
      }
    });
  } catch (err) {
    res.status(500).json({ error: "Erro ao buscar dados do usuário" });
  }
};
// #endregion

module.exports = {
  // User
  register,
  login,
  editBio,
  editUserName,
  editPassword,
  editFoto,
  // Token
  tokenValidate,
  // Db
  usersDb,
  logout,
  testeUserRelational,
  getAuthenticatedUser,
};
