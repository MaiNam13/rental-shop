const express = require("express");

const router = express.Router();
const upload = require("../middlewares/uploadMiddleware");

const {
    createCategory,
    getAllCategories,
    getCategoryById,
    updateCategory,
    deleteCategory,
} = require("../controllers/categoryController");

router.post("/", upload.single("image"), createCategory);

router.get("/", getAllCategories);

router.get("/:id", getCategoryById);

router.put("/:id", upload.single("image"), updateCategory);

router.delete("/:id", deleteCategory);

module.exports = router;