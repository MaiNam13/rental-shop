const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Cart = sequelize.define(
    "cart",
    {

        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },

        user_id: {
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

        size: {
            type: DataTypes.STRING,
        },

        startDate: {
            type: DataTypes.DATEONLY,
        },

        endDate: {
            type: DataTypes.DATEONLY,
        },

    },
    {
        freezeTableName: true,
    }
);

module.exports = Cart;