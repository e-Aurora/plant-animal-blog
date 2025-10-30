// src/contexts/PostsContext.tsx
'use client';

import { createContext, useContext, useState, useCallback, ReactNode } from 'react';

interface PostsContextType {
  refreshTrigger: number;
  triggerRefresh: () => void;
}

const PostsContext = createContext<PostsContextType | undefined>(undefined);

export function PostsProvider({ children }: { children: ReactNode }) {
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const triggerRefresh = useCallback(() => {
    setRefreshTrigger(prev => prev + 1);
  }, []);

  return (
    <PostsContext.Provider value={{ refreshTrigger, triggerRefresh }}>
      {children}
    </PostsContext.Provider>
  );
}

export function usePostsRefresh() {
  const context = useContext(PostsContext);
  if (context === undefined) {
    throw new Error('usePostsRefresh must be used within a PostsProvider');
  }
  return context;
}