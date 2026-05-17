import React, { useState, useEffect } from 'react';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import axiosClient from '../api/axiosClient';
import {
    User,
    Package,
    Heart,
    MapPin,
    CreditCard,
    Settings,
    LogOut,
    Search,
    Eye,
    Truck,
    HelpCircle,
    X
} from 'lucide-react';
import '../styles/ProfilePage.css';
import favoriteApi from '../api/favoriteApi';
import ProductCard from '../components/product/ProductCard';
import { useToast } from '../context/ToastContext';

const ProfilePage = () => {
    const { user, setUser, logout } = useAuth();
    const { t } = useLanguage();
    const { toast } = useToast();
    const [activeTab, setActiveTab] = useState('profile');
    const [rentals, setRentals] = useState([]);
    const [favorites, setFavorites] = useState([]);
    const [loading, setLoading] = useState(true);
    const [favLoading, setFavLoading] = useState(false);
    const [selectedRental, setSelectedRental] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [detailLoading, setDetailLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');

    const filteredRentals = rentals.filter(rental => {
        const matchesSearch =
            rental.id.toString().includes(searchTerm) ||
            rental.RentalItems?.[0]?.Product?.name?.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesStatus =
            statusFilter === 'all' ||
            rental.status === statusFilter;

        return matchesSearch && matchesStatus;
    });

    const handleViewDetail = async (rentalId) => {
        try {
            setDetailLoading(true);
            setShowModal(true);
            const response = await axiosClient.get(`/rentals/${rentalId}`);
            setSelectedRental(response.data);
        } catch (error) {
            console.error("Failed to fetch rental detail:", error);
            toast(t('failedToLoadDetails'), 'error');
        } finally {
            setDetailLoading(false);
        }
    };

    useEffect(() => {
        if (activeTab === 'rentals' && user?.id) {
            const fetchRentals = async () => {
                try {
                    setLoading(true);
                    const response = await axiosClient.get(`/rentals/user/${user.id}`);
                    setRentals(response.data);
                } catch (error) {
                    console.error("Failed to fetch rentals:", error);
                } finally {
                    setLoading(false);
                }
            };
            fetchRentals();
        }

        if (activeTab === 'wishlist' && user?.id) {
            const fetchFavorites = async () => {
                try {
                    setFavLoading(true);
                    const response = await favoriteApi.getFavorites();
                    // Transform favorites data to match ProductCard expectations
                    const favProducts = response.data.map(f => ({
                        ...f.Product,
                        image: f.Product?.image ? getFullImageUrl(f.Product.image) : 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800&h=1200&fit=crop&q=80',
                        price: f.Product?.price_per_day?.toLocaleString('vi-VN') + 'đ',
                        category: f.Product?.category_name || 'Fashion'
                    }));
                    setFavorites(favProducts);
                } catch (error) {
                    console.error("Failed to fetch favorites:", error);
                } finally {
                    setFavLoading(false);
                }
            };
            fetchFavorites();
        }
    }, [activeTab, user?.id]);

    useEffect(() => {
        if (showModal) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [showModal]);

    const getFullImageUrl = (path) => {
        if (!path) return 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800&h=1200&fit=crop&q=80';
        if (path.startsWith('http')) return path;

        // Remove leading slash if exists to avoid double slashes
        const cleanPath = path.startsWith('/') ? path.substring(1) : path;

        // If the path already includes 'uploads/', don't add it again
        if (cleanPath.startsWith('uploads/')) {
            return `http://localhost:3000/${cleanPath}`;
        }

        return `http://localhost:3000/uploads/${cleanPath}`;
    };

    const getStatusLabel = (status) => {
        switch (status) {
            case 'pending': return t('pendingStatus');
            case 'approved': return t('approved');
            case 'shipping': return t('shippingStatus');
            case 'renting': return t('renting');
            case 'returned': return t('returned');
            case 'cancelled': return t('cancelled');
            default: return status;
        }
    };

    // Profile Edit States
    const [profileName, setProfileName] = useState('');
    const [profilePhone, setProfilePhone] = useState('');
    const [profileEmail, setProfileEmail] = useState('');
    const [updateLoading, setUpdateLoading] = useState(false);
    const [profileErrors, setProfileErrors] = useState({});

    useEffect(() => {
        if (user) {
            setProfileName(user.name || '');
            setProfilePhone(user.phone || '');
            setProfileEmail(user.email || '');
        }
    }, [user]);

    const handleUpdateProfile = async (e) => {
        e.preventDefault();

        const errors = {};
        if (!profileName.trim()) errors.name = true;
        if (!profilePhone.trim()) errors.phone = true;

        if (Object.keys(errors).length > 0) {
            setProfileErrors(errors);
            if (errors.name) toast(t('nameRequired') || 'Vui lòng điền họ tên', 'error');
            else if (errors.phone) toast(t('phoneRequired') || 'Vui lòng điền số điện thoại', 'error');
            return;
        }

        setProfileErrors({});

        try {
            setUpdateLoading(true);
            const payload = {
                name: profileName,
                phone: profilePhone,
            };

            const response = await axiosClient.put('/users/profile', payload);
            
            setUser(response.data.user);
            toast(t('updateProfileSuccess'), 'success');
        } catch (error) {
            console.error("Failed to update profile:", error);
            const errMsg = error.response?.data?.message || t('updateProfileFailed');
            toast(errMsg, 'error');
        } finally {
            setUpdateLoading(false);
        }
    };

    const renderProfileContent = () => (
        <div className="profile-edit-content">
            <div className="content-header">
                <h2 className="content-title">{t('myProfile')}</h2>
                <p className="content-subtitle">{t('personalInfo')}</p>
            </div>

            <form className="profile-edit-form" onSubmit={handleUpdateProfile}>
                <div className="profile-form-container">
                    <div className="input-group">
                        <label className="input-label">{t('fullName')}</label>
                        <input
                            type="text"
                            className="profile-input"
                            value={profileName}
                            onChange={(e) => {
                                setProfileName(e.target.value);
                                if (profileErrors.name) setProfileErrors({...profileErrors, name: false});
                            }}
                            style={{
                                border: profileErrors.name ? '1.5px solid #ef4444' : '',
                                backgroundColor: profileErrors.name ? '#fef2f2' : '',
                                transition: 'all 0.3s ease'
                            }}
                        />
                    </div>
                    <div className="input-group">
                        <label className="input-label">{t('emailAddress')}</label>
                        <input
                            type="email"
                            className="profile-input disabled"
                            value={profileEmail}
                            disabled
                        />
                    </div>
                    <div className="input-group">
                        <label className="input-label">{t('phoneNumber')}</label>
                        <input
                            type="text"
                            className="profile-input"
                            value={profilePhone}
                            onChange={(e) => {
                                setProfilePhone(e.target.value);
                                if (profileErrors.phone) setProfileErrors({...profileErrors, phone: false});
                            }}
                            style={{
                                border: profileErrors.phone ? '1.5px solid #ef4444' : '',
                                backgroundColor: profileErrors.phone ? '#fef2f2' : '',
                                transition: 'all 0.3s ease'
                            }}
                        />
                    </div>
                    <div className="form-actions" style={{ borderTop: 'none', paddingTop: '15px' }}>
                        <button type="submit" className="btn-save-profile" disabled={updateLoading}>
                            {updateLoading ? t('processing') : t('saveChanges')}
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );

    const renderRentalsContent = () => (
        <div className="rentals-content">
            <div className="content-header">
                <h2 className="content-title">{t('myRentals')}</h2>
                <p className="content-subtitle">{t('manageRentals')}</p>
            </div>

            <div className="rentals-filters">
                <div className="search-wrapper">
                    <Search className="search-icon" size={18} />
                    <input
                        type="text"
                        placeholder={t('searchOrderPlaceholder')}
                        className="rental-search-input"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <select
                    className="filter-dropdown"
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                >
                    <option value="all">{t('allOrders')}</option>
                    <option value="pending">{t('pendingStatus')}</option>
                    <option value="shipping">{t('shippingStatus')}</option>
                    <option value="renting">{t('renting')}</option>
                    <option value="returned">{t('returned')}</option>
                    <option value="cancelled">{t('cancelled')}</option>
                </select>
            </div>

            <div className="rentals-list">
                {loading ? (
                    <p>{t('productLoading')}</p>
                ) : filteredRentals.length > 0 ? (
                    filteredRentals.map((rental) => (
                        <div key={rental.id} className="rental-card">
                            <div className="rental-image-wrapper">
                                <img
                                    src={rental.RentalItems?.[0]?.Product?.image ? getFullImageUrl(rental.RentalItems[0].Product.image) : 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800&h=1200&fit=crop&q=80'}
                                    alt="Sản phẩm"
                                    className="rental-image"
                                />
                            </div>
                            <div className="rental-info">
                                <div className="rental-header">
                                    <span className="order-id">{t('orderId')} #LUX{rental.id.toString().padStart(6, '0')}</span>
                                    <span className={`status-badge status-${rental.status || 'pending'}`}>
                                        {getStatusLabel(rental.status)}
                                    </span>
                                </div>
                                <h3 className="rental-name">
                                    {rental.RentalItems?.[0]?.Product?.name ? t(rental.RentalItems[0].Product.name) : t('premiumProduct')}
                                </h3>
                                <p className="rental-category">
                                    {rental.RentalItems?.[0]?.Product?.Category?.name ? t(rental.RentalItems[0].Product.Category.name) : t('fashion')}
                                </p>

                                <div className="rental-details-grid">
                                    <div className="detail-item">
                                        <span className="detail-label">{t('rentalPeriod')}</span>
                                        <span className="detail-value">
                                            {new Date(rental.start_date).toLocaleDateString(t('dateFormat'))} - {new Date(rental.end_date).toLocaleDateString(t('dateFormat'))}
                                        </span>
                                    </div>
                                    <div className="detail-item">
                                        <span className="detail-label">{t('returnDeadline')}</span>
                                        <span className="detail-value">
                                            {new Date(new Date(rental.end_date).getTime() + 86400000).toLocaleDateString(t('dateFormat'))}
                                        </span>
                                    </div>
                                    <div className="detail-item">
                                        <span className="detail-label">{t('paymentStatus')}</span>
                                        <span className="detail-value">{rental.payment_method === 'cod' ? t('payOnDelivery') : t('paid')}</span>
                                    </div>
                                </div>

                                <div className="rental-actions">
                                    <button
                                        className="action-btn btn-view-detail"
                                        onClick={() => handleViewDetail(rental.id)}
                                    >
                                        <Eye size={16} /> {t('viewDetail')}
                                    </button>
                                    <button className="action-btn btn-track-order">
                                        <Truck size={16} /> {t('trackOrder')}
                                    </button>
                                </div>
                            </div>
                            <div className="rental-price-side">
                                <span className="price-label">{t('totalPrice')}</span>
                                <span className="price-value">{rental.total_price?.toLocaleString('vi-VN')} đ</span>
                            </div>
                        </div>
                    ))
                ) : (
                    <div style={{ textAlign: 'center', padding: '60px', backgroundColor: '#fff', borderRadius: '20px' }}>
                        <Package size={48} color="#ccc" style={{ marginBottom: '20px' }} />
                        <h3>{t('orderNotFound')}</h3>
                        <p style={{ color: '#888' }}>{t('noRentalHistory')}</p>
                    </div>
                )}
            </div>
        </div>
    );

    const renderWishlistContent = () => (
        <div className="wishlist-content">
            <div className="content-header">
                <h2 className="content-title">{t('wishlist')}</h2>
                <p className="content-subtitle">{t('yourFavoriteItems')}</p>
            </div>

            {favLoading ? (
                <p>{t('productLoading')}</p>
            ) : favorites.length > 0 ? (
                <div className="wishlist-grid" style={{ 
                    display: 'grid', 
                    gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', 
                    gap: '24px',
                    marginTop: '32px' 
                }}>
                    {favorites.map(product => (
                        <ProductCard key={product.id} product={product} isFavoriteInitial={true} />
                    ))}
                </div>
            ) : (
                <div style={{ textAlign: 'center', padding: '60px', backgroundColor: '#fff', borderRadius: '20px' }}>
                    <Heart size={48} color="#ccc" style={{ marginBottom: '20px' }} />
                    <h3>{t('wishlistEmpty')}</h3>
                    <p style={{ color: '#888' }}>{t('wishlistEmptyDesc')}</p>
                </div>
            )}
        </div>
    );

    return (
        <div className="profile-page">
            <Navbar />
            <main className="profile-container" style={{ paddingTop: '120px', paddingBottom: '80px' }}>
                <div className="profile-layout">
                    {/* Sidebar */}
                    <aside className="profile-sidebar">
                        <div className="user-info">
                            <div className="avatar-wrapper" style={{ overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '50%', width: '80px', height: '80px', margin: '0 auto 15px auto', border: '2px solid rgba(197, 160, 89, 0.4)' }}>
                                {user?.avatar ? (
                                    <img src={user.avatar} alt={user.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                ) : (
                                    <User size={40} color="#555" strokeWidth={2.5} />
                                )}
                            </div>
                            <h3 className="user-name">{user?.name || t('customer')}</h3>
                            <p className="user-email">{user?.email || 'email@example.com'}</p>
                        </div>

                        <nav className="sidebar-nav">
                            <button
                                className={`profile-nav-item ${activeTab === 'profile' ? 'active' : ''}`}
                                onClick={() => setActiveTab('profile')}
                            >
                                <User size={18} /> {t('myProfile')}
                            </button>
                            <button
                                className={`profile-nav-item ${activeTab === 'rentals' ? 'active' : ''}`}
                                onClick={() => setActiveTab('rentals')}
                            >
                                <Package size={18} /> {t('myRentals')}
                            </button>
                            <button
                                className={`profile-nav-item ${activeTab === 'wishlist' ? 'active' : ''}`}
                                onClick={() => setActiveTab('wishlist')}
                            >
                                <Heart size={18} /> {t('wishlist')}
                            </button>
                            <button
                                className={`profile-nav-item ${activeTab === 'addresses' ? 'active' : ''}`}
                                onClick={() => setActiveTab('addresses')}
                            >
                                <MapPin size={18} /> {t('addresses')}
                            </button>
                            <button
                                className={`profile-nav-item ${activeTab === 'payment' ? 'active' : ''}`}
                                onClick={() => setActiveTab('payment')}
                            >
                                <CreditCard size={18} /> {t('paymentMethods')}
                            </button>
                            <button
                                className={`profile-nav-item ${activeTab === 'settings' ? 'active' : ''}`}
                                onClick={() => setActiveTab('settings')}
                            >
                                <Settings size={18} /> {t('settings')}
                            </button>
                            <button className="profile-nav-item logout" onClick={logout}>
                                <LogOut size={18} /> {t('logout')}
                            </button>
                        </nav>
                    </aside>

                    {/* Content Area */}
                    <section className="profile-content">
                        {activeTab === 'profile' ? renderProfileContent() :
                         activeTab === 'rentals' ? renderRentalsContent() : 
                         activeTab === 'wishlist' ? renderWishlistContent() : (
                            <div style={{ backgroundColor: '#fff', padding: '40px', borderRadius: '20px' }}>
                                <h2 className="content-title">{t('underDevelopment')}</h2>
                                <p className="content-subtitle">{t('featureComingSoon')}</p>
                            </div>
                        )}
                    </section>
                </div>
            </main>

            {/* Help Floating Button (Optional, as seen in screenshot) */}
            <div style={{ position: 'fixed', bottom: '30px', right: '30px', zIndex: 100 }}>
                <button style={{
                    width: '45px', height: '45px', borderRadius: '50%', backgroundColor: '#fff',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)', border: 'none', cursor: 'pointer',
                    display: 'flex', alignItems: 'center', justifyContent: 'center'
                }}>
                    <HelpCircle size={20} color="#111" />
                </button>
            </div>

            {/* Rental Detail Modal */}
            {showModal && (
                <div className="modal-overlay" onClick={() => setShowModal(false)}>
                    <div className="modal-container" onClick={e => e.stopPropagation()}>
                        <div className="modal-header">
                            <h3>{t('rentalDetail')}</h3>
                            <button className="close-modal" onClick={() => setShowModal(false)}>
                                <X size={20} />
                            </button>
                        </div>

                        {detailLoading ? (
                            <div className="modal-loading">
                                <div className="spinner"></div>
                                <p>{t('loadingDetails')}</p>
                            </div>
                        ) : selectedRental ? (
                            <div className="modal-body">
                                <div className="order-meta-header">
                                    <div className="order-id-badge">
                                        <span className="label">{t('orderId')}</span>
                                        <span className="value">#LUX{selectedRental.id.toString().padStart(6, '0')}</span>
                                    </div>
                                    <div className={`status-pill status-${selectedRental.status}`}>
                                        {getStatusLabel(selectedRental.status)}
                                    </div>
                                </div>

                                <div className="modal-grid">
                                    <div className="modal-grid-section">
                                        <h4 className="section-title">{t('shippingInfo')}</h4>
                                        <div className="info-card">
                                            <div className="info-row">
                                                <span className="info-label">{t('recipient')}:</span>
                                                <span className="info-value">{selectedRental.full_name}</span>
                                            </div>
                                            <div className="info-row">
                                                <span className="info-label">{t('phoneNumber')}:</span>
                                                <span className="info-value">{selectedRental.phone}</span>
                                            </div>
                                            <div className="info-row">
                                                <span className="info-label">{t('shippingAddress')}:</span>
                                                <span className="info-value">{selectedRental.address}</span>
                                            </div>
                                            <div className="info-row">
                                                <span className="info-label">{t('deliveryMethod')}:</span>
                                                <span className="info-value">
                                                    {selectedRental.delivery_method === 'home' ? t('homeDelivery') : t('pickupAtStore')}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="modal-grid-section">
                                        <h4 className="section-title">{t('paymentInfo')}</h4>
                                        <div className="info-card">
                                            <div className="info-row">
                                                <span className="info-label">{t('paymentMethod')}:</span>
                                                <span className="info-value" style={{ textTransform: 'uppercase' }}>{selectedRental.payment_method}</span>
                                            </div>
                                            <div className="info-row">
                                                <span className="info-label">{t('paymentStatus')}:</span>
                                                <span className="info-value status-text">
                                                    {selectedRental.payment_method === 'cod' ? t('payOnDelivery') : t('paid')}
                                                </span>
                                            </div>
                                            <div className="info-row total-row">
                                                <span className="info-label">{t('totalAmount')}:</span>
                                                <span className="info-value price-total">{selectedRental.total_price?.toLocaleString('vi-VN')} đ</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="modal-products-section">
                                    <h4 className="section-title">{t('rentedProducts')}</h4>
                                    <div className="modal-items-grid">
                                        {selectedRental.RentalItems?.map((item, idx) => (
                                            <div key={idx} className="product-mini-card">
                                                <div className="product-image">
                                                    <img src={getFullImageUrl(item.Product?.image)} alt={item.Product?.name} />
                                                </div>
                                                <div className="product-details">
                                                    <h5 className="product-name">{item.Product?.name ? t(item.Product.name) : t('premiumProduct')}</h5>
                                                    <div className="product-meta">
                                                        <span>{t('size')}: {item.size || 'M'}</span>
                                                        <span className="dot"></span>
                                                        <span>{t('quantity')}: {item.quantity}</span>
                                                    </div>
                                                    <p className="product-price">{item.price_per_day?.toLocaleString('vi-VN')} đ/{t('perDay')}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        ) : null}
                    </div>
                </div>
            )}

            <Footer />
        </div>
    );
};

export default ProfilePage;
