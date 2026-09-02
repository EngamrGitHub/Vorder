import { useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authApi } from '../api/auth';
import { STORAGE_KEYS } from '../api/client';
import { ErrorBox, Field } from '../components/ui';

const PHONE_RE = /^01[0125]\d{8}$/;

export default function RegisterPage() {
  const [form, setForm] = useState({ fullName: '', email: '', phone: '', password: '', confirm: '' });
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const navigate = useNavigate();

  const set = (k: keyof typeof form) => (v: string) => setForm((f) => ({ ...f, [k]: v }));

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    if (form.password !== form.confirm) {
      setError('Passwords do not match');
      return;
    }
    if (!PHONE_RE.test(form.phone)) {
      setError('Phone must be a valid Egyptian number (e.g. 01012345678)');
      return;
    }
    setBusy(true);
    const res = await authApi.register({
      fullName: form.fullName.trim(),
      email: form.email.trim(),
      password: form.password,
      confirmPassword: form.confirm,
      phoneNumber: form.phone,
    });
    setBusy(false);
    if (res.isSuccess && res.result) {
      localStorage.setItem(
        STORAGE_KEYS.pending,
        JSON.stringify({ userId: res.result.id, email: res.result.email }),
      );
      navigate('/confirm-email');
    } else {
      setError(res.errorMsg ?? 'Registration failed');
    }
  };

  return (
    <div className="auth-wrap card card-pad">
      <h1>Create account</h1>
      <p className="auth-sub">Register as a customer — you can open your own shop afterwards</p>
      <ErrorBox message={error} />
      <form onSubmit={submit}>
        <Field label="Full name" value={form.fullName} onChange={set('fullName')} required placeholder="John Doe" />
        <Field label="Email" type="email" value={form.email} onChange={set('email')} required placeholder="you@example.com" />
        <Field
          label="Phone number"
          value={form.phone}
          onChange={set('phone')}
          required
          placeholder="01012345678"
          hint="Egyptian format: 010 / 011 / 012 / 015 + 8 digits"
        />
        <div className="form-row">
          <Field label="Password" type="password" value={form.password} onChange={set('password')} required hint="Min 8 chars, upper/lower/digit/symbol" />
          <Field label="Confirm password" type="password" value={form.confirm} onChange={set('confirm')} required />
        </div>
        <button className="btn btn-primary btn-block" disabled={busy}>
          {busy ? 'Creating account…' : 'Create account'}
        </button>
      </form>
      <p className="auth-alt">
        Already registered? <Link to="/login">Log in</Link>
      </p>
    </div>
  );
}
