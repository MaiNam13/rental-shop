const { Category } = require("../models");

const createCategory = async (req, res) => {
    try {
        if (req.file) {
            req.body.image = `/uploads/${req.file.filename}`;
        }
        
        const category = await Category.create(req.body);

        res.status(201).json({
            message: "Create category success",
            category,
        });
    } catch (error) {
        res.status(500).json({
            message: error.message,
        });
    }
};

const getAllCategories = async (req, res) => {
    try {
        const categories = await Category.findAll();

        res.json(categories);
    } catch (error) {
        res.status(500).json({
            message: error.message,
        });
    }
};

const getCategoryById = async (req, res) => {
    try {
        const category = await Category.findByPk(req.params.id);

        if (!category) {
            return res.status(404).json({
                message: "Category not found",
            });
        }

        res.json(category);
    } catch (error) {
        res.status(500).json({
            message: error.message,
        });
    }
};

const updateCategory = async (req, res) => {
    try {
        const category = await Category.findByPk(req.params.id);

        if (!category) {
            return res.status(404).json({
                message: "Category not found",
            });
        }

        if (req.file) {
            req.body.image = `/uploads/${req.file.filename}`;
        }

        await category.update(req.body);

        res.json({
            message: "Update category success",
            category,
        });
    } catch (error) {
        res.status(500).json({
            message: error.message,
        });
    }
};

const deleteCategory = async (req, res) => {
    try {
        const category = await Category.findByPk(req.params.id);

        if (!category) {
            return res.status(404).json({
                message: "Category not found",
            });
        }

        await category.destroy();

        res.json({
            message: "Delete category success",
        });
    } catch (error) {
        res.status(500).json({
            message: error.message,
        });
    }
};

module.exports = {
    createCategory,
    getAllCategories,
    getCategoryById,
    updateCategory,
    deleteCategory,
};