// src/components/Search.tsx
'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { Avatar } from '@/components/ui/Avatar';
import { Badge } from '@/components/ui/Badge';

type SearchType = 'all' | 'posts' | 'users' | 'tags';

interface SearchResult {
  posts: Array<{
    id: number;
    title: string;
    excerpt: string;
    username: string;
    likes: number;
  }>;
  users: Array<{
    username: string;
    avatar_emoji: string;
    follower_count: number;
  }>;
  tags: Array<{
    name: string;
    post_count: number;
  }>;
}

export default function Search() {
  const [query, setQuery] = useState('');
  const [searchType, setSearchType] = useState<SearchType>('all');
  const [results, setResults] = useState<SearchResult>({
    posts: [],
    users: [],
    tags: []
  });
  const [loading, setLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowResults(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const searchTimeout = setTimeout(() => {
      if (query.length >= 2) {
        performSearch();
      } else {
        setResults({ posts: [], users: [], tags: [] });
      }
    }, 300);

    return () => clearTimeout(searchTimeout);
  }, [query, searchType]);

  async function performSearch() {
    setLoading(true);
    try {
      const res = await fetch(
        `/api/search?q=${encodeURIComponent(query)}&type=${searchType}`
      );
      if (res.ok) {
        const data = await res.json();
        setResults(data);
        setShowResults(true);
      }
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setLoading(false);
    }
  }

  const hasResults = results.posts.length > 0 || results.users.length > 0 || results.tags.length > 0;

  return (
    <div ref={searchRef} className="relative w-full max-w-2xl">
      {/* Search Input */}
      <div className="relative">
        
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => query.length >= 1 && setShowResults(true)}
          placeholder="🔍 Search posts, users, or tags..."
          className="w-full pl-10 pr-4 py-2 input"
        />
        
        {loading && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            <div className="w-4 h-4 border-2 border-green-600 border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}
      </div>

      {/* Results Dropdown */}
      {showResults && query.length >= 2 && (
        <div className="absolute z-50 w-full mt-2 bg-surface border border-default rounded-lg shadow-lg max-h-96 overflow-y-auto">
          {/* Filter Tabs - Inside Results */}
          <div className="sticky top-0 bg-surface border-b border-default p-3 flex gap-2 z-10">
            {(['all', 'posts', 'users', 'tags'] as SearchType[]).map((type) => (
              <button
                key={type}
                onClick={() => setSearchType(type)}
                className={`px-3 py-1 text-sm rounded-lg transition-colors capitalize ${
                  searchType === type
                    ? 'bg-green-600 text-white'
                    : 'bg-surface-elevated text-tertiary hover:bg-green-100 dark:hover:bg-green-900'
                }`}
              >
                {type}
              </button>
            ))}
          </div>

          {!hasResults && !loading && (
            <div className="p-8 text-center text-tertiary">
              No results found for "{query}"
            </div>
          )}

          {/* Posts Results */}
          {(searchType === 'all' || searchType === 'posts') && results.posts.length > 0 && (
            <div className="p-4 border-b border-default">
              <h3 className="text-sm font-semibold text-primary mb-3">Posts</h3>
              <div className="space-y-2">
                {results.posts.slice(0, 5).map((post) => (
                  <Link
                    key={post.id}
                    href={`/blog/${post.id}`}
                    onClick={() => setShowResults(false)}
                    className="block p-2 hover:bg-surface-elevated rounded-lg transition-colors"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-secondary line-clamp-1">
                          {post.title}
                        </p>
                        <p className="text-xs text-tertiary line-clamp-1">
                          by {post.username}
                        </p>
                      </div>
                      <Badge variant="secondary" size="sm">
                        ❤️ {post.likes}
                      </Badge>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Users Results */}
          {(searchType === 'all' || searchType === 'users') && results.users.length > 0 && (
            <div className="p-4 border-b border-default">
              <h3 className="text-sm font-semibold text-primary mb-3">Users</h3>
              <div className="space-y-2">
                {results.users.slice(0, 5).map((user) => (
                  <Link
                    key={user.username}
                    href={`/profile/${user.username}`}
                    onClick={() => setShowResults(false)}
                    className="flex items-center gap-3 p-2 hover:bg-surface-elevated rounded-lg transition-colors"
                  >
                    <Avatar 
                      name={user.username} 
                      emoji={user.avatar_emoji}
                      size="sm" 
                    />
                    <div className="flex-1">
                      <p className="font-medium text-secondary">{user.username}</p>
                      <p className="text-xs text-tertiary">
                        {user.follower_count} followers
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Tags Results */}
          {(searchType === 'all' || searchType === 'tags') && results.tags.length > 0 && (
            <div className="p-4">
              <h3 className="text-sm font-semibold text-primary mb-3">Tags</h3>
              <div className="space-y-2">
                {results.tags.slice(0, 5).map((tag) => (
                  <Link
                    key={tag.name}
                    href={`/tag/${tag.name}`}
                    onClick={() => setShowResults(false)}
                    className="flex items-center justify-between p-2 hover:bg-surface-elevated rounded-lg transition-colors"
                  >
                    <span className="text-secondary font-medium">#{tag.name}</span>
                    <span className="text-xs text-tertiary">
                      {tag.post_count} posts
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}