const User = require("./User");
const Category = require("./Category");
const Product = require("./Product");

const Rental = require("./Rental");
const RentalItem = require("./RentalItem");

const Cart = require("./Cart");
const Favorite = require("./Favorite");
const Deposit = require("./Deposit");
const Payment = require("./Payment");

const InventoryItem = require("./InventoryItem");
const ProductVariant = require("./ProductVariant");
const Review = require("./Review");


// ================= PRODUCTS - CATEGORIES =================

Category.hasMany(Product, {
    foreignKey: "category_id",
});

Product.belongsTo(Category, {
    foreignKey: "category_id",
});


// ================= USERS - RENTALS =================

User.hasMany(Rental, {
    foreignKey: "user_id",
});

Rental.belongsTo(User, {
    foreignKey: "user_id",
});


// ================= RENTALS - RENTALITEMS =================

Rental.hasMany(RentalItem, {
    foreignKey: "rental_id",
});

RentalItem.belongsTo(Rental, {
    foreignKey: "rental_id",
});


// ================= PRODUCTS - RENTALITEMS =================

Product.hasMany(RentalItem, {
    foreignKey: "product_id",
});

RentalItem.belongsTo(Product, {
    foreignKey: "product_id",
});


// ================= USERS - CART =================

User.hasMany(Cart, {
    foreignKey: "user_id",
});

Cart.belongsTo(User, {
    foreignKey: "user_id",
});


// ================= PRODUCTS - CART =================

Product.hasMany(Cart, {
    foreignKey: "product_id",
});

Cart.belongsTo(Product, {
    foreignKey: "product_id",
});


// ================= USERS - FAVORITES =================

User.hasMany(Favorite, {
    foreignKey: "user_id",
});

Favorite.belongsTo(User, {
    foreignKey: "user_id",
});


// ================= PRODUCTS - FAVORITES =================

Product.hasMany(Favorite, {
    foreignKey: "product_id",
});

Favorite.belongsTo(Product, {
    foreignKey: "product_id",
});


// ================= USERS - DEPOSITS =================

User.hasMany(Deposit, {
    foreignKey: "user_id",
});

Deposit.belongsTo(User, {
    foreignKey: "user_id",
});


// ================= RENTALS - PAYMENTS =================

Rental.hasMany(Payment, {
    foreignKey: "rental_id",
});

Payment.belongsTo(Rental, {
    foreignKey: "rental_id",
});


// ================= PRODUCTS - INVENTORY ITEMS =================

Product.hasMany(InventoryItem, {
    foreignKey: "product_id",
});

InventoryItem.belongsTo(Product, {
    foreignKey: "product_id",
});


// ================= PRODUCTS - PRODUCT VARIANTS =================

Product.hasMany(ProductVariant, {
    foreignKey: "product_id",
});

ProductVariant.belongsTo(Product, {
    foreignKey: "product_id",
});


// ================= PRODUCTS - REVIEWS =================

Product.hasMany(Review, {
    foreignKey: "product_id",
});

Review.belongsTo(Product, {
    foreignKey: "product_id",
});


// ================= USERS - REVIEWS =================

User.hasMany(Review, {
    foreignKey: "user_id",
});

Review.belongsTo(User, {
    foreignKey: "user_id",
});


module.exports = {
    User,
    Category,
    Product,

    Rental,
    RentalItem,

    Cart,
    Favorite,
    Deposit,
    Payment,

    InventoryItem,
    ProductVariant,
    Review,
};