import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Mail, Lock, Eye, EyeOff, ShieldCheck, ArrowLeft, CheckCircle2 } from "lucide-react";
import { useLanguage } from "../context/LanguageContext";
import { useToast } from "../context/ToastContext";
import axiosClient from "../api/axiosClient";
import "../styles/LoginPage.css"; // Reuse login styles

export default function ForgotPasswordPage() {
    const { t } = useLanguage();
    const { toast } = useToast();
    const navigate = useNavigate();

    const [step, setStep] = useState(1); // 1: Email, 2: OTP, 3: New Password, 4: Success
    const [email, setEmail] = useState("");
    const [otp, setOtp] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [timer, setTimer] = useState(60);
    const [canResend, setCanResend] = useState(false);
    const [formErrors, setFormErrors] = useState({});

    // Resend OTP timer countdown
    useEffect(() => {
        let interval;
        if (step === 2 && timer > 0) {
            interval = setInterval(() => {
                setTimer((prev) => prev - 1);
            }, 1000);
        } else if (timer === 0) {
            setCanResend(true);
        }
        return () => clearInterval(interval);
    }, [step, timer]);

    const handleSendOTP = async (e) => {
        e.preventDefault();
        setFormErrors({});

        if (!email) {
            setFormErrors({ email: true });
            toast(t('enterEmailToast'), "error");
            return;
        }

        setLoading(true);
        try {
            const response = await axiosClient.post("/users/forgot-password", { email });
            toast(response.data.message || t('otpSentToast'));
            setStep(2);
            setTimer(60);
            setCanResend(false);
        } catch (err) {
            console.error("Forgot password failed:", err);
            toast(err.response?.data?.message || t('otpRequestFailedToast'), "error");
        } finally {
            setLoading(false);
        }
    };

    const handleResendOTP = async () => {
        if (!canResend) return;
        setLoading(true);
        try {
            await axiosClient.post("/users/forgot-password", { email });
            toast(t('newOtpSentToast'));
            setTimer(60);
            setCanResend(false);
        } catch (err) {
            toast(err.response?.data?.message || t('otpResendFailedToast'), "error");
        } finally {
            setLoading(false);
        }
    };

    const handleVerifyOTP = async (e) => {
        e.preventDefault();
        setFormErrors({});

        if (!otp || otp.length < 6) {
            setFormErrors({ otp: true });
            toast(t('enterOtpToast'), "error");
            return;
        }

        setLoading(true);
        try {
            const response = await axiosClient.post("/users/verify-otp", { email, otp });
            toast(response.data.message || t('otpVerifiedToast'));
            setStep(3);
        } catch (err) {
            toast(err.response?.data?.message || t('otpIncorrectToast'), "error");
        } finally {
            setLoading(false);
        }
    };

    const handleResetPassword = async (e) => {
        e.preventDefault();
        setFormErrors({});
        const errors = {};

        if (!newPassword) errors.newPassword = true;
        if (!confirmPassword) errors.confirmPassword = true;

        if (Object.keys(errors).length > 0) {
            setFormErrors(errors);
            toast(t('fillRequiredToast'), "error");
            return;
        }

        if (newPassword.length < 6) {
            setFormErrors({ newPassword: true });
            toast(t('passwordMinLengthToast'), "error");
            return;
        }

        if (newPassword !== confirmPassword) {
            setFormErrors({ confirmPassword: true });
            toast(t('confirmPasswordMismatchToast'), "error");
            return;
        }

        setLoading(true);
        try {
            const response = await axiosClient.post("/users/reset-password", {
                email,
                otp,
                newPassword
            });
            toast(response.data.message || t('resetSuccessToast'));
            setStep(4);
        } catch (err) {
            toast(err.response?.data?.message || t('resetFailedToast'), "error");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-page-wrapper">
            {/* Left Side - Visual Banner */}
            <div className="login-visual">
                <img
                    src="https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=1200&q=80"
                    alt="Luxury Suit"
                    className="login-bg-image"
                />
                <div className="login-overlay" />

                <div className="login-slogan">
                    <h1>{t('recoverStyle')}</h1>
                    <p>{t('recoverStyleDesc')}</p>
                </div>
            </div>

            {/* Right Side - Form flow */}
            <div className="login-form-container">
                <div className="login-form-content">
                    {/* Logo */}
                    <div className="login-logo-wrapper">
                        <Link to="/" className="login-logo-brand">LUXE RENT</Link>
                    </div>

                    {/* Step 1: Request OTP */}
                    {step === 1 && (
                        <div>
                            <div className="login-header">
                                <h2>{t('forgotPasswordTitle')}</h2>
                                <p>{t('forgotPasswordDesc')}</p>
                            </div>

                            <form className="login-form" onSubmit={handleSendOTP} autoComplete="off">
                                <div className="input-group">
                                    <label htmlFor="email">{t('emailAddress')}</label>
                                    <div className="input-wrapper" style={{
                                        border: formErrors.email ? '1.5px solid #ef4444' : '',
                                        backgroundColor: formErrors.email ? '#fef2f2' : ''
                                    }}>
                                        <div className="input-icon">
                                            <Mail size={20} />
                                        </div>
                                        <input
                                            id="email"
                                            type="email"
                                            className="input-field"
                                            placeholder={t('emailPlaceholder')}
                                            value={email}
                                            onChange={(e) => {
                                                setEmail(e.target.value);
                                                if (formErrors.email) setFormErrors({ ...formErrors, email: false });
                                            }}
                                            disabled={loading}
                                        />
                                    </div>
                                </div>

                                <button type="submit" className="login-submit-btn" disabled={loading} style={{ marginTop: '20px' }}>
                                    {loading ? t('processing') : t('sendOTP')}
                                </button>
                            </form>
                        </div>
                    )}

                    {/* Step 2: Verification Code */}
                    {step === 2 && (
                        <div>
                            <div className="login-header">
                                <h2>{t('verifyOTPTitle')}</h2>
                                <p>{t('verifyOTPDesc').replace('{email}', email)}</p>
                            </div>

                            <form className="login-form" onSubmit={handleVerifyOTP} autoComplete="off">
                                <div className="input-group">
                                    <label htmlFor="otp">{t('otpLabel')}</label>
                                    <div className="input-wrapper" style={{
                                        border: formErrors.otp ? '1.5px solid #ef4444' : '',
                                        backgroundColor: formErrors.otp ? '#fef2f2' : ''
                                    }}>
                                        <div className="input-icon">
                                            <ShieldCheck size={20} />
                                        </div>
                                        <input
                                            id="otp"
                                            type="text"
                                            maxLength="6"
                                            className="input-field"
                                            placeholder={t('otpPlaceholder')}
                                            value={otp}
                                            onChange={(e) => {
                                                setOtp(e.target.value.replace(/\D/g, ''));
                                                if (formErrors.otp) setFormErrors({ ...formErrors, otp: false });
                                            }}
                                            disabled={loading}
                                            style={{ letterSpacing: '4px', fontWeight: 'bold' }}
                                        />
                                    </div>
                                </div>

                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '10px', fontSize: '13px' }}>
                                    <span style={{ color: '#888' }}>
                                        {!canResend ? t('resendIn').replace('{timer}', timer) : t('canResendNow')}
                                    </span>
                                    <button
                                        type="button"
                                        onClick={handleResendOTP}
                                        disabled={!canResend || loading}
                                        style={{
                                            background: 'none',
                                            border: 'none',
                                            color: canResend ? '#c5a059' : '#ccc',
                                            cursor: canResend ? 'pointer' : 'default',
                                            fontWeight: '600',
                                            textDecoration: 'underline'
                                        }}
                                    >
                                        {t('resendCode')}
                                    </button>
                                </div>

                                <button type="submit" className="login-submit-btn" disabled={loading} style={{ marginTop: '20px' }}>
                                    {loading ? t('verifyingOTP') : t('confirmOTP')}
                                </button>
                            </form>
                        </div>
                    )}

                    {/* Step 3: New Password */}
                    {step === 3 && (
                        <div>
                            <div className="login-header">
                                <h2>{t('setNewPasswordTitle')}</h2>
                                <p>{t('setNewPasswordDesc')}</p>
                            </div>

                            <form className="login-form" onSubmit={handleResetPassword} autoComplete="off">
                                <div className="input-group">
                                    <label htmlFor="newPassword">{t('newPasswordLabel')}</label>
                                    <div className="input-wrapper" style={{
                                        border: formErrors.newPassword ? '1.5px solid #ef4444' : '',
                                        backgroundColor: formErrors.newPassword ? '#fef2f2' : ''
                                    }}>
                                        <div className="input-icon">
                                            <Lock size={20} />
                                        </div>
                                        <input
                                            id="newPassword"
                                            type={showPassword ? "text" : "password"}
                                            className="input-field"
                                            placeholder={t('newPasswordPlaceholder')}
                                            value={newPassword}
                                            onChange={(e) => {
                                                setNewPassword(e.target.value);
                                                if (formErrors.newPassword) setFormErrors({ ...formErrors, newPassword: false });
                                            }}
                                            disabled={loading}
                                        />
                                        <button
                                            type="button"
                                            className="password-toggle"
                                            onClick={() => setShowPassword(!showPassword)}
                                        >
                                            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                        </button>
                                    </div>
                                </div>

                                <div className="input-group" style={{ marginTop: '15px' }}>
                                    <label htmlFor="confirmPassword">{t('confirmNewPasswordLabel')}</label>
                                    <div className="input-wrapper" style={{
                                        border: formErrors.confirmPassword ? '1.5px solid #ef4444' : '',
                                        backgroundColor: formErrors.confirmPassword ? '#fef2f2' : ''
                                    }}>
                                        <div className="input-icon">
                                            <Lock size={20} />
                                        </div>
                                        <input
                                            id="confirmPassword"
                                            type={showConfirmPassword ? "text" : "password"}
                                            className="input-field"
                                            placeholder={t('confirmNewPasswordPlaceholder')}
                                            value={confirmPassword}
                                            onChange={(e) => {
                                                setConfirmPassword(e.target.value);
                                                if (formErrors.confirmPassword) setFormErrors({ ...formErrors, confirmPassword: false });
                                            }}
                                            disabled={loading}
                                        />
                                        <button
                                            type="button"
                                            className="password-toggle"
                                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                        >
                                            {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                        </button>
                                    </div>
                                </div>

                                <button type="submit" className="login-submit-btn" disabled={loading} style={{ marginTop: '25px' }}>
                                    {loading ? t('updating') : t('saveNewPassword')}
                                </button>
                            </form>
                        </div>
                    )}

                    {/* Step 4: Reset Success */}
                    {step === 4 && (
                        <div style={{ textAlign: 'center', padding: '20px 0' }}>
                            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px', color: '#10b981' }}>
                                <CheckCircle2 size={64} strokeWidth={1.5} />
                            </div>
                            <div className="login-header" style={{ marginBottom: '30px' }}>
                                <h2>{t('resetSuccessTitle')}</h2>
                                <p>{t('resetSuccessDesc')}</p>
                            </div>
                            <button
                                onClick={() => navigate("/login")}
                                className="login-submit-btn"
                            >
                                {t('loginNow')}
                            </button>
                        </div>
                    )}

                    {/* Back to Login Link */}
                    {step < 4 && (
                        <div className="login-footer" style={{ marginTop: '25px' }}>
                            <Link to="/login" className="forgot-password" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', color: '#08060d', fontWeight: '600' }}>
                                <ArrowLeft size={16} /> {t('backToLogin')}
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
