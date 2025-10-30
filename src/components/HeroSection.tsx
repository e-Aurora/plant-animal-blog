// src/components/HeroSection.tsx
import Link from 'next/link';
import { Button } from '@/components/ui/Button';

export default function HeroSection() {
  return (
    <div className="relative overflow-hidden rounded-2xl p-8 md:p-12 mb-8 shadow-lg">
      {/* Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-green-50 via-pink-50 to-amber-50 dark:from-green-900 dark:via-pink-900 dark:to-amber-900 opacity-70"></div>
      
      {/* Pattern Overlay */}
      <div className="absolute inset-0 opacity-10" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
      }}></div>
      
      {/* Content */}
      <div className="relative max-w-3xl">
        <div className="flex items-center gap-3 mb-4">
          <span className="text-4xl animate-bounce">🌿</span>
          <span className="text-4xl animate-bounce" style={{ animationDelay: '0.1s' }}>🦋</span>
          <span className="text-4xl animate-bounce" style={{ animationDelay: '0.2s' }}>🌸</span>
        </div>
        
        <h1 className="text-4xl md:text-5xl font-bold text-primary mb-4">
          Welcome to Flora & Fauna
        </h1>
        
        <p className="text-lg text-secondary mb-6 leading-relaxed">
          Discover the wonders of the natural world through our collection of articles 
          about plants, animals, and the beautiful ecosystems they create together.
        </p>
        
        <div className="flex flex-wrap gap-4">
          <Button
            onClick={() => window.location.href = '/blog/create'}
            variant="primary"
          >
            Share Your Story
          </Button>
          <Button
            onClick={() => document.getElementById('posts')?.scrollIntoView({ behavior: 'smooth' })}
            variant="outline"
          >
            Explore Posts
          </Button>
        </div>
      </div>
    </div>
  );
}