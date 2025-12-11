// src/components/ui/Avatar.tsx
interface AvatarProps {
  name: string;
  emoji?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function Avatar({ name, emoji, size = 'md', className = '' }: AvatarProps) {
  const sizeClasses = {
    sm: 'w-9 h-9 text-sm',
    md: 'w-10 h-10 text-base',
    lg: 'w-12 h-12 text-lg'
  };

  if (emoji) {
    return (
      <div className={`${sizeClasses[size]} bg-green-200 rounded-full flex items-center justify-center ${className}`} >
        <span className="text-2xl relative top-[-2px]" >{emoji}</span>
      </div>
    );
  }

  const initial = name.charAt(0).toUpperCase();

  return (
    <div className={`${sizeClasses[size]} bg-green-600 text-white rounded-full flex items-center justify-center font-semibold ${className}`}>
      {initial}
    </div>
  );
}

export * from './Avatar';