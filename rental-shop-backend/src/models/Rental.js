const { DataTypes } = require("sequelize");

const sequelize = require("../config/db");

const Rental = sequelize.define("Rental", {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },

    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },

    start_date: {
        type: DataTypes.DATEONLY,
        allowNull: false,
    },

    end_date: {
        type: DataTypes.DATEONLY,
        allowNull: false,
    },

    full_name: {
        type: DataTypes.STRING,
        allowNull: true,
    },

    email: {
        type: DataTypes.STRING,
        allowNull: true,
    },

    phone: {
        type: DataTypes.STRING,
        allowNull: true,
    },

    address: {
        type: DataTypes.TEXT,
        allowNull: true,
    },

    note: {
        type: DataTypes.TEXT,
        allowNull: true,
    },

    delivery_method: {
        type: DataTypes.STRING,
        allowNull: true,
    },

    payment_method: {
        type: DataTypes.STRING,
        allowNull: true,
    },

    total_price: {
        type: DataTypes.FLOAT,
        defaultValue: 0,
    },

    status: {
        type: DataTypes.ENUM(
            "pending",
            "approved",
            "renting",
            "returned",
            "cancelled"
        ),
        defaultValue: "pending",
    },
});

module.exports = Rental;