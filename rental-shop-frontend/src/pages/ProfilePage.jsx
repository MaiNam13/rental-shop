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

const ProfilePage = () => {
    const { user, logout } = useAuth();
    const { t } = useLanguage();
    const [activeTab, setActiveTab] = useState('rentals');
    const [rentals, setRentals] = useState([]);
    const [loading, setLoading] = useState(true);
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
            alert(t('failedToLoadDetails'));
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
    }, [activeTab, user?.id]);

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
            case 'renting': return t('renting');
            case 'returned': return t('returned');
            case 'approved': return t('approved');
            default: return t('pending');
        }
    };

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
                    <option value="pending">{t('pending')}</option>
                    <option value="approved">{t('approved')}</option>
                    <option value="renting">{t('renting')}</option>
                    <option value="returned">{t('returned')}</option>
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

    return (
        <div className="profile-page">
            <Navbar />
            <main className="profile-container" style={{ paddingTop: '120px', paddingBottom: '80px' }}>
                <div className="profile-layout">
                    {/* Sidebar */}
                    <aside className="profile-sidebar">
                        <div className="user-info">
                            <div className="avatar-wrapper">
                                <User size={40} color="#555" strokeWidth={2.5} />
                            </div>
                            <h3 className="user-name">{user?.name || t('customer')}</h3>
                            <p className="user-email">{user?.email || 'email@example.com'}</p>
                        </div>

                        <nav className="sidebar-nav">
                            <button
                                className={`nav-item ${activeTab === 'profile' ? 'active' : ''}`}
                                onClick={() => setActiveTab('profile')}
                            >
                                <User size={18} /> {t('myProfile')}
                            </button>
                            <button
                                className={`nav-item ${activeTab === 'rentals' ? 'active' : ''}`}
                                onClick={() => setActiveTab('rentals')}
                            >
                                <Package size={18} /> {t('myRentals')}
                            </button>
                            <button
                                className={`nav-item ${activeTab === 'wishlist' ? 'active' : ''}`}
                                onClick={() => setActiveTab('wishlist')}
                            >
                                <Heart size={18} /> {t('wishlist')}
                            </button>
                            <button
                                className={`nav-item ${activeTab === 'addresses' ? 'active' : ''}`}
                                onClick={() => setActiveTab('addresses')}
                            >
                                <MapPin size={18} /> {t('addresses')}
                            </button>
                            <button
                                className={`nav-item ${activeTab === 'payment' ? 'active' : ''}`}
                                onClick={() => setActiveTab('payment')}
                            >
                                <CreditCard size={18} /> {t('paymentMethods')}
                            </button>
                            <button
                                className={`nav-item ${activeTab === 'settings' ? 'active' : ''}`}
                                onClick={() => setActiveTab('settings')}
                            >
                                <Settings size={18} /> {t('settings')}
                            </button>
                            <button className="nav-item logout" onClick={logout}>
                                <LogOut size={18} /> {t('logout')}
                            </button>
                        </nav>
                    </aside>

                    {/* Content Area */}
                    <section className="profile-content">
                        {activeTab === 'rentals' ? renderRentalsContent() : (
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
                            <div className="modal-loading">{t('loadingDetails')}</div>
                        ) : selectedRental ? (
                            <div className="modal-body">
                                <div className="modal-section order-meta">
                                    <div>
                                        <span className="label">{t('orderId')}:</span>
                                        <span className="value">#LUX{selectedRental.id.toString().padStart(6, '0')}</span>
                                    </div>
                                    <div className={`status-badge status-${selectedRental.status}`}>
                                        {getStatusLabel(selectedRental.status)}
                                    </div>
                                </div>

                                <div className="modal-section-grid">
                                    <div className="modal-section">
                                        <h4>{t('shippingInfo')}</h4>
                                        <p><strong>{t('recipient')}:</strong> {selectedRental.full_name}</p>
                                        <p><strong>{t('phoneNumber')}:</strong> {selectedRental.phone}</p>
                                        <p><strong>{t('addresses')}:</strong> {selectedRental.address}</p>
                                        <p><strong>{t('deliveryMethod')}:</strong> {selectedRental.delivery_method === 'home' ? t('shipToHome') : t('pickAtStore')}</p>
                                    </div>
                                    <div className="modal-section">
                                        <h4>{t('paymentStatus')}</h4>
                                        <p><strong>{t('paymentMethods')}:</strong> {selectedRental.payment_method === 'cod' ? t('payOnDelivery') : t('paid')}</p>
                                        <p><strong>{t('totalPrice')}:</strong> <span className="price">{selectedRental.total_price?.toLocaleString('vi-VN')} đ</span></p>
                                    </div>
                                </div>

                                <div className="modal-section">
                                    <h4>{t('rentedProducts')}</h4>
                                    <div className="modal-items-list">
                                        {selectedRental.RentalItems?.map((item, idx) => (
                                            <div key={idx} className="modal-item">
                                                <img src={getFullImageUrl(item.Product?.image)} alt={item.Product?.name} />
                                                <div className="item-info">
                                                    <h5>{item.Product?.name ? t(item.Product.name) : t('premiumProduct')}</h5>
                                                    <p>{t('quantity')}: {item.quantity}</p>
                                                    <p className="item-price">{item.price_per_day?.toLocaleString('vi-VN')} đ/{t('perDay')}</p>
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
