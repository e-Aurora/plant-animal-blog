// src/app/blog/[id]/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { useToast } from '@/components/Toast';
import { usePostsRefresh } from '@/contexts/PostsContext';
import Post from '@/components/Post';
import Comment from '@/components/Comment';

interface PostData {
  id: number;
  user_id: number;
  title: string;
  content: string;
  excerpt: string;
  created_at: string;
  username: string;
  avatar_emoji: string;
  likes: number;
  isLiked: boolean;
  tags?: string[];
}

interface CommentData {
  id: number;
  post_id: number;
  user_id: number;
  content: string;
  created_at: string;
  username: string;
  avatar_emoji: string;
  likes: number;
  isLiked?: boolean;
}

interface User {
  id: number;
  username: string;
}

export default function PostViewPage() {
  const [post, setPost] = useState<PostData | null>(null);
  const [comments, setComments] = useState<CommentData[]>([]);
  const [newComment, setNewComment] = useState('');
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const router = useRouter();
  const params = useParams();
  const postId = params.id as string;
  const { showToast, ToastContainer } = useToast();
  const { triggerRefresh } = usePostsRefresh();

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

    const wasLiked = post?.isLiked;
    setPost(prev => prev ? {
      ...prev,
      likes: prev.isLiked ? prev.likes - 1 : prev.likes + 1,
      isLiked: !prev.isLiked
    } : null);

    try {
      const res = await fetch(`/api/posts/${postId}/like`, { method: 'POST' });
      if (res.ok) {
        const data = await res.json();
        setPost(prev => prev ? { ...prev, likes: data.likes, isLiked: data.isLiked } : null);
        showToast(data.isLiked ? 'Post liked! ❤️' : 'Like removed', 'success');
        triggerRefresh();
      } else {
        fetchPost();
        showToast('Failed to update like', 'error');
      }
    } catch (error) {
      fetchPost();
      showToast('Error updating like', 'error');
    }
  }

  async function handleCommentLike(commentId: number) {
    if (!user) {
      router.push('/login');
      return;
    }

    const comment = comments.find(c => c.id === commentId);
    if (!comment) return;

    setComments(prev => prev.map(c => 
      c.id === commentId 
        ? { ...c, likes: c.isLiked ? c.likes - 1 : c.likes + 1, isLiked: !c.isLiked }
        : c
    ));

    try {
      const res = await fetch(`/api/comments/${postId}/${commentId}/like`, { method: 'POST' });
      if (res.ok) {
        const data = await res.json();
        setComments(prev => prev.map(c => 
          c.id === commentId ? { ...c, likes: data.likes, isLiked: data.isLiked } : c
        ));
      } else {
        fetchComments();
      }
    } catch (error) {
      fetchComments();
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
        await fetchComments();
        showToast('Comment posted! 💬', 'success');
      } else {
        showToast('Failed to post comment', 'error');
      }
    } catch (error) {
      showToast('Error posting comment', 'error');
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDeleteComment(commentId: number) {
    if (!confirm('Delete this comment?')) return;

    const prev = [...comments];
    setComments(comments.filter(c => c.id !== commentId));

    try {
      const res = await fetch(`/api/comments/${postId}/${commentId}`, { method: 'DELETE' });
      if (!res.ok) {
        setComments(prev);
        showToast('Failed to delete', 'error');
      } else {
        showToast('Comment deleted', 'success');
      }
    } catch (error) {
      setComments(prev);
      showToast('Error deleting comment', 'error');
    }
  }

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 border border-green-200/50 animate-pulse">
          <div className="h-10 bg-green-200 rounded w-3/4 mb-4"></div>
          <div className="h-4 bg-green-100 rounded w-1/4 mb-6"></div>
          <div className="space-y-3">
            <div className="h-4 bg-green-100 rounded"></div>
            <div className="h-4 bg-green-100 rounded w-5/6"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!post) return null;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <ToastContainer />
      
      <Link href="/" className="inline-flex items-center gap-2 text-green-700 hover:text-green-900 transition-colors font-medium">
        <span>←</span> Back to all posts
      </Link>

      <Post 
        post={post} 
        isOwner={user?.id === post.user_id}
        onLike={handleLike}
      />

      {/* Comments Section */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 border border-green-200/50 shadow-sm">
        <h2 className="text-2xl font-bold text-green-900 mb-6">
          Comments ({comments.length})
        </h2>

        {user ? (
          <form onSubmit={handleCommentSubmit} className="mb-8">
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Share your thoughts..."
              className="w-full px-4 py-3 border border-green-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 resize-none bg-white"
              rows={4}
              required
            />
            <div className="mt-3 flex justify-end">
              <button
                type="submit"
                disabled={submitting || !newComment.trim()}
                className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 font-medium"
              >
                {submitting ? 'Posting...' : 'Post Comment'}
              </button>
            </div>
          </form>
        ) : (
          <div className="mb-8 p-6 bg-green-50 border border-green-200 rounded-xl text-center">
            <p className="text-green-700">
              <Link href="/login" className="font-semibold hover:underline">Sign in</Link> to comment
            </p>
          </div>
        )}

        <div className="space-y-4">
          {comments.length === 0 ? (
            <div className="text-center py-12">
              <span className="text-6xl mb-4 block">💬</span>
              <p className="text-green-600">No comments yet. Be the first!</p>
            </div>
          ) : (
            comments.map((comment) => (
              <Comment
                key={comment.id}
                comment={comment}
                currentUserId={user?.id}
                onDelete={handleDeleteComment}
                onLike={handleCommentLike}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
}