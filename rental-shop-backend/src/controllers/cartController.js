const { Cart, Product } = require("../models");

// GET CART
const getCart = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const cartItems = await Cart.findAll({
            where: { user_id: userId },
            include: [{ model: Product }]
        });
        res.status(200).json(cartItems);
    } catch (error) {
        next(error);
    }
};

// ADD TO CART
const addToCart = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const { product_id, quantity, size, startDate, endDate } = req.body;

        // Check if item already exists in cart with same options
        let cartItem = await Cart.findOne({
            where: {
                user_id: userId,
                product_id,
                size,
                startDate,
                endDate
            }
        });

        if (cartItem) {
            cartItem.quantity += parseInt(quantity) || 1;
            await cartItem.save();
        } else {
            cartItem = await Cart.create({
                user_id: userId,
                product_id,
                quantity: quantity || 1,
                size,
                startDate,
                endDate
            });
        }

        res.status(201).json({
            message: "Added to cart successfully",
            cartItem
        });
    } catch (error) {
        next(error);
    }
};

// UPDATE CART ITEM
const updateCartItem = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { quantity, startDate, endDate } = req.body;
        const userId = req.user.id;

        const cartItem = await Cart.findOne({ where: { id, user_id: userId } });

        if (!cartItem) {
            return res.status(404).json({ message: "Cart item not found" });
        }

        if (quantity !== undefined) cartItem.quantity = quantity;
        if (startDate) cartItem.startDate = startDate;
        if (endDate) cartItem.endDate = endDate;

        await cartItem.save();

        res.status(200).json({ message: "Cart updated", cartItem });
    } catch (error) {
        next(error);
    }
};

// REMOVE FROM CART
const removeCartItem = async (req, res, next) => {
    try {
        const { id } = req.params;
        const userId = req.user.id;

        const deleted = await Cart.destroy({ where: { id, user_id: userId } });

        if (!deleted) {
            return res.status(404).json({ message: "Cart item not found" });
        }

        res.status(200).json({ message: "Item removed from cart" });
    } catch (error) {
        next(error);
    }
};

// CLEAR CART
const clearCart = async (req, res, next) => {
    try {
        const userId = req.user.id;
        await Cart.destroy({ where: { user_id: userId } });
        res.status(200).json({ message: "Cart cleared" });
    } catch (error) {
        next(error);
    }
};

// GET CART SUMMARY
const getSummary = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const cartItems = await Cart.findAll({
            where: { user_id: userId },
            include: [{ model: Product }]
        });

        let subtotal = 0;
        cartItems.forEach(item => {
            const start = new Date(item.startDate);
            const end = new Date(item.endDate);
            const days = Math.ceil((end - start) / (1000 * 60 * 60 * 24)) || 1;
            const price = item.Product?.price_per_day || 0;
            subtotal += price * days * item.quantity;
        });

        const depositFee = subtotal * 0.2;
        const shippingFee = subtotal > 0 ? 30000 : 0;
        const total = subtotal + depositFee + shippingFee;

        res.status(200).json({
            itemCount: cartItems.length,
            subtotal,
            depositFee,
            shippingFee,
            total
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getCart,
    addToCart,
    updateCartItem,
    removeCartItem,
    clearCart,
    getSummary
};
