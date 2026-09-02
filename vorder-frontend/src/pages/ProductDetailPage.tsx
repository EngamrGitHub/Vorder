import { useCallback, useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { productApi } from '../api/product';
import { reviewApi } from '../api/review';
import { cartApi } from '../api/cart';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';
import { useLanguage } from '../context/LanguageContext';
import { ErrorBox, Spinner, Stars, money, dateFmt } from '../components/ui';
import {
  resolveProductImage,
  SHOWCASE_PRODUCTS,
} from '../utils/imageHelper';
import type { ProductDto, ReviewDto } from '../api/types';

export default function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { token } = useAuth();
  const { refresh: refreshCart } = useCart();
  const { push } = useToast();
  const { t, lang } = useLanguage();

  const [product, setProduct] = useState<ProductDto | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [qty, setQty] = useState(1);
  const [cartBusy, setCartBusy] = useState(false);

  const [reviews, setReviews] = useState<ReviewDto[]>([]);
  const [rating, setRating] = useState(5);
  const [text, setText] = useState('');
  const [reviewBusy, setReviewBusy] = useState(false);

  const loadReviews = useCallback(async () => {
    if (!id) return;
    try {
      const res = await reviewApi.getProductReviews(id);
      if (res.isSuccess && res.result) setReviews(res.result);
    } catch {
      // Ignore
    }
  }, [id]);

  useEffect(() => {
    if (!id) return;
    void (async () => {
      try {
        // Check showcase products first for instant response
        const demo = SHOWCASE_PRODUCTS.find((p) => p.id === id);
        if (demo) {
          setProduct(demo);
          await loadReviews();
          return;
        }

        const res = await productApi.getProductById(id);
        if (res.isSuccess && res.result) {
          setProduct(res.result);
        } else {
          // Fallback to showcase if not found
          const fallback = SHOWCASE_PRODUCTS[0];
          setProduct(fallback);
        }
        await loadReviews();
      } catch {
        setProduct(SHOWCASE_PRODUCTS[0]);
      }
    })();
  }, [id, loadReviews]);

  const addToCart = async () => {
    if (!product) return;
    setCartBusy(true);
    try {
      const res = await cartApi.addToCart(product.id, Math.max(1, qty));
      if (res.isSuccess) {
        push('success', t('addedToCart'));
        await refreshCart();
      } else {
        push('error', res.errorMsg ?? 'Could not add to cart');
      }
    } catch {
      push('error', 'Network error');
    } finally {
      setCartBusy(false);
    }
  };

  const submitReview = async () => {
    if (!id) return;
    setReviewBusy(true);
    try {
      const res = await reviewApi.createReview(id, rating, text.trim() || undefined);
      if (res.isSuccess) {
        setText('');
        setRating(5);
        push('success', lang === 'ar' ? 'تم إرسال تقييمك بنجاح، شكراً لك!' : 'Review posted successfully!');
        await loadReviews();
      } else {
        push('error', res.errorMsg ?? 'Could not post review');
      }
    } catch {
      push('error', 'Network error');
    } finally {
      setReviewBusy(false);
    }
  };

  if (error) return <ErrorBox message={error} />;
  if (!product) return <Spinner label={t('loading')} />;

  const avg = reviews.length
    ? Math.round((reviews.reduce((s, r) => s + r.rating, 0) / reviews.length) * 10) / 10
    : 4.9;

  const resolvedImg = resolveProductImage(product.imageUrl, product.name, product.brand);
  const hasDiscount = product.applyDiscount && product.discountPrice < product.price;

  return (
    <div className="product-detail-luxury">
      {/* Breadcrumb */}
      <nav className="detail-breadcrumb">
        <Link to="/">{t('home')}</Link>
        <span className="sep">/</span>
        <Link to="/shops">{t('shops')}</Link>
        <span className="sep">/</span>
        <span className="current">{product.name}</span>
      </nav>

      {/* Main Product Showcase Card */}
      <div className="product-showcase-grid">
        {/* Media Preview Column */}
        <div className="product-gallery-card">
          <div className="product-gallery-wrap">
            <img
              src={resolvedImg}
              alt={product.name}
              className="product-large-img"
              onError={(e) => {
                (e.target as HTMLImageElement).src = SHOWCASE_PRODUCTS[0].imageUrl || '';
              }}
            />
            {hasDiscount && (
              <span className="detail-discount-badge">
                {product.discountPercent > 0 ? `-${product.discountPercent}%` : t('discountBadge')}
              </span>
            )}
          </div>
        </div>

        {/* Product Details & Purchase Options */}
        <div className="product-meta-card">
          <div className="meta-top-row">
            {product.brand && <span className="product-brand-tag">{product.brand}</span>}
            <span className={`stock-status-pill ${product.stockQuantity > 0 ? 'available' : 'unavailable'}`}>
              <span className="pill-dot" />
              {product.stockQuantity > 0
                ? `${t('inStock')} (${product.stockQuantity})`
                : t('outOfStock')}
            </span>
          </div>

          <h1 className="product-main-title">{product.name}</h1>

          {/* Rating summary */}
          <div className="product-rating-summary">
            <Stars value={Math.round(avg)} readOnly />
            <span className="rating-num">{avg}</span>
            <span className="reviews-count">
              ({reviews.length} {lang === 'ar' ? 'تقييم' : 'reviews'})
            </span>
          </div>

          {/* Price Box */}
          <div className="detail-price-box">
            {hasDiscount ? (
              <div className="price-combo">
                <span className="main-price">{money(product.discountPrice)}</span>
                <span className="strike-price">{money(product.price)}</span>
                <span className="savings-badge">
                  {lang === 'ar'
                    ? `وفر ${money(product.price - product.discountPrice)}`
                    : `Save ${money(product.price - product.discountPrice)}`}
                </span>
              </div>
            ) : (
              <span className="main-price">{money(product.price)}</span>
            )}
          </div>

          {/* Description */}
          <p className="product-description-text">{product.description}</p>

          {/* Key Attributes */}
          <div className="attributes-grid">
            <div className="attr-item">
              <span className="attr-label">SKU:</span>
              <span className="attr-value">{product.sku || 'N/A'}</span>
            </div>
            {product.model && (
              <div className="attr-item">
                <span className="attr-label">{lang === 'ar' ? 'الموديل:' : 'Model:'}</span>
                <span className="attr-value">{product.model}</span>
              </div>
            )}
            <div className="attr-item">
              <span className="attr-label">{lang === 'ar' ? 'النوع:' : 'Type:'}</span>
              <span className="attr-value">
                {product.isPhysical
                  ? lang === 'ar'
                    ? 'منتج مادي (شحن ملموس)'
                    : 'Physical Product'
                  : lang === 'ar'
                  ? 'خدمة / منتج رقمي'
                  : 'Digital Service'}
              </span>
            </div>
          </div>

          {/* Purchase Action Box */}
          {token ? (
            <div className="purchase-action-box">
              <div className="qty-picker">
                <button
                  type="button"
                  className="qty-btn"
                  onClick={() => setQty((q) => Math.max(1, q - 1))}
                  disabled={qty <= 1}
                >
                  -
                </button>
                <span className="qty-val">{qty}</span>
                <button
                  type="button"
                  className="qty-btn"
                  onClick={() => setQty((q) => q + 1)}
                  disabled={product.stockQuantity > 0 && qty >= product.stockQuantity}
                >
                  +
                </button>
              </div>

              <button
                className="btn btn-primary btn-add-cart"
                disabled={cartBusy || product.stockQuantity <= 0}
                onClick={addToCart}
              >
                {cartBusy ? (
                  t('adding')
                ) : (
                  <>
                    <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <circle cx="9" cy="21" r="1" />
                      <circle cx="20" cy="21" r="1" />
                      <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
                    </svg>
                    <span>{t('addToCart')}</span>
                  </>
                )}
              </button>
            </div>
          ) : (
            <div className="login-prompt-box">
              <p>{t('loginToBuy')}</p>
              <Link to="/login" className="btn btn-primary btn-sm">
                {t('login')}
              </Link>
            </div>
          )}

          {/* Trust Guarantee items */}
          <div className="detail-guarantees">
            <div className="guarantee-item">
              <span className="guarantee-icon">🚚</span>
              <span>{lang === 'ar' ? 'شحن سريع لجميع المحافظات' : 'Fast countrywide shipping'}</span>
            </div>
            <div className="guarantee-item">
              <span className="guarantee-icon">🔒</span>
              <span>{lang === 'ar' ? 'دفع إلكتروني آمن ومضمون' : 'Secure & encrypted payment'}</span>
            </div>
            <div className="guarantee-item">
              <span className="guarantee-icon">✨</span>
              <span>{lang === 'ar' ? 'ضمان جودة من شبكة فوردر' : 'Vorder quality guaranteed'}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Customer Reviews Section */}
      <section className="reviews-section-luxury">
        <div className="section-header">
          <div>
            <h2 className="section-heading">{t('reviews')} ({reviews.length})</h2>
          </div>
        </div>

        <div className="reviews-grid-luxury">
          {/* Reviews List */}
          <div className="card card-pad reviews-list-card">
            {reviews.length === 0 ? (
              <p className="no-reviews-text">{t('noReviews')}</p>
            ) : (
              reviews.map((r) => (
                <div key={r.id} className="review-entry">
                  <div className="review-entry-header">
                    <div className="review-author-info">
                      <div className="author-avatar">{r.userFullName?.charAt(0).toUpperCase() || 'U'}</div>
                      <span className="author-name">{r.userFullName || 'عميل موثوق'}</span>
                    </div>
                    <Stars value={r.rating} readOnly />
                  </div>
                  {r.customerReview && <p className="review-body">{r.customerReview}</p>}
                </div>
              ))
            )}
          </div>

          {/* Write a Review Box */}
          <div className="card card-pad review-form-card">
            <h3>{t('writeReview')}</h3>
            {token ? (
              <div className="review-form">
                <div className="rating-select-row">
                  <span>{t('yourRating')}</span>
                  <Stars value={rating} onChange={setRating} />
                </div>
                <textarea
                  className="input review-textarea"
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  placeholder={t('reviewPlaceholder')}
                  rows={4}
                />
                <button
                  className="btn btn-primary"
                  disabled={reviewBusy}
                  onClick={submitReview}
                >
                  {reviewBusy ? t('posting') : t('postReview')}
                </button>
              </div>
            ) : (
              <p className="muted">
                <Link to="/login" className="login-inline-link">
                  {t('login')}
                </Link>{' '}
                {lang === 'ar' ? 'لكتابة تقييمك ومشاركة رأيك.' : 'to leave a customer review.'}
              </p>
            )}
          </div>
        </div>
      </section>

      <p className="small muted" style={{ marginTop: 24, textAlign: 'center' }}>
        {lang === 'ar' ? 'تاريخ الإدراج:' : 'Listed on:'} {dateFmt(product.createdDate)}
      </p>
    </div>
  );
}
