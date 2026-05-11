const express = require("express");
const router = express.Router();
const verifyToken = require("../middlewares/authMiddleware");
const adminMiddleware = require("../middlewares/adminMiddleware");
const {
    getProductVariants,
    createVariant
} = require("../controllers/variantController");

// GET VARIANTS BY PRODUCT ID
router.get("/product/:id", getProductVariants);

// CREATE VARIANT (Admin only)
router.post("/", verifyToken, adminMiddleware, createVariant);

module.exports = router;
