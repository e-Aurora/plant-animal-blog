// components/Sidebar.tsx
'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Post } from '@/types/blog';

export default function Sidebar() {
  const [recentPosts, setRecentPosts] = useState<Post[]>([]);
  const [hotPosts, setHotPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPosts() {
      try {
        const [recentRes, hotRes] = await Promise.all([
          fetch('/api/posts/recent'),
          fetch('/api/posts/hot'),
        ]);

        const recent = await recentRes.json();
        const hot = await hotRes.json();

        setRecentPosts(recent);
        setHotPosts(hot);
      } catch (error) {
        console.error('Error fetching sidebar posts:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchPosts();
  }, []);

  if (loading) {
    return (
      <aside className="w-80 space-y-8">
        <div className="bg-white/60 backdrop-blur-sm rounded-lg p-6 border border-green-100">
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-green-200 rounded w-1/2"></div>
            <div className="h-3 bg-green-100 rounded"></div>
            <div className="h-3 bg-green-100 rounded w-5/6"></div>
          </div>
        </div>
      </aside>
    );
  }

  return (
    <aside className="w-80 space-y-8">
      {/* Recent Posts */}
      <div className="bg-white/60 backdrop-blur-sm rounded-lg p-6 border border-green-100">
        <h2 className="text-lg font-semibold text-green-800 mb-4">
          Recent Posts
        </h2>
        <div className="space-y-4">
          {recentPosts.map((post) => (
            <Link
              key={post.id}
              href={`/blog/${post.id}`}
              className="block group"
            >
              <h3 className="text-sm font-medium text-green-900 group-hover:text-green-700 transition-colors">
                {post.title}
              </h3>
              <p className="text-xs text-green-600 mt-1 line-clamp-2">
                {post.excerpt}
              </p>
              <div className="flex items-center justify-between mt-2">
                <span className="text-xs text-green-500">
                  {new Date(post.created_at).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                  })}
                </span>
                <span className="text-xs text-green-600">
                  ❤️ {post.likes}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Hot Posts */}
      <div className="bg-white/60 backdrop-blur-sm rounded-lg p-6 border border-green-100">
        <h2 className="text-lg font-semibold text-green-800 mb-4 flex items-center">
          <span className="mr-2">🔥</span>
          Hot Posts
        </h2>
        <div className="space-y-4">
          {hotPosts.map((post) => (
            <Link
              key={post.id}
              href={`/blog/${post.id}`}
              className="block group"
            >
              <h3 className="text-sm font-medium text-green-900 group-hover:text-green-700 transition-colors">
                {post.title}
              </h3>
              <p className="text-xs text-green-600 mt-1 line-clamp-2">
                {post.excerpt}
              </p>
              <div className="flex items-center justify-between mt-2">
                <span className="text-xs text-green-500">
                  {new Date(post.created_at).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                  })}
                </span>
                <span className="text-xs text-green-600 font-medium">
                  ❤️ {post.likes}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </aside>
  );
}