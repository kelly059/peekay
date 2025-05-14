'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Head from 'next/head';
import { motion, AnimatePresence } from 'framer-motion';

interface Confession {
  id: number;
  title: string;
  description: string;
  cover_image: string | null;
  created_at: string;
}

export default function ConfessionListPage() {
  const [confessions, setConfessions] = useState<Confession[]>([]);
  const [filteredConfessions, setFilteredConfessions] = useState<Confession[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);

  // SEO Metadata
  const pageTitle = "Confession Wall - Share Your Secrets Anonymously";
  const pageDescription = "A safe space to share your true stories, relationship confessions, and dark secrets without judgment. Vent anonymously and find comfort in others' stories.";
  const siteUrl = "https://lirivelle.com/confessions";
  const keywords = [
    "anonymous confessions",
    "true stories",
    "share your secret",
    "tell it anonymously",
    "relationship confessions",
    "guilt and secrets",
    "vent without judgment",
    "dark secrets",
    "confession wall",
    "secret sharing platform",
    "anonymous venting",
    "hidden truths"
  ].join(', ');

  useEffect(() => {
    const fetchConfessions = async () => {
      try {
        const res = await fetch('/api/confessions');
        if (!res.ok) throw new Error('Failed to load confessions');

        const data = await res.json();

        const resultArray = Array.isArray(data)
          ? data
          : Array.isArray(data.results)
          ? data.results
          : null;

        if (!resultArray) {
          throw new Error('Invalid data format: expected array');
        }

        setConfessions(resultArray);
        setFilteredConfessions(resultArray);
      } catch (err: unknown) {
        console.error('Error loading confessions:', err);
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    };

    fetchConfessions();
  }, []);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!searchQuery.trim()) {
      setFilteredConfessions(confessions);
      return;
    }

    setIsSearching(true);
    try {
      const res = await fetch(`/api/searchy?query=${encodeURIComponent(searchQuery)}&type=confession`);
      if (!res.ok) throw new Error('Search failed');

      const data = await res.json();
      console.log("Search API response:", data);

      if (data.success && Array.isArray(data.results)) {
        setFilteredConfessions(data.results);
      } else {
        throw new Error('Search returned invalid data');
      }
    } catch (err: unknown) {
      console.error('Search error:', err);
      setError(err instanceof Error ? err.message : 'Unknown search error');
    } finally {
      setIsSearching(false);
    }
  };

  if (loading) {
    return (
      <>
        <Head>
          <title>{pageTitle}</title>
          <meta name="description" content={pageDescription} />
          <meta name="keywords" content={keywords} />
        </Head>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      </>
    );
  }

  if (error) {
    return (
      <>
        <Head>
          <title>{pageTitle}</title>
          <meta name="description" content={pageDescription} />
          <meta name="keywords" content={keywords} />
        </Head>
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="bg-red-50 border-l-4 border-red-500 p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
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
  }

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
        <meta property="og:image" content={`${siteUrl}/images/confession-wall-preview.jpg`} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={pageTitle} />
        <meta name="twitter:description" content={pageDescription} />
        <meta name="twitter:image" content={`${siteUrl}/images/confession-wall-preview.jpg`} />
        <link rel="canonical" href={siteUrl} />
      </Head>

      <div className="max-w-4xl mx-auto px-4 py-8">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }} className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Confession Wall</h1>
          <p className="text-gray-600">Share your thoughts anonymously without judgment</p>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: 0.1 }} className="mb-8">
          <form onSubmit={handleSearch} className="flex gap-2">
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                </svg>
              </div>
              <input
                type="text"
                placeholder="Search confessions..."
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                aria-label="Search confessions"
              />
            </div>
            <button
              type="submit"
              disabled={isSearching}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 flex items-center"
              aria-label="Search confession posts"
            >
              {isSearching ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Searching...
                </>
              ) : 'Search'}
            </button>
          </form>
        </motion.div>

        {Array.isArray(filteredConfessions) && filteredConfessions.length === 0 ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }} className="text-center py-12">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h3 className="mt-2 text-lg font-medium text-gray-900">No confessions found</h3>
            <p className="mt-1 text-gray-500">
              {searchQuery ? 'Try a different search term' : 'Be the first to share your secret'}
            </p>
          </motion.div>
        ) : (
          <div className="space-y-6">
            <AnimatePresence>
              {filteredConfessions.map((c) => (
                <motion.div
                  key={c.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                  layout
                >
                  <Link href={`/confessions/${c.id}`} passHref>
                    <div className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow cursor-pointer border border-gray-100" aria-label={`Confession: ${c.title}`}>
                      {c.cover_image && (
                        <div className="h-48 overflow-hidden relative">
                          <Image 
                            src={c.cover_image} 
                            alt={`Cover image for ${c.title}`} 
                            fill
                            className="object-cover"
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                          />
                        </div>
                      )}
                      <div className="p-6">
                        <h2 className="text-xl font-semibold text-gray-900 mb-2">{c.title}</h2>
                        <p className="text-gray-600 mb-4 line-clamp-2">{c.description}</p>
                        <p className="text-sm text-gray-400">{new Date(c.created_at).toLocaleString()}</p>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </>
  );
}