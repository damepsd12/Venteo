const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Middleware de protection (JWT)
exports.protect = async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer ')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({ message: 'Non autorisé, token manquant' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId).select('-password');
    if (!user) {
      return res.status(401).json({ message: 'Utilisateur non trouvé' });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error('Erreur vérification token :', error);
    res.status(401).json({ message: 'Token invalide' });
  }
};

// Vérification du rôle
exports.requireRole = (role) => {
  return (req, res, next) => {
    if (req.user && req.user.role === role) {
      next();
    } else {
      return res.status(403).json({ message: 'Accès refusé : rôle non autorisé.' });
    }
  };
};

// Vérifie que le vendeur est approuvé
exports.requireApprovedSeller = (req, res, next) => {
  const user = req.user; // Assurez-vous que req.user est bien peuplé par un middleware précédent (comme un middleware d'authentification qui récupère l'utilisateur complet)

  console.log('--- Débogage requireApprovedSeller ---');
  console.log('Utilisateur reçu dans middleware:', user);

  if (!user) {
      console.log('Erreur: Utilisateur non trouvé dans req.user. Le middleware protect a-t-il fonctionné ?');
      return res.status(401).json({ message: 'Non authentifié.' }); // Should ideally be handled by protect
  }

  // Assuming your user model has a 'role' and 'pending' field
  console.log('Rôle de l\'utilisateur:', user.role);
  // *** Correction ici : Utiliser user.pending ***
  console.log('Statut d\'approbation (pending):', user.pending);

  if (user.role !== 'seller') {
      console.log('Accès refusé: Rôle non "seller".');
      return res.status(403).json({ message: 'Accès refusé : rôle non autorisé.' });
  }

  // *** Correction ici : Vérifier si user.pending est true (non approuvé) ***
  if (user.pending === true) { // Si pending est true, cela signifie qu'il n'est PAS approuvé
       console.log('Accès refusé: Vendeur non approuvé (pending est true).');
      return res.status(403).json({ message: 'Accès refusé : compte vendeur non approuvé.' });
  }

  // Si on arrive ici, c'est que le rôle est 'seller' ET pending est false (ou absent, mais votre modèle le met à true par défaut)
  console.log('Vendeur approuvé. Passage au middleware suivant.');
  next();

  // Note: Vous avez un double next() ici. Supprimez le second.
  // next(); // <-- Supprimez cette ligne
};
