'use client';

import { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Head from 'next/head';
import debounce from 'lodash/debounce';

type Content = {
  id: number;
  title: string;
  cover_image: string;
};

const CONTENT_TYPE = 'love song';

export default function HeartTalkPage() {
  const [contents, setContents] = useState<Content[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Content[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  // SEO Metadata
  const pageTitle = "Heart Talk - Emotional Wellness & Stress Relief Through Music";
  const pageDescription = "Find comfort in love songs and emotional connections. A multi-feature safe space for stress relief, self-care, and mental peace through music.";
  const siteUrl = "https://lirivelle.com/heart-talk";
  const keywords = [
    "stress relief",
    "emotional wellness",
    "calm your mind",
    "self-care online",
    "multi-feature safe space",
    "relax and talk",
    "digital escape space",
    "mental peace zone",
    "anonymous stress relief",
    "wellness through connection",
    "love songs",
    "emotional healing",
    "comfort music",
    "heartfelt connections"
  ].join(', ');

  // Create a debounced search function using a ref
  const debouncedSearchRef = useRef(
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
    }, 500)
  );

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

  // Safe debounce handling
  useEffect(() => {
    const debouncedFn = debouncedSearchRef.current;
    debouncedFn(searchQuery);
    return () => {
      debouncedFn.cancel();
    };
  }, [searchQuery]);

  const displayContents = searchQuery ? searchResults : contents;

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
        <meta property="og:image" content={`${siteUrl}/images/heart-talk-preview.jpg`} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={pageTitle} />
        <meta name="twitter:description" content={pageDescription} />
        <meta name="twitter:image" content={`${siteUrl}/images/heart-talk-preview.jpg`} />
        <link rel="canonical" href={siteUrl} />
      </Head>

      <div className="p-6 max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold mb-10 text-center">💖 Heart Talk</h1>

        <div className="mb-8 max-w-md mx-auto">
          <input
            type="text"
            placeholder="Search Love Songs..."
            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            aria-label="Search love songs"
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
                <Link href={`/heart-talk/${item.id}`} aria-label={`View ${item.title}`}>
                  <div className="relative w-full h-60 rounded-lg overflow-hidden shadow hover:shadow-lg transition duration-300">
                    <Image
                      src={item.cover_image}
                      alt={item.title}
                      fill
                      className="rounded-lg object-cover"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                  </div>
                  <p className="mt-2 text-center font-medium group-hover:text-pink-500 transition-colors">
                    {item.title}
                  </p>
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}