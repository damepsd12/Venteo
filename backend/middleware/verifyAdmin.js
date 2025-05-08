const jwt = require('jsonwebtoken');

exports.verifyAdmin = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  if (!authHeader?.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Token manquant" });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "secret");
    if (decoded.role !== "admin") {
      return res.status(403).json({ message: "Accès réservé aux administrateurs." });
    }

    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ message: "Token invalide" });
  }
};
