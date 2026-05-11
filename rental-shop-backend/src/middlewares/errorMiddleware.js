const errorMiddleware = (err, req, res, next) => {
    console.error("--- GLOBAL ERROR HANDLER ---");
    console.error(err.stack);
    console.error("----------------------------");

    const status = err.status || 500;
    const message = err.message || "Internal Server Error";

    res.status(status).json({
        success: false,
        status,
        message,
        // Chỉ hiện stack trace ở môi trường dev
        stack: process.env.NODE_ENV === "development" ? err.stack : undefined,
    });
};

module.exports = errorMiddleware;
