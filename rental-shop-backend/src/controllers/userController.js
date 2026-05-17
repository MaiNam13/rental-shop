const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const registerUser = async (req, res) => {
    try {

        const { name, email, password, phone } = req.body;

        // Hash password
        const hashedPassword =
            await bcrypt.hash(password, 10);

        const user = await User.create({
            name,
            email,
            password: hashedPassword,
            phone,
        });

        res.status(201).json({
            message: "User registered successfully",
            user,
        });

    } catch (error) {

        res.status(500).json({
            message: error.message,
        });

    }
};


const loginUser = async (req, res) => {
    try {

        const { email, password } = req.body;

        const user = await User.findOne({
            where: { email }
        });

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        if (user.is_locked) {
            return res.status(400).json({
                message: "Tài khoản của bạn đã bị khóa bởi quản trị viên."
            });
        }

        const isMatch =
            await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(400).json({
                message: "Invalid password"
            });
        }

        const token = jwt.sign(
            {
                id: user.id,
                email: user.email,
                role: user.role
            },
            process.env.JWT_SECRET,
            {
                expiresIn: "7d"
            }
        );

        res.status(200).json({
            message: "Login successful",
            token,
            user
        });

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }
};

const getUserProfile = async (req, res) => {
    try {
        const user = await User.findByPk(req.user.id, {
            attributes: { exclude: ['password'] }
        });

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

const getAllUsers = async (req, res) => {
    try {
        const users = await User.findAll({
            attributes: { exclude: ['password'] }
        });
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const deleteUser = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findByPk(id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        await user.destroy();
        res.status(200).json({ message: "User deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const toggleUserLock = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findByPk(id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        
        user.is_locked = !user.is_locked;
        await user.save();
        
        res.status(200).json({ 
            message: user.is_locked ? "Đã khóa tài khoản thành công" : "Đã mở khóa tài khoản thành công",
            user 
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const updateUserProfile = async (req, res) => {
    try {
        const { name, phone, password } = req.body;
        const user = await User.findByPk(req.user.id);

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        if (name) user.name = name;
        if (phone !== undefined) user.phone = phone;
        if (password) {
            user.password = await bcrypt.hash(password, 10);
        }

        await user.save();

        const updatedUser = await User.findByPk(req.user.id, {
            attributes: { exclude: ['password'] }
        });

        res.status(200).json({
            message: "Profile updated successfully",
            user: updatedUser
        });
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

const { sendResetPasswordOTP } = require("../services/emailService");
const otps = {}; // In-memory store: { email: { otp, expiresAt } }

// 1. Forgot password - Send OTP
const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ where: { email } });
        if (!user) {
            return res.status(404).json({ message: "Không tìm thấy tài khoản với địa chỉ email này." });
        }

        // Generate 6-digit OTP code
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const expiresAt = Date.now() + 10 * 60 * 1000; // 10 minutes from now

        otps[email] = { otp, expiresAt };

        await sendResetPasswordOTP(email, otp);

        res.status(200).json({ message: "Mã OTP đã được gửi đến email của bạn." });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// 2. Verify OTP
const verifyOTP = async (req, res) => {
    try {
        const { email, otp } = req.body;
        const stored = otps[email];

        if (!stored) {
            return res.status(400).json({ message: "Mã OTP không tồn tại hoặc đã hết hạn." });
        }

        if (Date.now() > stored.expiresAt) {
            delete otps[email];
            return res.status(400).json({ message: "Mã OTP đã hết hạn." });
        }

        if (stored.otp !== otp) {
            return res.status(400).json({ message: "Mã OTP không chính xác." });
        }

        res.status(200).json({ message: "Xác thực mã OTP thành công." });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// 3. Reset password
const resetPassword = async (req, res) => {
    try {
        const { email, otp, newPassword } = req.body;
        const stored = otps[email];

        if (!stored || stored.otp !== otp || Date.now() > stored.expiresAt) {
            return res.status(400).json({ message: "Yêu cầu khôi phục mật khẩu không hợp lệ hoặc đã hết hạn." });
        }

        const user = await User.findOne({ where: { email } });
        if (!user) {
            return res.status(404).json({ message: "Không tìm thấy người dùng." });
        }

        // Hash new password
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashedPassword;
        await user.save();

        // Clear OTP
        delete otps[email];

        res.status(200).json({ message: "Mật khẩu của bạn đã được thay đổi thành công." });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// 4. OAuth Login (Google/Facebook)
const oauthLogin = async (req, res) => {
    try {
        const { email, name, provider, provider_id, avatar } = req.body;
        
        if (!email) {
            return res.status(400).json({ message: "Địa chỉ email là bắt buộc." });
        }

        let user = await User.findOne({ where: { email } });
        
        if (!user) {
            // Automatically create a new user with a secure random password if they don't exist yet!
            const randomPassword = Math.random().toString(36).slice(-8);
            const hashedPassword = await bcrypt.hash(randomPassword, 10);
            
            user = await User.create({
                name: name || email.split('@')[0],
                email,
                password: hashedPassword,
                role: 'customer',
                provider: provider || null,
                provider_id: provider_id || null,
                avatar: avatar || null
            });
        } else {
            // Sync/update provider info if it's already an existing user logging in through OAuth
            let changed = false;
            if (provider && user.provider !== provider) {
                user.provider = provider;
                changed = true;
            }
            if (provider_id && user.provider_id !== provider_id) {
                user.provider_id = provider_id;
                changed = true;
            }
            if (avatar && user.avatar !== avatar) {
                user.avatar = avatar;
                changed = true;
            }
            if (name && user.name !== name && !user.provider) {
                user.name = name;
                changed = true;
            }
            if (changed) {
                await user.save();
            }
        }

        if (user.is_locked) {
            return res.status(400).json({
                message: "Tài khoản của bạn đã bị khóa bởi quản trị viên."
            });
        }

        // Generate JWT Token
        const token = jwt.sign(
            {
                id: user.id,
                email: user.email,
                role: user.role
            },
            process.env.JWT_SECRET,
            {
                expiresIn: "7d"
            }
        );

        res.status(200).json({
            message: `Đăng nhập thành công bằng ${provider === 'google' ? 'Google' : 'Facebook'}`,
            token,
            user
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    registerUser,
    loginUser,
    getUserProfile,
    updateUserProfile,
    getAllUsers,
    deleteUser,
    toggleUserLock,
    forgotPassword,
    verifyOTP,
    resetPassword,
    oauthLogin
};