const express = require("express");
const router = express.Router();
const verifyToken = require("../middlewares/authMiddleware");

const {
    registerUser,
    loginUser,
    getUserProfile
} = require("../controllers/userController");

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/profile", verifyToken, getUserProfile);

module.exports = router;