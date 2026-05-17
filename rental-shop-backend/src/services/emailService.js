const nodemailer = require('nodemailer');

// Lưu ý: Người dùng cần cấu hình EMAIL_USER và EMAIL_PASS trong file .env
// Để dùng Gmail, cần tạo "App Password"
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER || 'your-email@gmail.com',
        pass: process.env.EMAIL_PASS || 'your-app-password'
    }
});

const sendConfirmationEmail = async (rental) => {
    // Nếu chưa cấu hình email thì chỉ log ra console để tránh lỗi
    if (!process.env.EMAIL_USER || process.env.EMAIL_USER === 'your-email@gmail.com') {
        console.log('--- EMAIL NOTIFICATION (MOCK) ---');
        console.log(`To: ${rental.email}`);
        console.log(`Subject: Xác nhận đơn hàng #${rental.id}`);
        console.log(`Message: Đơn hàng đã được xác nhận thành công.`);
        console.log('---------------------------------');
        return;
    }

    try {
        const mailOptions = {
            from: `"LUXE RENT" <${process.env.EMAIL_USER}>`,
            to: rental.email,
            subject: `Xác nhận đơn hàng #${rental.id} - LUXE RENT`,
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; border: 1px solid #eee; padding: 20px; border-radius: 12px;">
                    <div style="text-align: center; margin-bottom: 20px;">
                        <h1 style="color: #c5a059; margin: 0;">LUXE RENT</h1>
                        <p style="color: #888; text-transform: uppercase; letter-spacing: 2px; font-size: 10px;">Premium Fashion Rental</p>
                    </div>
                    
                    <h2 style="color: #12120f; text-align: center;">XÁC NHẬN ĐƠN THUÊ THÀNH CÔNG</h2>
                    
                    <p>Chào <strong>${rental.full_name}</strong>,</p>
                    <p>Chúc mừng! Đơn hàng của bạn <strong>#${rental.id}</strong> đã được đội ngũ quản trị của LUXE RENT xác nhận.</p>
                    
                    <div style="background: #fcfcfb; padding: 20px; border: 1px solid #f0f0eb; border-radius: 12px; margin: 24px 0;">
                        <p style="margin: 0 0 10px 0; color: #c5a059; font-weight: bold; text-transform: uppercase; font-size: 11px;">Chi tiết đơn hàng:</p>
                        <table style="width: 100%; font-size: 14px; border-collapse: collapse;">
                            <tr>
                                <td style="padding: 5px 0; color: #666;">Ngày bắt đầu:</td>
                                <td style="padding: 5px 0; text-align: right; font-weight: bold;">${new Date(rental.start_date).toLocaleDateString('vi-VN')}</td>
                            </tr>
                            <tr>
                                <td style="padding: 5px 0; color: #666;">Ngày trả đồ:</td>
                                <td style="padding: 5px 0; text-align: right; font-weight: bold;">${new Date(rental.end_date).toLocaleDateString('vi-VN')}</td>
                            </tr>
                            <tr style="border-top: 1px solid #eee;">
                                <td style="padding: 15px 0 5px 0; font-weight: bold;">Tổng cộng:</td>
                                <td style="padding: 15px 0 5px 0; text-align: right; font-weight: bold; color: #c5a059; font-size: 18px;">
                                    ${rental.total_price?.toLocaleString('vi-VN')}₫
                                </td>
                            </tr>
                        </table>
                    </div>
                    
                    <p style="line-height: 1.6;">Chúng tôi đang tiến hành chuẩn bị các sản phẩm tốt nhất cho bạn. Vui lòng giữ điện thoại để Shipper có thể liên lạc khi giao đồ.</p>
                    
                    <div style="text-align: center; margin-top: 32px;">
                        <a href="http://localhost:5173/profile" style="background-color: #12120f; color: #fff; padding: 12px 32px; text-decoration: none; border-radius: 100px; font-weight: bold; display: inline-block;">Theo dõi đơn hàng</a>
                    </div>
                    
                    <hr style="border: none; border-top: 1px solid #eee; margin: 32px 0;">
                    <p style="font-size: 12px; color: #aaa; text-align: center; margin: 0;">
                        123 Nguyễn Huệ, Quận 1, TP. Hồ Chí Minh<br>
                        Hotline: 0912 345 678 | Email: support@luxerent.vn
                    </p>
                </div>
            `
        };

        await transporter.sendMail(mailOptions);
        console.log(`Confirmation email sent to ${rental.email}`);
    } catch (error) {
        console.error('Error sending confirmation email:', error);
    }
};

const sendResetPasswordOTP = async (email, otp) => {
    // Nếu chưa cấu hình email thì chỉ log ra console để tránh lỗi
    if (!process.env.EMAIL_USER || process.env.EMAIL_USER === 'your-email@gmail.com') {
        console.log('--- RESET PASSWORD OTP (MOCK) ---');
        console.log(`To: ${email}`);
        console.log(`OTP Code: ${otp}`);
        console.log('---------------------------------');
        return;
    }

    try {
        const mailOptions = {
            from: `"LUXE RENT" <${process.env.EMAIL_USER}>`,
            to: email,
            subject: `Mã OTP khôi phục mật khẩu - LUXE RENT`,
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; border: 1px solid #eee; padding: 20px; border-radius: 12px;">
                    <div style="text-align: center; margin-bottom: 20px;">
                        <h1 style="color: #c5a059; margin: 0;">LUXE RENT</h1>
                        <p style="color: #888; text-transform: uppercase; letter-spacing: 2px; font-size: 10px;">Premium Fashion Rental</p>
                    </div>
                    
                    <h2 style="color: #12120f; text-align: center;">MÃ OTP KHÔI PHỤC MẬT KHẨU</h2>
                    
                    <p>Chào bạn,</p>
                    <p>Chúng tôi nhận được yêu cầu khôi phục mật khẩu cho tài khoản liên kết với địa chỉ email này. Vui lòng sử dụng mã OTP dưới đây để hoàn tất việc xác thực:</p>
                    
                    <div style="background: #fcfcfb; padding: 24px; border: 1px solid #f0f0eb; border-radius: 12px; margin: 24px 0; text-align: center;">
                        <span style="font-size: 32px; font-weight: bold; letter-spacing: 6px; color: #c5a059;">${otp}</span>
                        <p style="margin: 10px 0 0 0; color: #888; font-size: 12px;">Mã OTP này có hiệu lực trong vòng 10 phút. Tuyệt đối không chia sẻ mã này với bất kỳ ai.</p>
                    </div>
                    
                    <p style="line-height: 1.6;">Nếu bạn không yêu cầu khôi phục mật khẩu, bạn có thể bỏ qua email này một cách an toàn. Mật khẩu hiện tại của bạn vẫn được bảo mật.</p>
                    
                    <hr style="border: none; border-top: 1px solid #eee; margin: 32px 0;">
                    <p style="font-size: 12px; color: #aaa; text-align: center; margin: 0;">
                        123 Nguyễn Huệ, Quận 1, TP. Hồ Chí Minh<br>
                        Hotline: 0912 345 678 | Email: support@luxerent.vn
                    </p>
                </div>
            `
        };

        await transporter.sendMail(mailOptions);
        console.log(`Reset password OTP email sent to ${email}`);
    } catch (error) {
        console.error('Error sending reset password OTP email:', error);
    }
};

module.exports = {
    sendConfirmationEmail,
    sendResetPasswordOTP
};
