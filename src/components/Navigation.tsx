// src/components/Navigation.tsx
'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Avatar } from '@/components/ui/Avatar';

interface User {
  id: number;
  username: string;
}

export default function Navigation() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [showDropdown, setShowDropdown] = useState(false);
  const router = useRouter();

  useEffect(() => {
    fetchUser();
  }, []);

  async function fetchUser() {
    try {
      const res = await fetch('/api/auth/me');
      if (res.ok) {
        const data = await res.json();
        setUser(data.user);
      }
    } catch (error) {
      console.error('Error fetching user:', error);
    } finally {
      setLoading(false);
    }
  }

  async function handleLogout() {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      setUser(null);
      setShowDropdown(false);
      router.push('/');
      router.refresh();
    } catch (error) {
      console.error('Logout error:', error);
    }
  }

  return (
    <nav className="bg-surface border-b border-default sticky top-0 z-50 backdrop-blur-sm bg-opacity-90">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2 group">
            <span className="text-xl font-semibold text-primary">
              Plants & Animals
            </span>
          </Link>
          
          {/* Navigation Items */}
          <div className="flex items-center space-x-4">
            <Link 
              href="/" 
              className="text-secondary hover:text-primary transition-colors font-medium"
            >
              Home
            </Link>

            {!loading && (
              <>
                {user ? (
                  <>
                    <Link 
                      href="/blog/my-posts" 
                      className="hidden md:block text-secondary hover:text-primary transition-colors font-medium"
                    >
                      My Posts
                    </Link>
                    
                    <Button
                      onClick={() => router.push('/blog/create')}
                      variant="primary"
                      size="sm"
                    >
                      + Create
                    </Button>
                    
                    {/* User Dropdown */}
                    <div className="relative">
                      <button
                        onClick={() => setShowDropdown(!showDropdown)}
                        className="flex items-center space-x-2 hover:opacity-80 transition-opacity"
                      >
                        <Avatar name={user.username} size="sm" />
                        <span className="hidden md:inline font-medium text-secondary">
                          {user.username}
                        </span>
                      </button>

                      {showDropdown && (
                        <>
                          <div 
                            className="fixed inset-0 z-10" 
                            onClick={() => setShowDropdown(false)}
                          />
                          <div className="absolute right-0 mt-2 w-48 bg-surface rounded-lg shadow-lg border border-default py-2 z-20">
                            <Link
                              href="/blog/my-posts"
                              className="block px-4 py-2 text-secondary hover:bg-surface-elevated transition-colors md:hidden font-medium"
                              onClick={() => setShowDropdown(false)}
                            >
                              My Posts
                            </Link>
                            <Link
                              href="/settings"
                              className="block px-4 py-2 text-secondary hover:bg-surface-elevated transition-colors font-medium"
                              onClick={() => setShowDropdown(false)}
                            >
                              Settings
                            </Link>
                            <hr className="my-2 border-default" />
                            <button
                              onClick={handleLogout}
                              className="w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 transition-colors font-medium"
                            >
                              Logout
                            </button>
                          </div>
                        </>
                      )}
                    </div>
                  </>
                ) : (
                  <>
                    <Link
                      href="/login"
                      className="text-secondary hover:text-primary transition-colors font-medium"
                    >
                      Sign In
                    </Link>
                    <Button
                      onClick={() => router.push('/register')}
                      variant="primary"
                      size="sm"
                    >
                      Sign Up
                    </Button>
                  </>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}