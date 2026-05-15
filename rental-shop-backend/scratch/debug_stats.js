const { User, Product, Rental, RentalItem } = require("../src/models");
const sequelize = require("../src/config/db");
const { Op } = require("sequelize");

async function testControllerLogic() {
    try {
        console.log("1. Testing Basic Stats...");
        const stats = {};
        stats.totalUsers = await User.count();
        stats.totalProducts = await Product.count();
        stats.rentingCount = await Rental.count({ where: { status: 'renting' } });
        console.log("Basic stats OK");

        console.log("2. Testing Revenue Sum...");
        const totalRevenue = await Rental.sum('total_price', { 
            where: { status: { [Op.in]: ['renting', 'returned', 'approved'] } } 
        });
        console.log("Revenue Sum OK:", totalRevenue);

        console.log("3. Testing Recent Rentals...");
        const recentRentals = await Rental.findAll({
            limit: 5,
            order: [['id', 'DESC']],
            include: [{ model: User, attributes: ['name'] }]
        });
        console.log("Recent Rentals OK");

        console.log("4. Testing Top Products...");
        const topProductsData = await RentalItem.findAll({
            attributes: [
                'product_id',
                [sequelize.fn('COUNT', sequelize.col('product_id')), 'rental_count'],
            ],
            group: ['product_id'],
            include: [{ model: Product, attributes: ['name'] }]
        });
        console.log("Top Products OK");

        console.log("5. Testing Monthly Revenue...");
        const monthlyRevenue = await Rental.findAll({
            attributes: [
                [sequelize.fn('MONTH', sequelize.col('start_date')), 'month'],
                [sequelize.fn('SUM', sequelize.col('total_price')), 'revenue']
            ],
            where: { status: { [Op.in]: ['renting', 'returned', 'approved'] } },
            group: [sequelize.fn('MONTH', sequelize.col('start_date'))]
        });
        console.log("Monthly Revenue OK");

        console.log("ALL TESTS PASSED");
        process.exit(0);
    } catch (error) {
        console.error("DEBUG ERROR AT STEP:", error.message);
        console.error(error.stack);
        process.exit(1);
    }
}

testControllerLogic();
