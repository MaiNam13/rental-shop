const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const InventoryItem = sequelize.define(
    "inventory_items",
    {

        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },

        product_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },

        serial_number: {
            type: DataTypes.STRING,
            allowNull: false,
        },

        condition: {
            type: DataTypes.STRING,
            defaultValue: "good",
        },

        status: {
            type: DataTypes.STRING,
            defaultValue: "available",
        },

    },
    {
        freezeTableName: true,
    }
);

module.exports = InventoryItem;