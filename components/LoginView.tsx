import React, { useState } from 'react';
import { LogoIcon } from './icons';

interface LoginViewProps {
  onLogin: () => void;
}

const LoginView: React.FC<LoginViewProps> = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [verificationSent, setVerificationSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email && password) {
      // Simulate sending a verification email
      setVerificationSent(true);
    } else {
      alert('Please enter both email and password.');
    }
  };

  const handleVerification = () => {
    // Simulate user clicking the verification link
    onLogin();
  };

  if (verificationSent) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--background-muted)] p-4 font-sans">
        <div className="w-full max-w-sm text-center">
          <div className="bg-[var(--card-background)] shadow-2xl rounded-2xl p-8">
            <div className="flex flex-col items-center mb-6">
              <svg className="h-12 w-12 text-emerald-500 mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              <h1 className="text-2xl font-bold text-[var(--text-primary)]">Check Your Email</h1>
              <p className="text-[var(--text-secondary)] mt-2 text-sm">
                We've sent a verification link to <strong className="text-[var(--text-tertiary)]">{email}</strong>.
              </p>
            </div>
            <p className="text-xs text-[var(--text-secondary)] mb-6">
              Please click the link in the email to complete your signup. If you don't see it, you may need to check your spam folder.
            </p>
            <button
              onClick={handleVerification}
              className="w-full px-4 py-2 bg-[var(--brand-primary)] text-[var(--brand-text-on-primary)] font-semibold rounded-lg shadow-md hover:bg-[var(--brand-primary-hover)] transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
            >
              Verify Email (Simulated)
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--background-muted)] p-4 font-sans">
      <div className="w-full max-w-sm">
        <div className="bg-[var(--card-background)] shadow-2xl rounded-2xl p-8">
          <div className="flex flex-col items-center mb-6">
            <LogoIcon className="h-12 w-12 text-emerald-500 mb-3" />
            <h1 className="text-2xl font-bold text-[var(--text-primary)]">Create an Account</h1>
            <p className="text-[var(--text-secondary)] mt-1 text-sm">Or sign in to continue</p>
          </div>
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
                className="w-full px-3 py-2 border border-[var(--border-color-strong)] rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 bg-[var(--card-background)] text-[var(--text-primary)]"
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
                className="w-full px-3 py-2 border border-[var(--border-color-strong)] rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 bg-[var(--card-background)] text-[var(--text-primary)]"
                placeholder="••••••••"
              />
            </div>
            <button
              type="submit"
              className="w-full px-4 py-2 bg-[var(--brand-primary)] text-[var(--brand-text-on-primary)] font-semibold rounded-lg shadow-md hover:bg-[var(--brand-primary-hover)] transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
            >
              Continue
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginView;