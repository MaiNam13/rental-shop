const express = require("express");
const router = express.Router();
const verifyToken = require("../middlewares/authMiddleware");
const {
    getProductReviews,
    getAllReviews,
    createReview
} = require("../controllers/reviewController");

// GET ALL REVIEWS (Latest)
router.get("/", getAllReviews);

// GET REVIEWS BY PRODUCT ID
router.get("/product/:id", getProductReviews);

// CREATE REVIEW (Need Login)
router.post("/", verifyToken, createReview);

module.exports = router;
