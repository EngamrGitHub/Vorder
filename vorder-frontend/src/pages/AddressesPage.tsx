import { useCallback, useEffect, useState, type FormEvent } from 'react';
import { addressApi } from '../api/address';
import { useToast } from '../context/ToastContext';
import { ErrorBox, Field, EmptyState, Spinner } from '../components/ui';
import type { AddressDto } from '../api/types';

const TYPES = ['Home', 'Work', 'Other'];

export default function AddressesPage() {
  const [items, setItems] = useState<AddressDto[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [form, setForm] = useState({
    addressType: TYPES[0],
    addressLine1: '',
    addressLine2: '',
    city: '',
    province: '',
    country: 'Egypt',
    postalCode: '',
  });
  const { push } = useToast();

  const load = useCallback(async () => {
    const res = await addressApi.getUserAddresses();
    if (res.isSuccess && res.result) setItems(res.result);
    else {
      setError(res.errorMsg ?? 'Failed to load addresses');
      setItems([]);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const set = (k: keyof typeof form) => (v: string) => setForm((f) => ({ ...f, [k]: v }));

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError(null);
    const res = await addressApi.addAddress({
      addressType: form.addressType,
      addressLine1: form.addressLine1.trim(),
      addressLine2: form.addressLine2.trim() || undefined,
      city: form.city.trim(),
      province: form.province.trim() || undefined,
      country: form.country.trim(),
      postalCode: form.postalCode.trim() || undefined,
    });
    setBusy(false);
    if (res.isSuccess) {
      push('success', 'Address saved');
      setForm((f) => ({ ...f, addressLine1: '', addressLine2: '', city: '', province: '', postalCode: '' }));
      await load();
    } else setError(res.errorMsg ?? 'Could not save address');
  };

  return (
    <>
      <div className="page-head">
        <div>
          <h1>Your addresses</h1>
          <p>Saved addresses speed up checkout</p>
        </div>
      </div>

      <ErrorBox message={error} />

      <div className="grid grid-2" style={{ alignItems: 'start' }}>
        <div>
          {!items && <Spinner label="Loading addresses…" />}
          {items && items.length === 0 && (
            <div className="card">
              <EmptyState icon="📍" title="No saved addresses" subtitle="Add one on the right." />
            </div>
          )}
          {items && items.length > 0 && (
            <div className="grid">
              {items.map((a) => (
                <div key={a.id} className="card card-pad">
                  <span className={`badge ${a.addressType === 'Home' ? 'badge-primary' : a.addressType === 'Work' ? 'badge-warning' : ''}`}>
                    {a.addressType}
                  </span>
                  <p style={{ margin: '8px 0 0', fontWeight: 600 }}>{a.addressLine1}</p>
                  {a.addressLine2 && <p className="muted" style={{ margin: 0 }}>{a.addressLine2}</p>}
                  <p className="muted" style={{ margin: 0 }}>
                    {a.city}{a.province ? `, ${a.province}` : ''} · {a.country}{a.postalCode ? ` (${a.postalCode})` : ''}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="card card-pad">
          <h3>Add address</h3>
          <form onSubmit={submit}>
            <Field label="Type" value={form.addressType} onChange={set('addressType')} />
            <Field label="Address line 1" value={form.addressLine1} onChange={set('addressLine1')} required placeholder="12 Tahrir St" />
            <Field label="Address line 2" value={form.addressLine2} onChange={set('addressLine2')} />
            <div className="form-row">
              <Field label="City" value={form.city} onChange={set('city')} required />
              <Field label="Province" value={form.province} onChange={set('province')} />
            </div>
            <div className="form-row">
              <Field label="Country" value={form.country} onChange={set('country')} required />
              <Field label="Postal code" value={form.postalCode} onChange={set('postalCode')} />
            </div>
            <button className="btn btn-primary" disabled={busy || !form.addressLine1.trim() || !form.city.trim()}>
              {busy ? 'Saving…' : 'Save address'}
            </button>
          </form>
        </div>
      </div>
    </>
  );
}
