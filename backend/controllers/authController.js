const bcrypt = require('bcrypt');
const User = require('../models/User');
const jwt = require('jsonwebtoken');

// Fonction pour enregistrer un utilisateur
const registerUser = async (req, res) => {
  const { name, email, password, isSeller, termsAccepted, sellerInfo } = req.body;

  // Vérification si l'utilisateur existe déjà
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return res.status(400).json({ message: "Un utilisateur avec cet e-mail existe déjà." });
  }

  // Hachage du mot de passe
  const hashedPassword = await bcrypt.hash(password, 10);

  // Créer un nouvel utilisateur
  const newUser = new User({
    name,
    email,
    password: hashedPassword,
    isSeller,
    termsAccepted,
    sellerInfo: isSeller ? sellerInfo : null, // Si c'est un vendeur, on ajoute les informations du vendeur
  });

  try {
    await newUser.save();
    res.status(201).json({ message: "Utilisateur créé avec succès." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Une erreur est survenue lors de la création de l'utilisateur." });
  }
};

// Fonction pour l'authentification
const loginUser = async (req, res) => {
    const { email, password } = req.body;
    console.log('Email dans la requête:', email);
    console.log('Recherche dans la DB:', email.toLowerCase());
  
    try {
      console.log('Email dans la requête:', email);
      console.log('Recherche dans la DB:', email.toLowerCase());
      const user = await User.findOne({ email: email.toLowerCase() });
      if (!user) {
        return res.status(400).json({ message: "Utilisateur non trouvé" });
      }
  
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(400).json({ message: "Mot de passe incorrect" });
      }
  
      // Si l'utilisateur est un vendeur en attente
      if (user.isSeller && user.pending) {
        return res.status(400).json({ message: "Votre compte vendeur est en attente d'approbation par l'administrateur." });
      }
  
      const token = jwt.sign({ userId: user._id, role: user.role }, 'secret', { expiresIn: '1h' });
  
    res.status(200).json({
        token,
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,       // 👈 doit être présent
          pending: user.pending, // 👈 doit être présent si seller
        },
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Erreur lors de la connexion" });
    }
  };

module.exports = { registerUser,  loginUser };
