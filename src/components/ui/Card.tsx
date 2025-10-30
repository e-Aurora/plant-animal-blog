// src/components/ui/Card.tsx
import { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  hover?: boolean;
  className?: string;
  onClick?: () => void;
}

export function Card({ children, hover = false, className = '', onClick }: CardProps) {
  return (
    <div 
      className={`card ${hover ? 'card-hover cursor-pointer' : ''} ${className}`}
      onClick={onClick}
    >
      {children}
    </div>
  );
}

export * from './Card';