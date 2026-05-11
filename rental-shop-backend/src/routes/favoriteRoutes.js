const express = require("express");
const router = express.Router();
const verifyToken = require("../middlewares/authMiddleware");
const {
    getFavorites,
    toggleFavorite
} = require("../controllers/favoriteController");

router.use(verifyToken);

router.get("/", getFavorites);
router.post("/toggle", toggleFavorite);

module.exports = router;
