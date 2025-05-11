const express = require('express');
const router = express.Router();
const Favorite = require('../models/Favorite');
const { protect } = require('../middleware/verifyToken'); // Middleware d'auth

// Récupérer tous les favoris de l'utilisateur
router.get('/', protect, async (req, res) => {
  try {
    const favorites = await Favorite.find({ user: req.user._id });
    res.json(favorites);
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur', error: err.message });
  }
});

// Ajouter ou supprimer un favori (toggle)
router.post('/', protect, async (req, res) => {
  const { productId } = req.body;

  if (!productId) {
    return res.status(400).json({ message: 'productId requis' });
  }

  try {
    const existing = await Favorite.findOne({ user: req.user._id, productId });
    if (existing) {
      // Si déjà favori, le supprimer (toggle off)
      await existing.deleteOne();
      return res.json({ message: 'Favori supprimé' });
    } else {
      // Sinon, l'ajouter
      const fav = new Favorite({ user: req.user._id, productId });
      await fav.save();
      return res.json({ message: 'Favori ajouté' });
    }
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur', error: err.message });
  }
});

module.exports = router;