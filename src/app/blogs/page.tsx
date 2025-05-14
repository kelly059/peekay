'use client';

import { useEffect, useState } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import Link from 'next/link';
import { FiEdit3, FiPlus, FiClock, FiChevronRight, FiBookmark, FiTrendingUp, FiStar } from 'react-icons/fi';
import { motion } from 'framer-motion';
import SearchBar from '@/components/SearchBar';
import DOMPurify from 'dompurify';
import Image from 'next/image';
import Head from 'next/head';

const ADMIN_EMAIL = 'lapsyruss31@gmail.com';
const SEO_KEYWORDS = [
  "modern blog",
  "tech news",
  "programming tutorials",
  "web development",
  "frontend development",
  "React.js",
  "JavaScript",
  "Next.js",
  "coding blog",
  "developer resources",
  "tech trends",
  "software engineering",
  "digital innovation",
  "latest technology",
  "coding tips",
  "web design",
  "UI/UX design",
  "responsive design",
  "mobile development",
  "cloud computing",
  "cybersecurity",
  "data science",
  "machine learning",
  "AI",
  "blog platform",
  "technical writing",
  "code examples",
  "developer community",
  "web performance",
  "modern web"
].join(', ');

type Blog = {
  id: number;
  title: string;
  description?: string;
  content?: string;
  image_url?: string | null;
  video_url?: string | null;
  extra_links?: { [key: string]: string };
  tags?: string[];
  category: string;
  created_at: string;
  is_featured?: boolean;
  is_trending?: boolean;
};

const STARS = [
  { id: 1, top: '15.23%', left: '22.45%', size: '0.75rem', opacity: 0.4, delay: 0.5 },
  { id: 2, top: '25.67%', left: '72.89%', size: '0.85rem', opacity: 0.5, delay: 1.2 },
  { id: 3, top: '35.12%', left: '45.78%', size: '0.65rem', opacity: 0.6, delay: 0.8 },
  { id: 4, top: '5.89%', left: '85.34%', size: '0.95rem', opacity: 0.7, delay: 1.5 },
  { id: 5, top: '55.43%', left: '15.67%', size: '0.8rem', opacity: 0.5, delay: 0.3 },
  { id: 6, top: '75.21%', left: '65.23%', size: '0.7rem', opacity: 0.4, delay: 1.0 },
  { id: 7, top: '85.76%', left: '35.89%', size: '0.9rem', opacity: 0.6, delay: 1.7 },
  { id: 8, top: '45.32%', left: '55.12%', size: '0.6rem', opacity: 0.3, delay: 0.6 },
  { id: 9, top: '65.78%', left: '25.45%', size: '0.85rem', opacity: 0.5, delay: 1.3 },
  { id: 10, top: '95.12%', left: '75.67%', size: '0.75rem', opacity: 0.4, delay: 0.9 }
];

export default function BlogPage() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [filteredBlogs, setFilteredBlogs] = useState<Blog[]>([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isClient, setIsClient] = useState(false);

  // SEO Metadata
  const pageTitle = "The Modern Gazette | Tech Blog & Programming Resources";
  const pageDescription = "Explore the latest in technology, programming tutorials, and web development trends. A modern blog for developers and tech enthusiasts.";
  const siteUrl = "https://yourblogdomain.com";

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const response = await fetch('/api/blogs');
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const data = await response.json();
        setBlogs(data);
        setFilteredBlogs(data);
      } catch (err) {
        console.error('Failed to fetch blogs:', err);
        setError(err instanceof Error ? err.message : 'Failed to load blogs');
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setIsAdmin(user?.email === ADMIN_EMAIL);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    let results = blogs;

    if (searchQuery) {
      results = blogs.filter(blog =>
        blog.title.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredBlogs(results);
  }, [searchQuery, blogs]);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const renderFirstLine = (html: string | undefined) => {
    if (!html) return null;
    const cleanHTML = DOMPurify.sanitize(html);
    const firstLine = cleanHTML.split('.')[0] || cleanHTML.split(' ').slice(0, 20).join(' ');
    return <div dangerouslySetInnerHTML={{ __html: firstLine + '...' }} />;
  };

  const featuredPosts = filteredBlogs.filter(blog => blog.is_featured);
  const trendingPosts = filteredBlogs.filter(blog => blog.is_trending);
  const regularPosts = filteredBlogs.filter(blog => !blog.is_featured && !blog.is_trending);
  const editorPicks = filteredBlogs.slice(0, 2);

  return (
    <>
      <Head>
        <title>{pageTitle}</title>
        <meta name="description" content={pageDescription} />
        <meta name="keywords" content={SEO_KEYWORDS} />
        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={pageDescription} />
        <meta property="og:url" content={siteUrl} />
        <meta property="og:type" content="website" />
        <meta property="og:image" content={`${siteUrl}/images/blog-og-image.jpg`} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={pageTitle} />
        <meta name="twitter:description" content={pageDescription} />
        <meta name="twitter:image" content={`${siteUrl}/images/blog-twitter-image.jpg`} />
        <link rel="canonical" href={siteUrl} />
      </Head>

      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 relative overflow-hidden">
        {isClient && STARS.map(star => (
          <motion.div
            key={star.id}
            className="absolute pointer-events-none"
            style={{
              top: star.top,
              left: star.left,
              width: star.size,
              height: star.size,
              opacity: star.opacity
            }}
            animate={{
              opacity: [star.opacity, star.opacity * 0.5, star.opacity],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              repeatType: 'reverse',
              delay: star.delay
            }}
          >
            <svg viewBox="0 0 24 24" className="w-full h-full">
              <path 
                fill="currentColor" 
                d="M12 .587l3.668 7.568 8.332 1.151-6.064 5.828 1.48 8.279-7.416-3.967-7.417 3.967 1.481-8.279-6.064-5.828 8.332-1.151z"
              />
            </svg>
          </motion.div>
        ))}

        <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-sm border-b border-gray-200 shadow-sm">
          <div className="container mx-auto px-4 py-4">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div className="flex-1 min-w-0">
                <h1 className="text-3xl md:text-4xl font-serif font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-800 to-purple-800 tracking-tight">
                  The Modern Gazette
                </h1>
                <p className="text-gray-600 mt-1 font-serif italic text-sm md:text-base">
                  Where ideas and stories converge
                </p>
              </div>
              
              <div className="w-full md:w-auto flex items-center gap-3">
                <div className="flex-1 min-w-[200px]">
                  <SearchBar onSearch={handleSearch} />
                </div>
                <Link 
                  href="/bookmarks" 
                  className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-full shadow-md hover:shadow-lg transition-all font-medium whitespace-nowrap"
                >
                  <FiBookmark className="text-lg" />
                  <span className="hidden sm:inline">cate</span>
                </Link>
              </div>
            </div>
          </div>
        </header>

        <main className="container mx-auto px-4 py-8 relative z-10">
          {error ? (
            <div className="text-center py-16">
              <h3 className="text-xl font-medium mb-2">Error loading content</h3>
              <p className="text-gray-600 mb-4">{error}</p>
              <button
                onClick={() => window.location.reload()}
                className="px-6 py-2 rounded-lg bg-gradient-to-r from-blue-500 to-indigo-500 text-white hover:from-blue-600 hover:to-indigo-600 transition-all shadow-md"
              >
                Retry
              </button>
            </div>
          ) : loading ? (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {[...Array(4)].map((_, i) => (
                <div
                  key={i}
                  className={`${i === 0 ? 'lg:col-span-2 h-96' : 'h-64'} bg-white/50 rounded-xl shadow-sm animate-pulse`}
                />
              ))}
            </div>
          ) : filteredBlogs.length === 0 ? (
            <div className="text-center py-16">
              <div className="max-w-md mx-auto mb-8">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-24 h-24 mx-auto text-gray-400">
                  <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path>
                  <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path>
                </svg>
              </div>
              <h3 className="text-2xl font-medium mb-2 text-gray-800">No posts found</h3>
              <p className="text-gray-600 mb-6">
                {searchQuery ? 
                  `No posts match your search for "${searchQuery}"` : 
                  'No posts available'}
              </p>
              <button
                onClick={() => setSearchQuery('')}
                className="px-6 py-3 rounded-lg bg-gradient-to-r from-blue-500 to-indigo-500 text-white hover:from-blue-600 hover:to-indigo-600 transition-all shadow-md"
              >
                View all posts
              </button>
            </div>
          ) : (
            <>
              {featuredPosts.length > 0 && (
                <section className="mb-16 relative">
                  {isClient && (
                    <>
                      <motion.div 
                        className="absolute -top-10 -left-10 w-20 h-20 text-yellow-400 opacity-70 z-0"
                        animate={{
                          y: [0, -10, 0],
                          rotate: [0, 5, 0]
                        }}
                        transition={{
                          duration: 8,
                          repeat: Infinity,
                          ease: "easeInOut"
                        }}
                      >
                        <FiStar className="w-full h-full" />
                      </motion.div>
                      
                      <motion.div 
                        className="absolute -bottom-5 -right-5 w-16 h-16 text-blue-400 opacity-50 z-0"
                        animate={{
                          y: [0, 10, 0],
                          rotate: [0, -5, 0]
                        }}
                        transition={{
                          duration: 7,
                          repeat: Infinity,
                          ease: "easeInOut",
                          delay: 1
                        }}
                      >
                        <FiStar className="w-full h-full" />
                      </motion.div>
                    </>
                  )}
                  
                  <div className="relative h-[70vh] max-h-[600px] rounded-3xl overflow-hidden shadow-2xl mb-8">
                    <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-black/20 to-black/50 z-10"></div>
                    {featuredPosts[0].image_url && (
                      <Image
                        src={featuredPosts[0].image_url}
                        alt={featuredPosts[0].title}
                        className="w-full h-full object-cover"
                        fill
                        priority
                      />
                    )}
                    <div className="absolute bottom-0 left-0 right-0 p-8 md:p-12 z-20 text-white">
                      <div className="max-w-3xl">
                        <span className="inline-block px-3 py-1 bg-yellow-500 text-white rounded-full text-xs md:text-sm font-bold mb-3 md:mb-4">
                          Featured Story
                        </span>
                        <h2 className="text-3xl md:text-4xl lg:text-5xl font-serif font-bold mb-3 md:mb-4 leading-tight">
                          {featuredPosts[0].title}
                        </h2>
                        <div className="text-lg md:text-xl opacity-90 mb-4 md:mb-6 line-clamp-2">
                          {renderFirstLine(featuredPosts[0].description || featuredPosts[0].content)}
                        </div>
                        <Link
                          href={`/blogs/${featuredPosts[0].id}`}
                          className="inline-flex items-center px-5 py-2 md:px-6 md:py-3 bg-white text-gray-900 rounded-full font-medium hover:bg-gray-100 transition-all text-sm md:text-base"
                        >
                          Read Story <FiChevronRight className="ml-1" />
                        </Link>
                      </div>
                    </div>
                  </div>
                </section>
              )}

              {trendingPosts.length > 0 && (
                <section className="mb-16">
                  <div className="flex items-center justify-between mb-6 border-b border-gray-200 pb-4">
                    <h2 className="text-2xl font-serif font-bold text-gray-900 flex items-center">
                      <FiTrendingUp className="mr-2 text-red-500" />
                      Trending Now
                    </h2>
                    <Link href="#" className="text-sm font-medium text-blue-600 hover:underline">
                      View all trending
                    </Link>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {trendingPosts.map((post, index) => (
                      <motion.div
                        key={post.id}
                        initial={isClient ? { opacity: 0, y: 20 } : false}
                        animate={isClient ? { opacity: 1, y: 0 } : false}
                        transition={{ duration: 0.3, delay: index * 0.1 }}
                        className="group relative"
                      >
                        <div className="absolute -inset-1 bg-gradient-to-r from-red-500 to-pink-500 rounded-lg blur opacity-0 group-hover:opacity-75 transition-all duration-300 z-0"></div>
                        <div className="relative h-full bg-white rounded-lg shadow-md overflow-hidden border border-gray-100 group-hover:shadow-lg transition-all flex flex-col z-10">
                          <Link href={`/blogs/${post.id}`} className="block">
                            <div className="relative h-48 bg-gradient-to-br from-gray-100 to-gray-200 overflow-hidden">
                              {post.image_url ? (
                                <Image
                                  src={post.image_url}
                                  alt={post.title}
                                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                  fill
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center text-blue-400">
                                  <FiPlus className="text-4xl opacity-70" />
                                </div>
                              )}
                              <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent"></div>
                              <div className="absolute top-3 right-3 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-bold flex items-center">
                                <FiTrendingUp className="mr-1" />
                                Trending
                              </div>
                            </div>
                          </Link>
                          <div className="p-5 flex-grow flex flex-col">
                            <div className="flex-grow">
                              <Link href={`/blogs/${post.id}`}>
                                <h3 className="font-serif font-semibold text-xl text-gray-900 line-clamp-2 mb-3 group-hover:text-blue-600 transition-colors">
                                  {post.title}
                                </h3>
                              </Link>
                              <div className="text-gray-600 text-sm line-clamp-2 mb-4">
                                {renderFirstLine(post.description || post.content)}
                              </div>
                            </div>
                            <div className="mt-auto pt-3 border-t border-gray-100">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center text-xs text-gray-500">
                                  <FiClock className="mr-1.5" />
                                  <span>
                                    {new Date(post.created_at).toLocaleDateString('en-US', {
                                      month: 'short',
                                      day: 'numeric'
                                    })}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </section>
              )}

              <div className="flex flex-col lg:flex-row gap-8 mb-16">
                <div className="lg:w-2/3">
                  <h2 className="text-2xl font-serif font-bold text-gray-900 mb-6 border-b border-gray-200 pb-4">
                    Latest Articles
                  </h2>
                  
                  <div className="space-y-8">
                    {regularPosts.map((post, index) => (
                      <motion.article
                        key={post.id}
                        initial={isClient ? { opacity: 0, y: 20 } : false}
                        animate={isClient ? { opacity: 1, y: 0 } : false}
                        transition={{ duration: 0.3, delay: index * 0.05 }}
                        className="group"
                      >
                        <div className="flex flex-col md:flex-row gap-6">
                          <Link href={`/blogs/${post.id}`} className="md:w-1/3">
                            <div className="relative aspect-video rounded-xl overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200">
                              {post.image_url ? (
                                <Image
                                  src={post.image_url}
                                  alt={post.title}
                                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                  fill
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center text-blue-400">
                                  <FiPlus className="text-4xl opacity-70" />
                                </div>
                              )}
                            </div>
                          </Link>
                          <div className="md:w-2/3">
                            <div className="flex items-center gap-2 mb-2">
                              <span className="text-xs text-gray-500">
                                {new Date(post.created_at).toLocaleDateString('en-US', {
                                  month: 'short',
                                  day: 'numeric',
                                  year: 'numeric'
                                })}
                              </span>
                            </div>
                            <Link href={`/blogs/${post.id}`}>
                              <h3 className="text-xl md:text-2xl font-serif font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                                {post.title}
                              </h3>
                            </Link>
                            <div className="text-gray-600 mb-3 line-clamp-2 text-sm md:text-base">
                              {renderFirstLine(post.description || post.content)}
                            </div>
                            <Link 
                              href={`/blogs/${post.id}`} 
                              className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium text-sm md:text-base"
                            >
                              Continue reading <FiChevronRight className="ml-1" />
                            </Link>
                          </div>
                        </div>
                      </motion.article>
                    ))}
                  </div>
                </div>
                
                <div className="lg:w-1/3">
                  <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl p-6 mb-8 shadow-sm border border-indigo-100 relative overflow-hidden">
                    {isClient && (
                      <>
                        <motion.div 
                          className="absolute top-4 right-4 w-8 h-8 text-indigo-300"
                          animate={{
                            rotate: 360,
                            scale: [1, 1.1, 1]
                          }}
                          transition={{
                            duration: 10,
                            repeat: Infinity,
                            ease: "linear"
                          }}
                        >
                          <FiStar className="w-full h-full" />
                        </motion.div>
                        
                        <motion.div 
                          className="absolute bottom-6 left-6 w-6 h-6 text-purple-300"
                          animate={{
                            rotate: -360,
                            scale: [1, 1.2, 1]
                          }}
                          transition={{
                            duration: 15,
                            repeat: Infinity,
                            ease: "linear"
                          }}
                        >
                          <FiStar className="w-full h-full" />
                        </motion.div>
                      </>
                    )}
                    
                    <h2 className="text-xl font-serif font-bold text-gray-900 mb-4 flex items-center border-b border-indigo-100 pb-3 relative z-10">
                      <FiStar className="mr-2 text-yellow-500" />
                      Stellar Picks
                    </h2>
                    <div className="space-y-6 relative z-10">
                      {editorPicks.map((post, index) => (
                        <motion.div
                          key={post.id}
                          initial={isClient ? { opacity: 0, x: -20 } : false}
                          animate={isClient ? { opacity: 1, x: 0 } : false}
                          transition={{ duration: 0.3, delay: index * 0.1 }}
                          className="group bg-white/80 backdrop-blur-sm rounded-lg p-4 shadow-sm hover:shadow-md transition-all"
                        >
                          <Link href={`/blogs/${post.id}`} className="flex items-start gap-4">
                            <div className="flex-shrink-0 relative w-16 h-16 rounded-lg overflow-hidden border border-gray-200">
                              {post.image_url ? (
                                <Image
                                  src={post.image_url}
                                  alt={post.title}
                                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                  fill
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-100 to-purple-100">
                                  <FiStar className="text-xl text-indigo-400" />
                                </div>
                              )}
                              <div className="absolute -top-2 -right-2 w-5 h-5 bg-yellow-400 rounded-full flex items-center justify-center text-xs text-white">
                                <FiStar className="w-3 h-3" />
                              </div>
                            </div>
                            <div>
                              <h3 className="font-medium text-gray-900 line-clamp-2 mb-1 group-hover:text-indigo-600 transition-colors">
                                {post.title}
                              </h3>
                              <div className="flex items-center text-xs text-gray-500">
                                <FiClock className="mr-1" />
                                <span>
                                  {new Date(post.created_at).toLocaleDateString('en-US', {
                                    month: 'short',
                                    day: 'numeric'
                                  })}
                                </span>
                              </div>
                            </div>
                          </Link>
                        </motion.div>
                      ))}
                    </div>
                  </div>

                  <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 relative overflow-hidden">
                    {isClient && (
                      <div className="absolute inset-0 overflow-hidden">
                        {Array.from({ length: 8 }).map((_, i) => (
                          <motion.div
                            key={i}
                            className="absolute bg-blue-400 rounded-full"
                            style={{
                              width: `${Math.random() * 4 + 2}px`,
                              height: `${Math.random() * 4 + 2}px`,
                              top: `${Math.random() * 100}%`,
                              left: `${Math.random() * 100}%`,
                              opacity: Math.random() * 0.5 + 0.3
                            }}
                            animate={{
                              opacity: [0.3, 0.7, 0.3]
                            }}
                            transition={{
                              duration: Math.random() * 5 + 3,
                              repeat: Infinity,
                              repeatType: 'reverse'
                            }}
                          />
                        ))}
                      </div>
                    )}
                    
                    <h3 className="text-lg font-serif font-bold text-gray-900 mb-4 relative z-10">
                      Cosmic Reading List
                    </h3>
                    <div className="space-y-4 relative z-10">
                      {blogs.slice(0, 3).map((post, index) => (
                        <motion.div 
                          key={post.id}
                          whileHover={isClient ? { x: 5 } : {}}
                          className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
                        >
                          <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center text-blue-500">
                            <span className="text-sm font-medium">{index + 1}</span>
                          </div>
                          <Link href={`/blogs/${post.id}`} className="text-sm font-medium text-gray-700 hover:text-blue-600 line-clamp-1">
                            {post.title}
                          </Link>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </main>

        {isAdmin && isClient && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="fixed bottom-6 right-6 z-50"
          >
            <Link
              href="/admin/blogs"
              className="w-14 h-14 rounded-full bg-gradient-to-br from-blue-600 to-blue-700 text-white flex items-center justify-center shadow-lg hover:shadow-xl transition-all"
              aria-label="Admin panel"
            >
              <FiEdit3 className="text-xl" />
            </Link>
          </motion.div>
        )}
      </div>
    </>
  );
}