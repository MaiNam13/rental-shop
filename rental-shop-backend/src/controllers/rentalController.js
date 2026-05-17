const {
    Rental,
    RentalItem,
    Product,
    User,
    Payment
} = require("../models");
const { sendConfirmationEmail, sendOrderPlacedEmail, sendOrderApprovedEmail, sendOrderCancelledEmail } = require("../services/emailService");
// Nodemon restart trigger for env reload

// CREATE RENTAL
const createRental = async (req, res) => {
    console.log("Create Rental Request Body:", JSON.stringify(req.body, null, 2));
    try {

        const {
            user_id,
            start_date,
            end_date,
            items,
            shippingInfo,
            deliveryMethod,
            paymentMethod
        } = req.body;
        
        if (!start_date || !end_date) {
            return res.status(400).json({
                message: "Vui lòng chọn ngày bắt đầu và ngày kết thúc thuê."
            });
        }

        if (!items || !items.length) {
            return res.status(400).json({
                message: "Giỏ hàng của bạn đang trống."
            });
        }

        // 1. Kiểm tra kho hàng trước khi làm bất cứ điều gì
        const productsToUpdate = [];
        let total_price = 0;
        
        const start = new Date(start_date);
        const end = new Date(end_date);
        const totalDays = Math.max(1, Math.ceil((end - start) / (1000 * 60 * 60 * 24)));

        for (const item of items) {
            const product = await Product.findByPk(item.product_id);
            if (!product) {
                return res.status(404).json({
                    message: `Không tìm thấy sản phẩm ID: ${item.product_id}`
                });
            }
            if (product.stock < item.quantity) {
                return res.status(400).json({
                    message: `Sản phẩm "${product.name}" đã hết hàng hoặc không đủ số lượng.`
                });
            }
            
            total_price += product.price_per_day * item.quantity * totalDays;
            productsToUpdate.push({ product, quantity: item.quantity, item });
        }

        const isOnlinePayment = ['momo', 'vnpay', 'card'].includes(paymentMethod);

        // 2. Nếu mọi thứ ok, tiến hành tạo đơn hàng
        const rental = await Rental.create({
            user_id,
            start_date,
            end_date,
            full_name: shippingInfo?.fullName,
            email: shippingInfo?.email,
            phone: shippingInfo?.phone,
            address: shippingInfo?.address,
            note: shippingInfo?.note,
            delivery_method: deliveryMethod,
            payment_method: paymentMethod,
            total_price: total_price,
            status: isOnlinePayment ? "approved" : "pending" // Tự động duyệt nếu thanh toán trực tuyến
        });

        // 3. Tạo chi tiết đơn hàng và cập nhật kho
        for (const { product, quantity, item } of productsToUpdate) {
            await RentalItem.create({
                rental_id: rental.id,
                product_id: product.id,
                quantity: quantity,
                price_per_day: product.price_per_day,
                size: item.size
            });

            product.stock -= quantity;
            
            // Tự động chuyển trạng thái nếu hết hàng
            if (product.stock <= 0) {
                product.status = 'out_of_stock';
            }
            
            await product.save();
        }

        // 4. Tạo bản ghi thanh toán (Payment)
        await Payment.create({
            rental_id: rental.id,
            amount: total_price,
            method: paymentMethod,
            status: isOnlinePayment ? "completed" : "pending" // Tự động hoàn thành thanh toán nếu chọn thanh toán trực tuyến
        });

        console.log("Rental and Payment created successfully:", rental.id);

        // Gửi email xác nhận đặt hàng thành công trong background
        sendOrderPlacedEmail(rental).catch(err => console.error("Error sending order placed email:", err));

        res.status(201).json({
            message: "Đặt thuê thành công!",
            rental,
        });

    } catch (error) {
        console.error("Create Rental Error:", error);
        res.status(500).json({
            message: "Đã xảy ra lỗi hệ thống: " + error.message
        });
    }
};


// GET ALL RENTALS
const getAllRentals = async (req, res) => {
    try {

        const rentals = await Rental.findAll({
            include: [
                {
                    model: User,
                    attributes: ["id", "name", "email"],
                },
                {
                    model: RentalItem,
                    include: [
                        {
                            model: Product,
                        },
                    ],
                },
            ],
        });

        res.status(200).json(rentals);

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }
};


// GET RENTAL DETAIL
const getRentalById = async (req, res) => {
    try {

        const { id } = req.params;

        const rental = await Rental.findByPk(id, {
            include: [
                {
                    model: User,
                    attributes: ["id", "name", "email"],
                },
                {
                    model: RentalItem,
                    include: [
                        {
                            model: Product,
                        },
                    ],
                },
            ],
        });

        if (!rental) {
            return res.status(404).json({
                message: "Rental not found"
            });
        }

        res.status(200).json(rental);

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }
};


// UPDATE RENTAL STATUS
const updateRental = async (req, res) => {
    try {

        const { id } = req.params;

        const { status } = req.body;

        const validStatus = [
            "pending",
            "approved",
            "shipping",
            "renting",
            "returned",
            "cancelled"
        ];

        // validate status
        if (!validStatus.includes(status)) {
            return res.status(400).json({
                message: "Invalid status"
            });
        }

        const rental = await Rental.findByPk(id);

        if (!rental) {
            return res.status(404).json({
                message: "Rental not found"
            });
        }

        const previousStatus = rental.status;

        // update status
        rental.status = status;

        // nếu trả hàng hoặc hủy đơn và trạng thái trước đó chưa từng là trả/hủy -> cộng stock lại
        if ((status === "returned" || status === "cancelled") && previousStatus !== "returned" && previousStatus !== "cancelled") {
            const rentalItems = await RentalItem.findAll({
                where: { rental_id: rental.id }
            });

            for (const item of rentalItems) {
                const product = await Product.findByPk(item.product_id);
                if (product) {
                    product.stock += item.quantity;

                    // Tự động khôi phục trạng thái nếu trước đó đã hết hàng
                    if (product.stock > 0 && product.status === 'out_of_stock') {
                        product.status = 'available';
                    }

                    await product.save();
                }
            }
        }

        await rental.save();

        // Gửi email thông báo tuỳ theo trạng thái đơn hàng
        if (status === "approved") {
            sendOrderApprovedEmail(rental).catch(err => console.error("Email approved send error:", err));
        } else if (status === "cancelled") {
            sendOrderCancelledEmail(rental).catch(err => console.error("Email cancelled send error:", err));
        } else if (status === "shipping") {
            sendConfirmationEmail(rental).catch(err => console.error("Email shipping send error:", err));
        }

        res.status(200).json({
            message: "Rental updated successfully",
            rental,
        });

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }
};


// GET RENTALS BY USER
const getRentalsByUser = async (req, res) => {
    try {
        const { userId } = req.params;

        const rentals = await Rental.findAll({
            where: { user_id: userId },
            include: [
                {
                    model: RentalItem,
                    include: [
                        {
                            model: Product,
                        },
                    ],
                },
            ],
            order: [['createdAt', 'DESC']]
        });

        res.status(200).json(rentals);
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};


module.exports = {
    createRental,
    getAllRentals,
    getRentalById,
    updateRental,
    getRentalsByUser,
};