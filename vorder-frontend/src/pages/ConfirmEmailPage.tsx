import { useEffect, useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authApi } from '../api/auth';
import { STORAGE_KEYS } from '../api/client';
import { useToast } from '../context/ToastContext';
import { ErrorBox, Field, SuccessBox } from '../components/ui';

interface Pending {
  userId: string;
  email: string;
}

export default function ConfirmEmailPage() {
  const [pending, setPending] = useState<Pending | null>(null);
  const [code, setCode] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [okMsg, setOkMsg] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [resendBusy, setResendBusy] = useState(false);
  const { push } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.pending);
      if (raw) setPending(JSON.parse(raw) as Pending);
    } catch {
      setPending(null);
    }
  }, []);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!pending) {
      setError('Missing registration info — please register first.');
      return;
    }
    setBusy(true);
    const res = await authApi.confirmEmail(pending.userId, code.trim());
    setBusy(false);
    if (res.isSuccess) {
      localStorage.removeItem(STORAGE_KEYS.pending);
      push('success', 'Email confirmed — you can log in now');
      navigate('/login');
    } else {
      setError(res.errorMsg ?? 'Confirmation failed');
    }
  };

  const resend = async () => {
    if (!pending) return;
    setResendBusy(true);
    const res = await authApi.resendConfirmation(pending.email);
    setResendBusy(false);
    if (res.isSuccess) setOkMsg('A new confirmation code was sent (check the API console log in development).');
    else setError(res.errorMsg ?? 'Could not resend the code');
  };

  return (
    <div className="auth-wrap card card-pad">
      <h1>Confirm your email</h1>
      <p className="auth-sub">
        {pending ? (
          <>We sent a 6-digit code to <strong>{pending.email}</strong></>
        ) : (
          'Enter your user ID and confirmation code'
        )}
      </p>
      <ErrorBox message={error} />
      <SuccessBox message={okMsg} />
      <form onSubmit={submit}>
        {!pending && (
          <>
            <Field label="User ID" value={code} onChange={setCode} placeholder="—" disabled />
            <p className="small muted" style={{ marginTop: -8 }}>
              Register first so we can store your user ID, or paste the code below after registering.
            </p>
          </>
        )}
        <Field
          label="Confirmation code"
          value={code}
          onChange={setCode}
          required
          placeholder="123456"
          hint="In development the email body (with the code) is printed in the API console."
        />
        <button className="btn btn-primary btn-block" disabled={busy || code.trim().length < 4}>
          {busy ? 'Confirming…' : 'Confirm email'}
        </button>
      </form>
      {pending && (
        <button className="btn btn-ghost btn-block" style={{ marginTop: 10 }} onClick={resend} disabled={resendBusy}>
          {resendBusy ? 'Sending…' : 'Resend code'}
        </button>
      )}
      <p className="auth-alt">
        Already confirmed? <Link to="/login">Log in</Link>
      </p>
    </div>
  );
}
