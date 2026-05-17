import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";
import { useLanguage } from "../context/LanguageContext";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import "../styles/LoginPage.css";

export default function LoginPage() {
    const [showPassword, setShowPassword] = useState(false);
    const [rememberMe, setRememberMe] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const { t } = useLanguage();

    const { login, loginOAuth, isLoggedIn, user } = useAuth();
    const { toast } = useToast();
    const navigate = useNavigate();

    // Khôi phục tài khoản nếu có Ghi nhớ đăng nhập
    useEffect(() => {
        const savedEmail = localStorage.getItem("rememberedEmail");
        const savedPassword = localStorage.getItem("rememberedPassword");
        const savedRememberMe = localStorage.getItem("rememberMe") === "true";
        if (savedRememberMe) {
            if (savedEmail) setEmail(savedEmail);
            if (savedPassword) setPassword(savedPassword);
            setRememberMe(true);
        }
    }, []);

    // Điều hướng nếu đã đăng nhập
    useEffect(() => {
        if (isLoggedIn && user) {
            if (user.role === 'admin') {
                navigate("/admin");
            } else {
                navigate("/");
            }
        }
    }, [isLoggedIn, user, navigate]);



    const handleCredentialResponse = async (response) => {
        try {
            setLoading(true);
            setError("");
            
            // Decode Google JWT safely
            const token = response.credential;
            const base64Url = token.split('.')[1];
            const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
            const jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function(c) {
                return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
            }).join(''));

            const payload = JSON.parse(jsonPayload);
            
            const result = await loginOAuth({
                email: payload.email,
                name: payload.name,
                avatar: payload.picture,
                provider: 'google',
                provider_id: payload.sub
            });

            if (result.success) {
                toast(result.message || t('loginSuccessGoogle'));
                if (result.user?.role === 'admin') {
                    navigate("/admin");
                } else {
                    navigate("/");
                }
            } else {
                setError(result.message);
                toast(result.message, "error");
            }
        } catch (err) {
            console.error("Google Auth error:", err);
            setError(t('authFailedGoogle'));
            toast(t('authFailed'), "error");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const initGoogle = () => {
            if (window.google) {
                window.google.accounts.id.initialize({
                    client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID || '1035541097825-78e2vjsc2s6uokqjptv68j8vpphgeoe3.apps.googleusercontent.com',
                    callback: handleCredentialResponse,
                    auto_select: false
                });

                const btnElem = document.getElementById("google-signin-btn");
                if (btnElem) {
                    window.google.accounts.id.renderButton(
                        btnElem,
                        { 
                            theme: "outline", 
                            size: "large", 
                            text: "continue_with", 
                            shape: "rectangular",
                            width: btnElem.offsetWidth || 380,
                            logo_alignment: "left"
                        }
                    );
                }
                
                // Show One Tap
                window.google.accounts.id.prompt();
            }
        };

        initGoogle();

        const interval = setInterval(() => {
            if (window.google) {
                initGoogle();
                clearInterval(interval);
            }
        }, 500);

        return () => clearInterval(interval);
    }, []);

    // Load and Initialize Facebook SDK dynamically
    useEffect(() => {
        (function(d, s, id) {
            var js, fjs = d.getElementsByTagName(s)[0];
            if (d.getElementById(id)) return;
            js = d.createElement(s); js.id = id;
            js.src = "https://connect.facebook.net/vi_VN/sdk.js";
            fjs.parentNode.insertBefore(js, fjs);
        }(document, 'script', 'facebook-jssdk'));

        window.fbAsyncInit = function() {
            window.FB.init({
                appId: import.meta.env.VITE_FACEBOOK_APP_ID || '1029483758291048',
                cookie: true,
                xfbml: true,
                version: 'v18.0'
            });
        };
    }, []);

    const handleFacebookLogin = () => {
        if (!window.FB) {
            toast("Không thể kết nối tới Facebook SDK. Vui lòng tải lại trang và thử lại.", "error");
            return;
        }

        setLoading(true);
        setError("");

        window.FB.login(function(response) {
            if (response.authResponse) {
                // Fetch profile info using Graph API
                window.FB.api('/me', { fields: 'name, email, picture.type(large)' }, async function(userInfo) {
                    try {
                        const result = await loginOAuth({
                            email: userInfo.email || `fb_${userInfo.id}@luxe.rent`,
                            name: userInfo.name,
                            avatar: userInfo.picture?.data?.url || null,
                            provider: 'facebook',
                            provider_id: userInfo.id
                        });

                        if (result.success) {
                            toast(result.message || t('loginSuccessFacebook'));
                            if (result.user?.role === 'admin') {
                                navigate("/admin");
                            } else {
                                navigate("/");
                            }
                        } else {
                            setError(result.message);
                            toast(result.message, "error");
                        }
                    } catch (err) {
                        console.error("Facebook Login error:", err);
                        setError(t('errorFacebook'));
                        toast(t('loginFailed'), "error");
                    } finally {
                        setLoading(false);
                    }
                });
            } else {
                console.log('User cancelled login or did not fully authorize.');
                setLoading(false);
            }
        }, { scope: 'email,public_profile' });
    };



    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        const result = await login(email, password);
        
        if (result.success) {
            if (rememberMe) {
                localStorage.setItem("rememberedEmail", email);
                localStorage.setItem("rememberedPassword", password);
                localStorage.setItem("rememberMe", "true");
            } else {
                localStorage.removeItem("rememberedEmail");
                localStorage.removeItem("rememberedPassword");
                localStorage.setItem("rememberMe", "false");
            }

            if (result.user?.role === 'admin') {
                navigate("/admin");
            } else {
                navigate("/");
            }
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
                    <form className="login-form" onSubmit={handleSubmit} autoComplete="off">
                        {/* Fake inputs to prevent browser autofill */}
                        <input type="text" name="email" style={{ display: 'none' }} tabIndex={-1} autoComplete="off" />
                        <input type="password" name="password" style={{ display: 'none' }} tabIndex={-1} autoComplete="new-password" />

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
                                    autoComplete="off"
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
                                    autoComplete="new-password"
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
                            <div id="google-signin-btn" style={{ width: '100%', minHeight: '44px', display: 'flex', justifyContent: 'center' }}></div>

                            <button
                                type="button"
                                className="social-btn"
                                disabled={loading}
                                onClick={handleFacebookLogin}
                            >
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
