const Product = require('../models/Product');
const cloudinary = require('../config/cloudinary');
const asyncHandler = require('express-async-handler'); // Si vous utilisez asyncHandler
const fs = require('fs');

exports.createProduct = async (req, res) => {
  try {
    const { title, description, price, category } = req.body;
    const file = req.file; // reçu par Multer

    if (!file) {
      return res.status(400).json({ message: 'Image requise' });
    }

    // Uploader l'image vers Cloudinary
    const result = await cloudinary.uploader.upload(file.path);

    // Supprimer le fichier temporaire
    fs.unlinkSync(file.path);

    // Créer le produit avec l'URL de Cloudinary
    const newProduct = await Product.create({
      title,
      description,
      price,
      category,
      image: result.secure_url, // URL de l’image uploadée
      cloudinary_public_id: result.public_id, // pour suppression ou autres opérations futures
      seller: req.user._id, // ID du vendeur connecté
      approved: false,       // ➕ ajouté
      status: 'pending',
    });

    res.status(201).json(newProduct);
  } catch (err) {
    res.status(500).json({ message: 'Erreur lors de la création du produit', error: err.message });
  }
};

// Liste des produits du vendeur
exports.getSellerProducts = async (req, res) => {
  const products = await Product.find({ seller: req.user._id }).sort('-createdAt');
  res.json(products);
};

// Produits validés (pour la page d'accueil)
exports.getApprovedProducts = async (req, res) => {
  const { category, search } = req.query;

  const filters = { approved: true };
  if (category) filters.category = category;
  if (search) filters.title = new RegExp(search, 'i');

  const products = await Product.find(filters).populate('seller', 'name');
  res.json(products);


};

// Fiche produit
exports.getProductById = async (req, res) => {
  try {
    const productId = req.params.id;

    // Vérification que l'ID est valide (24 caractères hexadécimaux)
    if (!/^[0-9a-fA-F]{24}$/.test(productId)) {
      return res.status(400).json({ message: 'ID du produit invalide' });
    }

    // Recherche du produit par ID
    const product = await Product.findById(productId).populate('seller', 'name');

    if (!product || !product.approved) {
      return res.status(404).json({ message: 'Produit introuvable ou non approuvé' });
    }

    res.json(product);
    console.log('Produit approuvé trouvé :', product);
  } catch (err) {
    console.error('Erreur dans getProductById:', err);
    res.status(500).json({ message: 'Erreur serveur', error: err.message });
  }
};

// Liste des produits en attente (admin)
exports.getPendingProducts = async (req, res) => {
  try {
    const products = await Product.find({ status: 'pending' }).populate('seller', 'name email');
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur', error: err.message });
  }
};

// Valider ou refuser un produit (admin)
exports.validateProduct = async (req, res) => {
  const { action } = req.body;
  const product = await Product.findById(req.params.id);
  if (!product) return res.status(404).json({ message: 'Produit introuvable' });

  if (action === 'approve') {
    product.approved = true;
    product.status = 'approved';
  } else if (action === 'reject') {
    product.approved = false;
    product.status = 'rejected';
  } else {
    return res.status(400).json({ message: 'Action invalide' });
  }

  await product.save();
  res.json({ message: `Produit ${action}é avec succès.` });
  console.log('Produit après modification :', product);

};

// Supprimer un produit (admin)
exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Produit introuvable' });
    }
    if (product.cloudinary_public_id) {
      await cloudinary.uploader.destroy(product.cloudinary_public_id);
    }
    await product.deleteOne();
    res.json({ message: 'Produit supprimé' });
  } catch (err) {
    console.error('Erreur lors de la suppression:', err);
    res.status(500).json({ message: 'Erreur serveur', error: err.message });
  }
};

// Modifier un produit (pour le vendeur)
exports.updateProduct = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const product = await Product.findById(id);

  if (!product || !product.seller.equals(req.user._id)) {
    return res.status(403).json({ message: 'Accès refusé' });
  }

  const { title, description, price, category, stock } = req.body;

  if (title) product.title = title;
  if (description) product.description = description;
  if (price !== undefined) product.price = price;
  if (category) product.category = category;
  if (stock !== undefined) product.stock = stock;

  // Si nouvelle image
  if (req.file) {
    const result = await cloudinary.uploader.upload(req.file.path);
    if (product.cloudinary_public_id) {
      await cloudinary.uploader.destroy(product.cloudinary_public_id);
    }
    product.image = result.secure_url;
    product.cloudinary_public_id = result.public_id;
    fs.unlinkSync(req.file.path);
  }

  await product.save();
  res.json(product);
});