// src/components/Footer.tsx
import Link from 'next/link';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-surface border-t border-default mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <span className="text-2xl">🌿</span>
              <span className="text-xl font-semibold text-primary">
                Plants & Animals
              </span>
            </div>
            <p className="text-tertiary text-sm mb-4">
              A community platform for nature enthusiasts to share stories, 
              knowledge, and experiences about the flora and fauna of our world.
            </p>
            <div className="flex gap-4">
              <a href="#" className="text-tertiary hover:text-primary transition-colors">
                🐦 Twitter
              </a>
              <a href="#" className="text-tertiary hover:text-primary transition-colors">
                📷 Instagram
              </a>
              <a href="#" className="text-tertiary hover:text-primary transition-colors">
                📘 Facebook
              </a>
            </div>
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

          {/* Resources */}
          <div>
            <h3 className="font-semibold text-primary mb-4">Resources</h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-tertiary hover:text-primary transition-colors text-sm">
                  About Us
                </a>
              </li>
              <li>
                <a href="#" className="text-tertiary hover:text-primary transition-colors text-sm">
                  Guidelines
                </a>
              </li>
              <li>
                <a href="#" className="text-tertiary hover:text-primary transition-colors text-sm">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#" className="text-tertiary hover:text-primary transition-colors text-sm">
                  Terms of Service
                </a>
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
            <div className="flex items-center gap-6 text-sm text-tertiary">
              <span>🌱 Celebrating biodiversity</span>
              <span>🌍 Protecting our planet</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}