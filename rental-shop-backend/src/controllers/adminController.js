const { User, Product, Rental, RentalItem, Category, Payment } = require("../models");


exports.getAdminPayments = async (req, res) => {
    try {
        const payments = await Payment.findAll({
            include: [
                { 
                    model: Rental, 
                    attributes: ['id', 'total_price'],
                    include: [{ model: User, attributes: ['name', 'email'] }]
                }
            ],
            order: [['id', 'DESC']]
        });

        // 1. Calculate Summary Stats
        const summary = {
            totalRevenue: payments.filter(p => p.status === 'completed').reduce((sum, p) => sum + p.amount, 0),
            pendingAmount: payments.filter(p => p.status === 'pending').reduce((sum, p) => sum + p.amount, 0),
            pendingCount: payments.filter(p => p.status === 'pending').length,
            successCount: payments.filter(p => p.status === 'completed').length,
            failedCount: payments.filter(p => p.status === 'failed').length,
            failedAmount: payments.filter(p => p.status === 'failed').reduce((sum, p) => sum + p.amount, 0)
        };

        // 2. Chart Data (Monthly Revenue)
        const chartData = [];
        const monthNames = ['T1', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'T8', 'T9', 'T10', 'T11', 'T12'];
        
        // Group by month
        const monthlyGroups = payments.reduce((acc, p) => {
            if (p.status === 'completed') {
                const date = new Date(p.createdAt);
                const month = date.getMonth();
                acc[month] = (acc[month] || 0) + p.amount;
            }
            return acc;
        }, {});

        // Fill in last 6 months
        const currentMonth = new Date().getMonth();
        for (let i = 5; i >= 0; i--) {
            const m = (currentMonth - i + 12) % 12;
            chartData.push({
                name: monthNames[m],
                revenue: (monthlyGroups[m] || 0) / 1000000 // Convert to millions
            });
        }

        // 3. Payment Method Distribution
        const methodCounts = payments.reduce((acc, p) => {
            const m = p.method || 'cash';
            acc[m] = (acc[m] || 0) + 1;
            return acc;
        }, {});

        const totalPayments = payments.length || 1;
        const methodData = Object.keys(methodCounts).map(key => ({
            name: key === 'bank_transfer' ? 'Chuyển khoản' : (key === 'vnpay' ? 'VNPay' : (key === 'momo' ? 'Momo' : 'Tiền mặt')),
            value: Math.round((methodCounts[key] / totalPayments) * 100),
            count: methodCounts[key]
        }));

        res.json({
            payments,
            summary,
            chartData,
            methodData
        });
    } catch (error) {
        console.error("Admin Get Payments Error:", error);
        res.status(500).json({ message: error.message });
    }
};
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
            Product.count({ where: { status: 'out_of_stock' } }),
            Rental.count({ where: { status: 'renting' } })
        ]);

        res.json({
            products,
            summary: {
                total,
                available,
                out_of_stock: outOfStock,
                renting
            }
        });
    } catch (error) {
        console.error("Admin Get Products Error:", error);
        res.status(500).json({ message: error.message });
    }
};

exports.updatePaymentStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        const payment = await Payment.findByPk(id);
        if (!payment) {
            return res.status(404).json({ message: "Không tìm thấy giao dịch" });
        }

        payment.status = status;
        await payment.save();

        // Tự động duyệt đơn thuê liên quan nếu thanh toán thành công
        if (status === 'completed') {
            const rental = await Rental.findByPk(payment.rental_id);
            if (rental && rental.status === 'pending') {
                rental.status = 'approved';
                await rental.save();
            }
        }

        res.json({ message: "Cập nhật trạng thái thanh toán thành công", payment });
    } catch (error) {
        console.error("Update Payment Status Error:", error);
        res.status(500).json({ message: error.message });
    }
};
