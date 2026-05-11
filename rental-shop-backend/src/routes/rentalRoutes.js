const express = require("express");

const router = express.Router();

const {
    createRental,
    getAllRentals,
    getRentalById,
    updateRental,
    getRentalsByUser
} = require("../controllers/rentalController");


// CREATE RENTAL
router.post("/", createRental);


// GET ALL RENTALS
router.get("/", getAllRentals);


// GET USER RENTALS
router.get("/user/:userId", getRentalsByUser);


// GET RENTAL DETAIL
router.get("/:id", getRentalById);


// UPDATE RENTAL STATUS
router.put("/:id/status", updateRental);


module.exports = router;