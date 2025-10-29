// src/app/blog/[id]/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { useToast } from '@/components/Toast';

interface Post {
  id: number;
  user_id: number;
  title: string;
  content: string;
  excerpt: string;
  created_at: string;
  username: string;
  likes: number;
  isLiked: boolean;
}

interface Comment {
  id: number;
  post_id: number;
  user_id: number;
  content: string;
  created_at: string;
  username: string;
}

interface User {
  id: number;
  username: string;
}

export default function PostViewPage() {
  const [post, setPost] = useState<Post | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const router = useRouter();
  const params = useParams();
  const postId = params.id as string;
  const { showToast, ToastContainer } = useToast();

  useEffect(() => {
    fetchUser();
    fetchPost();
    fetchComments();
  }, [postId]);

  async function fetchUser() {
    try {
      const res = await fetch('/api/auth/me');
      if (res.ok) {
        const data = await res.json();
        setUser(data.user);
      }
    } catch (error) {
      console.error('Error fetching user:', error);
    }
  }

  async function fetchPost() {
    try {
      const res = await fetch(`/api/posts/view/${postId}`);
      if (res.ok) {
        const data = await res.json();
        setPost(data);
      } else {
        router.push('/');
      }
    } catch (error) {
      console.error('Error fetching post:', error);
    } finally {
      setLoading(false);
    }
  }

  async function fetchComments() {
    try {
      const res = await fetch(`/api/comments/${postId}`);
      if (res.ok) {
        const data = await res.json();
        setComments(data);
      }
    } catch (error) {
      console.error('Error fetching comments:', error);
    }
  }

  async function handleLike() {
    if (!user) {
      router.push('/login');
      return;
    }

    // Optimistic update
    const wasLiked = post?.isLiked;
    setPost(prev => {
      if (!prev) return null;
      return {
        ...prev,
        likes: prev.isLiked ? prev.likes - 1 : prev.likes + 1,
        isLiked: !prev.isLiked
      };
    });

    try {
      const res = await fetch(`/api/posts/${postId}/like`, {
        method: 'POST',
      });

      if (res.ok) {
        const data = await res.json();
        // Update with server response to ensure accuracy
        setPost(prev => prev ? {
          ...prev,
          likes: data.likes,
          isLiked: data.isLiked
        } : null);
        
        showToast(data.isLiked ? 'Post liked! ❤️' : 'Like removed', 'success');
      } else {
        // Revert on error
        fetchPost();
        showToast('Failed to update like', 'error');
      }
    } catch (error) {
      console.error('Error liking post:', error);
      // Revert on error
      fetchPost();
      showToast('Error updating like', 'error');
    }
  }

  async function handleCommentSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!user) {
      router.push('/login');
      return;
    }

    if (!newComment.trim()) return;

    setSubmitting(true);

    try {
      const res = await fetch(`/api/comments/${postId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: newComment }),
      });

      if (res.ok) {
        setNewComment('');
        // Immediately fetch updated comments
        await fetchComments();
        showToast('Comment posted successfully! 💬', 'success');
      } else {
        showToast('Failed to post comment', 'error');
      }
    } catch (error) {
      console.error('Error posting comment:', error);
      showToast('Error posting comment', 'error');
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDeleteComment(commentId: number) {
    if (!confirm('Are you sure you want to delete this comment?')) return;

    // Optimistically remove comment from UI
    const previousComments = [...comments];
    setComments(comments.filter(c => c.id !== commentId));

    try {
      const res = await fetch(`/api/comments/${postId}/${commentId}`, {
        method: 'DELETE',
      });

      if (!res.ok) {
        // Revert on error
        setComments(previousComments);
        showToast('Failed to delete comment', 'error');
      } else {
        showToast('Comment deleted', 'success');
      }
    } catch (error) {
      console.error('Error deleting comment:', error);
      // Revert on error
      setComments(previousComments);
      showToast('Error deleting comment', 'error');
    }
  }

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 border border-green-200/50">
          <div className="animate-pulse space-y-4">
            <div className="h-10 bg-green-200 rounded w-3/4"></div>
            <div className="h-4 bg-green-100 rounded w-1/4"></div>
            <div className="space-y-3 pt-6">
              <div className="h-4 bg-green-100 rounded"></div>
              <div className="h-4 bg-green-100 rounded w-5/6"></div>
              <div className="h-4 bg-green-100 rounded w-4/6"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!post) return null;

  const isOwner = user && post.user_id === user.id;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <ToastContainer />
      {/* Back Button */}
      <Link
        href="/"
        className="inline-flex items-center gap-2 text-green-700 hover:text-green-900 transition-colors font-medium"
      >
        <span>←</span> Back to all posts
      </Link>

      {/* Post Content */}
      <article className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 md:p-12 border border-green-200/50 shadow-sm">
        {/* Header */}
        <div className="mb-8">
          {/* Title */}
          <h1 className="text-4xl md:text-5xl font-bold text-green-900 mb-6 leading-tight">
            {post.title}
          </h1>
          
          {/* Meta Info */}
          <div className="flex flex-wrap items-center gap-4 text-sm text-green-600 pb-6 border-b border-green-100">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center">
                <span className="text-white font-semibold">
                  {post.username.charAt(0).toUpperCase()}
                </span>
              </div>
              <div>
                <p className="font-semibold text-green-900">{post.username}</p>
                <p className="text-xs text-green-500">
                  {new Date(post.created_at).toLocaleDateString('en-US', {
                    month: 'long',
                    day: 'numeric',
                    year: 'numeric',
                  })}
                </p>
              </div>
            </div>

            {isOwner && (
              <div className="ml-auto flex gap-2">
                <Link
                  href={`/blog/edit/${post.id}`}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                >
                  Edit Post
                </Link>
              </div>
            )}
          </div>

          {/* Excerpt */}
          {post.excerpt && (
            <div className="mt-6 p-4 bg-green-50 border-l-4 border-green-500 rounded-r-lg">
              <p className="text-lg text-green-800 italic">
                {post.excerpt}
              </p>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="prose prose-green max-w-none mb-8">
          <div className="text-green-900 text-lg leading-relaxed whitespace-pre-wrap">
            {post.content}
          </div>
        </div>

        {/* Like Button */}
        <div className="flex items-center gap-4 pt-8 border-t border-green-100">
          <button
            onClick={handleLike}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl transition-all ${
              post.isLiked
                ? 'bg-red-100 text-red-700 hover:bg-red-200 shadow-md'
                : 'bg-green-100 text-green-700 hover:bg-green-200'
            }`}
          >
            <span className="text-2xl">{post.isLiked ? '❤️' : '🤍'}</span>
            <span className="font-semibold">{post.likes}</span>
          </button>
        </div>
      </article>

      {/* Comments Section */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 border border-green-200/50 shadow-sm">
        <h2 className="text-2xl font-bold text-green-900 mb-6">
          Comments ({comments.length})
        </h2>

        {/* Add Comment Form */}
        {user ? (
          <form onSubmit={handleCommentSubmit} className="mb-8">
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Share your thoughts..."
              className="w-full px-4 py-3 border border-green-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none bg-white"
              rows={4}
              required
            />
            <div className="mt-3 flex justify-end">
              <button
                type="submit"
                disabled={submitting || !newComment.trim()}
                className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
              >
                {submitting ? 'Posting...' : 'Post Comment'}
              </button>
            </div>
          </form>
        ) : (
          <div className="mb-8 p-6 bg-green-50 border border-green-200 rounded-xl text-center">
            <p className="text-green-700">
              <Link href="/login" className="font-semibold hover:underline text-green-800">
                Sign in
              </Link>{' '}
              to join the conversation
            </p>
          </div>
        )}

        {/* Comments List */}
        <div className="space-y-4">
          {comments.length === 0 ? (
            <div className="text-center py-12">
              <span className="text-6xl mb-4 block">💬</span>
              <p className="text-green-600">
                No comments yet. Be the first to share your thoughts!
              </p>
            </div>
          ) : (
            comments.map((comment) => (
              <div
                key={comment.id}
                className="bg-green-50/50 rounded-xl p-5 border border-green-100 hover:border-green-200 transition-colors"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-green-600 text-white rounded-full flex items-center justify-center font-semibold flex-shrink-0">
                      {comment.username.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="font-semibold text-green-900">
                        {comment.username}
                      </p>
                      <p className="text-xs text-green-500">
                        {new Date(comment.created_at).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </p>
                    </div>
                  </div>

                  {user && comment.user_id === user.id && (
                    <button
                      onClick={() => handleDeleteComment(comment.id)}
                      className="text-red-600 hover:text-red-800 text-sm font-medium"
                    >
                      Delete
                    </button>
                  )}
                </div>

                <p className="text-green-800 whitespace-pre-wrap leading-relaxed pl-13">
                  {comment.content}
                </p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}