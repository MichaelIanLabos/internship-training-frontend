'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth/context';
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
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
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
        err.response?.data?.message ||
        err.response?.data?.errors?.non_field_errors?.[0] ||
        'Invalid email or password'
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full">
      <div className="text-center">
        <h2 className="text-3xl font-bold tracking-tight text-gray-900">
          Sign in to your account
        </h2>
        <p className="mt-2 text-sm text-gray-600">
          Welcome to the Internship Training Platform
        </p>
      </div>

      <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
        {error && (
          <div className="rounded-md bg-red-50 p-4">
            <p className="text-sm text-red-800">{error}</p>
          </div>
        )}

        <div className="space-y-4">
          <Input
            label="Email address"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="email"
            placeholder="user@example.com"
          />

          <Input
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoComplete="current-password"
            placeholder="Enter your password"
          />
        </div>

        <Button type="submit" className="w-full" isLoading={isLoading}>
          Sign in
        </Button>

        {/* Optional: Add registration link */}
        {/* <p className="mt-4 text-center text-sm text-gray-600">
          Don't have an account?{' '}
          <a href="/register" className="text-primary-600 hover:text-primary-700">
            Register here
          </a>
        </p> */}
      </form>
    </Card>
  );
}
