// src/app/blog/edit/[id]/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';

export default function EditPostPage() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const router = useRouter();
  const params = useParams();
  const postId = params.id as string;

  useEffect(() => {
    fetchPost();
  }, []);

  async function fetchPost() {
    try {
      const res = await fetch(`/api/posts/single/${postId}`);
      if (res.ok) {
        const post = await res.json();
        setTitle(post.title);
        setContent(post.content);
        setExcerpt(post.excerpt || '');
      } else {
        setError('Post not found');
        setTimeout(() => router.push('/blog/my-posts'), 2000);
      }
    } catch (err) {
      setError('Failed to load post');
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setSaving(true);

    try {
      const res = await fetch(`/api/posts/${postId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, content, excerpt }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Failed to update post');
        return;
      }

      router.push(`/blog/${postId}`);
      router.refresh();
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="bg-white/80 backdrop-blur-sm rounded-lg p-8 border border-green-100">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-green-200 rounded w-1/4"></div>
            <div className="h-4 bg-green-100 rounded"></div>
            <div className="h-4 bg-green-100 rounded w-5/6"></div>
            <div className="h-64 bg-green-100 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white/80 backdrop-blur-sm rounded-lg p-8 border border-green-100">
        <h1 className="text-3xl font-bold text-green-800 mb-6">Edit Post</h1>

        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-300 text-red-700 rounded-lg">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-green-700 font-medium mb-2">
              Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-2 border border-green-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              required
            />
          </div>

          <div>
            <label className="block text-green-700 font-medium mb-2">
              Excerpt (Short Description)
            </label>
            <textarea
              value={excerpt}
              onChange={(e) => setExcerpt(e.target.value)}
              className="w-full px-4 py-2 border border-green-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              rows={2}
              maxLength={200}
            />
            <p className="text-sm text-green-600 mt-1">
              {excerpt.length}/200 characters
            </p>
          </div>

          <div>
            <label className="block text-green-700 font-medium mb-2">
              Content
            </label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full px-4 py-2 border border-green-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              rows={15}
              required
            />
          </div>

          <div className="flex gap-4">
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
            >
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
            <button
              type="button"
              onClick={() => router.back()}
              className="px-6 py-3 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}