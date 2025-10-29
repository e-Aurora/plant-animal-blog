// src/components/LoadingSkeleton.tsx
export default function LoadingSkeleton() {
  return (
    <div className="bg-white/70 backdrop-blur-sm rounded-xl p-6 border border-green-200/50 animate-pulse">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="w-12 h-12 bg-green-200 rounded-lg"></div>
        <div className="w-16 h-8 bg-green-100 rounded-full"></div>
      </div>

      {/* Title */}
      <div className="h-6 bg-green-200 rounded w-3/4 mb-3"></div>

      {/* Excerpt */}
      <div className="space-y-2 mb-4">
        <div className="h-4 bg-green-100 rounded"></div>
        <div className="h-4 bg-green-100 rounded w-5/6"></div>
        <div className="h-4 bg-green-100 rounded w-4/6"></div>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between pt-4 border-t border-green-100">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-green-200 rounded-full"></div>
          <div className="h-4 bg-green-200 rounded w-20"></div>
        </div>
        <div className="h-3 bg-green-100 rounded w-16"></div>
      </div>
    </div>
  );
}