const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Product = sequelize.define("Product", {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },

    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },

    description: {
        type: DataTypes.TEXT,
    },

    price_per_day: {
        type: DataTypes.FLOAT,
        allowNull: false,
    },

    image: {
        type: DataTypes.STRING,
    },

    category: {
        type: DataTypes.STRING,
    },

    features: {
        type: DataTypes.TEXT, // Sẽ lưu dạng chuỗi phân cách bởi dấu xuống hàng hoặc dấu phẩy
    },

    material: {
        type: DataTypes.STRING,
    },

    stock: {
        type: DataTypes.INTEGER,
        defaultValue: 1,
    },

    status: {
        type: DataTypes.STRING,
        defaultValue: "available",
    },

    rating: {
        type: DataTypes.FLOAT,
        defaultValue: 5.0,
    },

}, {
    timestamps: true
});

module.exports = Product;