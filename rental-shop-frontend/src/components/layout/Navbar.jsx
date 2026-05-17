import { useState, useEffect } from 'react'
import { Link, useNavigate, useLocation, NavLink } from 'react-router-dom'
import { Menu, X, ShoppingBag, User, Search, LogOut, Settings, ClipboardList, ArrowLeft } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { useLanguage } from '../../context/LanguageContext'
import axiosClient from '../../api/axiosClient'
import '../../styles/Navbar.css'

const Navbar = ({ showBack = false }) => {
    const [isScrolled, setIsScrolled] = useState(false)
    const [isMobileOpen, setIsMobileOpen] = useState(false)
    const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)
    const [cartCount, setCartCount] = useState(0)
    
    const { user, isLoggedIn, logout } = useAuth()
    const { language, toggleLanguage, t } = useLanguage()
    const navigate = useNavigate()
    const location = useLocation()

    useEffect(() => {
        if (isLoggedIn) {
            fetchCartCount()
        } else {
            setCartCount(0)
        }
    }, [isLoggedIn, location.pathname])

    const fetchCartCount = async () => {
        try {
            const response = await axiosClient.get('/cart')
            setCartCount(response.data.length)
        } catch (error) {
            console.error("Failed to fetch cart count:", error)
        }
    }

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50)
        }
        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    const handleLogout = () => {
        logout()
        setIsUserMenuOpen(false)
        navigate('/login')
    }

    const navLinks = [
        { name: t('home'), href: '/' },
        { name: t('products'), href: '/products' },
        { name: t('categories'), href: '/categories' },
        { name: t('about'), href: '/about' },
    ]

    return (
        <>
            <nav className={`navbar ${isScrolled ? 'scrolled' : ''}`}>
                <div className="container navbar-container">
                    <Link to="/" className="navbar-logo">
                        LUXE RENT
                    </Link>

                    <ul className="navbar-nav">
                        {navLinks.map((link) => (
                            <li key={link.name}>
                                <NavLink 
                                    to={link.href} 
                                    className={({ isActive }) => `navbar-link ${isActive ? 'active' : ''}`}
                                >
                                    {link.name}
                                </NavLink>
                            </li>
                        ))}
                    </ul>

                    <div className="navbar-actions">
                        <button className="navbar-icon-btn" aria-label={t('search')}>
                            <Search />
                        </button>
                        
                        <button className="navbar-lang-btn" onClick={toggleLanguage}>
                            {language === 'vi' ? 'EN' : 'VN'}
                        </button>
                        
                        {showBack ? (
                            <button className="navbar-icon-btn back-btn-luxury" onClick={() => navigate(-1)} title={t('back')}>
                                <ArrowLeft size={24} />
                                <span className="back-text">{t('back')}</span>
                            </button>
                        ) : (
                            <Link to="/cart" className="navbar-icon-btn" aria-label="Cart">
                                <ShoppingBag />
                                {isLoggedIn && cartCount > 0 && (
                                    <span className="cart-badge">{cartCount}</span>
                                )}
                            </Link>
                        )}
                        
                        {isLoggedIn ? (
                            <div className="navbar-user-container">
                                <button 
                                    className="navbar-user-btn"
                                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                                >
                                    <div className="user-avatar-circle" style={{ overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        {user?.avatar ? (
                                            <img src={user.avatar} alt={user.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                        ) : (
                                            <User size={18} />
                                        )}
                                    </div>
                                    <span className="user-name">{user?.name ? user.name.split(' ')[0] : t('guest')}</span>
                                </button>
                                
                                {isUserMenuOpen && (
                                    <div className="user-dropdown-luxury">
                                        <Link to="/profile" className="dropdown-item" onClick={() => setIsUserMenuOpen(false)}>
                                            <User size={18} strokeWidth={2.5} />
                                            <span>{t('myProfile')}</span>
                                        </Link>
                                        <div className="dropdown-divider"></div>
                                        <button onClick={handleLogout} className="dropdown-item logout-btn-luxury">
                                            <LogOut size={18} strokeWidth={2.5} />
                                            <span>{t('logout')}</span>
                                        </button>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <Link to="/login" className="navbar-login-luxury">{t('login')}</Link>
                        )}

                        <button
                            className="navbar-menu-toggle"
                            onClick={() => setIsMobileOpen(true)}
                            aria-label="Open menu"
                        >
                            <Menu />
                        </button>
                    </div>
                </div>
            </nav>

            {/* Mobile Menu */}
            <div className={`navbar-mobile ${isMobileOpen ? 'open' : ''}`}>
                <button
                    className="navbar-mobile-close"
                    onClick={() => setIsMobileOpen(false)}
                    aria-label="Close menu"
                >
                    <X />
                </button>
                <ul className="navbar-mobile-nav">
                    {navLinks.map((link) => (
                        <li key={link.name}>
                            <Link
                                to={link.href}
                                className="navbar-mobile-link"
                                onClick={() => setIsMobileOpen(false)}
                            >
                                {link.name}
                            </Link>
                        </li>
                    ))}
                    <li>
                        {isLoggedIn ? (
                            <div className="flex flex-col gap-4">
                                <Link to="/cart" className="navbar-mobile-link" onClick={() => setIsMobileOpen(false)}>
                                    {t('cart')} ({cartCount})
                                </Link>
                                <button onClick={handleLogout} className="navbar-mobile-link">
                                    {t('logout')} ({user?.name})
                                </button>
                            </div>
                        ) : (
                            <Link
                                to="/login"
                                className="navbar-mobile-link"
                                onClick={() => setIsMobileOpen(false)}
                            >
                                {t('login')}
                            </Link>
                        )}
                    </li>
                </ul>
            </div>
        </>
    )
}

export default Navbar
