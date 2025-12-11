// src/app/layout.tsx
import type { Metadata } from "next";

import "./globals.css";
import Navigation from '@/components/Navigation';
import Sidebar from '@/components/Sidebar';
import { PostsProvider } from '@/contexts/PostsContext';



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
    <html lang="en">
      <body
        
      >
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
            
          </div>
        </PostsProvider>
      </body>
    </html>
  );
}