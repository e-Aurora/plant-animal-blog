
// src/components/ui/Avatar.tsx
interface AvatarProps {
  name: string;
  size?: 'sm' | 'md' | 'lg';
  src?: string;
}

export function Avatar({ name, size = 'md', src }: AvatarProps) {
  const sizeClasses = {
    sm: 'w-8 h-8 text-sm',
    md: 'w-10 h-10 text-base',
    lg: 'w-12 h-12 text-lg'
  };

  const initial = name.charAt(0).toUpperCase();

  if (src) {
    return (
      <img 
        src={src} 
        alt={name}
        className={`${sizeClasses[size]} rounded-full object-cover`}
      />
    );
  }

  return (
    <div className={`${sizeClasses[size]} bg-green-600 text-white rounded-full flex items-center justify-center font-semibold`}>
      {initial}
    </div>
  );
}

export * from './Avatar';