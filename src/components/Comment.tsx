// src/components/Comment.tsx
'use client';

import Link from 'next/link';
import { Avatar } from '@/components/ui/Avatar';

interface CommentProps {
  comment: {
    id: number;
    user_id: number;
    content: string;
    created_at: string;
    username: string;
    avatar_emoji: string;
    likes: number;
    isLiked?: boolean;
  };
  currentUserId?: number;
  onDelete: (id: number) => void;
  onLike: (id: number) => void;
}

export default function Comment({ comment, currentUserId, onDelete, onLike }: CommentProps) {
  const isOwner = currentUserId === comment.user_id;

  return (
    <div className="bg-green-50/50 rounded-xl p-5 border border-green-100 hover:border-green-200 transition-colors">
      <div className="flex items-start justify-between mb-3">
        <Link 
          href={`/profile/${comment.username}`}
          className="flex items-center gap-3 hover:opacity-70 transition-opacity"
        >
          <Avatar 
            name={comment.username} 
            emoji={comment.avatar_emoji}
            size="md"
          />
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
        </Link>

        <div className="flex items-center gap-3">
          {/* Like Button */}
          <button
            onClick={() => onLike(comment.id)}
            className={`flex items-center gap-1 px-3 py-1 rounded-lg transition-colors text-sm ${
              comment.isLiked
                ? 'bg-red-100 text-red-700 hover:bg-red-200'
                : 'bg-green-100 text-green-700 hover:bg-green-200'
            }`}
          >
            <span>{comment.isLiked ? '❤️' : '🤍'}</span>
            <span className="font-medium">{comment.likes}</span>
          </button>

          {isOwner && (
            <button
              onClick={() => onDelete(comment.id)}
              className="text-red-600 hover:text-red-800 text-sm font-medium"
            >
              Delete
            </button>
          )}
        </div>
      </div>

      <p className="text-green-800 whitespace-pre-wrap leading-relaxed pl-13">
        {comment.content}
      </p>
    </div>
  );
}