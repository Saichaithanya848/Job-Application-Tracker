import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Alert from '../components/Alert';
import { Briefcase, ArrowRight } from 'lucide-react';

/**
 * Login Page Component
 */
const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Please enter both email and password.');
      return;
    }

    setLoading(true);
    const result = await login(email, password);
    setLoading(false);

    if (result.success) {
      navigate('/dashboard');
    } else {
      setError(result.message);
    }
  };

  // Quick fill demo user for easy testing
  const handleFillDemo = () => {
    setEmail('alex.dev@example.com');
    setPassword('password123');
    setError('');
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        {/* Brand Header */}
        <div className="auth-header">
          <div
            style={{
              display: 'inline-flex',
              padding: '0.6rem',
              backgroundColor: 'var(--primary-light)',
              borderRadius: 'var(--radius-md)',
              color: 'var(--primary)',
              marginBottom: '0.75rem',
            }}
          >
            <Briefcase size={28} />
          </div>
          <h1 className="auth-title">Welcome Back</h1>
          <p className="auth-subtitle">Log in to track and manage your job applications</p>
        </div>

        {error && <Alert type="error" message={error} onClose={() => setError('')} />}

        {/* Login Form */}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label" htmlFor="email">
              Email Address
            </label>
            <input
              id="email"
              type="email"
              className="form-input"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoFocus
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="password">
              Password
            </label>
            <input
              id="password"
              type="password"
              className="form-input"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            style={{ width: '100%', marginTop: '0.5rem' }}
            disabled={loading}
          >
            {loading ? 'Signing in...' : 'Sign In'}
            {!loading && <ArrowRight size={16} />}
          </button>
        </form>

        {/* Quick Demo Login Box */}
        <div className="demo-account-box">
          <div className="demo-account-header">
            <span>Demo Account:</span>
            <button
              type="button"
              className="btn-fill-demo"
              onClick={handleFillDemo}
            >
              Fill Demo Credentials
            </button>
          </div>
          <div style={{ color: 'var(--text-muted)' }}>
            <code>alex.dev@example.com</code> / <code>password123</code>
          </div>
        </div>

        {/* Footer */}
        <div className="auth-footer">
          Don't have an account?{' '}
          <Link to="/register" className="auth-link">
            Create an account
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
