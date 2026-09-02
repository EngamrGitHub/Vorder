import { useEffect, useRef, useState, type ChangeEvent, type ReactNode } from 'react';

export function Spinner({ label = 'Loading…' }: { label?: string }) {
  return (
    <div className="spinner-wrap">
      <div className="spinner" role="status" aria-label={label} />
      <span className="spinner-label">{label}</span>
    </div>
  );
}

export function ErrorBox({ message }: { message?: string | null }) {
  if (!message) return null;
  return <div className="alert alert-error">{message}</div>;
}

export function SuccessBox({ message }: { message?: string | null }) {
  if (!message) return null;
  return <div className="alert alert-success">{message}</div>;
}

interface FieldProps {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  placeholder?: string;
  required?: boolean;
  hint?: string;
  min?: string | number;
  max?: string | number;
  step?: string;
  disabled?: boolean;
}

export function Field({ label, value, onChange, type = 'text', placeholder, required, hint, min, max, step, disabled }: FieldProps) {
  return (
    <label className="field">
      <span className="field-label">
        {label} {required && <em className="req">*</em>}
      </span>
      <input
        className="input"
        type={type}
        value={value}
        placeholder={placeholder}
        required={required}
        min={min}
        max={max}
        step={step}
        disabled={disabled}
        onChange={(e: ChangeEvent<HTMLInputElement>) => onChange(e.target.value)}
      />
      {hint && <span className="field-hint">{hint}</span>}
    </label>
  );
}

interface SelectFieldProps {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
  required?: boolean;
  placeholder?: string;
  disabled?: boolean;
}

export function SelectField({ label, value, onChange, options, required, placeholder, disabled }: SelectFieldProps) {
  return (
    <label className="field">
      <span className="field-label">
        {label} {required && <em className="req">*</em>}
      </span>
      <select className="input" value={value} required={required} disabled={disabled} onChange={(e) => onChange(e.target.value)}>
        {placeholder && <option value="">{placeholder}</option>}
        {options.map((o) => (
          <option key={o.value} value={o.value}>{o.label}</option>
        ))}
      </select>
    </label>
  );
}

interface CheckFieldProps {
  label: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}

export function CheckField({ label, checked, onChange }: CheckFieldProps) {
  return (
    <label className="check-field">
      <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} />
      <span>{label}</span>
    </label>
  );
}

interface FileFieldProps {
  label: string;
  file: File | null;
  onChange: (f: File | null) => void;
  accept?: string;
}

export function FileField({ label, file, onChange, accept = 'image/png,image/jpeg,image/gif,image/bmp' }: FileFieldProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);

  useEffect(() => {
    if (file) {
      const url = URL.createObjectURL(file);
      setPreview(url);
      return () => URL.revokeObjectURL(url);
    }
    setPreview(null);
    return undefined;
  }, [file]);

  return (
    <div className="field">
      <span className="field-label">{label}</span>
      <div className="file-field">
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          onChange={(e) => onChange(e.target.files?.[0] ?? null)}
        />
        <button type="button" className="btn btn-outline btn-sm" onClick={() => inputRef.current?.click()}>
          {file ? 'Change file' : 'Choose file'}
        </button>
        <span className="file-name">{file ? file.name : 'PNG / JPG / GIF / BMP'}</span>
      </div>
      {preview && <img src={preview} alt="preview" className="image-preview" />}
    </div>
  );
}

interface ModalProps {
  open: boolean;
  title: string;
  onClose: () => void;
  children: ReactNode;
  wide?: boolean;
}

export function Modal({ open, title, onClose, children, wide }: ModalProps) {
  if (!open) return null;
  return (
    <div className="modal-backdrop" onMouseDown={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className={`modal ${wide ? 'modal-wide' : ''}`} role="dialog" aria-modal="true">
        <div className="modal-head">
          <h3>{title}</h3>
          <button className="modal-close" onClick={onClose} aria-label="Close">×</button>
        </div>
        <div className="modal-body">{children}</div>
      </div>
    </div>
  );
}

export function Stars({ value, onChange, readOnly = false }: { value: number; onChange?: (v: number) => void; readOnly?: boolean }) {
  return (
    <span className="stars">
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          key={n}
          type="button"
          disabled={readOnly}
          className={`star ${n <= value ? 'star-on' : ''}`}
          onClick={() => onChange?.(n)}
          aria-label={`${n} star${n > 1 ? 's' : ''}`}
        >
          ★
        </button>
      ))}
    </span>
  );
}

export function EmptyState({ icon = '📦', title, subtitle, children }: { icon?: string; title: string; subtitle?: string; children?: ReactNode }) {
  return (
    <div className="empty-state">
      <div className="empty-icon">{icon}</div>
      <h3>{title}</h3>
      {subtitle && <p>{subtitle}</p>}
      {children}
    </div>
  );
}

export const money = (v: number | null | undefined): string =>
  new Intl.NumberFormat('en-EG', { style: 'currency', currency: 'EGP', maximumFractionDigits: 2 }).format(Number(v ?? 0));

export const dateFmt = (v?: string | null): string =>
  v ? new Date(v).toLocaleString('en-GB', { dateStyle: 'medium', timeStyle: 'short' }) : '—';
