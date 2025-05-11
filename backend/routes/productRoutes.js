const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload'); // votre middleware Multer

// Contrôleurs
const {
  getApprovedProducts,
  getProductById,
  createProduct,
  deleteProduct,
  updateProduct,
  validateProduct,
  getSellerProducts,
  getPendingProducts, // Utilisé ici pour la route admin
} = require('../controllers/productController');

// Middlewares
const { protect, requireRole, requireApprovedSeller } = require('../middleware/verifyToken');
const { verifyAdmin } = require('../middleware/verifyAdmin');

// Routes vendeur
router.get('/my-products', protect, requireRole('seller'), requireApprovedSeller, getSellerProducts);
router.post('/', protect, requireRole('seller'), requireApprovedSeller,upload.single('image'), createProduct); // Note: Cette route POST / peut coexister avec GET / si l'ordre est bon
router.delete('/:id', protect, requireRole('seller'), deleteProduct);
//router.put('/:id', protect, requireRole('seller'), upload.single('image'), updateProduct);
router.put('/:id', protect, requireRole('seller'), upload.single('image'), updateProduct);

// Routes administrateur
// Utilisez cette route unique pour les produits en attente
router.get('/admin/pending-products', protect, verifyAdmin, getPendingProducts);
router.get('/admin/approved-products', protect, verifyAdmin, getApprovedProducts); // Route pour admin (produits approuvés)
router.patch('/:id/validate', protect, verifyAdmin, validateProduct);
router.delete('/:id', protect, verifyAdmin, deleteProduct);

// Routes publiques (Déplacées ici pour s'assurer que les routes spécifiques sont trouvées en premier)
router.get('/', getApprovedProducts);  // Liste des produits validés
router.get('/:id', getProductById);  // Détails d'un produit


module.exports = router;