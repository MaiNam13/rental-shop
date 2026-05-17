import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import cartApi from '../api/cartApi';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { useToast } from '../context/ToastContext';
import {
    Truck,
    Store,
    CreditCard,
    Wallet,
    ShieldCheck,
    Calendar,
    MapPin,
    MessageSquare,
    Info,
    ArrowLeft,
    QrCode
} from 'lucide-react';
import '../styles/CheckoutPage.css';

const CheckoutPage = () => {
    const navigate = useNavigate();
    const { user, isLoggedIn } = useAuth();
    const { toast } = useToast();
    const { t } = useLanguage();
    const [cartItems, setCartItems] = useState([]);
    const [summary, setSummary] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isProcessing, setIsProcessing] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);

    // State cho các lựa chọn
    const [deliveryMethod, setDeliveryMethod] = useState('home');
    const [paymentMethod, setPaymentMethod] = useState('cod');
    const [agreedToTerms, setAgreedToTerms] = useState(false);

    // Thông tin người dùng
    const [shippingInfo, setShippingInfo] = useState({
        fullName: user?.name || '',
        email: user?.email || '',
        phone: user?.phone || '',
        address: user?.address || '',
        note: ''
    });

    const [formErrors, setFormErrors] = useState({});

    useEffect(() => {
        if (!isLoggedIn) {
            navigate('/login');
            return;
        }

        const fetchData = async () => {
            try {
                const [cartRes, summaryRes] = await Promise.all([
                    cartApi.getCart(),
                    cartApi.getSummary()
                ]);
                setCartItems(cartRes.data);
                setSummary(summaryRes.data);
            } catch (err) {
                console.error("Error fetching checkout data:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
        window.scrollTo(0, 0);
    }, [isLoggedIn, navigate]);

    const handleCheckout = async (e) => {
        e.preventDefault();
        if (cartItems.length === 0) {
            toast(t('emptyCartAlert'), 'error');
            return;
        }

        // Kiểm tra thông tin bắt buộc
        const newErrors = {};
        if (!shippingInfo.fullName.trim()) newErrors.fullName = true;
        if (!shippingInfo.email.trim()) newErrors.email = true;
        if (!shippingInfo.phone.trim()) newErrors.phone = true;
        if (!shippingInfo.address.trim()) newErrors.address = true;

        if (Object.keys(newErrors).length > 0) {
            setFormErrors(newErrors);
            if (newErrors.fullName) toast(t('nameRequired'), 'error');
            else if (newErrors.email) toast(t('emailRequired'), 'error');
            else if (newErrors.phone) toast(t('phoneRequired'), 'error');
            else if (newErrors.address) toast(t('addressRequired'), 'error');
            return;
        }

        setFormErrors({});

        if (!agreedToTerms) {
            toast(t('termsRequired'), 'error');
            return;
        }

        setIsProcessing(true);

        try {
            const firstItem = cartItems[0];
            const rentalData = {
                user_id: user.id,
                start_date: firstItem.startDate,
                end_date: firstItem.endDate,
                items: cartItems.map(item => ({
                    product_id: item.product_id,
                    quantity: item.quantity,
                    size: item.size
                })),
                shippingInfo,
                deliveryMethod,
                paymentMethod,
                total_price: summary?.total
            };

            await cartApi.checkout(rentalData);
            await cartApi.clearCart();

            setShowSuccess(true);
            window.scrollTo(0, 0);
        } catch (err) {
            console.error("Checkout failed:", err);
            toast(err.response?.data?.message || t('error'), 'error');
        } finally {
            setIsProcessing(false);
        }
    };

    if (showSuccess) {
        return (
            <div className="checkout-page">
                <Navbar />
                <main className="checkout-container success-container" style={{ paddingTop: '150px', textAlign: 'center' }}>
                    <div className="success-card luxury-fade-in" style={{
                        maxWidth: '600px',
                        margin: '0 auto',
                        padding: '60px 40px',
                        backgroundColor: '#fff',
                        borderRadius: '32px',
                        boxShadow: '0 20px 60px rgba(0,0,0,0.08)',
                        border: '1px solid #f0f0f0'
                    }}>
                        <div className="success-icon-circle" style={{
                            width: '80px',
                            height: '80px',
                            backgroundColor: '#f0fdf4',
                            borderRadius: '50%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            margin: '0 auto 30px',
                            color: '#16a34a'
                        }}>
                            <ShieldCheck size={40} />
                        </div>
                        <h1 style={{ fontSize: '32px', fontWeight: '700', marginBottom: '16px', color: '#111' }}>
                            {t('checkoutSuccessTitle')}
                        </h1>
                        <p style={{ fontSize: '16px', color: '#6b7280', lineHeight: '1.6', marginBottom: '32px' }}>
                            {t('checkoutSuccessDesc')}
                        </p>

                        <div className="email-notice-box" style={{
                            backgroundColor: '#f8fafc',
                            padding: '24px',
                            borderRadius: '16px',
                            textAlign: 'left',
                            marginBottom: '40px',
                            borderLeft: '4px solid #111'
                        }}>
                            <div style={{ display: 'flex', gap: '12px' }}>
                                <Info size={20} color="#111" style={{ flexShrink: 0 }} />
                                <p style={{ fontSize: '14px', color: '#374151', margin: 0 }}>
                                    {t('checkEmailNotice')}
                                </p>
                            </div>
                        </div>

                        <div className="success-actions" style={{ display: 'flex', gap: '16px', justifyContent: 'center' }}>
                            <button
                                onClick={() => navigate('/profile')}
                                className="checkout-btn"
                                style={{ width: 'auto', padding: '16px 32px' }}
                            >
                                {t('myRentals')}
                            </button>
                            <button
                                onClick={() => navigate('/products')}
                                className="summary-continue-btn"
                                style={{ width: 'auto', padding: '16px 32px' }}
                            >
                                {t('continueShopping')}
                            </button>
                        </div>
                    </div>
                </main>
                <Footer />
            </div>
        );
    }

    if (loading) return (
        <div className="loading-state" style={{ padding: '200px 0', textAlign: 'center' }}>
            <Navbar />
            <p>{t('preparingOrder')}</p>
        </div>
    );

    // Lấy ngày thuê từ sản phẩm đầu tiên (giả sử thuê cùng đợt)
    const firstItem = cartItems[0] || {};

    return (
        <div className="checkout-page">
            <Navbar />

            <main className="checkout-container" style={{ paddingTop: '100px' }}>
                <button className="back-button" onClick={() => navigate(-1)}>
                    <ArrowLeft size={18} />
                    <span>{t('back')}</span>
                </button>

                <form onSubmit={handleCheckout} className="checkout-layout">

                    {/* Cột trái: Thông tin & Lựa chọn */}
                    <div className="checkout-left">

                        {/* 1. Thông tin khách hàng */}
                        <section className="checkout-section">
                            <h2>{t('customerInfo')}</h2>
                            <div className="form-grid">
                                <div className="form-group full-width">
                                    <label>{t('fullName')} *</label>
                                    <input
                                        type="text"
                                        placeholder={t('fullName')}
                                        value={shippingInfo.fullName}
                                        onChange={(e) => {
                                            setShippingInfo({ ...shippingInfo, fullName: e.target.value });
                                            if (formErrors.fullName) setFormErrors({ ...formErrors, fullName: false });
                                        }}
                                        style={{
                                            border: formErrors.fullName ? '1.5px solid #ef4444' : '',
                                            backgroundColor: formErrors.fullName ? '#fef2f2' : '',
                                            transition: 'all 0.3s ease'
                                        }}
                                    />
                                </div>
                                <div className="form-group">
                                    <label>{t('emailAddress')} *</label>
                                    <input
                                        type="email"
                                        placeholder={t('emailPlaceholder')}
                                        value={shippingInfo.email}
                                        onChange={(e) => {
                                            setShippingInfo({ ...shippingInfo, email: e.target.value });
                                            if (formErrors.email) setFormErrors({ ...formErrors, email: false });
                                        }}
                                        style={{
                                            border: formErrors.email ? '1.5px solid #ef4444' : '',
                                            backgroundColor: formErrors.email ? '#fef2f2' : '',
                                            transition: 'all 0.3s ease'
                                        }}
                                    />
                                </div>
                                <div className="form-group">
                                    <label>{t('phoneNumber')} *</label>
                                    <input
                                        type="tel"
                                        placeholder={t('phonePlaceholder')}
                                        value={shippingInfo.phone}
                                        onChange={(e) => {
                                            setShippingInfo({ ...shippingInfo, phone: e.target.value });
                                            if (formErrors.phone) setFormErrors({ ...formErrors, phone: false });
                                        }}
                                        style={{
                                            border: formErrors.phone ? '1.5px solid #ef4444' : '',
                                            backgroundColor: formErrors.phone ? '#fef2f2' : '',
                                            transition: 'all 0.3s ease'
                                        }}
                                    />
                                </div>
                                <div className="form-group full-width">
                                    <label className="delivery-address-label"><MapPin size={16} /> {t('shippingAddress')} *</label>
                                    <textarea
                                        placeholder={t('addressPlaceholder')}
                                        value={shippingInfo.address}
                                        onChange={(e) => {
                                            setShippingInfo({ ...shippingInfo, address: e.target.value });
                                            if (formErrors.address) setFormErrors({ ...formErrors, address: false });
                                        }}
                                        style={{
                                            border: formErrors.address ? '1.5px solid #ef4444' : '',
                                            backgroundColor: formErrors.address ? '#fef2f2' : '',
                                            transition: 'all 0.3s ease'
                                        }}
                                    />
                                </div>
                                <div className="form-group full-width">
                                    <label className="delivery-address-label"><MessageSquare size={16} /> {t('specialRequests')}</label>
                                    <input
                                        type="text"
                                        placeholder={t('specialRequestsPlaceholder')}
                                        value={shippingInfo.note}
                                        onChange={(e) => setShippingInfo({ ...shippingInfo, note: e.target.value })}
                                    />
                                </div>
                            </div>
                        </section>

                        {/* 2. Thời gian thuê */}
                        <section className="checkout-section">
                            <h2>{t('rentalPeriod')}</h2>
                            <div className="rental-period-grid">
                                <div className="form-group">
                                    <label><Calendar size={14} style={{ marginRight: '5px' }} /> {t('startDate')} *</label>
                                    <input type="date" value={firstItem.startDate || ''} readOnly disabled />
                                </div>
                                <div className="form-group">
                                    <label><Calendar size={14} style={{ marginRight: '5px' }} /> {t('endDate')} *</label>
                                    <input type="date" value={firstItem.endDate || ''} readOnly disabled />
                                </div>
                                <div className="full-width" style={{ fontSize: '13px', color: '#6b7280', display: 'flex', alignItems: 'center', gap: '5px' }}>
                                    <Info size={14} /> {t('rentalPeriodNote')}
                                </div>
                            </div>
                        </section>

                        {/* 3. Phương thức giao hàng */}
                        <section className="checkout-section">
                            <h2>{t('deliveryMethod')}</h2>
                            <div className="method-options">
                                <div
                                    className={`method-card ${deliveryMethod === 'home' ? 'active' : ''}`}
                                    onClick={() => setDeliveryMethod('home')}
                                >
                                    <div className="method-radio"></div>
                                    <div className="method-info">
                                        <Truck size={24} />
                                        <div className="method-text">
                                            <h4>{t('homeDelivery')}</h4>
                                            <p>{t('homeDeliveryDesc')}</p>
                                        </div>
                                    </div>
                                </div>
                                <div
                                    className={`method-card ${deliveryMethod === 'pickup' ? 'active' : ''}`}
                                    onClick={() => setDeliveryMethod('pickup')}
                                >
                                    <div className="method-radio"></div>
                                    <div className="method-info">
                                        <Store size={24} />
                                        <div className="method-text">
                                            <h4>{t('pickupAtStore')}</h4>
                                            <p>{t('pickupAtStoreDesc')}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div style={{ marginTop: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <input
                                    type="checkbox"
                                    id="terms"
                                    checked={agreedToTerms}
                                    onChange={(e) => setAgreedToTerms(e.target.checked)}
                                    style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                                />
                                <label htmlFor="terms" style={{ fontSize: '14px', color: '#374151', cursor: 'pointer' }}>
                                    {t('agreeTerms', {
                                        terms: <span style={{ textDecoration: 'underline', fontWeight: '600' }}>{t('termsOfService')}</span>,
                                        privacy: <span style={{ textDecoration: 'underline', fontWeight: '600' }}>{t('privacyPolicy')}</span>
                                    })}
                                </label>
                            </div>
                        </section>

                        {/* 4. Phương thức thanh toán */}
                        <section className="checkout-section">
                            <h2>{t('paymentMethod')}</h2>
                            <div className="payment-grid">
                                <div
                                    className={`payment-card ${paymentMethod === 'cod' ? 'active' : ''}`}
                                    onClick={() => setPaymentMethod('cod')}
                                >
                                    <div className="payment-header">
                                        <div className="payment-icon-wrapper" style={{ backgroundColor: '#e6f7ed', color: '#28a745' }}>
                                            <Wallet size={20} />
                                        </div>
                                        <div className="payment-radio"></div>
                                    </div>
                                    <div className="payment-name">{t('cod')}</div>
                                    <div className="payment-desc">{t('codDesc')}</div>
                                </div>

                                <div
                                    className={`payment-card ${paymentMethod === 'momo' ? 'active' : ''}`}
                                    onClick={() => setPaymentMethod('momo')}
                                >
                                    <div className="payment-header">
                                        <div className="payment-icon-wrapper" style={{ backgroundColor: '#ffeef4', color: '#d82d8b' }}>
                                            <div style={{ fontWeight: '800', fontSize: '10px' }}>MOMO</div>
                                        </div>
                                        <div className="payment-radio"></div>
                                    </div>
                                    <div className="payment-name">{t('momo')}</div>
                                    <div className="payment-desc">{t('momoDesc')}</div>
                                </div>

                                <div
                                    className={`payment-card ${paymentMethod === 'vnpay' ? 'active' : ''}`}
                                    onClick={() => setPaymentMethod('vnpay')}
                                >
                                    <div className="payment-header">
                                        <div className="payment-icon-wrapper" style={{ backgroundColor: '#eef2ff', color: '#005baa' }}>
                                            <div style={{ fontWeight: '900', fontSize: '10px' }}>VNPAY</div>
                                        </div>
                                        <div className="payment-radio"></div>
                                    </div>
                                    <div className="payment-name">{t('vnpay')}</div>
                                    <div className="payment-desc">{t('vnpayDesc')}</div>
                                </div>

                                <div
                                    className={`payment-card ${paymentMethod === 'transfer' ? 'active' : ''}`}
                                    onClick={() => setPaymentMethod('transfer')}
                                >
                                    <div className="payment-header">
                                        <div className="payment-icon-wrapper" style={{ backgroundColor: '#f0fdf4', color: '#16a34a' }}>
                                            <QrCode size={20} />
                                        </div>
                                        <div className="payment-radio"></div>
                                    </div>
                                    <div className="payment-name">{t('bankTransfer')}</div>
                                    <div className="payment-desc">{t('bankTransferDesc')}</div>
                                </div>

                                <div
                                    className={`payment-card ${paymentMethod === 'card' ? 'active' : ''}`}
                                    onClick={() => setPaymentMethod('card')}
                                >
                                    <div className="payment-header">
                                        <div className="payment-icon-wrapper" style={{ backgroundColor: '#f3f4f6', color: '#111' }}>
                                            <CreditCard size={20} />
                                        </div>
                                        <div className="payment-radio"></div>
                                    </div>
                                    <div className="payment-name">{t('creditCard')}</div>
                                    <div className="payment-desc">{t('creditCardDesc')}</div>
                                    <div className="card-logos">
                                        <span className="logo-v">VISA</span>
                                        <span className="logo-m"></span>
                                        <span className="logo-jcb">JCB</span>
                                    </div>
                                </div>
                            </div>

                            {/* QR Code Display Section */}
                            {(paymentMethod === 'momo' || paymentMethod === 'vnpay' || paymentMethod === 'transfer') && (
                                <div className="qr-payment-section" style={{
                                    marginTop: '25px',
                                    padding: '25px',
                                    backgroundColor: '#f9fafb',
                                    borderRadius: '16px',
                                    border: '1px dashed #d1d5db',
                                    textAlign: 'center'
                                }}>
                                    <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '10px' }}>{t('scanQRCode')}</h3>
                                    <p style={{ fontSize: '14px', color: '#6b7280', marginBottom: '20px' }}>{t('qrPaymentInstruction')}</p>

                                    <div className="qr-image-wrapper" style={{
                                        backgroundColor: '#fff',
                                        padding: '15px',
                                        borderRadius: '12px',
                                        display: 'inline-block',
                                        boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
                                        marginBottom: '15px'
                                    }}>
                                        <img
                                            src={paymentMethod === 'transfer'
                                                ? `https://api.vietqr.io/image/vcb-9824686868-compact.jpg?amount=${summary?.total}&addInfo=LUXE${user?.id || 'USER'}`
                                                : paymentMethod === 'momo'
                                                    ? 'https://upload.wikimedia.org/wikipedia/commons/d/d0/QR_code_for_mobile_English_Wikipedia.svg' // Placeholder
                                                    : 'https://upload.wikimedia.org/wikipedia/commons/d/d0/QR_code_for_mobile_English_Wikipedia.svg' // Placeholder
                                            }
                                            alt="Payment QR Code"
                                            style={{ width: '200px', height: '200px', objectFit: 'contain' }}
                                        />
                                    </div>

                                    <div style={{ fontSize: '13px', color: '#374151', fontWeight: '500' }}>
                                        {t('totalAmount')}: <span style={{ color: '#08060d', fontWeight: '700' }}>{summary?.total?.toLocaleString()}đ</span>
                                    </div>
                                </div>
                            )}
                        </section>
                    </div>

                    {/* Cột phải: Tóm tắt đơn hàng */}
                    <aside className="checkout-right">
                        <div className="summary-card">
                            <h2>{t('orderSummary')}</h2>

                            <div className="summary-items">
                                {cartItems.map(item => {
                                    const product = item.Product || item.product || {};
                                    return (
                                        <div key={item.id} className="summary-item-card">
                                            <img
                                                src={product.image ? (product.image.startsWith('http') ? product.image : `http://localhost:3000${product.image.startsWith('/') ? '' : '/uploads/'}${product.image}`) : ""}
                                                alt={product.name}
                                                className="item-img"
                                            />
                                            <div className="item-info">
                                                <h4>{t(product.name)}</h4>
                                                <div className="item-meta">{t('size')}: {item.size} | {t('qtyShort')}: {item.quantity}</div>
                                                <div className="item-price">{product.price_per_day?.toLocaleString()}đ</div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>

                            <div className="summary-breakdown">
                                <div className="summary-row">
                                    <span>{t('rentalFee')}</span>
                                    <span>{summary?.subtotal?.toLocaleString() || "0"}đ</span>
                                </div>
                                <div className="summary-row">
                                    <span>{t('depositFee')}</span>
                                    <span>{summary?.depositFee?.toLocaleString() || "0"}đ</span>
                                </div>
                                <div className="summary-row">
                                    <span>{t('shippingFee')}</span>
                                    <span>{summary?.shippingFee?.toLocaleString() || "0"}đ</span>
                                </div>
                                <div className="summary-row total">
                                    <span>{t('totalAmount')}</span>
                                    <span>{summary?.total?.toLocaleString() || "0"}đ</span>
                                </div>
                            </div>

                            <button
                                type="submit"
                                className="checkout-btn"
                                disabled={isProcessing || cartItems.length === 0}
                            >
                                {isProcessing ? t('processing') : t('confirmCheckout')}
                            </button>

                            <div className="safety-note">
                                <ShieldCheck size={16} />
                                <span>{t('securePaymentNote')}</span>
                            </div>
                        </div>
                    </aside>

                </form>
            </main>

            <Footer />
        </div>
    );
};

export default CheckoutPage;
