import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";
import { useLanguage } from "../context/LanguageContext";
import { useAuth } from "../context/AuthContext";
import "../styles/LoginPage.css";

export default function LoginPage() {
    const [showPassword, setShowPassword] = useState(false);
    const [rememberMe, setRememberMe] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const { t } = useLanguage();

    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        const result = await login(email, password);
        
        if (result.success) {
            navigate("/"); // Redirect to home on success
        } else {
            setError(result.message);
        }
        setLoading(false);
    };

    return (
        <div className="login-page-wrapper">
            {/* Left Side - Visual */}
            <div className="login-visual">
                <img
                    src="https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=1200&q=80"
                    alt="Luxury Suit"
                    className="login-bg-image"
                />
                <div className="login-overlay" />

                <div className="login-slogan">
                    <h1>{t('elevateStyle')}</h1>
                    <p>{t('premiumPlatform')}</p>
                </div>
            </div>

            {/* Right Side - Form */}
            <div className="login-form-container">
                <div className="login-form-content">
                    {/* Logo */}
                    <div className="login-logo-wrapper">
                        <Link to="/" className="login-logo-brand">LUXE RENT</Link>
                    </div>

                    {/* Header */}
                    <div className="login-header">
                        <h2>{t('welcomeBack')}</h2>
                        <p>{t('loginToContinue')}</p>
                    </div>

                    {/* Error Message */}
                    {error && <div className="auth-error-message">{error}</div>}

                    {/* Login Form */}
                    <form className="login-form" onSubmit={handleSubmit}>
                        {/* Email Input */}
                        <div className="input-group">
                            <label htmlFor="email">{t('emailAddress')}</label>
                            <div className="input-wrapper">
                                <div className="input-icon">
                                    <Mail size={20} />
                                </div>
                                <input
                                    id="email"
                                    type="email"
                                    required
                                    className="input-field"
                                    placeholder={t('emailPlaceholder')}
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    disabled={loading}
                                />
                            </div>
                        </div>

                        {/* Password Input */}
                        <div className="input-group">
                            <label htmlFor="password">{t('password')}</label>
                            <div className="input-wrapper">
                                <div className="input-icon">
                                    <Lock size={20} />
                                </div>
                                <input
                                    id="password"
                                    type={showPassword ? "text" : "password"}
                                    required
                                    className="input-field"
                                    placeholder={t('enterPassword')}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    disabled={loading}
                                />
                                <button
                                    type="button"
                                    className="password-toggle"
                                    onClick={() => setShowPassword(!showPassword)}
                                    disabled={loading}
                                >
                                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                </button>
                            </div>
                        </div>

                        {/* Remember Me & Forgot Password */}
                        <div className="form-options">
                            <label className="remember-me">
                                <input
                                    type="checkbox"
                                    checked={rememberMe}
                                    onChange={(e) => setRememberMe(e.target.checked)}
                                    disabled={loading}
                                />
                                {t('rememberMe')}
                            </label>
                            <Link to="/forgot-password" title={t('forgotPassword')} className="forgot-password">
                                {t('forgotPassword')}
                            </Link>
                        </div>

                        {/* Login Button */}
                        <button type="submit" className="login-submit-btn" disabled={loading}>
                            {loading ? t('processing') : t('login')}
                        </button>

                        {/* Divider */}
                        <div className="login-divider">
                            <span>{t('or')}</span>
                        </div>

                        {/* Social Login Buttons */}
                        <div className="social-buttons">
                            <button type="button" className="social-btn" disabled={loading}>
                                <svg viewBox="0 0 24 24">
                                    <path
                                        fill="#4285F4"
                                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                                    />
                                    <path
                                        fill="#34A853"
                                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                    />
                                    <path
                                        fill="#FBBC05"
                                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                                    />
                                    <path
                                        fill="#EA4335"
                                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                                    />
                                </svg>
                                {t('continueWithGoogle')}
                            </button>

                            <button type="button" className="social-btn" disabled={loading}>
                                <svg viewBox="0 0 24 24" fill="#1877F2">
                                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                                </svg>
                                {t('continueWithFacebook')}
                            </button>
                        </div>
                    </form>

                    {/* Sign Up Link */}
                    <div className="login-footer">
                        <p>
                            {t('noAccount')} <Link to="/register">{t('signUpNow')}</Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
