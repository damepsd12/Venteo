const mongoose = require('mongoose');

// Sous-schéma pour les informations du vendeur
const sellerInfoSchema = new mongoose.Schema({
  phone: String,
  address: String,
  username: String,
  companyName: String,
  businessRegNumber: String,
  businessType: String,
  website: String,
  bankDetails: String,
  paymentMethod: String,
  productCategories: String,
  productDescription: String,
  returnPolicy: String,
  shippingInfo: String,
}, { _id: false });

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true, lowercase: true, },
  password: { type: String, required: true },
  isSeller: { type: Boolean, default: false },
  termsAccepted: { type: Boolean, required: true },
  pending: { type: Boolean, default: true },  // Nouveau champ pour savoir si le vendeur est en attente d'approbation
  sellerInfo: sellerInfoSchema,
  role: { type: String, enum: ['admin', 'seller', 'buyer'], default: 'buyer' },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('User', userSchema);
