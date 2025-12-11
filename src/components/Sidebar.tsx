// src/components/Sidebar.tsx
'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Post } from '@/types/blog';
import { usePostsRefresh } from '@/contexts/PostsContext';
import { Card } from '@/components/ui/Card';
import { Skeleton } from '@/components/ui/Skeleton';
import { Badge } from '@/components/ui/Badge';

export default function Sidebar() {
  const [recentPosts, setRecentPosts] = useState<Post[]>([]);
  const [hotPosts, setHotPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const { refreshTrigger } = usePostsRefresh();

  useEffect(() => {
    fetchPosts();
  }, [refreshTrigger]);

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

  if (loading) {
    return (
      <aside className="w-80 space-y-6">
        <Card>
          <div className="space-y-4">
            <Skeleton className="h-6 w-32" />
            <Skeleton className="h-4" />
            <Skeleton className="h-4 w-5/6" />
          </div>
        </Card>
        <Card>
          <div className="space-y-4">
            <Skeleton className="h-6 w-32" />
            <Skeleton className="h-4" />
            <Skeleton className="h-4 w-5/6" />
          </div>
        </Card>
      </aside>
    );
  }

  return (
    <aside className="w-80 space-y-6 hidden lg:block">
      {/* Recent Posts */}
      <Card>
        <h2 className="text-lg font-semibold text-primary mb-4 flex items-center gap-2">
          
          Recent Posts
        </h2>
        <div className="space-y-4">
          {recentPosts.map((post) => (
            <Link
              key={post.id}
              href={`/blog/${post.id}`}
              className="block group"
            >
              <h3 className="text-sm font-medium text-secondary group-hover:text-primary transition-colors line-clamp-2">
                {post.title}
              </h3>
              <p className="text-xs text-tertiary mt-1 line-clamp-2">
                {post.excerpt}
              </p>
              <div className="flex items-center justify-between mt-2">
                <span className="text-xs text-muted">
                  {new Date(post.created_at).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                  })}
                </span>
                <Badge variant="secondary" size="sm">
                  ❤️ {post.likes}
                </Badge>
              </div>
            </Link>
          ))}
        </div>
      </Card>

      {/* Hot Posts */}
      <Card className="relative overflow-hidden">
        {/* Pink accent */}
        <div className="absolute top-0 right-0 w-20 h-20 bg-pink-200 rounded-full opacity-20 blur-2xl"></div>
        
        <h2 className="text-lg font-semibold text-primary mb-4 flex items-center gap-2 relative">
          
          Hot Posts
        </h2>
        <div className="space-y-4 relative">
          {hotPosts.map((post, index) => (
            <Link
              key={post.id}
              href={`/blog/${post.id}`}
              className="block group"
            >
              <div className="flex items-start gap-2">
                <span className="text-lg font-bold text-pink-500 mt-0.5">
                  #{index + 1}
                </span>
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-medium text-secondary group-hover:text-primary transition-colors line-clamp-2">
                    {post.title}
                  </h3>
                  <p className="text-xs text-tertiary mt-1 line-clamp-2">
                    {post.excerpt}
                  </p>
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-xs text-muted">
                      {new Date(post.created_at).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                      })}
                    </span>
                    <Badge variant="primary" size="sm">
                      ❤️ {post.likes}
                    </Badge>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </Card>

      
    </aside>
  );
}