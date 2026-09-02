import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useLanguage } from '../context/LanguageContext';

export default function Navbar() {
  const { user, signOut } = useAuth();
  const { count } = useCart();
  const { lang, toggleLang, t } = useLanguage();
  const navigate = useNavigate();

  const handleSignOut = () => {
    signOut();
    navigate('/');
  };

  return (
    <header className="navbar-luxury">
      <div className="navbar-inner">
        {/* Brand Logo & Title */}
        <Link to="/" className="brand-luxury">
          <div className="brand-logo-wrap">
            <img src="/logo.png" alt="Vorder Logo" className="brand-logo-img" />
          </div>
          <div className="brand-info">
            <span className="brand-name">Vorder</span>
            <span className="brand-sub">{lang === 'ar' ? 'وكالة تسويق وحلول متاجر' : 'Marketing & Commerce'}</span>
          </div>
        </Link>

        {/* Navigation Links */}
        <nav className="nav-links">
          <NavLink to="/" end>{t('home')}</NavLink>
          <NavLink to="/shops">{t('shops')}</NavLink>
          {user && <NavLink to="/my-shop">{t('myShop')}</NavLink>}
          {user && <NavLink to="/addresses">{t('addresses')}</NavLink>}
        </nav>

        {/* Actions & Utilities */}
        <div className="nav-actions">
          {/* Language Switcher Button */}
          <button
            type="button"
            className="btn-lang-switcher"
            onClick={toggleLang}
            title={lang === 'ar' ? 'Switch to English' : 'التحويل إلى العربية'}
          >
            <span className="lang-icon">🌐</span>
            <span className="lang-text">{lang === 'ar' ? 'English' : 'العربية'}</span>
          </button>

          {/* Cart Link */}
          {user && (
            <Link to="/cart" className="cart-link" aria-label={t('cart')}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="9" cy="21" r="1" />
                <circle cx="20" cy="21" r="1" />
                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
              </svg>
              {count > 0 && <span className="cart-badge-luxury">{count}</span>}
            </Link>
          )}

          {/* User Auth Buttons */}
          {user ? (
            <div className="user-chip-luxury">
              <span className="user-avatar-luxury">{user.name?.charAt(0).toUpperCase() ?? 'U'}</span>
              <span className="user-name-luxury" title={user.email}>{user.name}</span>
              <button className="btn btn-ghost btn-sm" onClick={handleSignOut}>{t('logout')}</button>
            </div>
          ) : (
            <div className="user-chip">
              <Link to="/login" className="btn btn-ghost btn-sm">{t('login')}</Link>
              <Link to="/register" className="btn btn-primary btn-sm">{t('signUp')}</Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
