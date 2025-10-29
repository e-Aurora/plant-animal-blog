// app/blog/page.tsx
'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Post } from '@/types/blog';

export default function BlogPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPosts() {
      try {
        const res = await fetch('/api/posts?limit=12');
        const data = await res.json();
        setPosts(data);
      } catch (error) {
        console.error('Error fetching posts:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchPosts();
  }, []);

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="bg-white/60 backdrop-blur-sm rounded-lg p-6 border border-green-100 animate-pulse"
          >
            <div className="h-4 bg-green-200 rounded w-3/4 mb-4"></div>
            <div className="space-y-2">
              <div className="h-3 bg-green-100 rounded"></div>
              <div className="h-3 bg-green-100 rounded w-5/6"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-green-800 mb-2">
          All Posts
        </h1>
        <p className="text-green-600">
          Explore our collection of articles about plants and animals
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {posts.map((post) => (
          <Link
            key={post.id}
            href={`/blog/${post.id}`}
            className="group bg-white/60 backdrop-blur-sm rounded-lg p-6 border border-green-100 hover:border-green-300 hover:shadow-lg transition-all duration-200"
          >
            <div className="flex items-start justify-between mb-3">
              <h2 className="text-lg font-semibold text-green-900 group-hover:text-green-700 transition-colors flex-1">
                {post.title}
              </h2>
              <span className="text-sm text-green-600 ml-2 flex-shrink-0">
                ❤️ {post.likes}
              </span>
            </div>

            <p className="text-sm text-green-700 mb-4 line-clamp-3">
              {post.excerpt || post.content.substring(0, 150) + '...'}
            </p>

            <div className="flex items-center justify-between text-xs text-green-500">
              <span>By {post.username || 'Anonymous'}</span>
              <span>
                {new Date(post.created_at).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric',
                })}
              </span>
            </div>
          </Link>
        ))}
      </div>

      {posts.length === 0 && (
        <div className="bg-white/60 backdrop-blur-sm rounded-lg p-12 border border-green-100 text-center">
          <p className="text-green-700 text-lg">
            No posts yet. Start creating content!
          </p>
        </div>
      )}
    </div>
  );
}