import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { shopApi } from '../api/shop';
import { productApi } from '../api/product';
import { cartApi } from '../api/cart';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';
import { useLanguage } from '../context/LanguageContext';
import { EmptyState, ErrorBox, Spinner, Stars, money } from '../components/ui';
import {
  resolveProductImage,
  resolveShopBanner,
  resolveShopLogo,
  SHOWCASE_PRODUCTS,
} from '../utils/imageHelper';
import type { ProductDto, ShopDto } from '../api/types';

export default function PublicShopPage() {
  const { id } = useParams<{ id: string }>();
  const { t, lang } = useLanguage();
  const { user } = useAuth();
  const { refresh: refreshCart } = useCart();
  const { push } = useToast();

  const [shop, setShop] = useState<ShopDto | null>(null);
  const [products, setProducts] = useState<ProductDto[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [addingId, setAddingId] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    void (async () => {
      try {
        const shopsRes = await shopApi.getShops();
        const found =
          shopsRes.isSuccess && shopsRes.result
            ? shopsRes.result.find((s) => s.id === id) ?? null
            : null;

        if (!found) {
          setError(lang === 'ar' ? 'المتجر غير موجود' : 'Shop not found');
          setProducts([]);
          return;
        }

        setShop(found);

        const prodRes = await productApi.getProducts(id);
        if (prodRes.isSuccess && prodRes.result && prodRes.result.length > 0) {
          setProducts(prodRes.result);
        } else {
          // If no products in this specific shop, show showcase catalog
          setProducts(SHOWCASE_PRODUCTS);
        }
      } catch (err: any) {
        setError(err.message || 'Error loading shop');
        setProducts(SHOWCASE_PRODUCTS);
      }
    })();
  }, [id, lang]);

  const handleQuickAddToCart = async (product: ProductDto, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!user) {
      push(
        'info',
        lang === 'ar'
          ? 'يرجى تسجيل الدخول أولاً لإضافة المنتج إلى السلة'
          : 'Please log in first to add items to cart'
      );
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

  if (error) return <ErrorBox message={error} />;
  if (!shop || !products) return <Spinner label={t('loading')} />;

  return (
    <div className="public-shop-luxury">
      {/* Shop Header Banner */}
      <div className="shop-header-card">
        <div
          className="shop-header-banner"
          style={{ backgroundImage: `url(${resolveShopBanner(shop.bannerUrl, 0)})` }}
        >
          <div className="shop-header-overlay" />
          <Link to="/shops" className="back-link-float">
            {lang === 'ar' ? '← العودة للمتاجر' : '← Back to Shops'}
          </Link>
        </div>

        <div className="shop-header-content">
          <div
            className="shop-header-avatar"
            style={{ backgroundImage: `url(${resolveShopLogo(shop.logoUrl, 0)})` }}
          >
            {!shop.logoUrl && (shop.name?.charAt(0).toUpperCase() ?? 'S')}
          </div>

          <div className="shop-header-details">
            <div className="shop-title-row">
              <h1>{shop.name}</h1>
              <span className="verified-badge">
                <span>✓</span>
                <span>{lang === 'ar' ? 'متجر معتمد' : 'Verified Merchant'}</span>
              </span>
            </div>

            <p className="shop-header-desc">
              {shop.description ||
                (lang === 'ar'
                  ? 'أحد المتاجر المعتمدة لدى شبكة فوردر للتسويق والتجارة الإلكترونية.'
                  : 'Verified partner merchant on Vorder ecosystem.')}
            </p>

            <div className="shop-meta-pills">
              {shop.city && <span className="meta-pill">📍 {shop.city}</span>}
              {shop.country && <span className="meta-pill">🌍 {shop.country}</span>}
              {shop.website && (
                <a href={shop.website} target="_blank" rel="noreferrer" className="meta-pill-link">
                  🌐 {shop.website}
                </a>
              )}
              {shop.whatsappNumber && (
                <a
                  href={`https://wa.me/${shop.whatsappNumber.replace(/\D/g, '')}`}
                  target="_blank"
                  rel="noreferrer"
                  className="meta-pill-whatsapp"
                >
                  💬 WhatsApp
                </a>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Shop Products Section */}
      <div className="section-header" style={{ marginTop: 32 }}>
        <div>
          <span className="section-pill">{t('shopProducts')}</span>
          <h2 className="section-heading">
            {t('shopProducts')} ({products.length})
          </h2>
        </div>
      </div>

      {products.length === 0 ? (
        <div className="card">
          <EmptyState
            title={t('noProductsShop')}
            subtitle={t('noProductsShopSub')}
          />
        </div>
      ) : (
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
      )}
    </div>
  );
}
