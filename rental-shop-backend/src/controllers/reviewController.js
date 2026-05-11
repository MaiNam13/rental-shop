const { Review, User } = require("../models");

// GET REVIEWS FOR A PRODUCT
const getProductReviews = async (req, res, next) => {
    try {
        const { id } = req.params; // Product ID
        const reviews = await Review.findAll({
            where: { product_id: id },
            include: [{
                model: User,
                attributes: ["id", "name"]
            }],
            order: [["createdAt", "DESC"]]
        });
        res.status(200).json(reviews);
    } catch (error) {
        next(error);
    }
};

// CREATE REVIEW
const createReview = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const { product_id, rating, comment } = req.body;

        const review = await Review.create({
            user_id: userId,
            product_id,
            rating,
            comment
        });

        res.status(201).json({
            message: "Review submitted successfully",
            review
        });
    } catch (error) {
        next(error);
    }
};

// GET ALL REVIEWS (For Home Page)
const getAllReviews = async (req, res, next) => {
    try {
        const reviews = await Review.findAll({
            limit: 6,
            include: [{
                model: User,
                attributes: ["id", "name"]
            }],
            order: [["createdAt", "DESC"]]
        });
        res.status(200).json(reviews);
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getProductReviews,
    getAllReviews,
    createReview
};
