// src/app/tag/[name]/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { Post } from '@/types/blog';
import PostCard from '@/components/PostCard';
import LoadingSkeleton from '@/components/LoadingSkeleton';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';

export default function TagPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [postCount, setPostCount] = useState(0);
  const params = useParams();
  const tagName = params.name as string;

  useEffect(() => {
    fetchPostsByTag();
  }, [tagName]);

  async function fetchPostsByTag() {
    try {
      const res = await fetch(`/api/tags/${tagName}/posts`);
      if (res.ok) {
        const data = await res.json();
        setPosts(data.posts);
        setPostCount(data.posts.length);
      }
    } catch (error) {
      console.error('Error fetching posts by tag:', error);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div>
        <div className="mb-8">
          <div className="h-8 w-48 bg-green-200 rounded animate-pulse mb-2"></div>
          <div className="h-4 w-32 bg-green-100 rounded animate-pulse"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <LoadingSkeleton key={i} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <Badge variant="primary" size="lg" className="text-2xl font-bold px-4 py-2">
            #{tagName}
          </Badge>
        </div>
        <p className="text-tertiary">
          {postCount} {postCount === 1 ? 'post' : 'posts'} tagged with #{tagName}
        </p>
      </div>

      {/* Posts Grid */}
      {posts.length === 0 ? (
        <Card>
          <div className="text-center py-12">
            <span className="text-6xl mb-4 block">🏷️</span>
            <p className="text-tertiary">No posts found with this tag</p>
          </div>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      )}
    </div>
  );
}

