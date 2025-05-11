'use client';

import { useState } from 'react';

interface SearchBarProps {
  onSearch?: (query: string) => void; // 🔥 optional prop
}

export default function SearchBar({ onSearch }: SearchBarProps) {
  const [query, setQuery] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    if (onSearch) {
      onSearch(value); // 🔥 Call only if onSearch exists
    }
  };

  return (
    <div className="relative w-full">
      <input
        type="text"
        value={query}
        onChange={handleChange}
        placeholder="Search blog posts..."
        className="w-full p-2 pl-10 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
      />

      {/* Optional: Search icon inside input */}
      <svg
        className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="16"
        fill="currentColor"
        viewBox="0 0 16 16"
      >
        <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398l3.85 3.85a1 1 0 0 0 1.415-1.415l-3.85-3.85zm-5.242 1.656a5.5 5.5 0 1 1 0-11 5.5 5.5 0 0 1 0 11z" />
      </svg>
    </div>
  );
}
