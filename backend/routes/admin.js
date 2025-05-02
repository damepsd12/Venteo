const express = require('express');
const router = express.Router();
const { getPendingSellers, approveSeller, rejectSeller } = require('../controllers/adminController');

// Middleware JWT (à créer si pas encore fait)
const verifyAdmin = require('../middleware/verifyAdmin');

// Routes pour l'approbation/rejet des vendeurs
router.get('/pending-sellers', verifyAdmin, getPendingSellers);
router.post('/approve/:userId', verifyAdmin, approveSeller);
router.post('/reject/:userId', verifyAdmin, rejectSeller);

module.exports = router;
