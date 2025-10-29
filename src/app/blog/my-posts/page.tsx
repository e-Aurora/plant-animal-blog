// src/app/blog/my-posts/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Post } from '@/types/blog';
import LoadingSkeleton from '@/components/LoadingSkeleton';
import EmptyState from '@/components/EmptyState';

export default function MyPostsPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    fetchMyPosts();
  }, []);

  async function fetchMyPosts() {
    try {
      const res = await fetch('/api/posts/my-posts');
      if (res.ok) {
        const data = await res.json();
        setPosts(data);
      } else {
        router.push('/login');
      }
    } catch (error) {
      console.error('Error fetching posts:', error);
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(postId: number) {
    if (!confirm('Are you sure you want to delete this post? This action cannot be undone.')) {
      return;
    }

    try {
      const res = await fetch(`/api/posts/${postId}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        setPosts(posts.filter((post) => post.id !== postId));
      } else {
        alert('Failed to delete post');
      }
    } catch (error) {
      alert('Error deleting post');
    }
  }

  if (loading) {
    return (
      <div>
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-green-800">My Posts</h1>
            <p className="text-green-600 mt-1">Manage your published articles</p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[...Array(4)].map((_, i) => (
            <LoadingSkeleton key={i} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-green-900 mb-2">My Posts</h1>
          <p className="text-green-600">
            You have {posts.length} {posts.length === 1 ? 'post' : 'posts'}
          </p>
        </div>
        <Link
          href="/blog/create"
          className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium shadow-md hover:shadow-lg"
        >
          + Create New Post
        </Link>
      </div>

      {/* Posts Grid or Empty State */}
      {posts.length === 0 ? (
        <EmptyState
          title="No Posts Yet"
          description="Start sharing your knowledge about plants and animals with the community!"
          actionLabel="Create Your First Post"
          actionHref="/blog/create"
          icon="✍️"
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {posts.map((post) => (
            <div
              key={post.id}
              className="bg-white/70 backdrop-blur-sm rounded-xl p-6 border border-green-200/50 hover:border-green-300 transition-all shadow-sm hover:shadow-md"
            >
              {/* Post Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <Link
                    href={`/blog/${post.id}`}
                    className="block group"
                  >
                    <h2 className="text-xl font-bold text-green-900 group-hover:text-green-700 transition-colors mb-2 line-clamp-2">
                      {post.title}
                    </h2>
                  </Link>
                  <p className="text-sm text-green-700/80 line-clamp-3 mb-4">
                    {post.excerpt || post.content.substring(0, 150) + '...'}
                  </p>
                </div>
              </div>

              {/* Stats */}
              <div className="flex items-center gap-4 mb-4 pb-4 border-b border-green-100">
                <div className="flex items-center gap-1 text-sm">
                  <span className="text-lg">❤️</span>
                  <span className="font-semibold text-green-700">{post.likes}</span>
                  <span className="text-green-500">likes</span>
                </div>
                <div className="text-sm text-green-500">
                  {new Date(post.created_at).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                  })}
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2">
                <Link
                  href={`/blog/${post.id}`}
                  className="flex-1 px-4 py-2 bg-green-600 text-white text-center rounded-lg hover:bg-green-700 transition-colors font-medium text-sm"
                >
                  View
                </Link>
                <Link
                  href={`/blog/edit/${post.id}`}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white text-center rounded-lg hover:bg-blue-700 transition-colors font-medium text-sm"
                >
                  Edit
                </Link>
                <button
                  onClick={() => handleDelete(post.id)}
                  className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium text-sm"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}