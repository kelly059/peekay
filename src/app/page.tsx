'use client';

import { useState, useEffect } from 'react';
import Head from 'next/head';
import { motion, AnimatePresence } from 'framer-motion';

type FeatureCard = {
  icon: string;
  title: string;
  description: string;
  highlight: string;
  gradient: string;
  link: string;
};

export default function LandingPage() {
  const [darkMode, setDarkMode] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeFeature, setActiveFeature] = useState<number | null>(null);
  const [isMounted, setIsMounted] = useState(false);
  const [showShareTooltip, setShowShareTooltip] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const features: FeatureCard[] = [
    {
      icon: '📝',
      title: 'Blogs',
      description: 'Thought-provoking articles across diverse topics',
      highlight: 'text-blue-400',
      gradient: 'from-blue-400 to-cyan-400',
      link: '/blogs'
    },
    {
      icon: '🖼',
      title: 'Wallpapers',
      description: 'Curated high-quality visuals for your devices',
      highlight: 'text-purple-400',
      gradient: 'from-purple-400 to-fuchsia-400',
      link: '/wallpapers'
    },
    {
      icon: '🕵️',
      title: 'Confessions',
      description: 'Anonymous space for authentic sharing',
      highlight: 'text-red-400',
      gradient: 'from-red-400 to-rose-400',
      link: '/confessions'
    },
    {
      icon: '🧸',
      title: 'Snapfacts',
      description: 'Mature conversations in a respectful environment',
      highlight: 'text-pink-400',
      gradient: 'from-pink-400 to-rose-400',
      link: '/whisper'
    },
    {
      icon: '🎧',
      title: 'Relaxing Sounds',
      description: 'Ambient audio for focus and relaxation',
      highlight: 'text-emerald-400',
      gradient: 'from-emerald-400 to-teal-400',
      link: '/sounds'
    },
    {
      icon: '❤️',
      title: 'Heart Talk',
      description: 'Melodies that soothe the heart and mind',
      highlight: 'text-rose-400',
      gradient: 'from-rose-400 to-pink-400',
      link: '/heart-talks'
    },
    {
      icon: '🐾',
      title: 'Pet Lovers',
      description: 'Community for animal enthusiasts',
      highlight: 'text-amber-400',
      gradient: 'from-amber-400 to-yellow-400',
      link: '/pet-lovers'
    }
  ];

  const handleDonateClick = () => {
    window.open('http://buymeacoffee.com/conteny', '_blank');
  };

  const handleAuthClick = (type: 'login' | 'signup') => {
    window.location.href = type === 'login' ? '/login' : '/signup';
  };

  const handleShareClick = async () => {
    const url = 'https://lirivelle.com'; // Hardcoded canonical URL
    
    try {
      await navigator.share({
        title: 'lirivelle - Your Content Sanctuary',
        text: 'Discover wallpapers, confessions, relaxing sounds, heart talk and more at lirivelle!',
        url: url
      });
    } catch (error) {
      console.error('Sharing failed:', error);
      copyToClipboard(url);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setShowShareTooltip(true);
    setTimeout(() => setShowShareTooltip(false), 2000);
  };

  const FloatingElements = () => {
    if (!isMounted) return null;
    
    return (
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(12)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: -100 }}
            animate={{ 
              opacity: [0, 0.3, 0],
              y: [0, window.innerHeight],
              x: Math.random() * window.innerWidth
            }}
            transition={{
              duration: 20 + Math.random() * 20,
              repeat: Infinity,
              delay: Math.random() * 10
            }}
            className={`absolute w-1 h-1 rounded-full ${darkMode ? 'bg-white' : 'bg-gray-900'}`}
            style={{
              left: `${Math.random() * 100}%`,
              top: `-10%`
            }}
          />
        ))}
      </div>
    );
  };

  return (
    <div className={`min-h-screen transition-colors duration-500 ${darkMode ? 'dark bg-gray-900' : 'bg-gray-50'}`}>
      <Head>
        {/* Verification Meta Tag */}
        <meta name="3402685d3dd5a408f5fac7a3fb70ea8b16ff34cd" content="3402685d3dd5a408f5fac7a3fb70ea8b16ff34cd" />
        
        {/* Primary Meta Tags */}
        <title>lirivelle | 🖼 Wallpapers 🕵 Confessions 💋 Whispers 📝 Blogs</title>
        <meta 
          name="description" 
          content="🎧 Relaxing Sounds ❤ Heart Talk � Pet Lovers - Your sanctuary for confessions, HD wallpapers, mental wellness, and emotional support. Join lirivelle today!" 
        />
        <meta name="keywords" content="🖼 Wallpapers, 🕵 Confessions, 💋 Whispers, 📝 Blogs, 🎧 Relaxing Sounds, ❤ Heart Talk, 🐾 Pet Lovers, anonymous confessions, HD wallpapers, poetic whispers, self-care, mental wellness, emotional support, stress relief" />
        <meta name="author" content="lirivelle" />
        <meta name="robots" content="index, follow" />
        
        {/* Open Graph / Facebook */}
        <meta property="og:title" content="lirivelle | 🖼 Wallpapers 🕵 Confessions 💋 Whispers" />
        <meta property="og:description" content="📝 Blogs 🎧 Relaxing Sounds ❤ Heart Talk 🐾 Pet Lovers - Your digital sanctuary for authentic sharing and mental wellness" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://lirivelle.com" />
        <meta property="og:image" content="https://lirivelle.com/images/website_imagepreview.jpg" />
        <meta property="og:site_name" content="lirivelle" />
        
        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="lirivelle | Content Sanctuary" />
        <meta name="twitter:description" content="🖼 Wallpapers 🕵 Confessions 💋 Whispers 📝 Blogs � Sounds ❤ Heart Talk - Join our community" />
        <meta name="twitter:image" content="https://lirivelle.com/public/images/website_imagepreview.jpg" />
        <meta name="twitter:creator" content="@lirivelle" />
        
        {/* Canonical URL */}
        <link rel="canonical" href="https://lirivelle.com" />
        
        {/* Favicon */}
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        
        {/* Theme Color */}
        <meta name="theme-color" content="#FFFFFF" />
        <meta name="msapplication-TileColor" content="#FFFFFF" />
        
        {/* Schema.org markup */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebSite",
            "name": "lirivelle",
            "url": "https://lirivelle.com",
            "description": "A digital sanctuary offering 🖼 Wallpapers, 🕵 Confessions, 💋 Whispers, 📝 Blogs, 🎧 Relaxing Sounds, ❤ Heart Talk, and 🐾 Pet Lovers community",
            "potentialAction": {
              "@type": "SearchAction",
              "target": "https://lirivelle.com/search?q={search_term_string}",
              "query-input": "required name=search_term_string"
            }
          })}
        </script>
      </Head>

      {/* Header */}
      <AnimatePresence>
        {isScrolled ? (
          <motion.header 
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            exit={{ y: -100 }}
            className="fixed w-full z-50 backdrop-blur-md bg-white/80 dark:bg-gray-900/80 shadow-sm"
          >
            <div className="container mx-auto px-6 py-3 flex justify-between items-center">
              <motion.a 
                href="#home"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-xl font-light hover:scale-105 transition-transform"
                aria-label="lirivelle Home"
              >
                <span className="font-medium italic">lirivelle</span> love
              </motion.a>
              <div className="flex items-center space-x-4">
                <div className="hidden md:flex items-center space-x-4 mr-4">
                  <a href="/about" className="text-sm hover:underline" aria-label="About lirivelle">About</a>
                  <a href="/privacy" className="text-sm hover:underline" aria-label="Privacy Policy">Privacy</a>
                  <a href="/terms" className="text-sm hover:underline" aria-label="Terms & Conditions">Terms</a>
                </div>
                <button 
                  onClick={handleDonateClick}
                  className="px-4 py-2 rounded-full bg-gradient-to-r from-yellow-500 to-amber-500 text-white text-sm hover:shadow-lg transition-all"
                  aria-label="Donate to support us"
                >
                  Donate
                </button>
                <button 
                  onClick={handleShareClick}
                  className="px-4 py-2 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 text-white text-sm hover:shadow-lg transition-all relative"
                  aria-label="Share this page"
                >
                  Share
                  {showShareTooltip && (
                    <motion.span 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded whitespace-nowrap"
                    >
                      Link copied!
                    </motion.span>
                  )}
                </button>
                <button 
                  onClick={() => handleAuthClick('login')}
                  className="px-4 py-2 rounded-full border border-gray-300 dark:border-gray-600 text-sm hover:bg-gray-100 dark:hover:bg-gray-800 transition-all"
                  aria-label="Log in to your account"
                >
                  Log In
                </button>
                <button 
                  onClick={() => setDarkMode(!darkMode)}
                  className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-800 transition-all duration-300"
                  aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
                >
                  {darkMode ? '☀️' : '🌙'}
                </button>
              </div>
            </div>
          </motion.header>
        ) : (
          <header className="fixed w-full z-50 backdrop-blur-md bg-white/80 dark:bg-gray-900/80">
            <div className="container mx-auto px-6 py-3 flex justify-between items-center">
              <a 
                href="#home" 
                className="text-xl font-light hover:scale-105 transition-transform"
                aria-label="lirivelle Home"
              >
                <span className="font-medium italic">lirivelle</span> pl
              </a>
              <div className="flex items-center space-x-4">
                <div className="hidden md:flex items-center space-x-4 mr-4">
                  <a href="/about" className="text-sm hover:underline" aria-label="About lirivelle">About</a>
                  <a href="/privacy" className="text-sm hover:underline" aria-label="Privacy Policy">Privacy</a>
                  <a href="/terms" className="text-sm hover:underline" aria-label="Terms & Conditions">Terms</a>
                </div>
                <button 
                  onClick={handleDonateClick}
                  className="px-4 py-2 rounded-full bg-gradient-to-r from-yellow-500 to-amber-500 text-white text-sm hover:shadow-lg transition-all"
                  aria-label="Donate to support us"
                >
                  Donate
                </button>
                <button 
                  onClick={handleShareClick}
                  className="px-4 py-2 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 text-white text-sm hover:shadow-lg transition-all relative"
                  aria-label="Share this page"
                >
                  Share
                  {showShareTooltip && (
                    <motion.span 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded whitespace-nowrap"
                    >
                      Link copied!
                    </motion.span>
                  )}
                </button>
                <button 
                  onClick={() => handleAuthClick('login')}
                  className="px-4 py-2 rounded-full border border-gray-300 dark:border-gray-600 text-sm hover:bg-gray-100 dark:hover:bg-gray-800 transition-all"
                  aria-label="Log in to your account"
                >
                  Log In
                </button>
                <button 
                  onClick={() => setDarkMode(!darkMode)}
                  className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-800 transition-all duration-300"
                  aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
                >
                  {darkMode ? '☀️' : '🌙'}
                </button>
              </div>
            </div>
          </header>
        )}
      </AnimatePresence>

      <main className="relative overflow-hidden" id="home">
        <FloatingElements />

        {/* Hero Section */}
        <section className="min-h-screen flex flex-col justify-center items-center text-center px-4 relative z-10 pt-16">
          <div className="max-w-6xl mx-auto">
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-5xl md:text-7xl lg:text-8xl font-light mb-8 text-gray-900 dark:text-white"
            >
              <span className="font-medium italic bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-500">
                lirivelle
              </span> sweet
            </motion.h1>
            
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto mb-16"
            >
              Your digital sanctuary for 🖼 Wallpapers, 🕵 Confessions, 💋 Whispers, and ❤ Heart Talk
            </motion.p>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="w-full max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
            >
              {features.map((feature, index) => (
                <motion.a 
                  key={feature.title}
                  href={feature.link}
                  whileHover={{ y: -8, scale: 1.03 }}
                  onMouseEnter={() => setActiveFeature(index)}
                  onMouseLeave={() => setActiveFeature(null)}
                  className={`p-4 rounded-2xl backdrop-blur-md bg-white dark:bg-gray-800 border transition-all duration-300 ${
                    activeFeature === index 
                      ? 'border-white/40 dark:border-gray-600/70 shadow-xl scale-105'
                      : 'border-white/20 dark:border-gray-700/50 shadow-lg'
                  }`}
                  aria-label={`Explore ${feature.title}`}
                >
                  <div className={`text-3xl mb-2 font-medium ${feature.highlight}`} aria-hidden="true">{feature.icon}</div>
                  <h2 className="text-md font-medium text-gray-900 dark:text-white">{feature.title}</h2>
                  {activeFeature === index && (
                    <motion.p 
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="mt-1 text-xs text-gray-700 dark:text-gray-300"
                    >
                      {feature.description}
                    </motion.p>
                  )}
                </motion.a>
              ))}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="mt-16 flex flex-col sm:flex-row justify-center gap-4"
            >
              <button 
                onClick={handleDonateClick}
                className="px-8 py-3 rounded-full bg-gradient-to-r from-yellow-500 to-amber-500 text-white font-medium shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-2"
                aria-label="Support our platform"
              >
                <span aria-hidden="true">💛</span> Support Us
              </button>
              <button 
                onClick={handleShareClick}
                className="px-8 py-3 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-medium shadow-lg hover:shadow-xl transition-all duration-300 relative"
                aria-label="Share lirivelle"
              >
                Share
                {showShareTooltip && (
                  <motion.span 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded whitespace-nowrap"
                  >
                    Link copied!
                  </motion.span>
                )}
              </button>
            </motion.div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-28 relative" id="features">
          <div className="absolute inset-0 -z-10 opacity-20 dark:opacity-30">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-purple-500/30 via-transparent to-transparent"></div>
          </div>
          
          <div className="max-w-7xl mx-auto px-6">
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="text-3xl md:text-5xl font-light mb-20 text-center text-gray-900 dark:text-white"
            >
              Carefully curated <span className="font-medium">experiences</span>
            </motion.h2>
            
            <div className="space-y-24">
              {features.map((feature, index) => (
                <motion.article 
                  key={feature.title}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true, margin: "-100px" }}
                  className={`flex flex-col ${index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'} items-center gap-12`}
                >
                  <div className={`flex-1 flex justify-center ${index % 2 === 0 ? 'md:justify-end' : 'md:justify-start'}`}>
                    <a href={feature.link} className="group" aria-label={`Explore ${feature.title}`}>
                      <div className={`w-48 h-48 rounded-3xl flex items-center justify-center text-7xl bg-gradient-to-br ${feature.gradient} shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-105`}>
                        <span aria-hidden="true">{feature.icon}</span>
                      </div>
                    </a>
                  </div>
                  <div className="flex-1">
                    <a href={feature.link}>
                      <h3 className="text-3xl font-medium mb-4 text-gray-900 dark:text-white hover:underline">
                        <span className={`bg-clip-text text-transparent bg-gradient-to-r ${feature.gradient}`}>
                          {feature.title}
                        </span>
                      </h3>
                    </a>
                    <p className="text-lg text-gray-600 dark:text-gray-400 leading-relaxed">{feature.description}</p>
                    <div className="mt-6">
                      <a 
                        href={feature.link}
                        className={`px-6 py-3 rounded-full bg-gradient-to-r ${feature.gradient} text-white hover:shadow-lg transition-all inline-block`}
                        aria-label={`Explore ${feature.title}`}
                      >
                        Explore {feature.title}
                      </a>
                    </div>
                  </div>
                </motion.article>
              ))}
            </div>
          </div>
        </section>

        {/* Donation Section */}
        <section className="py-24 relative overflow-hidden bg-gradient-to-br from-amber-50 to-yellow-50 dark:from-amber-900/20 dark:to-yellow-900/20">
          <div className="max-w-4xl mx-auto px-6 text-center">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl md:text-5xl font-light mb-6 text-gray-900 dark:text-white">
                Love what we do? <span className="font-medium">Support us!</span>
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-400 mb-8 max-w-2xl mx-auto">
                Your donations help keep lirivelle free and accessible for everyone.
              </p>
              <div className="flex justify-center">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="inline-block"
                >
                  <button 
                    onClick={handleDonateClick}
                    className="px-8 py-4 rounded-full bg-gradient-to-r from-yellow-500 to-amber-500 text-white font-medium text-lg shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-2 mx-auto"
                    aria-label="Donate to support our platform"
                  >
                    <span aria-hidden="true">💛</span> Donate Now
                  </button>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </section>
      </main>

      <footer className="py-12 border-t border-gray-200 dark:border-gray-800 backdrop-blur-md">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <a 
              href="#home" 
              className="text-xl font-light mb-6 md:mb-0 hover:scale-105 transition-transform"
              aria-label="lirivelle Home"
            >
              <span className="font-medium italic">lirivelle</span> love
            </a>
            
            <div className="flex flex-wrap justify-center gap-4 mb-6 md:mb-0">
              <a href="/about" className="text-sm hover:underline" aria-label="About lirivelle">About</a>
              <a href="/privacy" className="text-sm hover:underline" aria-label="Privacy Policy">Privacy Policy</a>
              <a href="/terms" className="text-sm hover:underline" aria-label="Terms & Conditions">Terms & Conditions</a>
            </div>
            
            <div className="flex gap-4">
              <button 
                onClick={handleDonateClick}
                className="px-6 py-2 rounded-full bg-gradient-to-r from-yellow-500 to-amber-500 text-white hover:shadow-lg transition-all"
                aria-label="Donate to support us"
              >
                Donate
              </button>
              <button 
                onClick={handleShareClick}
                className="px-6 py-2 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 text-white hover:shadow-lg transition-all relative"
                aria-label="Share this page"
              >
                Share
                {showShareTooltip && (
                  <motion.span 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded whitespace-nowrap"
                  >
                    Link copied!
                  </motion.span>
                )}
              </button>
              <button 
                onClick={() => handleAuthClick('login')}
                className="px-6 py-2 rounded-full border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all"
                aria-label="Log in to your account"
              >
                Log In
              </button>
            </div>
          </div>
          
          <div className="mt-12 pt-8 border-t border-gray-100 dark:border-gray-800 text-center text-gray-500 dark:text-gray-400 text-sm">
            <p>© {new Date().getFullYear()} lirivelle. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}