const express = require("express");

const router = express.Router();

const upload =
    require("../middlewares/uploadMiddleware");

const verifyToken =
    require("../middlewares/authMiddleware");

const adminMiddleware =
    require("../middlewares/adminMiddleware");

const {
    createProduct,
    getAllProducts,
    getProductById,
    updateProduct,
    deleteProduct
} = require("../controllers/productController");


// Upload Image
router.post(
    "/upload",
    verifyToken,
    adminMiddleware,
    upload.single("image"),
    (req, res) => {
        res.json({
            message: "Upload success",
            imageUrl: `/uploads/${req.file.filename}`,
        });
    }
);


// GET ALL PRODUCTS
router.get("/", getAllProducts);


// GET PRODUCT DETAIL
router.get("/:id", getProductById);


// CREATE PRODUCT
router.post(
    "/",
    verifyToken,
    adminMiddleware,
    upload.single("image"),
    createProduct
);


// UPDATE PRODUCT
router.put(
    "/:id",
    verifyToken,
    adminMiddleware,
    upload.single("image"),
    updateProduct
);


// DELETE PRODUCT
router.delete(
    "/:id",
    verifyToken,
    adminMiddleware,
    deleteProduct
);

module.exports = router;