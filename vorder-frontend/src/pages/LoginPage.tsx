import { useEffect, useRef, useState, type FormEvent } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { authApi } from '../api/auth';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { useLanguage } from '../context/LanguageContext';
import { ErrorBox, Field } from '../components/ui';

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || '';

declare global {
  interface Window {
    google?: any;
  }
}

export default function LoginPage() {
  const { lang } = useLanguage();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [googleBusy, setGoogleBusy] = useState(false);
  const [showGoogleSetup, setShowGoogleSetup] = useState(false);

  const { signIn } = useAuth();
  const { push } = useToast();
  const navigate = useNavigate();
  const location = useLocation() as { state?: { from?: string } };
  const googleBtnRef = useRef<HTMLDivElement>(null);

  // Initialize official Google Identity Services
  useEffect(() => {
    if (!GOOGLE_CLIENT_ID) return;

    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    script.onload = () => {
      if (window.google?.accounts?.id) {
        window.google.accounts.id.initialize({
          client_id: GOOGLE_CLIENT_ID,
          callback: async (response: { credential?: string }) => {
            if (response.credential) {
              await handleGoogleToken(response.credential);
            }
          },
        });

        // Automatically prompt Google One Tap on page load
        window.google.accounts.id.prompt();

        // Render native Google Sign-in button
        if (googleBtnRef.current) {
          window.google.accounts.id.renderButton(googleBtnRef.current, {
            theme: 'outline',
            size: 'large',
            width: 380,
            text: 'continue_with',
            shape: 'pill',
            locale: lang === 'ar' ? 'ar' : 'en',
          });
        }
      }
    };
    document.body.appendChild(script);

    return () => {
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, [lang]);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setBusy(true);
    try {
      const res = await authApi.login(email.trim(), password);
      if (res.isSuccess && res.result) {
        signIn(res.result.token, res.result.refreshToken);
        push('success', lang === 'ar' ? 'تم تسجيل الدخول بنجاح!' : 'Welcome back!');
        navigate(location.state?.from ?? '/', { replace: true });
      } else {
        setError(res.errorMsg ?? (lang === 'ar' ? 'فشل تسجيل الدخول، تأكد من صحة البريد وكلمة المرور' : 'Invalid email or password'));
      }
    } catch {
      setError(lang === 'ar' ? 'تعذر الاتصال بالخادم، يرجى المحاولة لاحقاً' : 'Network error');
    } finally {
      setBusy(false);
    }
  };

  const handleGoogleToken = async (idToken: string) => {
    setError(null);
    setGoogleBusy(true);
    try {
      const res = await authApi.googleLogin(idToken.trim());
      if (res.isSuccess && res.result) {
        signIn(res.result.token, res.result.refreshToken);
        push('success', lang === 'ar' ? 'تم تسجيل الدخول بحساب Google بنجاح' : 'Signed in with Google');
        navigate('/', { replace: true });
      } else {
        setError(res.errorMsg ?? (lang === 'ar' ? 'فشل التحقق من حساب Google' : 'Google sign-in failed'));
      }
    } catch {
      setError(lang === 'ar' ? 'حدث خطأ أثناء الاتصال بحساب Google' : 'Google sign-in error');
    } finally {
      setGoogleBusy(false);
    }
  };

  const handleGoogleClick = () => {
    if (GOOGLE_CLIENT_ID && window.google?.accounts?.id) {
      window.google.accounts.id.prompt();
    } else {
      // No Client ID configured — show inline setup instructions
      setShowGoogleSetup(true);
      push(
        'info',
        lang === 'ar'
          ? 'تسجيل الدخول بـ Google يحتاج إعداد Google Client ID أولاً'
          : 'Google sign-in needs a Google Client ID configured first',
      );
    }
  };

  return (
    <div className="auth-wrap card card-pad">
      <div style={{ textAlign: 'center', marginBottom: 24 }}>
        <img
          src="/logo.png"
          alt="Vorder"
          style={{ width: 56, height: 56, borderRadius: 12, objectFit: 'contain', margin: '0 auto' }}
        />
        <h1 style={{ marginTop: 12, fontSize: 24 }}>
          {lang === 'ar' ? 'تسجيل الدخول' : 'Log in'}
        </h1>
        <p className="auth-sub" style={{ margin: '4px 0 0' }}>
          {lang === 'ar' ? 'أهلاً بك مجدداً في منصة ووكالة فوردر' : 'Welcome back to Vorder'}
        </p>
      </div>

      <ErrorBox message={error} />

      {/* Primary Email & Password Form */}
      <form onSubmit={submit}>
        <Field
          label={lang === 'ar' ? 'البريد الإلكتروني' : 'Email'}
          type="email"
          value={email}
          onChange={setEmail}
          required
          placeholder="you@example.com"
        />
        <Field
          label={lang === 'ar' ? 'كلمة المرور' : 'Password'}
          type="password"
          value={password}
          onChange={setPassword}
          required
          placeholder="••••••••"
        />

        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 16 }}>
          <Link
            to="/forgot-password"
            style={{ color: 'var(--primary)', fontWeight: 700, fontSize: 13, textDecoration: 'none' }}
          >
            {lang === 'ar' ? 'هل نسيت كلمة المرور؟' : 'Forgot password?'}
          </Link>
        </div>

        <button
          type="submit"
          className="btn btn-primary btn-block btn-lg"
          disabled={busy || !email || !password}
        >
          {busy
            ? lang === 'ar'
              ? 'جاري التحقق…'
              : 'Signing in…'
            : lang === 'ar'
            ? 'تسجيل الدخول'
            : 'Log in'}
        </button>
      </form>

      <div className="divider">
        {lang === 'ar' ? 'أو' : 'OR'}
      </div>

      {/* Official 1-Click Google Sign-In */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10 }}>
        {/* Google GSI button iframe rendered here when Client ID exists */}
        <div ref={googleBtnRef} style={{ width: '100%', display: GOOGLE_CLIENT_ID ? 'flex' : 'none', justifyContent: 'center' }}></div>

        {/* Clean Standard Google Button */}
        <button
          type="button"
          className="btn btn-outline btn-block"
          style={{
            display: GOOGLE_CLIENT_ID ? 'none' : 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 12,
            height: 48,
            borderColor: 'var(--border)',
            background: '#fff',
            fontWeight: 700,
            fontSize: 14.5,
          }}
          disabled={googleBusy}
          onClick={handleGoogleClick}
        >
          <svg width="20" height="20" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"
            />
            <path
              fill="#34A853"
              d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z"
            />
            <path
              fill="#FBBC05"
              d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 10.03 0 12s.45 3.82 1.25 5.42l4.03-3.15z"
            />
            <path
              fill="#EA4335"
              d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
            />
          </svg>
          <span>
            {googleBusy
              ? lang === 'ar'
                ? 'جاري التحقق…'
                : 'Connecting…'
              : lang === 'ar'
              ? 'المتابعة باستخدام Google'
              : 'Continue with Google'}
          </span>
        </button>

        {/* Setup instructions when no Client ID is configured */}
        {showGoogleSetup && !GOOGLE_CLIENT_ID && (
          <div
            className="alert alert-info"
            style={{ width: '100%', textAlign: 'start', marginTop: 6 }}
          >
            <strong>{lang === 'ar' ? 'تفعيل تسجيل الدخول بـ Google:' : 'Enable Google sign-in:'}</strong>
            <ol style={{ margin: '8px 0 0', paddingInlineStart: 20, fontWeight: 500 }}>
              <li>
                {lang === 'ar' ? 'افتح' : 'Open'}{' '}
                <a href="https://console.cloud.google.com/apis/credentials" target="_blank" rel="noreferrer" style={{ color: 'var(--primary)', fontWeight: 700 }}>
                  Google Cloud Console → Credentials
                </a>
              </li>
              <li>
                {lang === 'ar'
                  ? 'أنشئ OAuth Client ID من نوع Web application'
                  : 'Create an OAuth Client ID of type "Web application"'}
              </li>
              <li>
                {lang === 'ar' ? 'أضف' : 'Add'}{' '}
                <code>http://localhost:5173</code>{' '}
                {lang === 'ar' ? 'في Authorized JavaScript origins' : 'to Authorized JavaScript origins'}
              </li>
              <li>
                {lang === 'ar' ? 'انسخ الـ Client ID في' : 'Paste the Client ID in'}{' '}
                <code>.env</code>{' '}
                {lang === 'ar' ? 'عند' : 'at'} <code>VITE_GOOGLE_CLIENT_ID</code>
                {lang === 'ar' ? ' ثم أعد تشغيل npm run dev' : ' then restart the dev server'}
              </li>
            </ol>
          </div>
        )}
      </div>

      <p className="auth-alt" style={{ marginTop: 24 }}>
        {lang === 'ar' ? 'ليس لديك حساب؟' : "Don't have an account?"}{' '}
        <Link to="/register">
          {lang === 'ar' ? 'إنشاء حساب جديد' : 'Create one'}
        </Link>
      </p>
    </div>
  );
}
