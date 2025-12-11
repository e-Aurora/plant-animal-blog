// src/components/PostCard.tsx
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Post } from '@/types/blog';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Avatar } from '@/components/ui/Avatar';


interface PostCardProps {
  post: Post;
}


export default function PostCard({ post }: PostCardProps) {
  const pathname = usePathname();
  const isProfilePage = pathname.startsWith('/profile/'); 
  return (
    <Card hover className="h-full flex flex-col">
      {/* Header with likes */}
      {!isProfilePage && (<div className="flex items-start justify-between mb-4">
        <Badge variant="secondary" size="sm">
          <span className="mr-1">❤️</span>
          {post.likes}
        </Badge>
      </div>)}
      

      {/* Title */}
      <Link href={`/blog/${post.id}`}>
        <h2 className="text-xl font-bold text-primary mb-3 hover:text-secondary transition-colors line-clamp-2">
          {post.title}
        </h2>
      </Link>

      {/* Excerpt */}
      <Link href={`/blog/${post.id}`}>
        <p className="text-sm text-tertiary mb-4 line-clamp-3 leading-relaxed flex-grow">
          {post.excerpt}
        </p>
      </Link>

      {/* Post Content */}
      {isProfilePage && (
        <div className="flex-grow mb-4">
          <Link href={`/blog/${post.id}`}>
            <p className="text-sm text-tertiary line-clamp-4 leading-relaxed">
              {post.content}
            </p>
          </Link>
        </div>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between pt-4 border-t border-default">
        
          {isProfilePage ? (
          <div className="flex items-start justify-between">
        <Badge variant="secondary" size="md">
          <span className="mr-1">❤️</span>
          {post.likes}
        </Badge>
      </div>) : (
          <Link 
          href={`/profile/${post.username}`}
          className="flex items-center gap-2 hover:opacity-70 transition-opacity"
        >
          <Avatar name={post.username || 'Anonymous'} emoji={post.avatar_emoji} size="sm" />
          <span className="text-sm text-secondary font-medium">
            {post.username || 'Anonymous'}
          </span>
          </Link>
          )}
        
        <span className="text-xs text-muted">
          {new Date(post.created_at).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
          })}
        </span>
      </div>
    </Card>
  );
}