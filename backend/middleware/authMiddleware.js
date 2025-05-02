const jwt = require('jsonwebtoken')
const User = require('../models/User')

exports.protect = async (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1]
  if (!token) return res.status(401).json({ message: 'Accès refusé' })

  try {
    const decoded = jwt.verify(token, 'secret')
    req.user = await User.findById(decoded.id)
    next()
  } catch (err) {
    res.status(401).json({ message: 'Token invalide' })
  }
}
