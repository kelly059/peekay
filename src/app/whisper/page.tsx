'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import Head from 'next/head';

interface Whisper {
  id: number;
  title: string;
  description: string;
  cover_image: string | null;
  created_at: string;
}

export default function WhisperListPage() {
  const [whispers, setWhispers] = useState<Whisper[]>([]);
  const [filteredWhispers, setFilteredWhispers] = useState<Whisper[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);

  // SEO Metadata
  const pageTitle = "Secret Whispers | Anonymous Confessions & Private Thoughts";
  const pageDescription = "Share your thoughts anonymously or discover what others are whispering. A safe space for secret confessions, midnight thoughts, and emotional whispers.";
  const siteUrl = "https://yourwebsite.com";
  const keywords = [
    "secret whispers",
    "anonymous whispers",
    "mysterious messages",
    "flirty whispers",
    "midnight thoughts",
    "romantic whispers",
    "secret crush confessions",
    "emotional whispers",
    "private messages online",
    "gentle late-night talk"
  ].join(', ');

  useEffect(() => {
    const fetchWhispers = async () => {
      try {
        const res = await fetch('/api/whispers');
        if (!res.ok) throw new Error('Failed to load whispers');

        const data: Whisper[] = await res.json();
        setWhispers(data);
        setFilteredWhispers(data);
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    };

    fetchWhispers();
  }, []);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!searchQuery.trim()) {
      setFilteredWhispers(whispers);
      return;
    }

    setIsSearching(true);
    try {
      const res = await fetch(`/api/searchy?query=${encodeURIComponent(searchQuery)}&type=whisper`);
      const data: { success: boolean; results: Whisper[] } = await res.json();
      if (data.success && Array.isArray(data.results)) {
        setFilteredWhispers(data.results);
      } else {
        throw new Error('Search returned invalid data');
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Search failed');
    } finally {
      setIsSearching(false);
    }
  };

  if (loading) return (
    <>
      <Head>
        <title>{pageTitle}</title>
        <meta name="description" content={pageDescription} />
        <meta name="keywords" content={keywords} />
      </Head>
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse flex flex-col items-center">
          <div className="h-12 w-12 bg-indigo-100 rounded-full mb-4"></div>
          <p className="text-gray-500">Loading whispers...</p>
        </div>
      </div>
    </>
  );

  if (error) return (
    <>
      <Head>
        <title>{pageTitle}</title>
        <meta name="description" content={pageDescription} />
        <meta name="keywords" content={keywords} />
      </Head>
      <div className="min-h-screen flex items-center justify-center">
        <div className="bg-red-50 border-l-4 border-red-500 p-4 max-w-md">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );

  return (
    <>
      <Head>
        <title>{pageTitle}</title>
        <meta name="description" content={pageDescription} />
        <meta name="keywords" content={keywords} />
        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={pageDescription} />
        <meta property="og:url" content={siteUrl} />
        <meta property="og:type" content="website" />
        <link rel="canonical" href={siteUrl} />
      </Head>

      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

          {/* Header */}
          <motion.header 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-16"
          >
            <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl sm:tracking-tight lg:text-6xl">
              Secret Whispers
            </h1>
            <p className="mt-5 max-w-xl mx-auto text-xl text-gray-500">
              Share your thoughts anonymously or discover what others are whispering...
            </p>
          </motion.header>

          {/* Search */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="max-w-2xl mx-auto mb-16"
          >
            <form onSubmit={handleSearch} className="relative">
              <div className="flex shadow-sm">
                <input
                  type="text"
                  placeholder="Search whispers..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="flex-1 min-w-0 block w-full px-5 py-3 rounded-l-lg border-0 text-base focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
                <button
                  type="submit"
                  disabled={isSearching}
                  className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-r-lg shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                >
                  {isSearching ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Searching...
                    </>
                  ) : 'Search'}
                </button>
              </div>
            </form>
          </motion.div>

          {/* Whisper List */}
          <div className="max-w-3xl mx-auto">
            {filteredWhispers.length === 0 ? (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-12"
              >
                <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <h3 className="mt-2 text-lg font-medium text-gray-900">No whispers found</h3>
                <p className="mt-1 text-gray-500">Try adjusting your search or create a new whisper.</p>
              </motion.div>
            ) : (
              <AnimatePresence>
                <div className="grid gap-8 sm:grid-cols-1 lg:grid-cols-1">
                  {filteredWhispers.map((whisper) => (
                    <motion.div
                      key={whisper.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.3 }}
                      whileHover={{ scale: 1.02 }}
                      className="flex flex-col overflow-hidden"
                    >
                      <Link href={`/whispers/${whisper.id}`}>
                        <div className="bg-white shadow-md rounded-lg overflow-hidden transition-all duration-200 hover:shadow-xl">
                          {whisper.cover_image && (
                            <div className="h-48 bg-gray-100 overflow-hidden relative">
                              <Image 
                                src={whisper.cover_image}
                                alt="Whisper cover"
                                fill
                                className="object-cover transition-transform duration-500 hover:scale-105"
                              />
                            </div>
                          )}
                          <div className="p-6">
                            <div className="flex items-center justify-between mb-2">
                              <h2 className="text-xl font-bold text-gray-900 line-clamp-1">{whisper.title}</h2>
                              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                                😉
                              </span>
                            </div>
                            <p className="text-gray-600 line-clamp-2 mb-4">{whisper.description}</p>
                            <div className="flex items-center justify-between text-sm text-gray-500">
                              <span>{new Date(whisper.created_at).toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric'
                              })}</span>
                              <span className="flex items-center">
                                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                                {new Date(whisper.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                              </span>
                            </div>
                          </div>
                        </div>
                      </Link>
                    </motion.div>
                  ))}
                </div>
              </AnimatePresence>
            )}
          </div>
        </div>
      </div>
    </>
  );
}