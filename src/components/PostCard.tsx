// src/components/PostCard.tsx
import Link from 'next/link';
import { Post } from '@/types/blog';

interface PostCardProps {
  post: Post;
}

export default function PostCard({ post }: PostCardProps) {
  return (
    <Link
      href={`/blog/${post.id}`}
      className="group bg-white/70 backdrop-blur-sm rounded-xl p-6 border border-green-200/50 hover:border-green-400 hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
    >
      {/* Header with emoji and likes */}
      <div className="flex items-start justify-between mb-4">
        <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-green-600 rounded-lg flex items-center justify-center text-2xl">
          🌿
        </div>
        <div className="flex items-center gap-1 px-3 py-1 bg-green-50 rounded-full">
          <span className="text-lg">❤️</span>
          <span className="text-sm font-semibold text-green-700">{post.likes}</span>
        </div>
      </div>

      {/* Title */}
      <h2 className="text-xl font-bold text-green-900 mb-3 group-hover:text-green-700 transition-colors line-clamp-2">
        {post.title}
      </h2>

      {/* Excerpt */}
      <p className="text-sm text-green-700/80 mb-4 line-clamp-3 leading-relaxed">
        {post.excerpt || post.content.substring(0, 150) + '...'}
      </p>

      {/* Footer */}
      <div className="flex items-center justify-between pt-4 border-t border-green-100">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center">
            <span className="text-white text-xs font-semibold">
              {post.username?.charAt(0).toUpperCase() || 'A'}
            </span>
          </div>
          <span className="text-sm text-green-700 font-medium">
            {post.username || 'Anonymous'}
          </span>
        </div>
        <span className="text-xs text-green-500">
          {new Date(post.created_at).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
          })}
        </span>
      </div>
    </Link>
  );
}