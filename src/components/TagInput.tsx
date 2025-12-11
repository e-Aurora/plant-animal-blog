// src/components/TagInput.tsx
'use client';

import { useState, KeyboardEvent } from 'react';
import { Badge } from '@/components/ui/Badge';

interface TagInputProps {
  tags: string[];
  onChange: (tags: string[]) => void;
  maxTags?: number;
  placeholder?: string;
}

export default function TagInput({ 
  tags, 
  onChange, 
  maxTags = 5,
  placeholder = 'Add tags (press Enter)...'
}: TagInputProps) {
  const [input, setInput] = useState('');
  const [suggestions, setSuggestions] = useState<string[]>([]);

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && input.trim()) {
      e.preventDefault();
      addTag(input.trim());
    } else if (e.key === 'Backspace' && !input && tags.length > 0) {
      removeTag(tags[tags.length - 1]);
    }
  };

  const addTag = (tag: string) => {
    const normalizedTag = tag.toLowerCase().replace(/\s+/g, '-');
    
    if (tags.length >= maxTags) {
      return;
    }
    
    if (!tags.includes(normalizedTag) && normalizedTag.length > 0) {
      onChange([...tags, normalizedTag]);
      setInput('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    onChange(tags.filter(tag => tag !== tagToRemove));
  };

  const handleInputChange = async (value: string) => {
    setInput(value);
    
    // Fetch tag suggestions
    if (value.length >= 2) {
      try {
        const res = await fetch(`/api/tags/search?q=${encodeURIComponent(value)}`);
        if (res.ok) {
          const data = await res.json();
          setSuggestions(data.tags.filter((t: string) => !tags.includes(t)).slice(0, 5));
        }
      } catch (error) {
        console.error('Error fetching tag suggestions:', error);
      }
    } else {
      setSuggestions([]);
    }
  };

  return (
    <div>
      <div className="flex flex-wrap gap-2 mb-2">
        {tags.map(tag => (
          <Badge key={tag} variant="primary" size="md">
            #{tag}
            <button
              onClick={() => removeTag(tag)}
              className="ml-2 hover:text-red-600"
            >
              ✕
            </button>
          </Badge>
        ))}
      </div>
      
      <div className="relative">
        <input
          type="text"
          value={input}
          onChange={(e) => handleInputChange(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={tags.length < maxTags ? placeholder : `Maximum ${maxTags} tags`}
          disabled={tags.length >= maxTags}
          className="input"
        />
        
        {suggestions.length > 0 && (
          <div className="absolute z-10 w-full mt-1 bg-surface border border-default rounded-lg shadow-lg max-h-48 overflow-y-auto">
            {suggestions.map(suggestion => (
              <button
                key={suggestion}
                onClick={() => {
                  addTag(suggestion);
                  setSuggestions([]);
                }}
                className="w-full px-4 py-2 text-left hover:bg-surface-elevated transition-colors text-secondary"
              >
                #{suggestion}
              </button>
            ))}
          </div>
        )}
      </div>
      
      <p className="text-xs text-muted mt-1">
        {tags.length}/{maxTags} tags • Press Enter to add
      </p>
    </div>
  );
}