const mongoose = require('mongoose')

const productSchema = new mongoose.Schema({
  title: String,
  description: String,
  price: Number,
  image: String,
  category: String,
  status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
  rejectionReason: { // Optionnel: pour stocker la raison du refus
    type: String,
 },
  seller: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
})

module.exports = mongoose.model('Product', productSchema)
