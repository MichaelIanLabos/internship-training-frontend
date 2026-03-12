'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth/context';
import { localAuth } from '@/lib/auth/local-auth';
import { validators } from '@/lib/utils/validators';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card } from '@/components/ui/Card';

/**
 * Login Page
 *
 * TODO for Interns:
 * This page is mostly complete, but you need to ensure the auth logic works.
 *
 * The login flow:
 * 1. User enters email and password
 * 2. Form submits -> handleSubmit is called
 * 3. useAuth().login() is called with credentials
 * 4. If successful, redirect to dashboard
 * 5. If error, show error message
 *
 * Make sure your AuthContext login() function is properly implemented!
 */

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const switchMode = (nextMode: 'login' | 'register') => {
    setMode(nextMode);
    setError('');
    setSuccess('');
    setPassword('');
    setPasswordConfirm('');
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setIsLoading(true);

    try {
      /**
       * TODO: This calls your login function from AuthContext
       * Make sure it's implemented correctly!
       */
      await login(email, password);
      router.push('/dashboard');
    } catch (err: any) {
      /**
       * TODO: Handle different error types
       * - Network errors
       * - Invalid credentials (400/401)
       * - Server errors (500)
       */
      setError(
        err?.response?.data?.message ||
        err?.response?.data?.errors?.non_field_errors?.[0] ||
        'Invalid email or password'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!validators.required(firstName) || !validators.required(lastName)) {
      setError('First name and last name are required');
      return;
    }

    if (!validators.email(email)) {
      setError('Enter a valid email address');
      return;
    }

    const passwordValidation = validators.password(password);
    if (!passwordValidation.valid) {
      setError(passwordValidation.message || 'Invalid password');
      return;
    }

    if (password !== passwordConfirm) {
      setError('Passwords do not match');
      return;
    }

    setIsLoading(true);
    try {
      localAuth.register({
        email,
        first_name: firstName,
        last_name: lastName,
        password,
        password_confirm: passwordConfirm,
      });

      setSuccess('Account created. You can now sign in.');
      setEmail(email.trim().toLowerCase());
      setMode('login');
      setFirstName('');
      setLastName('');
      setPassword('');
      setPasswordConfirm('');
    } catch (err: unknown) {
      setError(
        err instanceof Error ? err.message : 'Unable to create account'
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full rounded-2xl border border-slate-200/70 bg-white/95 p-8 shadow-xl backdrop-blur">
      <div className="mb-5 inline-flex rounded-lg bg-slate-100 p-1">
        <button
          type="button"
          onClick={() => switchMode('login')}
          className={`rounded-md px-3 py-1.5 text-sm font-semibold transition ${
            mode === 'login'
              ? 'bg-white text-slate-900 shadow-sm'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Sign in
        </button>
        <button
          type="button"
          onClick={() => switchMode('register')}
          className={`rounded-md px-3 py-1.5 text-sm font-semibold transition ${
            mode === 'register'
              ? 'bg-white text-slate-900 shadow-sm'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Create account
        </button>
      </div>

      <div>
        <p className="inline-flex rounded-full bg-primary-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-primary-700">
          {mode === 'login' ? 'Welcome Back' : 'Create Account'}
        </p>
        <h2 className="mt-4 text-3xl font-bold tracking-tight text-slate-900">
          {mode === 'login' ? 'Sign in to your account' : 'Register new account'}
        </h2>
        <p className="mt-2 text-sm text-slate-600">
          {mode === 'login'
            ? 'Continue your internship training journey.'
            : 'Create your account and sign in whenever you return.'}
        </p>
      </div>

      <form
        className="mt-8 space-y-5"
        onSubmit={mode === 'login' ? handleLoginSubmit : handleRegisterSubmit}
      >
        {error && (
          <div className="rounded-lg border border-red-200 bg-red-50 p-3">
            <p className="text-sm font-medium text-red-800">{error}</p>
          </div>
        )}
        {success && (
          <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-3">
            <p className="text-sm font-medium text-emerald-800">{success}</p>
          </div>
        )}

        <div className="space-y-4">
          {mode === 'register' && (
            <>
              <Input
                label="First name"
                type="text"
                id="firstName"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                required
                autoComplete="given-name"
                placeholder="Enter First Name"
                className="rounded-lg border-slate-300 py-2.5"
              />

              <Input
                label="Last name"
                type="text"
                id="lastName"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                required
                autoComplete="family-name"
                placeholder="Enter Last Name"
                className="rounded-lg border-slate-300 py-2.5"
              />
            </>
          )}

          <Input
            label="Email address"
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="email"
            placeholder="user@example.com"
            className="rounded-lg border-slate-300 py-2.5"
          />

          <Input
            label="Password"
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
            placeholder="Enter your password"
            className="rounded-lg border-slate-300 py-2.5"
          />

          {mode === 'register' && (
            <Input
              label="Confirm password"
              type="password"
              id="passwordConfirm"
              value={passwordConfirm}
              onChange={(e) => setPasswordConfirm(e.target.value)}
              required
              autoComplete="new-password"
              placeholder="Re-enter your password"
              className="rounded-lg border-slate-300 py-2.5"
            />
          )}
        </div>

        <Button
          type="submit"
          className="w-full rounded-lg py-2.5 text-sm font-semibold"
          isLoading={isLoading}
        >
          {mode === 'login' ? 'Sign in' : 'Create account'}
        </Button>

        <p className="text-center text-sm text-slate-600">
          {mode === 'login' ? "Don't have an account?" : 'Already have an account?'}{' '}
          <button
            type="button"
            onClick={() => switchMode(mode === 'login' ? 'register' : 'login')}
            className="font-semibold text-primary-700 hover:text-primary-800"
          >
            {mode === 'login' ? 'Create one' : 'Sign in'}
          </button>
        </p>
      </form>
    </Card>
  );
}
