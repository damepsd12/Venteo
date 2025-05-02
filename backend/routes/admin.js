const express = require("express");
const router = express.Router();

const { getPendingSellers, approveSeller, rejectSeller } = require("../controllers/adminController");
const verifyAdmin = require("../middleware/verifyAdmin"); // doit être une fonction middleware

router.get("/pending-sellers", verifyAdmin, getPendingSellers);
router.post("/approve/:userId", verifyAdmin, approveSeller);
router.post("/reject/:userId", verifyAdmin, rejectSeller);

module.exports = router;

