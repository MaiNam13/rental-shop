// AUTO-GENERATED SEED FILE FROM LOCAL MYSQL DATA
const sequelize = require("./config/db");
const { Category, Product, User, ProductVariant, InventoryItem, Review } = require("./models");

const runSeed = async () => {
    try {
        console.log("Initializing database sync for seeding...");
        // Use alter: true to preserve and adapt database tables
        await sequelize.sync({ alter: true });
        console.log("Database tables synced.");

        // Clear existing data in correct dependency order
        if (Review) await Review.destroy({ where: {}, truncate: { cascade: true } });
        if (InventoryItem) await InventoryItem.destroy({ where: {}, truncate: { cascade: true } });
        if (ProductVariant) await ProductVariant.destroy({ where: {}, truncate: { cascade: true } });
        await Product.destroy({ where: {}, truncate: { cascade: true } });
        await Category.destroy({ where: {}, truncate: { cascade: true } });
        await User.destroy({ where: {}, truncate: { cascade: true } });
        console.log("Existing database rows cleared.");

        // Seed Users
        const users = [
    {
        "id": 1,
        "name": "Admin",
        "email": "admin@gmail.com",
        "password": "$2b$10$E9yzK/a.9VdD1ZofeTTvleZxxxRvkxF.InsUn/W.XPSWxhx50c6iC",
        "phone": "0123456789",
        "role": "admin",
        "is_locked": 0,
        "avatar": null,
        "provider": null,
        "provider_id": null
    },
    {
        "id": 2,
        "name": "Mai Nam",
        "email": "mainam137204@gmail.com",
        "password": "$2b$10$PQx3.5Kwj5LNcC2EA0cxEuwjpUiJdIzii6nfVARCN7h4esiTz89ti",
        "phone": "0912016657",
        "role": "customer",
        "is_locked": 0,
        "avatar": null,
        "provider": null,
        "provider_id": null
    }
];
        await User.bulkCreate(users);
        console.log("Successfully seeded users!");

        // Seed Categories
        const categories = [
    {
        "id": 5,
        "name": "Giày",
        "image": "/uploads/1779033206479-giay4.jpg",
        "createdAt": "2026-05-16T07:19:26.000Z",
        "updatedAt": "2026-05-17T15:53:26.000Z"
    },
    {
        "id": 6,
        "name": "Vest",
        "image": "/uploads/1779021611943-vets1.jpg",
        "createdAt": "2026-05-17T12:40:11.000Z",
        "updatedAt": "2026-05-17T12:40:11.000Z"
    },
    {
        "id": 7,
        "name": "Váy cưới",
        "image": "/uploads/1779021630328-vaycuoi1.jpg",
        "createdAt": "2026-05-17T12:40:30.000Z",
        "updatedAt": "2026-05-17T12:40:30.000Z"
    },
    {
        "id": 8,
        "name": "Nón",
        "image": "/uploads/1779021648340-non3.jpg",
        "createdAt": "2026-05-17T12:40:48.000Z",
        "updatedAt": "2026-05-17T12:40:48.000Z"
    },
    {
        "id": 9,
        "name": "Cao gót",
        "image": "/uploads/1779021663385-caogot3.jpg",
        "createdAt": "2026-05-17T12:41:03.000Z",
        "updatedAt": "2026-05-17T12:41:03.000Z"
    }
];
        await Category.bulkCreate(categories);
        console.log("Successfully seeded categories!");

        // Seed Products
        const products = [
    {
        "id": 5,
        "name": "Giày dior",
        "description": "giày cao cấp siêu chất lượng",
        "price_per_day": 150000,
        "image": "/uploads/1778916030833-giay dior.jpg",
        "category": null,
        "features": "{\"sizes\":[\"34\",\"33\"],\"colors\":[\"đen\",\"Cam\",\"Tím\",\"Nâu\"]}",
        "material": null,
        "stock": 28,
        "status": "available",
        "rating": 5,
        "createdAt": "2026-05-16T07:20:30.000Z",
        "updatedAt": "2026-05-17T12:12:21.000Z",
        "category_id": 5
    },
    {
        "id": 6,
        "name": "Vest đen nam",
        "description": "Vest hàng siêu chất lượng ",
        "price_per_day": 200000,
        "image": "/uploads/1779021750846-vest2.jpg",
        "category": null,
        "features": "{\"sizes\":[\"M\",\"L\",\"XL\",\"XXL\"],\"colors\":[\"Đen\"]}",
        "material": null,
        "stock": 3,
        "status": "available",
        "rating": 5,
        "createdAt": "2026-05-17T12:42:30.000Z",
        "updatedAt": "2026-05-17T12:42:30.000Z",
        "category_id": 6
    },
    {
        "id": 7,
        "name": "Vest xám",
        "description": "Nhìn là biết đẹp ",
        "price_per_day": 250000,
        "image": "/uploads/1779021809745-vest3.jpg",
        "category": null,
        "features": "{\"sizes\":[\"L\",\"M\",\"XL\",\"XXL\"],\"colors\":[\"Xám\",\"Đen\"]}",
        "material": null,
        "stock": 3,
        "status": "available",
        "rating": 5,
        "createdAt": "2026-05-17T12:43:29.000Z",
        "updatedAt": "2026-05-17T12:43:29.000Z",
        "category_id": 6
    },
    {
        "id": 8,
        "name": "Vest xanh ",
        "description": "Thuê đi đừng ngại",
        "price_per_day": 40000,
        "image": "/uploads/1779021868222-vest4.jpg",
        "category": null,
        "features": "{\"sizes\":[\"M\",\"L\",\"XL\",\"XXL\"],\"colors\":[\"Xanh dương\",\"Đen\"]}",
        "material": null,
        "stock": 2,
        "status": "available",
        "rating": 5,
        "createdAt": "2026-05-17T12:44:28.000Z",
        "updatedAt": "2026-05-17T12:44:28.000Z",
        "category_id": 6
    },
    {
        "id": 9,
        "name": "Vest trắng đỏ",
        "description": "Siêu đẹp siêu chât lượng",
        "price_per_day": 500000,
        "image": "/uploads/1779021909161-vest5.jpg",
        "category": null,
        "features": "{\"sizes\":[\"M\",\"L\",\"XL\",\"XXL\"],\"colors\":[\"Đỏ\",\"Đen\",\"Trắng\"]}",
        "material": null,
        "stock": 4,
        "status": "available",
        "rating": 5,
        "createdAt": "2026-05-17T12:45:09.000Z",
        "updatedAt": "2026-05-17T12:45:09.000Z",
        "category_id": 6
    },
    {
        "id": 10,
        "name": "Vest trắng ",
        "description": "Đẹp của đẹp",
        "price_per_day": 600000,
        "image": "/uploads/1779021945183-vest6.jpg",
        "category": null,
        "features": "{\"sizes\":[\"M\",\"L\",\"XL\",\"XXL\"],\"colors\":[]}",
        "material": null,
        "stock": 4,
        "status": "available",
        "rating": 5,
        "createdAt": "2026-05-17T12:45:45.000Z",
        "updatedAt": "2026-05-17T12:45:45.000Z",
        "category_id": 6
    },
    {
        "id": 11,
        "name": "Đầm cưới ôm người",
        "description": "Vải mềm đẹp",
        "price_per_day": 900000,
        "image": "/uploads/1779022013069-vaycuoi4.jpg",
        "category": null,
        "features": "{\"sizes\":[\"XS\",\"S\",\"M\",\"L\",\"XL\"],\"colors\":[\"Trắng\"]}",
        "material": null,
        "stock": 1,
        "status": "available",
        "rating": 5,
        "createdAt": "2026-05-17T12:46:53.000Z",
        "updatedAt": "2026-05-17T12:46:53.000Z",
        "category_id": 7
    },
    {
        "id": 12,
        "name": "Đầm cưới nữ hàng",
        "description": "Mặc lên thành hoàng hậu",
        "price_per_day": 1000000,
        "image": "/uploads/1779022067170-vaycuoi3.jpg",
        "category": null,
        "features": "{\"sizes\":[\"S\",\"M\",\"L\",\"XS\",\"XL\"],\"colors\":[\"Trắng\"]}",
        "material": null,
        "stock": 1,
        "status": "available",
        "rating": 5,
        "createdAt": "2026-05-17T12:47:47.000Z",
        "updatedAt": "2026-05-17T12:47:47.000Z",
        "category_id": 7
    },
    {
        "id": 13,
        "name": "Đầm cưới công chúa",
        "description": "Đẹp như công chúa",
        "price_per_day": 500000,
        "image": "/uploads/1779022116170-vaycuoi2.jpg",
        "category": null,
        "features": "{\"sizes\":[\"S\",\"M\",\"L\",\"XL\"],\"colors\":[]}",
        "material": null,
        "stock": 1,
        "status": "available",
        "rating": 5,
        "createdAt": "2026-05-17T12:48:36.000Z",
        "updatedAt": "2026-05-17T12:48:36.000Z",
        "category_id": 7
    },
    {
        "id": 14,
        "name": "Nón trung quốc",
        "description": "Đội lên mát đầu",
        "price_per_day": 50000,
        "image": "/uploads/1779022166333-non2.jpg",
        "category": null,
        "features": "{\"sizes\":[\"S\",\"M\",\"L\",\"XL\",\"XXL\"],\"colors\":[\"Be\",\"Đen\",\"Trắng\"]}",
        "material": null,
        "stock": 9,
        "status": "available",
        "rating": 5,
        "createdAt": "2026-05-17T12:49:26.000Z",
        "updatedAt": "2026-05-17T12:49:26.000Z",
        "category_id": 8
    },
    {
        "id": 15,
        "name": "Nón LV",
        "description": "Đội như không đội siêu nhẹ",
        "price_per_day": 50000,
        "image": "/uploads/1779022218453-non1.jpg",
        "category": null,
        "features": "{\"sizes\":[\"S\",\"M\",\"L\",\"XL\",\"XXL\"],\"colors\":[\"Đen\",\"Trắng\",\"Đỏ\",\"Xanh dương\",\"Vàng\",\"Hồng\",\"Be\",\"Xám\"]}",
        "material": null,
        "stock": 6,
        "status": "available",
        "rating": 5,
        "createdAt": "2026-05-17T12:50:18.000Z",
        "updatedAt": "2026-05-17T12:50:18.000Z",
        "category_id": 8
    },
    {
        "id": 16,
        "name": "Giày da rồng",
        "description": "Được lấy từ da rồng trên đỉnh núi tuyết",
        "price_per_day": 600000,
        "image": "/uploads/1779022292072-giay6.jpg",
        "category": null,
        "features": "{\"sizes\":[\"40\",\"41\",\"39\",\"38\",\"42\"],\"colors\":[\"Trắng\"]}",
        "material": null,
        "stock": 4,
        "status": "available",
        "rating": 5,
        "createdAt": "2026-05-17T12:51:32.000Z",
        "updatedAt": "2026-05-17T12:51:32.000Z",
        "category_id": 5
    },
    {
        "id": 17,
        "name": "Giày da nhân tạo",
        "description": "Đi cả ngày đau chân",
        "price_per_day": 150000,
        "image": "/uploads/1779022362387-giay3.jpg",
        "category": null,
        "features": "{\"sizes\":[\"38\",\"39\",\"40\",\"41\",\"42\"],\"colors\":[\"Đen\"]}",
        "material": null,
        "stock": 5,
        "status": "available",
        "rating": 5,
        "createdAt": "2026-05-17T12:52:42.000Z",
        "updatedAt": "2026-05-17T12:52:42.000Z",
        "category_id": 5
    },
    {
        "id": 18,
        "name": "Giày LV",
        "description": "Chính hãng đẹp ",
        "price_per_day": 200000,
        "image": "/uploads/1779022408177-giay1.jpg",
        "category": null,
        "features": "{\"sizes\":[\"33\",\"34\",\"35\",\"36\",\"37\",\"38\",\"39\",\"40\"],\"colors\":[\"Đen\",\"Trắng\"]}",
        "material": null,
        "stock": 5,
        "status": "available",
        "rating": 5,
        "createdAt": "2026-05-17T12:53:28.000Z",
        "updatedAt": "2026-05-17T15:41:01.000Z",
        "category_id": 5
    },
    {
        "id": 19,
        "name": "Giày da lộn xếp đi",
        "description": "Đi vào êm chân thoáng mùi",
        "price_per_day": 250000,
        "image": "/uploads/1779022480304-giay5.jpg",
        "category": null,
        "features": "{\"sizes\":[\"39\",\"40\",\"41\",\"42\",\"44\",\"43\"],\"colors\":[\"Nâu\"]}",
        "material": null,
        "stock": 4,
        "status": "available",
        "rating": 5,
        "createdAt": "2026-05-17T12:54:40.000Z",
        "updatedAt": "2026-05-17T12:54:40.000Z",
        "category_id": 5
    },
    {
        "id": 20,
        "name": "Giày da cá xấu",
        "description": "Làm từ cá xấu bạch tạng",
        "price_per_day": 1500000,
        "image": "/uploads/1779022525849-giay4.jpg",
        "category": null,
        "features": "{\"sizes\":[\"40\",\"41\",\"42\",\"43\"],\"colors\":[\"Trắng\"]}",
        "material": null,
        "stock": 1,
        "status": "available",
        "rating": 5,
        "createdAt": "2026-05-17T12:55:25.000Z",
        "updatedAt": "2026-05-17T15:42:29.000Z",
        "category_id": 5
    },
    {
        "id": 21,
        "name": "Cao gót hãng chưa biết",
        "description": "Đi đau chân",
        "price_per_day": 200000,
        "image": "/uploads/1779022574552-caogot1.jpg",
        "category": null,
        "features": "{\"sizes\":[\"33\",\"34\",\"35\",\"36\",\"37\",\"38\"],\"colors\":[\"Trắng\",\"Be\"]}",
        "material": null,
        "stock": 4,
        "status": "available",
        "rating": 5,
        "createdAt": "2026-05-17T12:56:14.000Z",
        "updatedAt": "2026-05-17T12:56:14.000Z",
        "category_id": 9
    },
    {
        "id": 22,
        "name": "Cao gót VL",
        "description": "Chính hãng cao câp",
        "price_per_day": 500000,
        "image": "/uploads/1779022613803-caogot5.jpg",
        "category": null,
        "features": "{\"sizes\":[\"33\",\"34\",\"35\",\"36\",\"37\",\"38\"],\"colors\":[\"Đen\"]}",
        "material": null,
        "stock": 2,
        "status": "available",
        "rating": 5,
        "createdAt": "2026-05-17T12:56:53.000Z",
        "updatedAt": "2026-05-17T12:56:53.000Z",
        "category_id": 9
    },
    {
        "id": 23,
        "name": "Cao gót thượng hạng",
        "description": "Đi vào thành công chúa",
        "price_per_day": 300000,
        "image": "/uploads/1779022666613-caogot4.jpg",
        "category": null,
        "features": "{\"sizes\":[\"33\",\"34\",\"35\",\"36\",\"37\",\"38\"],\"colors\":[\"Xanh dương\",\"Trắng\",\"Đen\"]}",
        "material": null,
        "stock": 1,
        "status": "available",
        "rating": 5,
        "createdAt": "2026-05-17T12:57:46.000Z",
        "updatedAt": "2026-05-17T12:57:46.000Z",
        "category_id": 9
    },
    {
        "id": 24,
        "name": "Cao gót MLB",
        "description": "Chính hãng cao cấp",
        "price_per_day": 300000,
        "image": "/uploads/1779022710800-caogot3.jpg",
        "category": null,
        "features": "{\"sizes\":[\"33\",\"34\",\"35\",\"36\",\"37\",\"38\",\"39\"],\"colors\":[]}",
        "material": null,
        "stock": 2,
        "status": "available",
        "rating": 5,
        "createdAt": "2026-05-17T12:58:30.000Z",
        "updatedAt": "2026-05-17T12:58:30.000Z",
        "category_id": 9
    }
];
        await Product.bulkCreate(products);
        console.log("Successfully seeded products!");

        // Seed Variants
        const variants = [];
        if (variants.length > 0 && ProductVariant) {
            await ProductVariant.bulkCreate(variants);
            console.log("Successfully seeded product variants!");
        }

        // Seed Inventory Items
        const inventoryItems = [];
        if (inventoryItems.length > 0 && InventoryItem) {
            await InventoryItem.bulkCreate(inventoryItems);
            console.log("Successfully seeded inventory items!");
        }

        // Seed Reviews
        const reviews = [];
        if (reviews.length > 0 && Review) {
            await Review.bulkCreate(reviews);
            console.log("Successfully seeded reviews!");
        }

        console.log("DATABASE SEEDING COMPLETED SUCCESSFULY!");
        process.exit(0);
    } catch (error) {
        console.error("FATAL ERROR DURING SEEDING DATABASE:", error);
        process.exit(1);
    }
};

runSeed();
