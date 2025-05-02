const User = require('../models/User');

const getPendingSellers = async (req, res) => {
  try {
    const sellers = await User.find({ isSeller: true, pending: true }).select("-password");
    res.status(200).json(sellers);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erreur lors de la récupération des vendeurs en attente." });
  }
};

// Fonction pour approuver un vendeur
const approveSeller = async (req, res) => {
  const { userId } = req.params;

  try {
    const user = await User.findById(userId);
    if (!user || !user.isSeller) {
      return res.status(404).json({ message: "Utilisateur non trouvé ou non vendeur." });
    }

    // Mettre à jour l'état de l'utilisateur pour le marquer comme approuvé
    user.pending = false;
    user.role = 'seller';  // Si approuvé, on change son rôle en vendeur
    await user.save();

    res.status(200).json({ message: "Vendeur approuvé avec succès." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erreur lors de l'approbation du vendeur." });
  }
};

// Fonction pour refuser un vendeur
const rejectSeller = async (req, res) => {
  const { userId } = req.params;

  try {
    const user = await User.findById(userId);
    if (!user || !user.isSeller) {
      return res.status(404).json({ message: "Utilisateur non trouvé ou non vendeur." });
    }

    // Supprimer les informations du vendeur et mettre le statut en 'buyer'
    user.isSeller = false;
    user.sellerInfo = undefined;
    user.pending = false;
    user.role = 'buyer'; // Changer son rôle en acheteur
    await user.save();

    res.status(200).json({ message: "Vendeur rejeté avec succès." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erreur lors du rejet du vendeur." });
  }
};


module.exports = { getPendingSellers, approveSeller, rejectSeller };
