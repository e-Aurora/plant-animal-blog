// src/components/Navigation.tsx
'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Avatar } from '@/components/ui/Avatar';
import { Badge } from '@/components/ui/Badge';
import Search from '@/components/Search';

interface User {
  id: number;
  username: string;
  avatar_emoji: string;
}

export default function Navigation() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [showDropdown, setShowDropdown] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    fetchUser();
  }, [pathname]);

  useEffect(() => {
    if (user) {
      fetchUnreadCount();
      const interval = setInterval(fetchUnreadCount, 30000);
      return () => clearInterval(interval);
    }
  }, [user?.id]);

  async function fetchUser() {
    try {
      const res = await fetch('/api/auth/me');
      if (res.ok) {
        const data = await res.json();
        setUser(data.user);
        console.log('Fetched user:', data.user);
      } else {
        setUser(null);
      }
    } catch (error) {
      console.error('Error fetching user:', error);
      setUser(null);
    } finally {
      setLoading(false);
    }
  }

  async function fetchUnreadCount() {
    try {
      const res = await fetch('/api/notifications/unread-count');
      if (res.ok) {
        const data = await res.json();
        setUnreadCount(data.count);
      }
    } catch (error) {
      console.error('Error fetching unread count:', error);
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
        <div className="flex justify-between items-center h-16 gap-4">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2 group flex-shrink-0">
            <span className="text-2xl transition-transform group-hover:scale-110">🌿</span>
            <span className="text-xl font-semibold text-primary hidden sm:inline">
              Petals & Paws
            </span>
          </Link>

          {/* Search Bar */}
          
            <div className="flex-1 max-w-2xl hidden md:block">
              <Search />
            </div>
         
          
          {/* Navigation Items */}
          <div className="flex items-center space-x-2 md:space-x-4 flex-shrink-0">
            {!loading && (
              <>
                {user ? (
                  <>
                    {/* Notifications Bell */}
                    <Link
                      href="/notifications"
                      className="relative p-2 hover:bg-surface-elevated rounded-lg transition-colors"
                    >
                      <span className="text-xl">🔔</span>
                      {unreadCount > 0 && (
                        <Badge 
                          variant="error" 
                          size="sm"
                          className="absolute -top-1 -right-1 min-w-[20px] h-5 flex items-center justify-center"
                        >
                          {unreadCount > 9 ? '9+' : unreadCount}
                        </Badge>
                      )}
                    </Link>
                    
                    <Button
                      onClick={() => router.push('/blog/create')}
                      variant="primary"
                      size="sm"
                      className="hidden md:inline-flex"
                    >
                      + Create
                    </Button>
                    
                    {/* User Dropdown */}
                    <div className="relative">
                      <button
                        onClick={() => setShowDropdown(!showDropdown)}
                        className="flex items-center space-x-2 hover:opacity-80 transition-opacity"
                      >
                        <Avatar 
                          name={user.username} 
                          emoji={user.avatar_emoji}
                          size="sm" 
                        />
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
                              href={`/profile/${user.username}`}
                              className="block px-4 py-2 text-secondary hover:bg-surface-elevated transition-colors font-medium"
                              onClick={() => setShowDropdown(false)}
                            >
                              Profile
                            </Link>
                            <Link
                              href="/blog/create"
                              className="block px-4 py-2 text-secondary hover:bg-surface-elevated transition-colors md:hidden font-medium"
                              onClick={() => setShowDropdown(false)}
                            >
                              Create Post
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
                              className="w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors font-medium"
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

        {/* Mobile Search */}
       
          <div className="md:hidden pb-4">
            <Search />
          </div>
      
      </div>
    </nav>
  );
}