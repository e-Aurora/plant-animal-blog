// src/app/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { Post } from '@/types/blog';
import PostCard from '@/components/PostCard';
import HeroSection from '@/components/HeroSection';
import LoadingSkeleton from '@/components/LoadingSkeleton';
import EmptyState from '@/components/EmptyState';

export default function HomePage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchPosts();
    
    // Auto-refresh posts every 60 seconds
    const interval = setInterval(() => {
      fetchPosts();
    }, 60000);

    return () => clearInterval(interval);
  }, []);

  async function fetchPosts() {
    try {
      const res = await fetch('/api/posts?limit=12');
      
      if (!res.ok) {
        throw new Error('Failed to fetch posts');
      }
      
      const data = await res.json();
      setPosts(data);
    } catch (error) {
      console.error('Error fetching posts:', error);
      setError('Failed to load posts. Please try again later.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <HeroSection />

      {/* Posts Section */}
      <div id="posts">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-green-900">Latest Stories</h2>
            <p className="text-green-600 mt-1">
              Discover amazing articles from our community
            </p>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <LoadingSkeleton key={i} />
            ))}
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
            <p className="text-red-700 font-medium">{error}</p>
            <button
              onClick={fetchPosts}
              className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Posts Grid */}
        {!loading && !error && posts.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && posts.length === 0 && (
          <EmptyState
            title="No Posts Yet"
            description="Be the first to share a story about the natural world!"
            actionLabel="Create First Post"
            actionHref="/blog/create"
            icon="🌱"
          />
        )}
      </div>

      {/* Call to Action */}
      {!loading && posts.length > 0 && (
        <div className="bg-gradient-to-r from-green-600 to-green-700 rounded-2xl p-8 text-center text-white">
          <h3 className="text-2xl font-bold mb-2">Have a Story to Share?</h3>
          <p className="mb-6 opacity-90">
            Join our community and share your knowledge about plants and animals
          </p>
          <a
            href="/blog/create"
            className="inline-block px-8 py-3 bg-white text-green-700 rounded-lg hover:bg-green-50 transition-colors font-semibold shadow-lg"
          >
            Start Writing
          </a>
        </div>
      )}
    </div>
  );
}