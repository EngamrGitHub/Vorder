import { useCallback, useEffect, useState } from 'react';
import { subCategoryApi, type SubCategoryInput } from '../../api/subcategory';
import { categoryApi } from '../../api/category';
import { ErrorBox, Field, SelectField, Modal, EmptyState, Spinner } from '../ui';
import type { CategoryDto, SubCategoryDto } from '../../api/types';

interface Props {
  shopId: string;
  onChanged: () => void;
}

export default function SubCategoriesTab({ shopId, onChanged }: Props) {
  const [subs, setSubs] = useState<SubCategoryDto[] | null>(null);
  const [cats, setCats] = useState<CategoryDto[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<SubCategoryDto | null>(null);
  const [form, setForm] = useState<SubCategoryInput>({ categoryId: '', name: '' });
  const [busy, setBusy] = useState(false);

  const load = useCallback(async () => {
    const [subsRes, catsRes] = await Promise.all([
      subCategoryApi.getSubCategories(shopId),
      categoryApi.getCategories(shopId),
    ]);
    if (subsRes.isSuccess && subsRes.result) setSubs(subsRes.result);
    else setError(subsRes.errorMsg ?? 'Failed to load subcategories');
    if (catsRes.isSuccess && catsRes.result) setCats(catsRes.result);
  }, [shopId]);

  useEffect(() => {
    void load();
  }, [load]);

  const catName = (id: string) => cats.find((c) => c.id === id)?.name ?? '—';

  const openCreate = () => {
    setEditing(null);
    setForm({ categoryId: cats[0]?.id ?? '', name: '' });
    setModalOpen(true);
  };

  const openEdit = (s: SubCategoryDto) => {
    setEditing(s);
    setForm({ categoryId: s.categoryId, name: s.name, nameAr: s.nameAr ?? '', description: s.description ?? '' });
    setModalOpen(true);
  };

  const save = async () => {
    setBusy(true);
    const input: SubCategoryInput = {
      categoryId: form.categoryId,
      name: form.name.trim(),
      nameAr: form.nameAr || undefined,
      description: form.description || undefined,
    };
    const res = editing
      ? await subCategoryApi.updateSubCategory(editing.id, input)
      : await subCategoryApi.createSubCategory(input, shopId);
    setBusy(false);
    if (res.isSuccess) {
      setModalOpen(false);
      await load();
      onChanged();
    } else setError(res.errorMsg ?? 'Save failed');
  };

  const remove = async (s: SubCategoryDto) => {
    if (!window.confirm(`Delete subcategory "${s.name}"? Its products will also be removed.`)) return;
    const res = await subCategoryApi.deleteSubCategory(s.id);
    if (res.isSuccess) {
      await load();
      onChanged();
    } else setError(res.errorMsg ?? 'Delete failed');
  };

  return (
    <div>
      <div className="flex-between" style={{ marginBottom: 14 }}>
        <span className="muted small">{subs ? `${subs.length} subcategories` : ''}</span>
        <button className="btn btn-primary btn-sm" onClick={openCreate} disabled={cats.length === 0}>+ New subcategory</button>
      </div>
      {cats.length === 0 && (
        <div className="alert alert-info">Create a category first — subcategories belong to a parent category.</div>
      )}
      <ErrorBox message={error} />

      {!subs && <Spinner label="Loading subcategories…" />}
      {subs && subs.length === 0 && (
        <EmptyState icon="🏷️" title="No subcategories" subtitle="Group products inside categories (e.g. Phones inside Electronics)." />
      )}

      {subs && subs.length > 0 && (
        <div className="card table-wrap">
          <table className="table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Parent category</th>
                <th>Description</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {subs.map((s) => (
                <tr key={s.id}>
                  <td><strong>{s.name}</strong></td>
                  <td><span className="badge">{catName(s.categoryId)}</span></td>
                  <td className="muted">{s.description || '—'}</td>
                  <td>
                    <div className="row-actions">
                      <button className="btn btn-outline btn-sm" onClick={() => openEdit(s)}>Edit</button>
                      <button className="btn btn-danger btn-sm" onClick={() => remove(s)}>Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Modal open={modalOpen} title={editing ? 'Edit subcategory' : 'New subcategory'} onClose={() => setModalOpen(false)}>
        <SelectField
          label="Parent category"
          value={form.categoryId}
          onChange={(v) => setForm((f) => ({ ...f, categoryId: v }))}
          options={cats.map((c) => ({ value: c.id, label: c.name }))}
          required
        />
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
        <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
          <button className="btn btn-ghost" onClick={() => setModalOpen(false)}>Cancel</button>
          <button className="btn btn-primary" disabled={busy || !form.name.trim() || !form.categoryId} onClick={save}>
            {busy ? 'Saving…' : 'Save'}
          </button>
        </div>
      </Modal>
    </div>
  );
}
