// src/app/blog/edit/[id]/page.tsx
// ============================================

'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Button } from '@/components/ui/Button';
import { Alert } from '@/components/ui/Alert';
import { Card } from '@/components/ui/Card';
import { Skeleton } from '@/components/ui/Skeleton';
import { usePostsRefresh } from '@/contexts/PostsContext';

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
  const { triggerRefresh } = usePostsRefresh();

  useEffect(() => {
    fetchPost();
  }, [postId]);

  async function fetchPost() {
    try {
      const res = await fetch(`/api/posts/single/${postId}`);
      
      if (res.ok) {
        const post = await res.json();
        setTitle(post.title);
        setContent(post.content);
        setExcerpt(post.excerpt || '');
      } else if (res.status === 403) {
        setError('You do not have permission to edit this post');
        setTimeout(() => router.push('/blog/my-posts'), 2000);
      } else if (res.status === 404) {
        setError('Post not found');
        setTimeout(() => router.push('/blog/my-posts'), 2000);
      } else {
        setError('Failed to load post');
        setTimeout(() => router.push('/blog/my-posts'), 2000);
      }
    } catch (err) {
      console.error('Error fetching post:', err);
      setError('Failed to load post');
      setTimeout(() => router.push('/blog/my-posts'), 2000);
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

      triggerRefresh();
      router.push(`/blog/${postId}`);
      router.refresh();
    } catch (err) {
      console.error('Error updating post:', err);
      setError('An error occurred. Please try again.');
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto">
        <Card>
          <div className="space-y-4">
            <Skeleton className="h-8 w-1/4" />
            <Skeleton className="h-10" />
            <Skeleton className="h-20" />
            <Skeleton className="h-64" />
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <Card>
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-primary mb-2">
            Edit Post
          </h1>
          <p className="text-tertiary">
            Update your post content
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
            placeholder="Post title"
            required
          />

          <Textarea
            label="Excerpt (Short Description)"
            value={excerpt}
            onChange={(e) => setExcerpt(e.target.value)}
            placeholder="Brief summary..."
            rows={2}
            maxLength={200}
            characterCount={excerpt.length}
            maxCharacters={200}
          />

          <Textarea
            label="Content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Post content..."
            rows={15}
            required
          />

          <div className="flex gap-4 pt-4">
            <Button
              type="submit"
              variant="primary"
              isLoading={saving}
            >
              Save Changes
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