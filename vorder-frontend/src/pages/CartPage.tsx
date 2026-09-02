import { useCallback, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { cartApi } from '../api/cart';
import { productApi } from '../api/product';
import { useCart } from '../context/CartContext';
import { useLanguage } from '../context/LanguageContext';
import { EmptyState, ErrorBox, Spinner, money } from '../components/ui';
import { resolveProductImage, SHOWCASE_PRODUCTS } from '../utils/imageHelper';
import type { CartItemDto } from '../api/types';

interface EnrichedCartItem extends CartItemDto {
  name: string;
  image: string;
  price: number;
}

export default function CartPage() {
  const { t, lang } = useLanguage();
  const [items, setItems] = useState<EnrichedCartItem[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { refresh: refreshCartCount } = useCart();
  const navigate = useNavigate();

  const load = useCallback(async () => {
    try {
      const res = await cartApi.getMyCart();
      if (res.isSuccess && res.result) {
        const rawItems = res.result;

        // Enrich items with real product name and image
        const enriched: EnrichedCartItem[] = await Promise.all(
          rawItems.map(async (item) => {
            let name = item.productName || '';
            let price = item.unitPrice || 0;
            let image = '';

            // Check demo products first
            const demo = SHOWCASE_PRODUCTS.find((p) => p.id === item.productId);
            if (demo) {
              name = name || demo.name;
              price = price || (demo.applyDiscount ? demo.discountPrice : demo.price);
              image = resolveProductImage(demo.imageUrl, demo.name);
            } else {
              try {
                const prodRes = await productApi.getProductById(item.productId);
                if (prodRes.isSuccess && prodRes.result) {
                  const p = prodRes.result;
                  name = name || p.name;
                  price = price || (p.applyDiscount ? p.discountPrice : p.price);
                  image = resolveProductImage(p.imageUrl, p.name);
                }
              } catch {
                // Ignore
              }
            }

            return {
              ...item,
              name: name || `${lang === 'ar' ? 'منتج متميز' : 'Product'} #${item.productId.slice(0, 6)}`,
              image: image || resolveProductImage(null, name),
              price: price || 450,
            };
          })
        );

        setItems(enriched);
      } else {
        setError(res.errorMsg ?? 'Failed to load cart');
        setItems([]);
      }
    } catch {
      setError('Network error');
      setItems([]);
    }
  }, [lang]);

  useEffect(() => {
    void load();
  }, [load]);

  const updateQuantity = async (productId: string, delta: number) => {
    if (!items) return;
    try {
      await cartApi.addToCart(productId, delta);
      await load();
      await refreshCartCount();
    } catch {
      // Ignore
    }
  };

  const total = (items ?? []).reduce((s, i) => s + i.price * i.quantity, 0);

  if (!items) return <Spinner label={t('loading')} />;

  return (
    <div className="cart-page-luxury">
      <div className="page-head-luxury">
        <div>
          <span className="page-pill">🛒 {t('yourCart')}</span>
          <h1 className="page-title">{t('yourCart')}</h1>
          <p className="page-subtitle">
            {items.length} {t('cartItemsCount')}
          </p>
        </div>
      </div>

      <ErrorBox message={error} />

      {items.length === 0 ? (
        <div className="card">
          <EmptyState
            icon="🛒"
            title={t('cartEmpty')}
            subtitle={t('cartEmptySub')}
          >
            <Link to="/shops" className="btn btn-primary">
              {t('browseShops')}
            </Link>
          </EmptyState>
        </div>
      ) : (
        <div className="cart-layout-grid">
          {/* Items Table / List */}
          <div className="cart-items-card">
            {items.map((i) => (
              <div key={i.id} className="cart-item-row">
                <Link to={`/products/${i.productId}`} className="cart-item-img-link">
                  <img src={i.image} alt={i.name} className="cart-item-img" />
                </Link>

                <div className="cart-item-info">
                  <h4 className="cart-item-title">
                    <Link to={`/products/${i.productId}`}>{i.name}</Link>
                  </h4>
                  <div className="cart-item-price-unit">
                    <span className="unit-label">{t('unitPrice')}:</span>
                    <span className="unit-val">{money(i.price)}</span>
                  </div>
                </div>

                {/* Quantity Controls */}
                <div className="cart-item-qty">
                  <button
                    type="button"
                    className="qty-btn-mini"
                    onClick={() => updateQuantity(i.productId, -1)}
                    disabled={i.quantity <= 1}
                  >
                    -
                  </button>
                  <span className="qty-count">{i.quantity}</span>
                  <button
                    type="button"
                    className="qty-btn-mini"
                    onClick={() => updateQuantity(i.productId, 1)}
                  >
                    +
                  </button>
                </div>

                {/* Line Total */}
                <div className="cart-item-total">
                  <span className="line-total-val">{money(i.price * i.quantity)}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary Card */}
          <div className="cart-summary-card">
            <h3 className="summary-title">{t('orderSummary')}</h3>

            <div className="summary-line">
              <span>{t('subtotal')}</span>
              <strong>{money(total)}</strong>
            </div>

            <div className="summary-line">
              <span>{t('shipping')}</span>
              <span className="free-shipping-tag">{t('freeShipping')}</span>
            </div>

            <div className="summary-sep" />

            <div className="summary-line summary-grand-total">
              <span>{t('total')}</span>
              <span className="total-amount">{money(total)}</span>
            </div>

            <button
              type="button"
              className="btn btn-primary btn-block btn-lg"
              style={{ marginTop: 20 }}
              onClick={() => navigate('/checkout')}
            >
              {t('proceedToCheckout')} {lang === 'ar' ? '←' : '→'}
            </button>

            <div className="cart-trust-bullets">
              <div className="trust-bullet">
                <span>🛡️</span>
                <span>{lang === 'ar' ? 'دفع إلكتروني آمن ومشفر 100%' : '100% Secure Checkout'}</span>
              </div>
              <div className="trust-bullet">
                <span>🚚</span>
                <span>{lang === 'ar' ? 'شحن فوري لباب منزلك' : 'Fast doorstep delivery'}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
