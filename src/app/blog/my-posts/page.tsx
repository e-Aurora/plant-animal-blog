// src/app/blog/my-posts/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Post } from '@/types/blog';

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
    if (!confirm('Are you sure you want to delete this post?')) {
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
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {[...Array(4)].map((_, i) => (
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
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-green-800 mb-2">My Posts</h1>
          <p className="text-green-600">Manage your published articles</p>
        </div>
        <Link
          href="/blog/create"
          className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
        >
          Create New Post
        </Link>
      </div>

      {posts.length === 0 ? (
        <div className="bg-white/60 backdrop-blur-sm rounded-lg p-12 border border-green-100 text-center">
          <p className="text-green-700 text-lg mb-4">
            You haven't created any posts yet.
          </p>
          <Link
            href="/blog/create"
            className="inline-block px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            Create Your First Post
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {posts.map((post) => (
            <div
              key={post.id}
              className="bg-white/60 backdrop-blur-sm rounded-lg p-6 border border-green-100"
            >
              <div className="flex items-start justify-between mb-3">
                <h2 className="text-lg font-semibold text-green-900 flex-1">
                  {post.title}
                </h2>
                <span className="text-sm text-green-600 ml-2 flex-shrink-0">
                  ❤️ {post.likes}
                </span>
              </div>

              <p className="text-sm text-green-700 mb-4 line-clamp-3">
                {post.excerpt || post.content.substring(0, 150) + '...'}
              </p>

              <div className="flex items-center justify-between text-xs text-green-500 mb-4">
                <span>
                  {new Date(post.created_at).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                  })}
                </span>
              </div>

              <div className="flex gap-2">
                <Link
                  href={`/blog/${post.id}`}
                  className="flex-1 px-4 py-2 bg-green-600 text-white text-center rounded-lg hover:bg-green-700 transition-colors"
                >
                  View
                </Link>
                <Link
                  href={`/blog/edit/${post.id}`}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white text-center rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Edit
                </Link>
                <button
                  onClick={() => handleDelete(post.id)}
                  className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
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