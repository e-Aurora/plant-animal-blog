// components/Navigation.tsx
'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

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
    <nav className="bg-white/80 backdrop-blur-sm border-b border-green-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="flex items-center space-x-2">
            <span className="text-2xl">🌿</span>
            <span className="text-xl font-semibold text-green-800">
              Flora & Fauna
            </span>
          </Link>
          
          <div className="flex items-center space-x-6">
            <Link 
              href="/" 
              className="text-green-700 hover:text-green-900 transition-colors font-medium"
            >
              Home
            </Link>

            {!loading && (
              <>
                {user ? (
                  <>
                    <Link 
                      href="/blog/my-posts" 
                      className="text-green-700 hover:text-green-900 transition-colors font-medium"
                    >
                      My Posts
                    </Link>
                    
                    <Link
                      href="/blog/create"
                      className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium"
                    >
                      Create Post
                    </Link>
                    
                    <div className="relative">
                      <button
                        onClick={() => setShowDropdown(!showDropdown)}
                        className="flex items-center space-x-2 text-green-700 hover:text-green-900 transition-colors"
                      >
                        <div className="w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center font-semibold text-sm">
                          {user.username.charAt(0).toUpperCase()}
                        </div>
                        <span className="hidden md:inline font-medium">{user.username}</span>
                      </button>

                      {showDropdown && (
                        <>
                          <div 
                            className="fixed inset-0 z-10" 
                            onClick={() => setShowDropdown(false)}
                          />
                          <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-green-100 py-2 z-20">
                            <Link
                              href="/blog/my-posts"
                              className="block px-4 py-2 text-green-700 hover:bg-green-50 font-medium"
                              onClick={() => setShowDropdown(false)}
                            >
                              My Posts
                            </Link>
                            <Link
                              href="/settings"
                              className="block px-4 py-2 text-green-700 hover:bg-green-50 font-medium"
                              onClick={() => setShowDropdown(false)}
                            >
                              Settings
                            </Link>
                            <hr className="my-2 border-green-100" />
                            <button
                              onClick={handleLogout}
                              className="w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 font-medium"
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
                      className="text-green-700 hover:text-green-900 transition-colors font-medium"
                    >
                      Sign In
                    </Link>
                    <Link
                      href="/register"
                      className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium"
                    >
                      Sign Up
                    </Link>
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