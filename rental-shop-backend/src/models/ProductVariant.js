const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const ProductVariant = sequelize.define("product_variant", {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    product_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    size: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    color: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    stock: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
    },
    price_modifier: {
        type: DataTypes.DECIMAL(10, 2),
        defaultValue: 0, // Giá cộng thêm nếu là hàng cao cấp/hiếm
    }
}, {
    freezeTableName: true,
    timestamps: true
});

module.exports = ProductVariant;