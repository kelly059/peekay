'use client';

import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import debounce from 'lodash/debounce';

type Content = {
  id: number;
  title: string;
  cover_image: string;
};

// ✅ Define constant for content type to prevent mismatches
const CONTENT_TYPE = 'love song';

export default function HeartTalkPage() {
  const [contents, setContents] = useState<Content[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Content[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  // ✅ Fetch only content with type = "love song"
  useEffect(() => {
    const fetchContent = async () => {
      try {
        const res = await fetch(`/api/heart-talk?type=${encodeURIComponent(CONTENT_TYPE)}`);
        const data = await res.json();
        setContents(data);
      } catch (err) {
        console.error('Failed to fetch heart talks', err);
      } finally {
        setLoading(false);
      }
    };
    fetchContent();
  }, []);

  // ✅ Debounced search for "love song"
  const handleSearch = useCallback(
    debounce(async (query: string) => {
      if (!query.trim()) {
        setSearchResults([]);
        setIsSearching(false);
        return;
      }

      try {
        setIsSearching(true);
        const res = await fetch(
          `/api/searchy?query=${encodeURIComponent(query)}&type=${encodeURIComponent(CONTENT_TYPE)}`
        );
        const data = await res.json();
        if (data.success) {
          setSearchResults(data.results);
        } else {
          setSearchResults([]);
        }
      } catch (error) {
        console.error('Search error:', error);
        setSearchResults([]);
      } finally {
        setIsSearching(false);
      }
    }, 500),
    []
  );

  // ✅ Trigger search on query change
  useEffect(() => {
    handleSearch(searchQuery);
    return () => {
      handleSearch.cancel();
    };
  }, [searchQuery, handleSearch]);

  const displayContents = searchQuery ? searchResults : contents;

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-4xl font-bold mb-10 text-center">💖 Heart Talk</h1>

      {/* Search Bar */}
      <div className="mb-8 max-w-md mx-auto">
        <input
          type="text"
          placeholder="Search Love Songs..."
          className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {loading || isSearching ? (
        <p className="text-center">Loading...</p>
      ) : displayContents.length === 0 ? (
        <p className="text-center">
          {searchQuery ? 'No results found. Try a different search.' : 'No content available.'}
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {displayContents.map((item) => (
            <div key={item.id} className="group">
              <Link href={`/heart-talk/${item.id}`}>
                <img
                  src={item.cover_image}
                  alt={item.title}
                  className="w-full h-60 object-cover rounded-lg shadow hover:shadow-lg transition duration-300"
                />
                <p className="mt-2 text-center font-medium group-hover:text-pink-500 transition-colors">
                  {item.title}
                </p>
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
