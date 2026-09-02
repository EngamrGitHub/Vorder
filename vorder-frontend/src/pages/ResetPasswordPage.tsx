import { useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authApi } from '../api/auth';
import { useToast } from '../context/ToastContext';
import { ErrorBox, Field } from '../components/ui';

export default function ResetPasswordPage() {
  const [form, setForm] = useState({ email: '', code: '', password: '', confirm: '' });
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const { push } = useToast();
  const navigate = useNavigate();

  const set = (k: keyof typeof form) => (v: string) => setForm((f) => ({ ...f, [k]: v }));

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    if (form.password !== form.confirm) {
      setError('Passwords do not match');
      return;
    }
    setBusy(true);
    const res = await authApi.resetPassword(form.email.trim(), form.code.trim(), form.password);
    setBusy(false);
    if (res.isSuccess) {
      push('success', 'Password reset — log in with your new password');
      navigate('/login');
    } else {
      setError(res.errorMsg ?? 'Reset failed');
    }
  };

  return (
    <div className="auth-wrap card card-pad">
      <h1>Reset password</h1>
      <p className="auth-sub">Enter the code we emailed you plus your new password</p>
      <ErrorBox message={error} />
      <form onSubmit={submit}>
        <Field label="Email" type="email" value={form.email} onChange={set('email')} required />
        <Field label="Reset code" value={form.code} onChange={set('code')} required placeholder="123456" />
        <div className="form-row">
          <Field label="New password" type="password" value={form.password} onChange={set('password')} required />
          <Field label="Confirm password" type="password" value={form.confirm} onChange={set('confirm')} required />
        </div>
        <button className="btn btn-primary btn-block" disabled={busy}>
          {busy ? 'Resetting…' : 'Reset password'}
        </button>
      </form>
      <p className="auth-alt">
        <Link to="/login">Back to login</Link>
      </p>
    </div>
  );
}
