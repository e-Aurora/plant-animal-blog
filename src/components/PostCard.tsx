// src/components/PostCard.tsx
import Link from 'next/link';
import { Post } from '@/types/blog';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Avatar } from '@/components/ui/Avatar';

interface PostCardProps {
  post: Post;
}

export default function PostCard({ post }: PostCardProps) {
  return (
    <Link href={`/blog/${post.id}`}>
      <Card hover className="h-full flex flex-col">
        {/* Header with likes */}
        <div className="flex items-start justify-between mb-4">
          
          <Badge variant="secondary" size="sm">
            <span className="mr-1">❤️</span>
            {post.likes}
          </Badge>
        </div>

        {/* Title */}
        <h2 className="text-xl font-bold text-primary mb-3 group-hover:text-secondary transition-colors line-clamp-2">
          {post.title}
        </h2>

        {/* Excerpt */}
        <p className="text-sm text-tertiary mb-4 line-clamp-3 leading-relaxed flex-grow">
          {post.excerpt || post.content.substring(0, 150) + '...'}
        </p>

        {/* Footer */}
        <div className="flex items-center justify-between pt-4 border-t border-default">
          <div className="flex items-center gap-2">
            <Avatar name={post.username || 'Anonymous'} size="sm" />
            <span className="text-sm text-secondary font-medium">
              {post.username || 'Anonymous'}
            </span>
          </div>
          <span className="text-xs text-muted">
            {new Date(post.created_at).toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
            })}
          </span>
        </div>
      </Card>
    </Link>
  );
}