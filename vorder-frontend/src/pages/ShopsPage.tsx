import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { shopApi } from '../api/shop';
import { EmptyState, Spinner } from '../components/ui';
import { useLanguage } from '../context/LanguageContext';
import { resolveShopBanner, resolveShopLogo } from '../utils/imageHelper';
import type { ShopDto } from '../api/types';

export default function ShopsPage() {
  const { t, lang } = useLanguage();
  const [shops, setShops] = useState<ShopDto[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [filterActive, setFilterActive] = useState<'all' | 'active'>('all');

  useEffect(() => {
    void (async () => {
      const res = await shopApi.getShops();
      if (res.isSuccess && res.result) setShops(res.result);
      else {
        setError(res.errorMsg);
        setShops([]);
      }
    })();
  }, []);

  const filteredShops = (shops ?? []).filter((s) => {
    const matchesSearch =
      (s.name && s.name.toLowerCase().includes(search.toLowerCase())) ||
      (s.city && s.city.toLowerCase().includes(search.toLowerCase())) ||
      (s.description && s.description.toLowerCase().includes(search.toLowerCase()));

    const matchesFilter = filterActive === 'all' || (filterActive === 'active' && s.isActive);
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="shops-page-luxury">
      <div className="page-head-luxury">
        <div>
          <span className="page-pill">🏪 {lang === 'ar' ? 'شركاء فوردر' : 'Vorder Partners'}</span>
          <h1 className="page-title">{t('shopsPageTitle')}</h1>
          <p className="page-subtitle">{t('shopsPageSubtitle')}</p>
        </div>

        {/* Search & Filter Bar */}
        <div className="shops-filter-row">
          <div className="search-input-wrap">
            <span className="search-icon">🔍</span>
            <input
              type="text"
              className="search-input"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={t('searchShops')}
            />
            {search && (
              <button className="clear-search-btn" onClick={() => setSearch('')}>✕</button>
            )}
          </div>

          <div className="filter-pills">
            <button
              className={`filter-pill ${filterActive === 'all' ? 'active' : ''}`}
              onClick={() => setFilterActive('all')}
            >
              {t('allShops')} ({shops?.length ?? 0})
            </button>
            <button
              className={`filter-pill ${filterActive === 'active' ? 'active' : ''}`}
              onClick={() => setFilterActive('active')}
            >
              {t('active')} ({shops?.filter((s) => s.isActive).length ?? 0})
            </button>
          </div>
        </div>
      </div>

      {error && <div className="alert alert-error">{error}</div>}
      {!shops && <Spinner label={t('loading')} />}

      {shops && filteredShops.length === 0 && (
        <div className="card">
          <EmptyState
            icon="🏪"
            title={t('noShops')}
            subtitle={t('noShopsSubtitle')}
          >
            <Link to="/my-shop" className="btn btn-primary">
              {t('openYourShop')}
            </Link>
          </EmptyState>
        </div>
      )}

      {shops && filteredShops.length > 0 && (
        <div className="shops-grid-luxury">
          {filteredShops.map((s, idx) => (
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
                <p className="shop-desc-luxury">
                  {s.description || (lang === 'ar' ? 'متجر معتمد على منصة فوردر للتجارة والتسويق الرقمي.' : 'Verified vendor on Vorder platform.')}
                </p>

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
    </div>
  );
}
