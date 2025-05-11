// models/Favorite.js
const mongoose = require('mongoose');

const favoriteSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  productId: { type: String, required: true }, // ID du produit, en string pour s'aligner avec le format mongoose
}, { timestamps: true });

module.exports = mongoose.model('Favorite', favoriteSchema);