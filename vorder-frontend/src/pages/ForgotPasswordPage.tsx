import { useState, type FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { authApi } from '../api/auth';
import { ErrorBox, Field, SuccessBox } from '../components/ui';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [okMsg, setOkMsg] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setOkMsg(null);
    setBusy(true);
    const res = await authApi.forgotPassword(email.trim());
    setBusy(false);
    if (res.isSuccess) {
      setOkMsg('Reset code sent — check your email (or the API console log in development).');
    } else {
      setError(res.errorMsg ?? 'Request failed');
    }
  };

  return (
    <div className="auth-wrap card card-pad">
      <h1>Forgot password</h1>
      <p className="auth-sub">We'll send a reset code to your email</p>
      <ErrorBox message={error} />
      <SuccessBox message={okMsg} />
      <form onSubmit={submit}>
        <Field label="Email" type="email" value={email} onChange={setEmail} required placeholder="you@example.com" />
        <button className="btn btn-primary btn-block" disabled={busy || !email}>
          {busy ? 'Sending…' : 'Send reset code'}
        </button>
      </form>
      {okMsg && (
        <p className="auth-alt">
          Got the code? <Link to="/reset-password">Reset password</Link>
        </p>
      )}
      <p className="auth-alt">
        <Link to="/login">Back to login</Link>
      </p>
    </div>
  );
}
