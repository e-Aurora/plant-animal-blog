// src/app/blog/create/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Button } from '@/components/ui/Button';
import { Alert } from '@/components/ui/Alert';
import { Card } from '@/components/ui/Card';
import { usePostsRefresh } from '@/contexts/PostsContext';

export default function CreatePostPage() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [authenticated, setAuthenticated] = useState(false);
  const router = useRouter();
  const { triggerRefresh } = usePostsRefresh();

  useEffect(() => {
    checkAuth();
  }, []);

  async function checkAuth() {
    try {
      const res = await fetch('/api/auth/me');
      if (res.ok) {
        setAuthenticated(true);
      } else {
        router.push('/login');
      }
    } catch (error) {
      router.push('/login');
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/posts/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, content, excerpt }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Failed to create post');
        return;
      }

      triggerRefresh();
      router.push(`/blog/${data.id}`);
      router.refresh();
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  if (!authenticated) {
    return null;
  }

  return (
    <div className="max-w-4xl mx-auto">
      <Card>
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-primary mb-2">
            Create New Post
          </h1>
          <p className="text-tertiary">
            Share your knowledge about plants and animals
          </p>
        </div>

        {error && (
          <Alert type="error" onClose={() => setError('')}>
            {error}
          </Alert>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <Input
            label="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Give your post a captivating title"
            required
          />

          <Textarea
            label="Excerpt (Short Description)"
            value={excerpt}
            onChange={(e) => setExcerpt(e.target.value)}
            placeholder="Write a brief summary of your post..."
            rows={2}
            maxLength={200}
            characterCount={excerpt.length}
            maxCharacters={200}
          />

          <Textarea
            label="Content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Share your story, knowledge, or observations..."
            rows={15}
            required
          />

          <div className="flex gap-4 pt-4">
            <Button
              type="submit"
              variant="primary"
              isLoading={loading}
            >
              Publish Post
            </Button>
            <Button
              type="button"
              onClick={() => router.back()}
              variant="outline"
            >
              Cancel
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}