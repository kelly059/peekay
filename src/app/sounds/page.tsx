'use client';

import { useEffect, useState, useRef } from 'react';
import Head from 'next/head';

interface Content {
  id: number;
  title: string;
  image_url: string | null;
  video_url: string | null;
}

export default function SoundContentListPage() {
  const [contents, setContents] = useState<Content[]>([]);
  const [filteredContents, setFilteredContents] = useState<Content[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isMuted, setIsMuted] = useState(true);
  const [isPlaying, setIsPlaying] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);

  // SEO Metadata
  const pageTitle = "Relaxing Audio & Soothing Sounds | Calm Music Collection";
  const pageDescription = "Discover high-quality relaxing audio including calm music, nature sounds for sleep, meditation music, white noise, and peaceful audio for stress relief. Perfect for relaxation and focus.";
  const siteUrl = "https://lirivelle.com/sounds";
  const keywords = [
    "relaxing audio",
    "calm music",
    "soothing sounds",
    "nature sounds for sleep",
    "rain and ocean sounds",
    "meditation music",
    "white noise",
    "chill background music",
    "relaxation playlist",
    "peaceful audio for stress",
    "sleep sounds",
    "ambient music",
    "focus music",
    "study sounds",
    "background noise"
  ].join(', ');

  useEffect(() => {
    const fetchContents = async () => {
      try {
        const res = await fetch('/api/sounds');
        const result = await res.json();
        if (res.ok) {
          setContents(result.data);
          setFilteredContents(result.data);
        } else {
          console.error('Fetch error:', result.message);
        }
      } catch (err) {
        console.error('Fetch error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchContents();
  }, []);

  useEffect(() => {
    videoRefs.current.forEach((video, index) => {
      if (video) {
        if (index === currentIndex) {
          if (isPlaying) video.play().catch(() => {});
          else video.pause();
          video.muted = isMuted;
        } else {
          video.pause();
          video.currentTime = 0;
        }
      }
    });
  }, [currentIndex, isMuted, isPlaying, filteredContents]);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (!query.trim()) {
      setFilteredContents(contents);
      setCurrentIndex(0);
      return;
    }
    const lowerQuery = query.toLowerCase();
    const filtered = contents.filter((item) =>
      item.title.toLowerCase().includes(lowerQuery)
    );
    setFilteredContents(filtered);
    setCurrentIndex(0);
  };

  const handleNext = () => {
    if (currentIndex < filteredContents.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setIsPlaying(true);
      scrollToIndex(currentIndex + 1);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setIsPlaying(true);
      scrollToIndex(currentIndex - 1);
    }
  };

  const scrollToIndex = (index: number) => {
    if (containerRef.current) {
      const element = containerRef.current.children[index] as HTMLElement;
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  const handleScroll = () => {
    if (containerRef.current) {
      const container = containerRef.current;
      const scrollPosition = container.scrollTop;
      const windowHeight = container.clientHeight;
      const newIndex = Math.round(scrollPosition / windowHeight);
      
      if (newIndex !== currentIndex) {
        setCurrentIndex(newIndex);
        setIsPlaying(true);
      }
    }
  };

  const toggleMute = () => setIsMuted((prev) => !prev);

  const togglePlay = () => {
    const currentVideo = videoRefs.current[currentIndex];
    if (currentVideo) {
      if (currentVideo.paused) {
        currentVideo.play();
        setIsPlaying(true);
      } else {
        currentVideo.pause();
        setIsPlaying(false);
      }
    }
  };

  if (loading)
    return (
      <>
        <Head>
          <title>{pageTitle}</title>
          <meta name="description" content={pageDescription} />
          <meta name="keywords" content={keywords} />
        </Head>
        <div className="h-screen w-full flex items-center justify-center bg-black">
          <p className="text-center text-white">Loading...</p>
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
        <meta property="og:image" content={`${siteUrl}/images/sound-content-preview.jpg`} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={pageTitle} />
        <meta name="twitter:description" content={pageDescription} />
        <meta name="twitter:image" content={`${siteUrl}/images/sound-content-preview.jpg`} />
        <link rel="canonical" href={siteUrl} />
      </Head>

      <div className="relative h-screen w-full bg-black overflow-hidden">
        {/* Search Bar */}
        <div className="fixed top-4 left-0 right-0 px-4 z-50">
          <div className="max-w-md mx-auto">
            <div className="relative">
              <input
                type="text"
                placeholder="Search titles..."
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                className="w-full py-2 px-4 rounded-lg bg-black bg-opacity-80 text-white border border-gray-600 focus:outline-none focus:border-red-500 shadow-md text-sm"
                aria-label="Search sound content"
              />
              {searchQuery && (
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setFilteredContents(contents);
                    setCurrentIndex(0);
                  }}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-300 hover:text-white"
                  aria-label="Clear search"
                >
                  ✕
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Scrollable Content */}
        <div
          ref={containerRef}
          className="h-full w-full overflow-y-auto snap-y snap-mandatory scroll-smooth"
          onScroll={handleScroll}
        >
          {filteredContents.length === 0 ? (
            <div className="h-screen w-full flex items-center justify-center text-white snap-start">
              No matching sounds found.
            </div>
          ) : (
            filteredContents.map((item, index) => (
              <div
                key={item.id}
                className="h-screen w-full flex items-center justify-center relative snap-start"
              >
                <div
                  className="relative w-full max-w-[400px] h-[70vh] bg-black rounded-lg overflow-hidden cursor-pointer mx-4"
                  onClick={togglePlay}
                >
                  {item.video_url ? (
                    <video
                      ref={(el) => {
                        videoRefs.current[index] = el;
                      }}
                      src={item.video_url}
                      autoPlay={index === currentIndex}
                      muted={isMuted}
                      loop
                      playsInline
                      className="w-full h-full object-cover"
                      aria-label={`Video for ${item.title}`}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-500">
                      No video available
                    </div>
                  )}
                  <div className="absolute bottom-16 left-1/2 transform -translate-x-1/2 text-red-600 text-xl font-bold text-center z-10">
                    {item.title}
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleMute();
                    }}
                    className="absolute top-4 right-4 bg-black bg-opacity-50 text-white px-3 py-1 rounded-full z-20 text-sm hover:bg-opacity-75 transition"
                    aria-label={isMuted ? 'Unmute sound' : 'Mute sound'}
                  >
                    {isMuted ? 'Unmute 🔇' : 'Mute 🔊'}
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Navigation - Only show on desktop */}
        <div className="hidden md:block">
          <button
            onClick={handlePrev}
            disabled={currentIndex === 0}
            className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white text-4xl z-30 opacity-70 hover:opacity-100"
            aria-label="Previous sound"
          >
            ↑
          </button>
          <button
            onClick={handleNext}
            disabled={currentIndex === filteredContents.length - 1}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white text-4xl z-30 opacity-70 hover:opacity-100"
            aria-label="Next sound"
          >
            ↓
          </button>
        </div>

        {/* Dots Indicator */}
        <div className="fixed bottom-4 left-0 right-0 flex justify-center gap-2 z-20">
          {filteredContents.map((_, index) => (
            <div
              key={index}
              className={`w-2 h-2 rounded-full transition-all ${
                index === currentIndex ? 'bg-white w-4' : 'bg-gray-500'
              }`}
              aria-hidden="true"
            />
          ))}
        </div>
      </div>
    </>
  );
}