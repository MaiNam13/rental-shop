const { User, Product, Rental, RentalItem, Category } = require("../models");
const sequelize = require("../config/db");
const { Op } = require("sequelize");

exports.getDashboardStats = async (req, res) => {
    try {
        console.log("Fetching Dashboard Stats...");
        
        // 1. Basic Counts
        const totalUsers = await User.count().catch(e => (console.error(e), 0));
        const totalProducts = await Product.count().catch(e => (console.error(e), 0));
        const rentingCount = await Rental.count({ where: { status: 'renting' } }).catch(e => 0);
        const pendingCount = await Rental.count({ where: { status: 'pending' } }).catch(e => 0);
        const returnedCount = await Rental.count({ where: { status: 'returned' } }).catch(e => 0);
        const lowStockCount = await Product.count({ where: { stock: { [Op.lt]: 5 } } }).catch(e => 0);
        const availableCount = await Product.sum('stock', { where: { status: 'available' } }).catch(e => 0);
        const damagedCount = await Product.count({ where: { status: 'damaged' } }).catch(e => 0);

        // 2. Revenue
        const totalRevenueResult = await Rental.sum('total_price', { 
            where: { 
                status: { [Op.in]: ['renting', 'returned', 'approved'] }
            } 
        }).catch(e => 0);
        const totalRevenue = totalRevenueResult || 0;

        // 3. Recent Rentals
        const recentRentals = await Rental.findAll({
            limit: 5,
            order: [['id', 'DESC']],
            include: [{ model: User, attributes: ['name'] }]
        }).catch(e => (console.error("Recent rentals failed:", e), []));

        // 4. Top Products (Safe approach)
        let topProducts = [];
        try {
            const topProductsRaw = await RentalItem.findAll({
                attributes: [
                    'product_id',
                    [sequelize.fn('COUNT', sequelize.col('product_id')), 'rental_count'],
                    [sequelize.fn('SUM', sequelize.col('price_per_day')), 'total_revenue']
                ],
                group: ['product_id'],
                order: [[sequelize.literal('rental_count'), 'DESC']],
                limit: 5,
                raw: true
            });

            topProducts = await Promise.all(topProductsRaw.map(async (item) => {
                const product = await Product.findByPk(item.product_id, {
                    attributes: ['name', 'category', 'rating']
                });
                return { 
                    rental_count: item.rental_count,
                    total_revenue: item.total_revenue,
                    Product: product 
                };
            }));
        } catch (e) {
            console.error("Top products failed:", e);
        }

        // 5. Monthly Revenue (Safe approach)
        let monthlyRevenue = [];
        try {
            monthlyRevenue = await Rental.findAll({
                attributes: [
                    [sequelize.fn('MONTH', sequelize.col('start_date')), 'month'],
                    [sequelize.fn('SUM', sequelize.col('total_price')), 'revenue']
                ],
                where: {
                    status: { [Op.in]: ['renting', 'returned', 'approved'] }
                },
                group: [sequelize.fn('MONTH', sequelize.col('start_date'))],
                order: [[sequelize.fn('MONTH', sequelize.col('start_date')), 'ASC']],
                limit: 12,
                raw: true
            });
        } catch (e) {
            console.error("Monthly revenue failed:", e);
        }

        console.log("Stats fetched successfully");
        res.json({
            stats: {
                totalUsers,
                totalProducts,
                rentingCount,
                pendingCount,
                returnedCount,
                totalRevenue,
                lowStockCount,
                availableCount: availableCount || 0,
                damagedCount
            },
            recentRentals: recentRentals || [],
            topProducts: topProducts || [],
            monthlyRevenue: monthlyRevenue || []
        });
    } catch (error) {
        console.error("Critical Dashboard Stats Error:", error);
        res.status(500).json({ message: "Lỗi hệ thống khi lấy thống kê" });
    }
};

exports.getAdminProducts = async (req, res) => {
    try {
        const products = await Product.findAll({
            include: [{ model: Category, attributes: ['name'] }],
            order: [['id', 'DESC']]
        });

        // Summary stats for product page
        const [total, available, outOfStock, renting] = await Promise.all([
            Product.count(),
            Product.count({ where: { status: 'available' } }),
            Product.count({ where: { stock: 0 } }),
            Rental.count({ where: { status: 'renting' } }) // Simplified
        ]);

        res.json({
            products,
            summary: {
                total,
                available,
                outOfStock,
                renting
            }
        });
    } catch (error) {
        console.error("Admin Get Products Error:", error);
        res.status(500).json({ message: error.message });
    }
};
