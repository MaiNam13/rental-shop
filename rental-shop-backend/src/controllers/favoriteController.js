const { Favorite, Product } = require("../models");

// GET FAVORITES
const getFavorites = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const favorites = await Favorite.findAll({
            where: { user_id: userId },
            include: [{ model: Product }]
        });
        res.status(200).json(favorites);
    } catch (error) {
        next(error);
    }
};

// TOGGLE FAVORITE
const toggleFavorite = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const { product_id } = req.body;

        const favorite = await Favorite.findOne({
            where: { user_id: userId, product_id }
        });

        if (favorite) {
            await favorite.destroy();
            return res.status(200).json({ message: "Removed from favorites" });
        } else {
            await Favorite.create({ user_id: userId, product_id });
            return res.status(201).json({ message: "Added to favorites" });
        }
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getFavorites,
    toggleFavorite
};
