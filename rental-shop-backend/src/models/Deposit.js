const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Deposit = sequelize.define(
    "deposits",
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

        amount: {
            type: DataTypes.FLOAT,
            allowNull: false,
        },

        status: {
            type: DataTypes.STRING,
            defaultValue: "pending",
        },

    },
    {
        freezeTableName: true,
    }
);

module.exports = Deposit;