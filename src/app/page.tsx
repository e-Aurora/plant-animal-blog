// src/app/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { Post } from '@/types/blog';
import PostCard from '@/components/PostCard';

import LoadingSkeleton from '@/components/LoadingSkeleton';
import EmptyState from '@/components/EmptyState';
import { usePostsRefresh } from '@/contexts/PostsContext';
import { Alert } from '@/components/ui/Alert';
import { Button } from '@/components/ui/Button';

export default function HomePage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { refreshTrigger } = usePostsRefresh();

  useEffect(() => {
    fetchPosts();
  }, [refreshTrigger]);

  async function fetchPosts() {
    try {
      const res = await fetch('/api/posts?limit=12');
      
      if (!res.ok) {
        throw new Error('Failed to fetch posts');
      }
      
      const data = await res.json();
      setPosts(data);
      setError(null);
    } catch (error) {
      console.error('Error fetching posts:', error);
      setError('Failed to load posts. Please try again later.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-8">
      

      <div id="posts">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-primary">Latest Stories</h2>
            <p className="text-tertiary mt-1">
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
          <Alert type="error">
            <div className="flex flex-col gap-3">
              <p className="font-medium">{error}</p>
              <Button
                onClick={fetchPosts}
                variant="outline"
                size="sm"
                className="self-start"
              >
                Try Again
              </Button>
            </div>
          </Alert>
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
            description="Be the first one to share a story about plants & animals!"
            actionLabel="Create the First Post"
            actionHref="/blog/create"
            icon="✍️"
          />
        )}
      </div>

      {/* Call to Action */}
      {!loading && posts.length > 0 && (
        <div className="relative overflow-hidden rounded-2xl p-8 text-center">
          {/* Gradient background */}
          <div className="absolute inset-0 bg-gradient-to-r from-pink-300 via-green-400 to-pink-300 opacity-70"></div>
          
          {/* Content */}
          <div className="relative z-10 text-white">
            <h3 className="text-2xl font-bold mb-2">Have a Story to Share?</h3>
            <Button
              onClick={() => window.location.href = '/blog/create'}
              className="bg-white text-green-500 hover:bg-green-200 border-white"
            >
              Start Writing
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}