import { createContext, useContext, useState, useEffect, useMemo } from 'react';
import axiosClient from '../api/axiosClient';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem('token') || null);
    const [loading, setLoading] = useState(true);

    // Sử dụng useMemo để isLoggedIn được tính toán lại mỗi khi token thay đổi
    const isLoggedIn = useMemo(() => !!token, [token]);

    useEffect(() => {
        if (token) {
            localStorage.setItem('token', token);
            fetchUserProfile();
        } else {
            localStorage.removeItem('token');
            setUser(null);
            setLoading(false);
        }
    }, [token]);

    const fetchUserProfile = async () => {
        try {
            const response = await axiosClient.get('/users/profile');
            setUser(response.data);
        } catch (error) {
            console.error("Failed to fetch profile:", error);
            // Nếu token hết hạn hoặc lỗi, logout luôn
            logout();
        } finally {
            setLoading(false);
        }
    };

    const login = async (email, password) => {
        try {
            const response = await axiosClient.post('/users/login', { email, password });
            const { token: newToken, user: userData } = response.data;
            
            // Cập nhật state
            setToken(newToken);
            setUser(userData);
            localStorage.setItem('token', newToken);
            
            return { success: true, user: userData };
        } catch (error) {
            return { 
                success: false, 
                message: error.response?.data?.message || "Đăng nhập thất bại" 
            };
        }
    };

    const register = async (userData) => {
        try {
            const response = await axiosClient.post('/users/register', userData);
            const { token: newToken, user: newUser } = response.data;
            
            setToken(newToken);
            setUser(newUser);
            localStorage.setItem('token', newToken);
            
            return { success: true, user: newUser };
        } catch (error) {
            return { 
                success: false, 
                message: error.response?.data?.message || "Đăng ký thất bại" 
            };
        }
    };

    const logout = () => {
        setToken(null);
        setUser(null);
        localStorage.removeItem('token');
        // Xóa header trong axiosClient nếu cần
    };

    const loginOAuth = async (oauthData) => {
        try {
            const response = await axiosClient.post('/users/oauth-login', oauthData);
            const { token: newToken, user: userData } = response.data;
            
            // Cập nhật state
            setToken(newToken);
            setUser(userData);
            localStorage.setItem('token', newToken);
            
            return { success: true, user: userData, message: response.data.message };
        } catch (error) {
            return { 
                success: false, 
                message: error.response?.data?.message || "Đăng nhập mạng xã hội thất bại" 
            };
        }
    };

    const value = {
        user,
        setUser,
        token,
        loading,
        isLoggedIn,
        login,
        register,
        loginOAuth,
        logout
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};
