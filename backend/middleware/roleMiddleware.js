exports.requireRole = role => (req, res, next) => {
    if (req.user.role !== role) {
      return res.status(403).json({ message: 'Accès interdit' })
    }
    next()
  }
  
  exports.requireApprovedSeller = (req, res, next) => {
    if (req.user.role !== 'seller' || !req.user.isApproved) {
      return res.status(403).json({ message: 'Vendeur non approuvé' })
    }
    next()
  }
  