// src/components/HeroSection.tsx
import Link from 'next/link';

export default function HeroSection() {
  return (
    <div className="bg-gradient-to-r from-green-50 via-amber-50 to-green-50 rounded-2xl p-8 md:p-12 mb-8 border border-green-200/50 shadow-sm">
      <div className="max-w-3xl">
        <div className="flex items-center gap-3 mb-4">
          <span className="text-4xl">🌿</span>
          <span className="text-4xl">🦋</span>
          <span className="text-4xl">🌸</span>
        </div>
        
        <h1 className="text-4xl md:text-5xl font-bold text-green-900 mb-4">
          Welcome to Flora & Fauna
        </h1>
        
        <p className="text-lg text-green-700 mb-6 leading-relaxed">
          Discover the wonders of the natural world through our collection of articles 
          about plants, animals, and the beautiful ecosystems they create together.
        </p>
        
        <div className="flex flex-wrap gap-4">
          <Link
            href="/blog/create"
            className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors shadow-md hover:shadow-lg font-medium"
          >
            Share Your Story
          </Link>
          <a
            href="#posts"
            className="px-6 py-3 bg-white/80 text-green-700 rounded-lg hover:bg-white transition-colors border border-green-200 font-medium"
          >
            Explore Posts
          </a>
        </div>
      </div>
    </div>
  );
}