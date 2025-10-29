// src/app/blog/[id]/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';

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
        router.push('/blog');
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

    try {
      const res = await fetch(`/api/posts/${postId}/like`, {
        method: 'POST',
      });

      if (res.ok) {
        const data = await res.json();
        setPost(prev => prev ? {
          ...prev,
          likes: data.likes,
          isLiked: data.isLiked
        } : null);
      }
    } catch (error) {
      console.error('Error liking post:', error);
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
        fetchComments();
      }
    } catch (error) {
      console.error('Error posting comment:', error);
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDeleteComment(commentId: number) {
    if (!confirm('Are you sure you want to delete this comment?')) return;

    try {
      const res = await fetch(`/api/comments/${postId}/${commentId}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        setComments(comments.filter(c => c.id !== commentId));
      }
    } catch (error) {
      console.error('Error deleting comment:', error);
    }
  }

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="bg-white/80 backdrop-blur-sm rounded-lg p-8 border border-green-100">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-green-200 rounded w-3/4"></div>
            <div className="h-4 bg-green-100 rounded w-1/4"></div>
            <div className="h-64 bg-green-100 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!post) return null;

  const isOwner = user && post.user_id === user.id;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Post Content */}
      <article className="bg-white/80 backdrop-blur-sm rounded-lg p-8 border border-green-100">
        <div className="mb-6">
          <h1 className="text-4xl font-bold text-green-900 mb-4">
            {post.title}
          </h1>
          
          <div className="flex items-center justify-between text-sm text-green-600 mb-4">
            <div className="flex items-center space-x-4">
              <span className="font-medium">By {post.username}</span>
              <span>•</span>
              <span>
                {new Date(post.created_at).toLocaleDateString('en-US', {
                  month: 'long',
                  day: 'numeric',
                  year: 'numeric',
                })}
              </span>
            </div>

            {isOwner && (
              <div className="flex gap-2">
                <Link
                  href={`/blog/edit/${post.id}`}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                >
                  Edit
                </Link>
              </div>
            )}
          </div>

          {post.excerpt && (
            <p className="text-lg text-green-700 italic border-l-4 border-green-500 pl-4 mb-6">
              {post.excerpt}
            </p>
          )}
        </div>

        <div className="prose prose-green max-w-none mb-8">
          <div className="text-green-800 whitespace-pre-wrap leading-relaxed">
            {post.content}
          </div>
        </div>

        {/* Like Button */}
        <div className="flex items-center gap-4 pt-6 border-t border-green-100">
          <button
            onClick={handleLike}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
              post.isLiked
                ? 'bg-red-100 text-red-700 hover:bg-red-200'
                : 'bg-green-100 text-green-700 hover:bg-green-200'
            }`}
          >
            <span className="text-xl">{post.isLiked ? '❤️' : '🤍'}</span>
            <span className="font-medium">{post.likes} Likes</span>
          </button>
        </div>
      </article>

      {/* Comments Section */}
      <div className="bg-white/80 backdrop-blur-sm rounded-lg p-8 border border-green-100">
        <h2 className="text-2xl font-bold text-green-900 mb-6">
          Comments ({comments.length})
        </h2>

        {/* Add Comment Form */}
        {user ? (
          <form onSubmit={handleCommentSubmit} className="mb-8">
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Write a comment..."
              className="w-full px-4 py-3 border border-green-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 resize-none"
              rows={3}
              required
            />
            <div className="mt-3 flex justify-end">
              <button
                type="submit"
                disabled={submitting || !newComment.trim()}
                className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
              >
                {submitting ? 'Posting...' : 'Post Comment'}
              </button>
            </div>
          </form>
        ) : (
          <div className="mb-8 p-4 bg-green-50 border border-green-200 rounded-lg text-center">
            <p className="text-green-700">
              <Link href="/login" className="font-semibold hover:underline">
                Sign in
              </Link>{' '}
              to leave a comment
            </p>
          </div>
        )}

        {/* Comments List */}
        <div className="space-y-4">
          {comments.length === 0 ? (
            <p className="text-green-600 text-center py-8">
              No comments yet. Be the first to comment!
            </p>
          ) : (
            comments.map((comment) => (
              <div
                key={comment.id}
                className="bg-green-50/50 rounded-lg p-4 border border-green-100"
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center font-semibold text-sm">
                      {comment.username.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="font-medium text-green-900">
                        {comment.username}
                      </p>
                      <p className="text-xs text-green-600">
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
                      className="text-red-600 hover:text-red-800 text-sm"
                    >
                      Delete
                    </button>
                  )}
                </div>

                <p className="text-green-800 whitespace-pre-wrap">
                  {comment.content}
                </p>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Back Button */}
      <div className="flex justify-center">
        <Link
          href="/blog"
          className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
        >
          ← Back to All Posts
        </Link>
      </div>
    </div>
  );
}