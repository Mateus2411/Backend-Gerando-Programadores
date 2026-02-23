const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
require("dotenv").config();

const userRoutes = require("./routes/userRoutes");

const app = express();

app.use(cors({
  origin: "https://gerando-programadores.vercel.app",
  credentials: true,
}));

// app.use(cors({
//   origin: "http://localhost:5173",
//   credentials: true,
// }));

app.use(express.json());

// 🔴 habilita leitura de cookies
app.use(cookieParser());

app.use("/api", userRoutes);

// Rota de health check para o Render
app.get("/", (req, res) => {
  res.json({ status: "ok", message: "API Gerando Programadores" });
});

// Tratamento de erros
app.use((err, req, res, next) => {
  console.error('Erro:', err);
  res.status(500).json({ error: 'Erro interno do servidor' });
});

const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, '0.0.0.0', () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});

// Tratamento de erros não capturados
process.on('unhandledRejection', (err) => {
  console.error('Unhandled Rejection:', err);
});

process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
  process.exit(1);
});