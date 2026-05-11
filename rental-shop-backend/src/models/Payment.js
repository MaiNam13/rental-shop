const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Payment = sequelize.define(
    "payment",
    {

        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },

        rental_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },

        amount: {
            type: DataTypes.FLOAT,
            allowNull: false,
        },

        method: {
            type: DataTypes.STRING,
            defaultValue: "cash",
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

module.exports = Payment;