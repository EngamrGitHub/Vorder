import { useEffect, useMemo, useState } from 'react';
import { shopApi, type ShopInput } from '../../api/shop';
import { ErrorBox, Field, FileField, Spinner } from '../ui';

interface Props {
  initial?: {
    name?: string | null;
    nameAr?: string | null;
    description?: string | null;
    city?: string | null;
    state?: string | null;
    country?: string | null;
    addressLine1?: string | null;
    postalCode?: string | null;
    website?: string | null;
    whatsappNumber?: string | null;
  };
  busy: boolean;
  error: string | null;
  submitLabel: string;
  onSubmit: (input: ShopInput) => void;
}

export default function ShopForm({ initial, busy, error, submitLabel, onSubmit }: Props) {
  const [name, setName] = useState(initial?.name ?? '');
  const [nameAr, setNameAr] = useState(initial?.nameAr ?? '');
  const [description, setDescription] = useState(initial?.description ?? '');
  const [addressLine1, setAddressLine1] = useState(initial?.addressLine1 ?? '');
  const [city, setCity] = useState(initial?.city ?? '');
  const [state_, setState_] = useState(initial?.state ?? '');
  const [country, setCountry] = useState(initial?.country ?? 'Egypt');
  const [postalCode, setPostalCode] = useState(initial?.postalCode ?? '');
  const [website, setWebsite] = useState(initial?.website ?? '');
  const [whatsapp, setWhatsapp] = useState(initial?.whatsappNumber ?? '');
  const [logo, setLogo] = useState<File | null>(null);
  const [banner, setBanner] = useState<File | null>(null);
  const [favicon, setFavicon] = useState<File | null>(null);

  const valid = useMemo(() => name.trim().length > 0, [name]);

  useEffect(() => {
    setName(initial?.name ?? '');
    setNameAr(initial?.nameAr ?? '');
    setDescription(initial?.description ?? '');
    setCity(initial?.city ?? '');
    setCountry(initial?.country ?? 'Egypt');
    setWebsite(initial?.website ?? '');
    setWhatsapp(initial?.whatsappNumber ?? '');
  }, [initial]);

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        if (!busy && valid) {
          onSubmit({
            name: name.trim(),
            nameAr: nameAr || undefined,
            description: description || undefined,
            addressLine1: addressLine1 || undefined,
            city: city || undefined,
            state: state_ || undefined,
            country: country || undefined,
            postalCode: postalCode || undefined,
            website: website || undefined,
            whatsappNumber: whatsapp || undefined,
            logo,
            banner,
            favicon,
          });
        }
      }}
    >
      <ErrorBox message={error} />
      <Field label="Shop name" value={name} onChange={setName} required placeholder="Nile Store" />
      <div className="form-row">
        <Field label="Name (Arabic)" value={nameAr} onChange={setNameAr} placeholder="متجر النيل" />
        <Field label="WhatsApp number" value={whatsapp} onChange={setWhatsapp} placeholder="+20 100 000 0000" />
      </div>
      <label className="field">
        <span className="field-label">Description</span>
        <textarea className="input" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="What does your shop sell?" />
      </label>
      <div className="form-row">
        <Field label="Address line" value={addressLine1} onChange={setAddressLine1} placeholder="12 Tahrir St" />
        <Field label="City" value={city} onChange={setCity} placeholder="Cairo" />
      </div>
      <div className="form-row">
        <Field label="State / Governorate" value={state_} onChange={setState_} />
        <Field label="Country" value={country} onChange={setCountry} />
      </div>
      <div className="form-row">
        <Field label="Postal code" value={postalCode} onChange={setPostalCode} />
        <Field label="Website" value={website} onChange={setWebsite} placeholder="https://…" />
      </div>

      <div className="form-row">
        <FileField label="Logo" file={logo} onChange={setLogo} />
        <FileField label="Banner" file={banner} onChange={setBanner} />
      </div>
      <FileField label="Favicon" file={favicon} onChange={setFavicon} />

      <button className="btn btn-primary" type="submit" disabled={busy || !valid} style={{ marginTop: 6 }}>
        {busy ? <Spinner label="" /> : submitLabel}
      </button>
    </form>
  );
}
