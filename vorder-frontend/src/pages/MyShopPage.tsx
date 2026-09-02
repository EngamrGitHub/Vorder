import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { shopApi, type ShopInput } from '../api/shop';
import { shopImageUrl } from '../api/client';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { ErrorBox, Spinner } from '../components/ui';
import ShopForm from '../components/owner/ShopForm';
import CategoriesTab from '../components/owner/CategoriesTab';
import SubCategoriesTab from '../components/owner/SubCategoriesTab';
import ProductsTab from '../components/owner/ProductsTab';
import type { ShopDto } from '../api/types';

type Tab = 'details' | 'categories' | 'subcategories' | 'products';

export default function MyShopPage() {
  const { user } = useAuth();
  const { push } = useToast();
  const [shop, setShop] = useState<ShopDto | null>(null);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<Tab>('details');
  const [busy, setBusy] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const loadMyShop = useCallback(async () => {
    setLoading(true);
    const res = await shopApi.getShops();
    const mine = res.isSuccess && res.result && user
      ? res.result.find((s) => s.ownerId === user.id) ?? null
      : null;
    setShop(mine);
    setLoading(false);
  }, [user]);

  useEffect(() => {
    void loadMyShop();
  }, [loadMyShop]);

  const createShop = async (input: ShopInput) => {
    setBusy(true);
    setFormError(null);
    const res = await shopApi.createShop(input);
    setBusy(false);
    if (res.isSuccess && res.result) {
      push('success', `Shop "${res.result.shop.name}" created`);
      await loadMyShop();
      setTab('categories');
    } else setFormError(res.errorMsg ?? 'Create failed');
  };

  const updateShop = async (input: ShopInput) => {
    if (!shop) return;
    setBusy(true);
    setFormError(null);
    const res = await shopApi.updateShop(shop.id, input);
    setBusy(false);
    if (res.isSuccess) {
      push('success', 'Shop updated');
      await loadMyShop();
    } else setFormError(res.errorMsg ?? 'Update failed');
  };

  const deleteShop = async () => {
    if (!shop) return;
    if (!window.confirm(`Delete shop "${shop.name}"? ALL its categories, subcategories and products will be removed. This cannot be undone.`)) return;
    setBusy(true);
    const res = await shopApi.deleteShop(shop.id);
    setBusy(false);
    if (res.isSuccess) {
      push('success', 'Shop deleted');
      setShop(null);
      await loadMyShop();
    } else push('error', res.errorMsg ?? 'Delete failed');
  };

  if (loading) return <Spinner label="Loading your shop…" />;

  if (!shop) {
    return (
      <>
        <div className="page-head">
          <div>
            <h1>Open your shop</h1>
            <p>You don't own a shop yet — create one in under a minute</p>
          </div>
        </div>
        <div className="card card-pad" style={{ maxWidth: 640, margin: '0 auto' }}>
          <ShopForm busy={busy} error={formError} submitLabel="Create shop" onSubmit={createShop} />
        </div>
      </>
    );
  }

  return (
    <>
      <div className="page-head">
        <div>
          <h1>{shop.name}</h1>
          <p>
            Manage your shop, catalog and products ·{' '}
            <Link to={`/shops/${shop.id}`} style={{ color: 'var(--primary)' }}>view public page ↗</Link>
          </p>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button className="btn btn-danger btn-sm" onClick={deleteShop} disabled={busy}>Delete shop</button>
        </div>
      </div>

      <div className="card" style={{ display: 'flex', gap: 16, alignItems: 'center', padding: 14, marginBottom: 20, flexWrap: 'wrap' }}>
        {shop.logoUrl
          ? <img src={shopImageUrl(shop.logoUrl)} alt="logo" style={{ width: 52, height: 52, borderRadius: 12, objectFit: 'cover', border: '1px solid var(--border)' }} />
          : <div className="shop-logo" style={{ width: 52, height: 52, borderRadius: 12, fontSize: 22 }}>S</div>}
        <div style={{ flex: 1 }}>
          <strong>{shop.description || 'No description'}</strong>
          <div className="shop-meta" style={{ marginTop: 6 }}>
            {shop.city && <span className="badge">📍 {shop.city}</span>}
            {shop.country && <span className="badge">{shop.country}</span>}
            <span className={`badge ${shop.isActive ? 'badge-success' : 'badge-danger'}`}>
              {shop.isActive ? 'Active' : 'Inactive'}
            </span>
          </div>
        </div>
      </div>

      <div className="tabs">
        {(['details', 'categories', 'subcategories', 'products'] as Tab[]).map((t) => (
          <button key={t} className={`tab ${tab === t ? 'active' : ''}`} onClick={() => setTab(t)}>
            {t === 'details' ? 'Shop details' : t === 'categories' ? 'Categories' : t === 'subcategories' ? 'Subcategories' : 'Products'}
          </button>
        ))}
      </div>

      {tab === 'details' && (
        <div className="card card-pad" style={{ maxWidth: 640 }}>
          <h3 style={{ marginBottom: 12 }}>Edit shop</h3>
          <ErrorBox message={formError} />
          <ShopForm
            initial={shop}
            busy={busy}
            error={null}
            submitLabel="Save changes"
            onSubmit={updateShop}
          />
        </div>
      )}

      {tab === 'categories' && <CategoriesTab shopId={shop.id} onChanged={loadMyShop} />}
      {tab === 'subcategories' && <SubCategoriesTab shopId={shop.id} onChanged={loadMyShop} />}
      {tab === 'products' && <ProductsTab shopId={shop.id} onChanged={loadMyShop} />}
    </>
  );
}
