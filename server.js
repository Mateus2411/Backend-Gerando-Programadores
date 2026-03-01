const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
require("dotenv").config();

const userRoutes = require("./routes/userRoutes");
const { generalLimiter } = require("./controllers/rateController");

const app = express();

// Rate limiting global
app.use(generalLimiter);

// CORS
app.use(cors({
  origin: "https://gerando-programadores.vercel.app",
  credentials: true,
}));

// app.use(cors({
//   origin: "http://localhost:5173",
//   credentials: true,
// }));

// Middlewares
app.use(express.json());
app.use(cookieParser());

// Rotas
app.use("/api", userRoutes);

// Health check
app.get("/", (req, res) => {
  res.json({ status: "ok", message: "API Gerando Programadores" });
});

// Tratamento de erros
app.use((err, req, res, next) => {
  console.error('Erro:', err);
  res.status(500).json({ error: 'Erro interno do servidor' });
});

// Inicialização do servidor
const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0', () => {
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