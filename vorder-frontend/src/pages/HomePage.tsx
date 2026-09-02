import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { shopApi } from '../api/shop';
import { productApi } from '../api/product';
import { cartApi } from '../api/cart';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';
import { useLanguage } from '../context/LanguageContext';
import { Spinner, Stars, money } from '../components/ui';
import {
  resolveProductImage,
  resolveShopBanner,
  resolveShopLogo,
  SHOWCASE_PRODUCTS,
} from '../utils/imageHelper';
import type { ProductDto, ShopDto } from '../api/types';

export default function HomePage() {
  const { t, lang } = useLanguage();
  const { user } = useAuth();
  const { refresh: refreshCart } = useCart();
  const { push } = useToast();

  const [shops, setShops] = useState<ShopDto[] | null>(null);
  const [products, setProducts] = useState<ProductDto[]>([]);
  const [loadingShops, setLoadingShops] = useState(true);
  const [addingId, setAddingId] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    void (async () => {
      try {
        const r = await shopApi.getShops();
        if (!mounted) return;
        const loadedShops = r.isSuccess && r.result ? r.result : [];
        setShops(loadedShops);

        // Try loading products from active shops
        const collectedProducts: ProductDto[] = [];
        for (const s of loadedShops.slice(0, 3)) {
          try {
            const pRes = await productApi.getProducts(s.id);
            if (pRes.isSuccess && pRes.result && pRes.result.length > 0) {
              collectedProducts.push(...pRes.result);
            }
          } catch {
            // Ignore single shop product fetch errors
          }
        }

        // If backend has few or dummy products, enrich with showcase products
        if (collectedProducts.length < 4) {
          const merged = [...collectedProducts];
          for (const sp of SHOWCASE_PRODUCTS) {
            if (!merged.some((m) => m.name.toLowerCase() === sp.name.toLowerCase())) {
              merged.push(sp);
            }
          }
          setProducts(merged.slice(0, 8));
        } else {
          setProducts(collectedProducts.slice(0, 8));
        }
      } catch {
        if (mounted) {
          setShops([]);
          setProducts(SHOWCASE_PRODUCTS);
        }
      } finally {
        if (mounted) setLoadingShops(false);
      }
    })();

    return () => {
      mounted = false;
    };
  }, []);

  const handleQuickAddToCart = async (product: ProductDto, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!user) {
      push('info', lang === 'ar' ? 'يرجى تسجيل الدخول أولاً لإضافة المنتج إلى السلة' : 'Please log in first to add items to cart');
      return;
    }

    setAddingId(product.id);
    try {
      const res = await cartApi.addToCart(product.id, 1);
      if (res.isSuccess) {
        push('success', t('addedToCart'));
        await refreshCart();
      } else {
        push('error', res.errorMsg ?? 'Could not add to cart');
      }
    } catch {
      push('error', 'Network error');
    } finally {
      setAddingId(null);
    }
  };

  const categoriesList = [
    {
      title: t('catElectronics'),
      image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=600&q=80',
      count: '240+',
    },
    {
      title: t('catFashion'),
      image: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=600&q=80',
      count: '580+',
    },
    {
      title: t('catWatches'),
      image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=600&q=80',
      count: '150+',
    },
    {
      title: t('catPerfumes'),
      image: 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&w=600&q=80',
      count: '190+',
    },
    {
      title: t('catHome'),
      image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=600&q=80',
      count: '320+',
    },
    {
      title: t('catDigital'),
      image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=600&q=80',
      count: '85+',
    },
  ];

  return (
    <div className="home-experience">
      {/* 1. Hero Section */}
      <section className="hero-luxury">
        <div className="hero-content">
          <div className="hero-badge">
            <span className="badge-sparkle">✨</span>
            <span>{t('heroBadge')}</span>
          </div>

          <h1 className="hero-title">{t('heroTitle')}</h1>

          <p className="hero-subtitle">{t('heroSubtitle')}</p>

          <div className="hero-actions">
            <Link to="/shops" className="btn btn-primary btn-lg">
              {t('browseShops')}
              <span className="btn-arrow">{lang === 'ar' ? '←' : '→'}</span>
            </Link>
            <Link to={user ? "/my-shop" : "/register"} className="btn btn-outline-glass btn-lg">
              {t('openYourShop')}
            </Link>
          </div>

          {/* Quick Stats bar inside hero */}
          <div className="hero-stats-bar">
            <div className="hero-stat-item">
              <span className="h-stat-num">{shops ? shops.length : '12+'}</span>
              <span className="h-stat-lbl">{t('statShops')}</span>
            </div>
            <div className="hero-stat-sep" />
            <div className="hero-stat-item">
              <span className="h-stat-num">{shops ? shops.filter((s) => s.isActive).length : '10+'}</span>
              <span className="h-stat-lbl">{t('statActiveShops')}</span>
            </div>
            <div className="hero-stat-sep" />
            <div className="hero-stat-item">
              <span className="h-stat-num">1,500+</span>
              <span className="h-stat-lbl">{t('statProducts')}</span>
            </div>
            <div className="hero-stat-sep" />
            <div className="hero-stat-item">
              <span className="h-stat-num">99.8%</span>
              <span className="h-stat-lbl">{t('statOrders')}</span>
            </div>
          </div>
        </div>

        {/* Hero Visual Card / Floating preview */}
        <div className="hero-visual">
          <div className="hero-card-glow" />
          <div className="hero-floating-card main-preview-card">
            <img
              src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80"
              alt="Vorder Platform Marketing"
              className="hero-card-img"
            />
            <div className="hero-card-overlay">
              <div className="hero-card-tag">
                <span className="pulse-dot" />
                <span>{lang === 'ar' ? 'وكالة تسويق رقمية معتمدة' : 'Official Marketing Agency'}</span>
              </div>
              <h3>Vorder Ecosystem</h3>
              <p>{lang === 'ar' ? 'حلول ذكية لنمو التجارة الإلكترونية وإدارة المتاجر' : 'Next-gen e-commerce growth & store management'}</p>
            </div>
          </div>

          {/* Mini Floating Card 1 */}
          <div className="hero-floating-badge badge-sales">
            <div className="badge-icon">📈</div>
            <div>
              <div className="badge-title">+280% {lang === 'ar' ? 'نمو المبيعات' : 'Sales Growth'}</div>
              <div className="badge-sub">{lang === 'ar' ? 'حملات تسويقية دقيقة' : 'Precision Marketing'}</div>
            </div>
          </div>

          {/* Mini Floating Card 2 */}
          <div className="hero-floating-badge badge-stores">
            <div className="badge-icon">🏪</div>
            <div>
              <div className="badge-title">100% {lang === 'ar' ? 'دعم كامل للبائعين' : 'Vendor Support'}</div>
              <div className="badge-sub">{lang === 'ar' ? 'بوابات دفع وشحن متكاملة' : 'Integrated checkout & shipping'}</div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Trust Badges Section */}
      <section className="trust-section">
        <div className="trust-grid">
          <div className="trust-card">
            <div className="trust-icon-box">🛡️</div>
            <div>
              <h4>{t('trustVerified')}</h4>
              <p>{t('trustVerifiedDesc')}</p>
            </div>
          </div>

          <div className="trust-card">
            <div className="trust-icon-box">🚀</div>
            <div>
              <h4>{t('trustShipping')}</h4>
              <p>{t('trustShippingDesc')}</p>
            </div>
          </div>

          <div className="trust-card">
            <div className="trust-icon-box">💳</div>
            <div>
              <h4>{t('trustPayments')}</h4>
              <p>{t('trustPaymentsDesc')}</p>
            </div>
          </div>

          <div className="trust-card">
            <div className="trust-icon-box">🎯</div>
            <div>
              <h4>{t('trustSupport')}</h4>
              <p>{t('trustSupportDesc')}</p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Categories Showcase */}
      <section className="section-block">
        <div className="section-header">
          <div>
            <h2 className="section-heading">{t('categoriesTitle')}</h2>
            <p className="section-sub">{t('categoriesSubtitle')}</p>
          </div>
          <Link to="/shops" className="section-link">
            {t('allShops')} {lang === 'ar' ? '←' : '→'}
          </Link>
        </div>

        <div className="category-grid">
          {categoriesList.map((cat, idx) => (
            <Link key={idx} to="/shops" className="category-card">
              <img src={cat.image} alt={cat.title} className="cat-img" />
              <div className="cat-overlay">
                <span className="cat-count">{cat.count} {lang === 'ar' ? 'عنصر' : 'items'}</span>
                <h3 className="cat-title">{cat.title}</h3>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 4. Trending & Featured Products */}
      <section className="section-block">
        <div className="section-header">
          <div>
            <span className="section-pill">{lang === 'ar' ? 'عروض حصرية' : 'Exclusive Deals'}</span>
            <h2 className="section-heading">{t('featuredTitle')}</h2>
            <p className="section-sub">{t('featuredSubtitle')}</p>
          </div>
        </div>

        <div className="product-grid-luxury">
          {products.map((p) => {
            const resolvedImg = resolveProductImage(p.imageUrl, p.name, p.brand);
            const hasDiscount = p.applyDiscount && p.discountPrice < p.price;
            const isAdding = addingId === p.id;

            return (
              <div key={p.id} className="product-card-luxury">
                <Link to={`/products/${p.id}`} className="product-media-link">
                  <div className="product-img-wrap">
                    <img
                      src={resolvedImg}
                      alt={p.name}
                      className="product-img-luxury"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = SHOWCASE_PRODUCTS[0].imageUrl || '';
                      }}
                    />
                    {hasDiscount && (
                      <span className="discount-tag">
                        {p.discountPercent > 0 ? `-${p.discountPercent}%` : t('discountBadge')}
                      </span>
                    )}
                    <span className={`stock-pill ${p.stockQuantity > 0 ? 'in-stock' : 'out-stock'}`}>
                      {p.stockQuantity > 0 ? t('inStock') : t('outOfStock')}
                    </span>
                  </div>
                </Link>

                <div className="product-card-body">
                  <div className="product-card-meta">
                    {p.brand && <span className="product-brand">{p.brand}</span>}
                    <div className="product-rating">
                      <Stars value={5} readOnly />
                    </div>
                  </div>

                  <h3 className="product-title">
                    <Link to={`/products/${p.id}`}>{p.name}</Link>
                  </h3>

                  <p className="product-desc-luxury">{p.description}</p>

                  <div className="product-footer-row">
                    <div className="price-box">
                      {hasDiscount ? (
                        <>
                          <span className="price-strike">{money(p.price)}</span>
                          <span className="price-current">{money(p.discountPrice)}</span>
                        </>
                      ) : (
                        <span className="price-current">{money(p.price)}</span>
                      )}
                    </div>

                    <button
                      type="button"
                      className="btn-quick-add"
                      disabled={isAdding || p.stockQuantity <= 0}
                      onClick={(e) => handleQuickAddToCart(p, e)}
                      title={t('addToCart')}
                    >
                      {isAdding ? (
                        <span className="btn-spinner" />
                      ) : (
                        <>
                          <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <path d="M12 5v14M5 12h14" strokeLinecap="round" />
                          </svg>
                          <span>{t('addToCart')}</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 5. Featured Verified Stores */}
      <section className="section-block">
        <div className="section-header">
          <div>
            <span className="section-pill">{lang === 'ar' ? 'شركاء النجاح' : 'Top Partners'}</span>
            <h2 className="section-heading">{t('featuredShopsTitle')}</h2>
            <p className="section-sub">{t('featuredShopsSubtitle')}</p>
          </div>
          <Link to="/shops" className="section-link">
            {t('allShops')} {lang === 'ar' ? '←' : '→'}
          </Link>
        </div>

        {loadingShops && <Spinner label={t('loading')} />}

        {shops && shops.length > 0 && (
          <div className="shops-grid-luxury">
            {shops.slice(0, 4).map((s, idx) => (
              <Link key={s.id} to={`/shops/${s.id}`} className="shop-card-luxury">
                <div
                  className="shop-banner-luxury"
                  style={{ backgroundImage: `url(${resolveShopBanner(s.bannerUrl, idx)})` }}
                >
                  <div className="shop-banner-overlay" />
                  <span className={`shop-status-badge ${s.isActive ? 'active' : 'inactive'}`}>
                    <span className="status-dot" />
                    {s.isActive ? t('active') : t('inactive')}
                  </span>
                </div>

                <div className="shop-info-luxury">
                  <div
                    className="shop-avatar-luxury"
                    style={{ backgroundImage: `url(${resolveShopLogo(s.logoUrl, idx)})` }}
                  >
                    {!s.logoUrl && (s.name?.charAt(0).toUpperCase() ?? 'S')}
                  </div>

                  <h3 className="shop-name-luxury">{s.name}</h3>
                  <p className="shop-desc-luxury">{s.description || (lang === 'ar' ? 'متجر معتمد على منصة فوردر للتجارة والتسويق الرقمي.' : 'Verified store on Vorder e-commerce platform.')}</p>

                  <div className="shop-tags-row">
                    {s.city && <span className="shop-tag">📍 {s.city}</span>}
                    {s.country && <span className="shop-tag">🌍 {s.country}</span>}
                    <span className="shop-tag-highlight">{t('visitShop')} {lang === 'ar' ? '←' : '→'}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* 6. Vendor Marketing CTA Banner */}
      <section className="cta-banner-luxury">
        <div className="cta-content">
          <span className="cta-badge">🚀 {lang === 'ar' ? 'انطلق نحو العالمية' : 'Scale With Us'}</span>
          <h2>{t('ctaTitle')}</h2>
          <p>{t('ctaSubtitle')}</p>
          <div className="cta-btn-group">
            <Link to={user ? "/my-shop" : "/register"} className="btn btn-cta-primary btn-lg">
              {t('ctaButton')}
            </Link>
            <Link to="/shops" className="btn btn-cta-secondary btn-lg">
              {t('browseShops')}
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
