const { ProductVariant } = require("../models");

// GET VARIANTS FOR A PRODUCT
const getProductVariants = async (req, res, next) => {
    try {
        const { id } = req.params; // Product ID
        const variants = await ProductVariant.findAll({
            where: { product_id: id }
        });
        res.status(200).json(variants);
    } catch (error) {
        next(error);
    }
};

// CREATE VARIANT (Admin)
const createVariant = async (req, res, next) => {
    try {
        const { product_id, size, color, stock, price_modifier } = req.body;
        const variant = await ProductVariant.create({
            product_id,
            size,
            color,
            stock,
            price_modifier
        });
        res.status(201).json(variant);
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getProductVariants,
    createVariant
};
