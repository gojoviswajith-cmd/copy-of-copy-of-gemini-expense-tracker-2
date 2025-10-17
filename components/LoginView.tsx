import React, { useState } from 'react';
import { LogoIcon } from './icons';
import { useAuth } from '../contexts/AuthContext';

const LoginView: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const { signUp, signIn } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setMessage(null);

    if (!email || !password) {
      setError('Please enter both email and password.');
      setLoading(false);
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long.');
      setLoading(false);
      return;
    }

    try {
      if (isSignUp) {
        const { error } = await signUp(email, password);
        if (error) {
          setError(error.message);
        } else {
          setMessage('Account created successfully! Please sign in.');
          setIsSignUp(false);
          setPassword('');
        }
      } else {
        const { error } = await signIn(email, password);
        if (error) {
          setError(error.message);
        }
      }
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--background-muted)] p-4 font-sans">
      <div className="w-full max-w-sm">
        <div className="bg-[var(--card-background)] shadow-2xl rounded-2xl p-8">
          <div className="flex flex-col items-center mb-6">
            <LogoIcon className="h-12 w-12 text-emerald-500 mb-3" />
            <h1 className="text-2xl font-bold text-[var(--text-primary)]">
              {isSignUp ? 'Create an Account' : 'Welcome Back'}
            </h1>
            <p className="text-[var(--text-secondary)] mt-1 text-sm">
              {isSignUp ? 'Sign up to get started' : 'Sign in to continue'}
            </p>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg text-sm">
              {error}
            </div>
          )}

          {message && (
            <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded-lg text-sm">
              {message}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-[var(--text-tertiary)] mb-1" htmlFor="email">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={loading}
                className="w-full px-3 py-2 border border-[var(--border-color-strong)] rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 bg-[var(--card-background)] text-[var(--text-primary)] disabled:opacity-50"
                placeholder="you@example.com"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[var(--text-tertiary)] mb-1" htmlFor="password">
                Password
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={loading}
                className="w-full px-3 py-2 border border-[var(--border-color-strong)] rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 bg-[var(--card-background)] text-[var(--text-primary)] disabled:opacity-50"
                placeholder="••••••••"
              />
              {isSignUp && (
                <p className="text-xs text-[var(--text-secondary)] mt-1">
                  Must be at least 6 characters
                </p>
              )}
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full px-4 py-2 bg-[var(--brand-primary)] text-[var(--brand-text-on-primary)] font-semibold rounded-lg shadow-md hover:bg-[var(--brand-primary-hover)] transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {loading ? 'Processing...' : isSignUp ? 'Sign Up' : 'Sign In'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <button
              onClick={() => {
                setIsSignUp(!isSignUp);
                setError(null);
                setMessage(null);
              }}
              disabled={loading}
              className="text-sm text-[var(--brand-primary)] hover:text-[var(--brand-primary-hover)] font-medium disabled:opacity-50"
            >
              {isSignUp ? 'Already have an account? Sign In' : "Don't have an account? Sign Up"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginView;
