import React, { useState } from 'react';
import { Lock, LogIn, Mail } from 'lucide-react';
import { ApiError } from '../../lib/api';
import { navigate } from '../../lib/router';
import { useBusiness } from '../../i18n/useContent';
import { useAuth } from '../AuthContext';
import { Button, FieldError, Input, Label } from '../components/ui';

export const LoginPage: React.FC = () => {
  const { login } = useAuth();
  const business = useBusiness();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fields, setFields] = useState<Record<string, string>>({});

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setError(null);
    setFields({});

    try {
      await login(email.trim(), password);
      navigate('/admin/dashboard', { replace: true });
    } catch (loginError) {
      if (loginError instanceof ApiError) {
        setError(loginError.message);
        setFields(loginError.fields);
      } else {
        setError('Could not sign in. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-[#F3F3F3] font-sans flex items-center justify-center px-4 py-12 relative overflow-hidden selection:bg-[#F5C400] selection:text-[#0A0A0A]">
      <div className="absolute inset-0 bg-grid-pattern opacity-10 pointer-events-none" />
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[32rem] h-[32rem] bg-[#F5C400]/5 blur-[140px] rounded-full pointer-events-none" />

      <div className="relative z-10 w-full max-w-md">
        <div className="flex flex-col items-center text-center mb-8">
          {business.logoUrl && (
            <img
              src={business.logoUrl}
              alt=""
              className="w-14 h-14 rounded-2xl object-contain bg-[#101010] border border-neutral-800 p-2 mb-4"
            />
          )}
          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#181818] border border-neutral-800 text-[10px] font-mono font-bold uppercase tracking-widest text-[#F5C400] mb-3">
            <span className="w-1.5 h-1.5 rounded-full bg-[#F5C400]" />
            Secure area
          </span>
          <h1 className="font-heading text-2xl sm:text-3xl font-black uppercase tracking-tight text-white">
            Admin portal
          </h1>
          <p className="text-xs text-neutral-500 mt-2 max-w-xs leading-relaxed">
            Sign in to manage services, testimonials, leads and site content for{' '}
            {business.shortName || 'the website'}.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          noValidate
          className="rounded-2xl bg-gradient-to-b from-[#181818] to-[#121212] border border-neutral-700/80 p-6 sm:p-8 shadow-2xl space-y-4"
        >
          {error && (
            <div
              role="alert"
              className="px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/40 text-xs text-red-300"
            >
              {error}
            </div>
          )}

          <div>
            <Label htmlFor="admin-email">Email address</Label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-600 pointer-events-none" />
              <Input
                id="admin-email"
                type="email"
                autoComplete="username"
                required
                value={email}
                error={fields.email}
                onChange={event => setEmail(event.target.value)}
                placeholder="admin@example.com"
                className="pl-10"
              />
            </div>
            <FieldError message={fields.email} />
          </div>

          <div>
            <Label htmlFor="admin-password">Password</Label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-600 pointer-events-none" />
              <Input
                id="admin-password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                error={fields.password}
                onChange={event => setPassword(event.target.value)}
                placeholder="••••••••••"
                className="pl-10"
              />
            </div>
            <FieldError message={fields.password} />
          </div>

          <Button type="submit" loading={loading} className="w-full !py-4">
            <LogIn className="w-4 h-4" />
            Sign in
          </Button>

          <p className="text-[11px] text-center text-neutral-600 font-mono leading-relaxed">
            Sessions are stored in a signed, http-only cookie.
          </p>
        </form>

        <p className="text-center mt-6">
          <a href="/" className="text-[11px] text-neutral-600 hover:text-[#F5C400] transition-colors">
            ← Back to the website
          </a>
        </p>
      </div>
    </div>
  );
};
