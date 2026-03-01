const rateLimit = require("express-rate-limit");

// Limitador geral para todas as rotas
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100, // 100 requisições por IP
  message: "Muitas requisições, tente novamente mais tarde.",
  standardHeaders: true,
  legacyHeaders: false,
});

// Limitador mais restritivo para login/registro
const authLimiter = rateLimit({
  windowMs: 5 * 60 * 1000, // 5 minutos
  max: 5, // apenas 5 tentativas de login/registro
  message: "Muitas tentativas de autenticação, tente novamente mais tarde.",
  standardHeaders: true,
  legacyHeaders: false,
});

module.exports = { generalLimiter, authLimiter };
