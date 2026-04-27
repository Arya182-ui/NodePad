import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { Mail, Lock, Eye, EyeOff, Loader2 } from 'lucide-react';
import './Auth.css';

export default function Login() {
  const { loginWithEmail, loginWithGoogle } = useAuth();
  const navigate = useNavigate();

  const [form, setForm]       = useState({ email: '', password: '' });
  const [show, setShow]       = useState(false);
  const [loading, setLoading] = useState(false);
  const [gLoading, setGLoad]  = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.email || !form.password) return toast.error('Fill all fields');
    try {
      setLoading(true);
      await loginWithEmail(form.email, form.password);
      navigate('/');
    } catch (err) {
      toast.error(friendlyError(err.code));
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = async () => {
    try {
      setGLoad(true);
      await loginWithGoogle();
      navigate('/');
    } catch (err) {
      toast.error('Google sign-in failed');
    } finally {
      setGLoad(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        {/* Logo */}
        <div className="auth-logo">
          <div className="auth-logo__icon">✦</div>
          <span className="auth-logo__text">NodePad</span>
        </div>

        <h1 className="auth-title">Welcome back</h1>
        <p className="auth-sub">Sign in to your workspace</p>

        {/* Google */}
        <button className="auth-google" onClick={handleGoogle} disabled={gLoading}>
          {gLoading ? <Loader2 size={18} className="spin" /> : (
            <svg width="18" height="18" viewBox="0 0 48 48">
              <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
              <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
              <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
              <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
            </svg>
          )}
          Continue with Google
        </button>

        <div className="auth-divider"><span>or</span></div>

        {/* Email form */}
        <form onSubmit={handleSubmit} className="auth-form">
          <div className="auth-field">
            <Mail size={16} className="auth-field__icon" />
            <input
              type="email"
              placeholder="Email address"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              autoComplete="email"
            />
          </div>

          <div className="auth-field">
            <Lock size={16} className="auth-field__icon" />
            <input
              type={show ? 'text' : 'password'}
              placeholder="Password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              autoComplete="current-password"
            />
            <button type="button" className="auth-field__toggle" onClick={() => setShow(!show)}>
              {show ? <EyeOff size={15} /> : <Eye size={15} />}
            </button>
          </div>

          <button type="submit" className="auth-submit" disabled={loading}>
            {loading ? <Loader2 size={16} className="spin" /> : 'Sign in'}
          </button>
        </form>

        <p className="auth-footer">
          Don't have an account? <Link to="/signup">Sign up</Link>
        </p>
      </div>
    </div>
  );
}

function friendlyError(code) {
  const map = {
    'auth/user-not-found':   'No account with this email',
    'auth/wrong-password':   'Incorrect password',
    'auth/invalid-email':    'Invalid email address',
    'auth/too-many-requests':'Too many attempts. Try later',
  };
  return map[code] || 'Sign in failed';
}
