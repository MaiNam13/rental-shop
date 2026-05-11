const { DataTypes } = require("sequelize");

const sequelize = require("../config/db");

const RentalItem = sequelize.define("RentalItem", {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },

    rental_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },

    product_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },

    quantity: {
        type: DataTypes.INTEGER,
        defaultValue: 1,
    },

    price_per_day: {
        type: DataTypes.FLOAT,
        allowNull: false,
    },
});

module.exports = RentalItem;