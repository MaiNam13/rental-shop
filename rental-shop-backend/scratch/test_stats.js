const { User, Product, Rental, RentalItem } = require("../src/models");
const sequelize = require("../src/config/db");
const { Op } = require("sequelize");

async function testStats() {
    try {
        console.log("Testing Stats Query...");
        
        const totalUsers = await User.count();
        console.log("Total Users:", totalUsers);

        const recentRentals = await Rental.findAll({
            limit: 5,
            order: [['createdAt', 'DESC']],
            include: [{ model: User, attributes: ['name'] }]
        });
        console.log("Recent Rentals fetched");

        const topProductsData = await RentalItem.findAll({
            attributes: [
                'product_id',
                [sequelize.fn('COUNT', sequelize.col('product_id')), 'rental_count'],
            ],
            group: ['product_id'],
            include: [{ 
                model: Product, 
                attributes: ['name'] 
            }]
        });
        console.log("Top Products fetched");

        process.exit(0);
    } catch (error) {
        console.error("TEST ERROR:", error);
        process.exit(1);
    }
}

testStats();
