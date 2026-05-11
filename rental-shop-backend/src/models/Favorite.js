const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Favorite = sequelize.define(
    "favorites",
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

    },
    {
        freezeTableName: true,
    }
);

module.exports = Favorite;