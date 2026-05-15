const express = require("express");
const router = express.Router();
const { getDashboardStats, getAdminProducts } = require("../controllers/adminController");
// You might want to add an admin middleware here later
// const { isAdmin } = require("../middlewares/authMiddleware");

router.get("/stats", getDashboardStats);
router.get("/products", getAdminProducts);
router.get("/test", (req, res) => res.json({ message: "Admin API OK" }));

module.exports = router;
