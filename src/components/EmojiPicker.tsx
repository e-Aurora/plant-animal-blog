// src/components/EmojiPicker.tsx
'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/Card';

interface EmojiPickerProps {
  currentEmoji: string;
  onSelect: (emoji: string) => void;
  onClose: () => void;
}

const AVATAR_EMOJIS = [
  '🌿', '🌱', '🌸', '🌺', '🌻', '🌷', '🌹', '🌼',
  '🦋', '🐝', '🐞', '🦗', '🐛', '🐌', '🪲', '🕷️',
  '🦊', '🐻', '🐼', '🐨', '🦁', '🐯', '🐸', '🐢',
  '🦉', '🦅', '🦆', '🐧', '🦜', '🦚', '🦩', '🐦',
  '🐠', '🐟', '🐡', '🦈', '🐙', '🦀', '🦞', '🐚',
  '🍄', '🌵', '🎋', '🌾', '🌳', '🌲', '🌴', '🍀',
  '🪴', '🌿', '☘️', '🍃', '🍂', '🍁', '🌾', '💐'
];

export default function EmojiPicker({ currentEmoji, onSelect, onClose }: EmojiPickerProps) {
  const [selectedEmoji, setSelectedEmoji] = useState(currentEmoji);

  const handleSelect = (emoji: string) => {
    setSelectedEmoji(emoji);
    onSelect(emoji);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="max-w-md w-full">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-primary">Choose Your Avatar</h3>
          <button
            onClick={onClose}
            className="text-tertiary hover:text-primary transition-colors"
          >
            ✕
          </button>
        </div>

        <div className="mb-4 text-center">
          <div className="inline-block w-20 h-20 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center text-5xl mb-2">
            {selectedEmoji}
          </div>
          <p className="text-sm text-tertiary">Current Selection</p>
        </div>

        <div className="grid grid-cols-8 gap-2 max-h-80 overflow-y-auto p-2">
          {AVATAR_EMOJIS.map((emoji,num) => (
            <button
              key={num}
              onClick={() => handleSelect(emoji)}
              className={`text-3xl rounded-lg transition-all hover:scale-110 ${
                selectedEmoji === emoji
                  ? 'bg-green-200 dark:bg-green-800 scale-110'
                  : 'hover:bg-green-100 dark:hover:bg-green-900'
              }`}
            >
              {emoji}
            </button>
          ))}
        </div>
      </Card>
    </div>
  );
}