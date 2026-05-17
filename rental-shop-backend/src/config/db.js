const { Sequelize } = require("sequelize");
require("dotenv").config();

let sequelize;

if (process.env.DATABASE_URL) {
    // Configuration for PostgreSQL on Replit / Heroku / Render
    sequelize = new Sequelize(process.env.DATABASE_URL, {
        dialect: "postgres",
        protocol: "postgres",
        dialectOptions: {
            ssl: {
                require: true,
                rejectUnauthorized: false // Required for external SSL database connections
            }
        },
        logging: false
    });
} else {
    // Configuration for local MySQL
    sequelize = new Sequelize(
        process.env.DB_NAME,
        process.env.DB_USER,
        process.env.DB_PASSWORD,
        {
            host: process.env.DB_HOST,
            dialect: process.env.DB_DIALECT || "mysql",
            logging: false
        }
    );
}

module.exports = sequelize;