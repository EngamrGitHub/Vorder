import { useCallback, useEffect, useState } from 'react';
import { categoryApi, type CategoryInput } from '../../api/category';
import { ErrorBox, Field, CheckField, Modal, EmptyState, Spinner } from '../ui';
import type { CategoryDto } from '../../api/types';

interface Props {
  shopId: string;
  onChanged: () => void;
}

export default function CategoriesTab({ shopId, onChanged }: Props) {
  const [items, setItems] = useState<CategoryDto[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<CategoryDto | null>(null);
  const [form, setForm] = useState<CategoryInput>({ name: '', description: '', appearsInHeader: false, isFeatured: false });
  const [busy, setBusy] = useState(false);

  const load = useCallback(async () => {
    const res = await categoryApi.getCategories(shopId);
    if (res.isSuccess && res.result) {
      setItems(res.result);
      setError(null);
    } else setError(res.errorMsg ?? 'Failed to load categories');
  }, [shopId]);

  useEffect(() => {
    void load();
  }, [load]);

  const openCreate = () => {
    setEditing(null);
    setForm({ name: '', description: '', appearsInHeader: false, isFeatured: false });
    setModalOpen(true);
  };

  const openEdit = (c: CategoryDto) => {
    setEditing(c);
    setForm({
      name: c.name,
      nameAr: c.nameAr ?? '',
      description: c.description ?? '',
      appearsInHeader: c.appearsInHeader,
      isFeatured: c.isFeatured,
    });
    setModalOpen(true);
  };

  const save = async () => {
    setBusy(true);
    const input: CategoryInput = {
      name: form.name.trim(),
      nameAr: form.nameAr || undefined,
      description: form.description || undefined,
      appearsInHeader: form.appearsInHeader,
      isFeatured: form.isFeatured,
    };
    const res = editing
      ? await categoryApi.updateCategory(editing.id, input)
      : await categoryApi.createCategory(input, shopId);
    setBusy(false);
    if (res.isSuccess) {
      setModalOpen(false);
      await load();
      onChanged();
    } else {
      setError(res.errorMsg ?? 'Save failed');
    }
  };

  const remove = async (c: CategoryDto) => {
    if (!window.confirm(`Delete category "${c.name}"? Its subcategories and products will also be removed.`)) return;
    const res = await categoryApi.deleteCategory(c.id);
    if (res.isSuccess) {
      await load();
      onChanged();
    } else setError(res.errorMsg ?? 'Delete failed');
  };

  return (
    <div>
      <div className="flex-between" style={{ marginBottom: 14 }}>
        <span className="muted small">{items ? `${items.length} categories` : ''}</span>
        <button className="btn btn-primary btn-sm" onClick={openCreate}>+ New category</button>
      </div>
      <ErrorBox message={error} />

      {!items && <Spinner label="Loading categories…" />}
      {items && items.length === 0 && (
        <EmptyState icon="🗂️" title="No categories" subtitle="Create your first category to start organizing products." />
      )}

      {items && items.length > 0 && (
        <div className="card table-wrap">
          <table className="table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Description</th>
                <th>Flags</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {items.map((c) => (
                <tr key={c.id}>
                  <td><strong>{c.name}</strong>{c.nameAr ? <span className="muted"> · {c.nameAr}</span> : null}</td>
                  <td className="muted">{c.description || '—'}</td>
                  <td>
                    <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap' }}>
                      {c.isFeatured && <span className="badge badge-warning">Featured</span>}
                      {c.appearsInHeader && <span className="badge badge-primary">Header</span>}
                    </div>
                  </td>
                  <td>
                    <div className="row-actions">
                      <button className="btn btn-outline btn-sm" onClick={() => openEdit(c)}>Edit</button>
                      <button className="btn btn-danger btn-sm" onClick={() => remove(c)}>Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Modal open={modalOpen} title={editing ? 'Edit category' : 'New category'} onClose={() => setModalOpen(false)}>
        <Field label="Name" value={form.name} onChange={(v) => setForm((f) => ({ ...f, name: v }))} required />
        <Field label="Name (Arabic)" value={form.nameAr ?? ''} onChange={(v) => setForm((f) => ({ ...f, nameAr: v }))} />
        <label className="field">
          <span className="field-label">Description</span>
          <textarea
            className="input"
            value={form.description ?? ''}
            onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
          />
        </label>
        <CheckField
          label="Show in shop header"
          checked={form.appearsInHeader ?? false}
          onChange={(v) => setForm((f) => ({ ...f, appearsInHeader: v }))}
        />
        <CheckField
          label="Featured on homepage"
          checked={form.isFeatured ?? false}
          onChange={(v) => setForm((f) => ({ ...f, isFeatured: v }))}
        />
        <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
          <button className="btn btn-ghost" onClick={() => setModalOpen(false)}>Cancel</button>
          <button className="btn btn-primary" disabled={busy || !form.name.trim()} onClick={save}>
            {busy ? 'Saving…' : 'Save'}
          </button>
        </div>
      </Modal>
    </div>
  );
}
