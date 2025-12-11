// src/components/Footer.tsx
import Link from 'next/link';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-surface border-t border-default mt-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col md:flex-row justify-between mb-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <span className="text-2xl">🌿</span>
              <span className="text-xl font-semibold text-primary">
                Petals & Paws
              </span>
            </div>
            <p className="text-tertiary text-sm mb-4">
              A community platform for nature lovers to share stories, 
              knowledge, and experiences about the petals and paws of our world.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-primary mb-4">Explore</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-tertiary hover:text-primary transition-colors text-sm">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/blog/create" className="text-tertiary hover:text-primary transition-colors text-sm">
                  Write a Post
                </Link>
              </li>
              <li>
                <Link href="/blog/my-posts" className="text-tertiary hover:text-primary transition-colors text-sm">
                  My Posts
                </Link>
              </li>
              <li>
                <Link href="/notifications" className="text-tertiary hover:text-primary transition-colors text-sm">
                  Notifications
                </Link>
              </li>
            </ul>
          </div>
</div>
        {/* Bottom Bar */}
        <div className="pt-8 border-t border-default">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-tertiary">
              © {currentYear} Plants & Animals. Made with 💚 for nature lovers.
            </p>
            
          </div>
        </div>
      </div>
    </footer>
  );
}