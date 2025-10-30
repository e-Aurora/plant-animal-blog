// src/app/register/page.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Alert } from '@/components/ui/Alert';
import { Card } from '@/components/ui/Card';

export default function RegisterPage() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Registration failed');
        return;
      }

      router.push('/');
      router.refresh();
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-secondary -m-8 px-4">
      <div className="w-full max-w-md">
        <Card>
          {/* Header */}
          <div className="text-center mb-8">
            <div className="text-5xl mb-4">🌸</div>
            <h1 className="text-3xl font-bold text-primary mb-2">
              Join Our Community
            </h1>
            <p className="text-tertiary">
              Start sharing your nature stories today
            </p>
          </div>

          {/* Error Alert */}
          {error && (
            <Alert type="error" onClose={() => setError('')}>
              {error}
            </Alert>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <Input
              type="text"
              label="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Choose a username"
              required
            />

            <Input
              type="email"
              label="Email (optional)"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
            />

            <Input
              type="password"
              label="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="At least 6 characters"
              required
              minLength={6}
            />

            <Input
              type="password"
              label="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm your password"
              required
              minLength={6}
            />

            <Button
              type="submit"
              variant="primary"
              className="w-full"
              isLoading={loading}
            >
              Create Account
            </Button>
          </form>

          {/* Footer */}
          <div className="mt-6 text-center">
            <p className="text-tertiary">
              Already have an account?{' '}
              <Link 
                href="/login" 
                className="text-primary font-semibold hover:underline"
              >
                Sign In
              </Link>
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
}