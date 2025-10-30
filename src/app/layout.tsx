
// src/app/layout.tsx
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navigation from '@/components/Navigation';
import Sidebar from '@/components/Sidebar';
import { PostsProvider } from '@/contexts/PostsContext';
import { ThemeProvider } from '@/contexts/ThemeContext';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Flora & Fauna - Nature Blog",
  description: "Share and discover stories about plants and animals",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider>
          <PostsProvider>
            <div className="min-h-screen bg-secondary">
              <Navigation />
              
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="flex gap-8">
                  {/* Main Content Area */}
                  <main className="flex-1 min-w-0">
                    {children}
                  </main>
                  
                  {/* Sidebar */}
                  <Sidebar />
                </div>
              </div>
              
              {/* Footer 
              <footer className="bg-surface border-t border-default mt-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                  <div className="text-center text-muted text-sm">
                    <p className="mb-2">🌿 Flora & Fauna - Celebrating Nature 🦋</p>
                    <p>Made with 💚 for nature lovers</p>
                  </div>
                </div>
              </footer>*/}
            </div>
          </PostsProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}