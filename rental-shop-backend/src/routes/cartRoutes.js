const express = require("express");
const router = express.Router();
const verifyToken = require("../middlewares/authMiddleware");
const {
    getCart,
    addToCart,
    updateCartItem,
    removeCartItem,
    clearCart,
    getSummary
} = require("../controllers/cartController");

router.use(verifyToken); // Tất cả các route cart đều cần đăng nhập

router.get("/", getCart);
router.get("/summary", getSummary);
router.post("/", addToCart);
router.put("/:id", updateCartItem);
router.delete("/:id", removeCartItem);
router.delete("/", clearCart);

module.exports = router;
