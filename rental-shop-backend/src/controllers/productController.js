const { Op } = require("sequelize");

const { Product, Category } = require("../models");


// CREATE PRODUCT
const createProduct = async (req, res) => {
    try {

        const {
            name,
            description,
            price_per_day,
            category_id,
            stock,
            status,
            features
        } = req.body;

        // lấy ảnh từ multer upload
        const image = req.file
            ? `/uploads/${req.file.filename}`
            : null;

        const product = await Product.create({
            name,
            description,
            price_per_day,
            image,
            category_id,
            stock,
            status: parseInt(stock) === 0 ? "out_of_stock" : (status || "available"),
            features: features || null
        });

        res.status(201).json({
            message: "Product created successfully",
            product
        });

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }
};


// GET ALL PRODUCTS
const getAllProducts = async (req, res) => {
    try {

        // pagination
        const page = parseInt(req.query.page) || 1;

        const limit = parseInt(req.query.limit) || 10;

        const offset = (page - 1) * limit;

        // search
        const keyword = req.query.keyword || "";

        // filter category
        const category = req.query.category || "";

        // price filter
        const minPrice = parseInt(req.query.minPrice) || 0;
        const maxPrice = parseInt(req.query.maxPrice) || 100000000; // 100M default

        // status filter (available, newest)
        const status = req.query.status || "all";

        // sort
        const sort = req.query.sort || "DESC";

        // where condition
        let whereCondition = {};

        // search theo tên
        if (keyword) {
            whereCondition.name = {
                [Op.like]: `%${keyword}%`
            };
        }

        // filter category
        if (category) {
            whereCondition.category_id = category;
        }

        // filter price
        whereCondition.price_per_day = {
            [Op.between]: [minPrice, maxPrice]
        };

        // Mọi trạng thái đều được trả về, frontend sẽ xử lý hiển thị mờ nếu là 'hidden'

        // filter status
        if (status === "available") {
            whereCondition.status = 'available';
            whereCondition.stock = { [Op.gt]: 0 };
        } else if (status === "out_of_stock") {
            whereCondition.status = 'out_of_stock';
        } else if (status === "newest") {
            // Lấy hàng mới về trong vòng 30 ngày qua
            const thirtyDaysAgo = new Date();
            thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
            whereCondition.createdAt = {
                [Op.gte]: thirtyDaysAgo
            };
        }

        // lấy products
        const products = await Product.findAndCountAll({
            where: whereCondition,

            include: [
                {
                    model: Category,
                },
            ],

            // sort giá
            order: [
                ["price_per_day", sort]
            ],

            limit,
            offset,
        });

        res.status(200).json({
            totalProducts: products.count,
            totalPages: Math.ceil(products.count / limit),
            currentPage: page,
            products: products.rows,
        });

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }
};


// GET PRODUCT BY ID
const getProductById = async (req, res) => {
    try {

        const { id } = req.params;

        const product = await Product.findByPk(id, {
            include: [
                {
                    model: Category,
                },
            ],
        });

        if (!product) {
            return res.status(404).json({
                message: "Product not found"
            });
        }

        res.status(200).json(product);

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }
};


// UPDATE PRODUCT
const updateProduct = async (req, res) => {
    try {

        const { id } = req.params;

        const product = await Product.findByPk(id);

        if (!product) {
            return res.status(404).json({
                message: "Product not found"
            });
        }

        const {
            name,
            description,
            price_per_day,
            category_id,
            stock,
            status,
            features
        } = req.body;

        // giữ ảnh cũ nếu không upload ảnh mới
        let image = product.image;

        // nếu có upload ảnh mới
        if (req.file) {
            image = `/uploads/${req.file.filename}`;
        }

        await product.update({
            name,
            description,
            price_per_day,
            category_id,
            stock,
            status: parseInt(stock) === 0 ? "out_of_stock" : (status || product.status),
            features: features || product.features,
            image
        });

        res.status(200).json({
            message: "Product updated successfully",
            product
        });

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }
};


// DELETE PRODUCT
const deleteProduct = async (req, res) => {
    try {

        const { id } = req.params;

        const product = await Product.findByPk(id);

        if (!product) {
            return res.status(404).json({
                message: "Product not found"
            });
        }

        await product.destroy();

        res.status(200).json({
            message: "Product deleted successfully"
        });

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }
};


module.exports = {
    createProduct,
    getAllProducts,
    getProductById,
    updateProduct,
    deleteProduct
};