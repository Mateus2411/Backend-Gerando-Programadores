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

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Servidor rodando na porta http://localhost:${PORT}`));