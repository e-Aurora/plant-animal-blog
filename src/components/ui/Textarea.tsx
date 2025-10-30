
// src/components/ui/Textarea.tsx
import { TextareaHTMLAttributes, forwardRef } from 'react';

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  helperText?: string;
  characterCount?: number;
  maxCharacters?: number;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, helperText, characterCount, maxCharacters, className = '', ...props }, ref) => {
    return (
      <div className="space-y-1">
        {label && (
          <label className="block text-sm font-medium text-secondary">
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          className={`textarea ${error ? 'border-red-500' : ''} ${className}`}
          {...props}
        />
        <div className="flex justify-between items-center">
          {error && (
            <p className="text-sm text-red-500">{error}</p>
          )}
          {helperText && !error && (
            <p className="text-sm text-muted">{helperText}</p>
          )}
          {characterCount !== undefined && maxCharacters && (
            <p className="text-sm text-muted ml-auto">
              {characterCount}/{maxCharacters}
            </p>
          )}
        </div>
      </div>
    );
  }
);

Textarea.displayName = 'Textarea';

export * from './Textarea';