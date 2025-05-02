const express = require('express')
const router = express.Router()
const { createProduct, validateProduct } = require('../controllers/productController')
const { protect } = require('../middleware/authMiddleware')
const { requireRole, requireApprovedSeller } = require('../middleware/roleMiddleware')

// Vendeur (approuvé)
router.post('/products', protect, requireApprovedSeller, createProduct)

// Admin
router.put('/products/:id/validate', protect, requireRole('admin'), validateProduct)

module.exports = router
