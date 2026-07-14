'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useSearchStore } from '@/stores';
import { mockListings } from '@/lib/marketplace';

const suggestionsFromCatalog = mockListings.map((l) => l.title);

export function SearchBar({ className }: { className?: string }) {
  const router = useRouter();
  const { query, setQuery, suggestions, setSuggestions } = useSearchStore();
  const [isOpen, setIsOpen] = useState(false);
  const [focused, setFocused] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setIsOpen(false);
        setFocused(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const handleInput = (value: string) => {
    setQuery(value);
    if (value.length >= 2) {
      const filtered = suggestionsFromCatalog.filter((s) =>
        s.toLowerCase().includes(value.toLowerCase()),
      );
      setSuggestions(filtered.slice(0, 6));
      setIsOpen(filtered.length > 0);
    } else {
      setSuggestions([]);
      setIsOpen(false);
    }
  };

  const handleSearch = (term?: string) => {
    const q = term ?? query;
    if (q.trim()) {
      router.push(`/catalog?q=${encodeURIComponent(q.trim())}`);
      setIsOpen(false);
      setFocused(false);
    }
  };

  return (
    <div ref={ref} className={`relative ${className ?? ''}`}>
      <motion.div
        animate={{
          boxShadow: focused
            ? '0 4px 20px rgba(21, 101, 192, 0.15)'
            : '0 2px 8px rgba(0, 0, 0, 0.08)',
        }}
        transition={{ duration: 0.3 }}
        className="flex items-center rounded-button bg-surface ring-1 ring-gray-100"
      >
        <Search className="ml-4 h-5 w-5 text-text-secondary" />
        <input
          type="text"
          value={query}
          onChange={(e) => handleInput(e.target.value)}
          onFocus={() => {
            setFocused(true);
            if (suggestions.length > 0) setIsOpen(true);
          }}
          onBlur={() => setFocused(false)}
          onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
          placeholder="Поиск шин, дисков, размеров..."
          className="flex-1 bg-transparent px-3 py-3.5 text-sm text-text-primary placeholder:text-text-secondary/60 focus:outline-none"
        />
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => handleSearch()}
          className="mr-1.5 rounded-button bg-primary px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-primary-dark"
        >
          Найти
        </motion.button>
      </motion.div>

      <AnimatePresence>
        {isOpen && suggestions.length > 0 && (
          <motion.ul
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className="absolute left-0 right-0 top-full z-50 mt-2 overflow-hidden rounded-card bg-surface shadow-elevation ring-1 ring-gray-100"
          >
            {suggestions.map((suggestion, i) => (
              <motion.li
                key={suggestion}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.04 }}
              >
                <button
                  onClick={() => {
                    setQuery(suggestion);
                    handleSearch(suggestion);
                  }}
                  className="flex w-full items-center gap-3 px-4 py-3 text-left text-sm text-text-primary transition-colors hover:bg-background"
                >
                  <Search className="h-4 w-4 text-text-secondary" />
                  {suggestion}
                </button>
              </motion.li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
}
