import { useCallback, useEffect, useState } from 'react';
import { productApi, type ProductInput } from '../../api/product';
import { subCategoryApi } from '../../api/subcategory';
import { shopImageUrl } from '../../api/client';
import { ErrorBox, Field, SelectField, CheckField, FileField, Modal, EmptyState, Spinner, money } from '../ui';
import type { ProductDto, SubCategoryDto } from '../../api/types';

interface Props {
  shopId: string;
  onChanged: () => void;
}

const emptyForm: ProductInput = {
  name: '',
  description: '',
  price: 0,
  stockQuantity: 0,
  sku: '',
  brand: '',
  model: '',
  subCategoryId: '',
  isPhysical: true,
  applyDiscount: false,
  discountPercent: 0,
  discountPrice: 0,
};

export default function ProductsTab({ shopId, onChanged }: Props) {
  const [items, setItems] = useState<ProductDto[] | null>(null);
  const [subs, setSubs] = useState<SubCategoryDto[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<ProductDto | null>(null);
  const [form, setForm] = useState<ProductInput>(emptyForm);
  const [image, setImage] = useState<File | null>(null);
  const [busy, setBusy] = useState(false);

  const load = useCallback(async () => {
    const [prodRes, subsRes] = await Promise.all([
      productApi.getProducts(shopId),
      subCategoryApi.getSubCategories(shopId),
    ]);
    if (prodRes.isSuccess && prodRes.result) setItems(prodRes.result);
    else setError(prodRes.errorMsg ?? 'Failed to load products');
    if (subsRes.isSuccess && subsRes.result) setSubs(subsRes.result);
  }, [shopId]);

  useEffect(() => {
    void load();
  }, [load]);

  const openCreate = () => {
    setEditing(null);
    setForm({ ...emptyForm, subCategoryId: subs[0]?.id ?? '' });
    setImage(null);
    setModalOpen(true);
  };

  const openEdit = (p: ProductDto) => {
    setEditing(p);
    setForm({
      name: p.name,
      description: p.description,
      price: p.price,
      stockQuantity: p.stockQuantity,
      sku: p.sku,
      brand: p.brand,
      model: p.model,
      subCategoryId: p.subCategoryId,
      isPhysical: p.isPhysical,
      applyDiscount: p.applyDiscount,
      discountPercent: p.discountPercent,
      discountPrice: p.discountPrice,
      imageUrl: p.imageUrl,
    });
    setImage(null);
    setModalOpen(true);
  };

  const save = async () => {
    setBusy(true);
    const input: ProductInput = {
      ...form,
      name: form.name.trim(),
      description: form.description.trim() || '—',
      image,
    };
    const res = editing
      ? await productApi.updateProduct(editing.id, input)
      : await productApi.createProduct(input, shopId);
    setBusy(false);
    if (res.isSuccess) {
      setModalOpen(false);
      await load();
      onChanged();
    } else setError(res.errorMsg ?? 'Save failed');
  };

  const remove = async (p: ProductDto) => {
    if (!window.confirm(`Delete product "${p.name}"?`)) return;
    const res = await productApi.deleteProduct(p.id);
    if (res.isSuccess) {
      await load();
      onChanged();
    } else setError(res.errorMsg ?? 'Delete failed');
  };

  const subName = (id: string) => subs.find((s) => s.id === id)?.name ?? '—';
  const valid = form.name.trim() && form.price > 0 && form.sku.trim() && form.subCategoryId;

  return (
    <div>
      <div className="flex-between" style={{ marginBottom: 14 }}>
        <span className="muted small">{items ? `${items.length} products` : ''}</span>
        <button className="btn btn-primary btn-sm" onClick={openCreate} disabled={subs.length === 0}>+ New product</button>
      </div>
      {subs.length === 0 && (
        <div className="alert alert-info">Create a category and a subcategory first — products hang under subcategories.</div>
      )}
      <ErrorBox message={error} />

      {!items && <Spinner label="Loading products…" />}
      {items && items.length === 0 && (
        <EmptyState icon="📦" title="No products" subtitle="Add your first product to start selling." />
      )}

      {items && items.length > 0 && (
        <div className="card table-wrap">
          <table className="table">
            <thead>
              <tr>
                <th></th>
                <th>Product</th>
                <th>Subcategory</th>
                <th>Price</th>
                <th>Stock</th>
                <th>SKU</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {items.map((p) => (
                <tr key={p.id}>
                  <td>
                    {p.imageUrl
                      ? <img className="thumb" src={shopImageUrl(p.imageUrl)} alt={p.name} />
                      : <div className="thumb" style={{ display: 'grid', placeItems: 'center' }}>📦</div>}
                  </td>
                  <td>
                    <strong>{p.name}</strong>
                    <div className="muted small">{p.brand || '—'} {p.model ? `· ${p.model}` : ''}</div>
                  </td>
                  <td><span className="badge">{subName(p.subCategoryId)}</span></td>
                  <td>
                    {p.applyDiscount && p.discountPrice < p.price ? (
                      <>
                        <span className="price-old">{money(p.price)}</span> <strong>{money(p.discountPrice)}</strong>
                      </>
                    ) : money(p.price)}
                  </td>
                  <td>{p.stockQuantity > 0 ? p.stockQuantity : <span className="stock-out">0</span>}</td>
                  <td className="muted">{p.sku}</td>
                  <td>
                    <div className="row-actions">
                      <button className="btn btn-outline btn-sm" onClick={() => openEdit(p)}>Edit</button>
                      <button className="btn btn-danger btn-sm" onClick={() => remove(p)}>Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Modal open={modalOpen} title={editing ? 'Edit product' : 'New product'} onClose={() => setModalOpen(false)} wide>
        <div className="form-row">
          <Field label="Name" value={form.name} onChange={(v) => setForm((f) => ({ ...f, name: v }))} required />
          <Field label="SKU" value={form.sku} onChange={(v) => setForm((f) => ({ ...f, sku: v }))} required placeholder="IP15-001" />
        </div>
        <label className="field">
          <span className="field-label">Description</span>
          <textarea
            className="input"
            value={form.description}
            onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
          />
        </label>
        <div className="form-row">
          <Field label="Price (EGP)" type="number" min="0.01" step="0.01" value={String(form.price)} onChange={(v) => setForm((f) => ({ ...f, price: Number(v) }))} required />
          <Field label="Stock quantity" type="number" min="0" value={String(form.stockQuantity)} onChange={(v) => setForm((f) => ({ ...f, stockQuantity: Number(v) }))} required />
        </div>
        <div className="form-row">
          <Field label="Brand" value={form.brand} onChange={(v) => setForm((f) => ({ ...f, brand: v }))} />
          <Field label="Model" value={form.model} onChange={(v) => setForm((f) => ({ ...f, model: v }))} />
        </div>
        <SelectField
          label="Subcategory"
          value={form.subCategoryId}
          onChange={(v) => setForm((f) => ({ ...f, subCategoryId: v }))}
          options={subs.map((s) => ({ value: s.id, label: s.name }))}
          required
          placeholder="Choose a subcategory"
        />
        <div className="form-row">
          <CheckField label="Physical product" checked={form.isPhysical} onChange={(v) => setForm((f) => ({ ...f, isPhysical: v }))} />
          <CheckField label="Apply discount" checked={form.applyDiscount} onChange={(v) => setForm((f) => ({ ...f, applyDiscount: v }))} />
        </div>
        {form.applyDiscount && (
          <div className="form-row">
            <Field label="Discount %" type="number" min="0" max="100" value={String(form.discountPercent)} onChange={(v) => setForm((f) => ({ ...f, discountPercent: Number(v) }))} />
            <Field label="Discounted price" type="number" min="0" step="0.01" value={String(form.discountPrice)} onChange={(v) => setForm((f) => ({ ...f, discountPrice: Number(v) }))} />
          </div>
        )}
        <FileField label={editing ? 'Replace image (optional)' : 'Product image (optional)'} file={image} onChange={setImage} />
        {editing && form.imageUrl && !image && (
          <p className="small muted">Current image: <code>{form.imageUrl}</code> — kept unless you upload a new one.</p>
        )}
        <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
          <button className="btn btn-ghost" onClick={() => setModalOpen(false)}>Cancel</button>
          <button className="btn btn-primary" disabled={busy || !valid} onClick={save}>
            {busy ? 'Saving…' : 'Save product'}
          </button>
        </div>
      </Modal>
    </div>
  );
}
