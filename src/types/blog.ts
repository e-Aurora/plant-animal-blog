
// src/types/blog.ts
export interface Post {
  id: number;
  user_id: number;
  title: string;
  content: string;
  excerpt: string;
  created_at: string;
  likes: number;
  username?: string;
}