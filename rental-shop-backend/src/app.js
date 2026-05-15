require("dotenv").config();

const express = require("express");
const cors = require("cors");
const path = require("path");
const morgan = require("morgan");
const helmet = require("helmet");

const sequelize = require("./config/db");

// Routes
const userRoutes = require("./routes/userRoutes");
const productRoutes = require("./routes/productRoutes");
const categoryRoutes = require("./routes/categoryRoutes");
const rentalRoutes = require("./routes/rentalRoutes");
const cartRoutes = require("./routes/cartRoutes");
const favoriteRoutes = require("./routes/favoriteRoutes");
const variantRoutes = require("./routes/variantRoutes");
const reviewRoutes = require("./routes/reviewRoutes");
const adminRoutes = require("./routes/adminRoutes");

// Middleware
const authMiddleware = require("./middlewares/authMiddleware");
const errorMiddleware = require("./middlewares/errorMiddleware");

// Import Models & Relationships
require("./models");


// =========================
// Create App
// =========================
const app = express();


// =========================
// Middleware
// =========================
app.use(cors());
app.use(helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
    crossOriginEmbedderPolicy: false
}));
app.use(morgan("dev"));
app.use(express.json());


// =========================
// Static Folder Uploads
// =========================
app.use(
    "/uploads",
    express.static(
        path.join(__dirname, "uploads")
    )
);


// =========================
// Routes
// =========================

// Test API
app.get("/", (req, res) => {
    res.send("Rental Shop API Running...");
});


// Protected Route
app.get(
    "/api/profile",
    authMiddleware,
    (req, res) => {
        res.json({
            message: "Protected route accessed",
            user: req.user
        });
    }
);


// API Routes
app.use("/api/users", userRoutes);

app.use("/api/products", productRoutes);

app.use("/api/categories", categoryRoutes);

app.use("/api/rentals", rentalRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/favorites", favoriteRoutes);
app.use("/api/product-variants", variantRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/admin", adminRoutes);

// Error Handling Middleware (Must be last)
app.use(errorMiddleware);


// =========================
// Start Server
// =========================
const PORT = process.env.PORT || 3000;

const startServer = async () => {
    try {
        await sequelize.authenticate();
        console.log("MySQL Connected...");

        // // Use sync() without alter to prevent crash
        // await sequelize.sync();
        // console.log("Database Synced...");

        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });

        // Keep alive
        setInterval(() => {}, 1000 * 60 * 60);
    } catch (error) {
        console.log("Failed to start server:", error);
        process.exit(1);
    }
};

startServer(); 