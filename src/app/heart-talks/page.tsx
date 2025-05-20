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
  duration?: string; // Added duration property
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
        // Add mock duration if not provided by API
        const contentsWithDuration = data.map((item: Content) => ({
          ...item,
          duration: item.duration || `${Math.floor(Math.random() * 4) + 2}:${Math.floor(Math.random() * 60).toString().padStart(2, '0')}`
        }));
        setContents(contentsWithDuration);
      } catch (err) {
        console.error('Failed to fetch heart talks', err);
      } finally {
        setLoading(false);
      }
    };
    fetchContent();
  }, []);

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

      <div className="min-h-screen bg-gradient-to-b from-pink-50 to-purple-50 p-6">
        <div className="max-w-6xl mx-auto">
          {/* Header Section */}
          <div className="text-center mb-12">
            <h1 className="text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-purple-600">
              💖 Heart Talk
            </h1>
            <p className="text-xl text-gray-600 mb-6">
              Discover beautiful love song videos to soothe your heart and soul
            </p>
            
            <div className="bg-white p-6 rounded-xl shadow-lg max-w-2xl mx-auto">
              <h2 className="text-2xl font-semibold mb-4 text-pink-600">🎬 Have Fun Watching the Videos!</h2>
              <p className="text-gray-700 mb-4">
                Click on any video thumbnail below to watch beautiful love that will touch your heart.
                Each selection is carefully chosen to bring you comfort and joy.
              </p>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search love song videos..."
                  className="w-full px-5 py-3 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent shadow-sm"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  aria-label="Search love songs"
                />
                <span className="absolute right-4 top-3 text-gray-400">
                  {isSearching ? '🔍 Searching...' : '🔍'}
                </span>
              </div>
            </div>
          </div>

          {/* Content Section */}
          {loading || isSearching ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-pulse flex space-x-4">
                <div className="rounded-full bg-pink-400 h-12 w-12"></div>
                <div className="flex-1 space-y-4 py-1">
                  <div className="h-4 bg-pink-400 rounded w-3/4"></div>
                  <div className="space-y-2">
                    <div className="h-4 bg-pink-400 rounded"></div>
                    <div className="h-4 bg-pink-400 rounded w-5/6"></div>
                  </div>
                </div>
              </div>
            </div>
          ) : displayContents.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-xl shadow">
              <div className="text-6xl mb-4">🎵</div>
              <h3 className="text-2xl font-semibold text-gray-700 mb-2">
                {searchQuery ? 'No videos found' : 'No videos available yet'}
              </h3>
              <p className="text-gray-500">
                {searchQuery 
                  ? 'Try searching for something else or check back later.'
                  : 'We are preparing some beautiful love songs for you. Please check back soon!'}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {displayContents.map((item) => (
                <div key={item.id} className="group">
                  <Link href={`/heart-talk/${item.id}`} aria-label={`Watch ${item.title}`}>
                    <div className="relative rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 transform group-hover:-translate-y-1">
                      {/* Video Thumbnail with Play Button */}
                      <div className="relative w-full h-48">
                        <Image
                          src={item.cover_image}
                          alt={`${item.title} video thumbnail`}
                          fill
                          className="object-cover"
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        />
                        <div className="absolute inset-0 bg-black bg-opacity-20 flex items-center justify-center transition-opacity duration-300 opacity-0 group-hover:opacity-100">
                          <div className="bg-pink-500 bg-opacity-80 rounded-full p-4">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                            </svg>
                          </div>
                        </div>
                        <div className="absolute bottom-2 right-2 bg-black bg-opacity-70 text-white text-xs px-2 py-1 rounded">
                          {item.duration}
                        </div>
                      </div>
                      
                      {/* Video Info */}
                      <div className="bg-white p-4">
                        <h3 className="font-semibold text-lg text-gray-800 group-hover:text-pink-600 transition-colors">
                          {item.title}
                        </h3>
                        <div className="flex items-center mt-2 text-sm text-gray-500">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                          </svg>
                          Love Video
                        </div>
                      </div>
                    </div>
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer Note */}
        <div className="mt-16 text-center text-gray-500 text-sm">
          <p>Enjoy our collection of love videos. New additions every week!</p>
          <p className="mt-2">❤️ Made with love for your heart ❤️</p>
        </div>
      </div>
    </>
  );
}