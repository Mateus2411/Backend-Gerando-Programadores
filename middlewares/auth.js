const jwt = require("jsonwebtoken");

function auth(req, res, next) {
  const token = req.cookies.token;
  if (!token) {
    return res.status(401).json({ logado: false });
  }

  try {
    const user = jwt.verify(token, process.env.JWT_SECRET);
    req.user = user;
    next();
  } catch {
    return res.status(401).json({ logado: false });
  }
}

module.exports = auth;