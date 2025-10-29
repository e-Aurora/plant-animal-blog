// src/components/EmptyState.tsx
import Link from 'next/link';

interface EmptyStateProps {
  title: string;
  description: string;
  actionLabel?: string;
  actionHref?: string;
  icon?: string;
}

export default function EmptyState({
  title,
  description,
  actionLabel,
  actionHref,
  icon = '🌱'
}: EmptyStateProps) {
  return (
    <div className="bg-white/70 backdrop-blur-sm rounded-xl p-12 border border-green-200/50 text-center">
      <div className="text-6xl mb-4">{icon}</div>
      <h3 className="text-2xl font-bold text-green-900 mb-2">{title}</h3>
      <p className="text-green-700 mb-6">{description}</p>
      {actionLabel && actionHref && (
        <Link
          href={actionHref}
          className="inline-block px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
        >
          {actionLabel}
        </Link>
      )}
    </div>
  );
}