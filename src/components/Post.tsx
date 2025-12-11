// src/components/Post.tsx
'use client';

import Link from 'next/link';
import { Avatar } from '@/components/ui/Avatar';
import { Badge } from '@/components/ui/Badge';

interface PostProps {
  post: {
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
  };
  isOwner: boolean;
  onLike: () => void;
}

export default function Post({ post, isOwner, onLike }: PostProps) {
  return (
    <article className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 md:p-12 border border-green-200/50 shadow-sm">
      <div className="mb-8">
        <h1 className="text-4xl md:text-5xl font-bold text-green-900 mb-6 leading-tight">
          {post.title}
        </h1>
        
        <div className="flex flex-wrap items-center gap-4 text-sm text-green-600 pb-6 border-b border-green-100">
          <Link 
            href={`/profile/${post.username}`}
            className="flex items-center gap-2 hover:opacity-70 transition-opacity"
          >
            <Avatar name={post.username} emoji={post.avatar_emoji} size="md" />
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
          </Link>

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

        {post.excerpt && (
          <div className="mt-6 p-4 bg-green-50 border-l-4 border-green-500 rounded-r-lg">
            <p className="text-lg text-green-800 italic">
              {post.excerpt}
            </p>
          </div>
        )}

        {/* Tags */}
        {post.tags && post.tags.length > 0 && (
          <div className="mt-6 flex flex-wrap gap-2">
            {post.tags.map((tag) => (
              <Link key={tag} href={`/tag/${tag}`}>
                <Badge variant="primary" size="sm" className="hover:bg-green-200 transition-colors cursor-pointer">
                  #{tag}
                </Badge>
              </Link>
            ))}
          </div>
        )}
      </div>

      <div className="prose prose-green max-w-none mb-8">
        <div className="text-green-900 text-lg leading-relaxed whitespace-pre-wrap">
          {post.content}
        </div>
      </div>

      <div className="flex items-center gap-4 pt-8 border-t border-green-100">
        <button
          onClick={onLike}
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
  );
}