const express = require("express");
const router = express.Router();
const { getDashboardStats, getAdminProducts, getAdminPayments, updatePaymentStatus } = require("../controllers/adminController");
const { getAllUsers, deleteUser, toggleUserLock } = require("../controllers/userController");
const { getAllRentals, updateRental } = require("../controllers/rentalController");

router.get("/stats", getDashboardStats);
router.get("/products", getAdminProducts);
router.get("/users", getAllUsers);
router.delete("/users/:id", deleteUser);
router.put("/users/:id/toggle-lock", toggleUserLock);
router.get("/rentals", getAllRentals);
router.put("/rentals/:id/status", updateRental);
router.get("/payments", getAdminPayments);
router.put("/payments/:id/status", updatePaymentStatus);

module.exports = router;
