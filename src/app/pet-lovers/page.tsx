"use client";

import { useEffect, useState, useRef } from "react";
import Image from "next/image";
import Head from "next/head";

interface Content {
  id: number;
  title: string;
  image_url: string | null;
  video_url: string | null;
}

export default function ContentListPage() {
  const [contents, setContents] = useState<Content[]>([]);
  const [filteredContents, setFilteredContents] = useState<Content[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isMuted, setIsMuted] = useState(true);
  const [isPlaying, setIsPlaying] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [touchStartY, setTouchStartY] = useState(0);
  const [touchEndY, setTouchEndY] = useState(0);
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);

  // SEO Metadata
  const pageTitle = "Adorable Pet Moments | Heartwarming Animal Content";
  const pageDescription = "Discover cute pets, funny animal stories, and heartwarming moments that celebrate the bond between humans and animals. Perfect for dog and cat lovers!";
  const siteUrl = "https://lirivelle.com/pets";
  const keywords = [
    "cute pets",
    "funny pet stories",
    "pet love",
    "dog and cat lovers",
    "animal therapy",
    "pets for mental wellness",
    "pet confessions",
    "adorable animal moments",
    "bond with your pet",
    "pet-inspired content"
  ].join(', ');

  useEffect(() => {
    const fetchContents = async () => {
      try {
        const res = await fetch("/api/contentys");
        const result = await res.json();
        if (res.ok) {
          setContents(result.data);
          setFilteredContents(result.data);
        } else {
          console.error("Fetch error:", result.message);
        }
      } catch (err) {
        console.error("Fetch error:", err);
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
          if (isPlaying) {
            video.play().catch(() => {});
          } else {
            video.pause();
          }
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
    setCurrentIndex((prev) =>
      prev < filteredContents.length - 1 ? prev + 1 : prev
    );
    setIsPlaying(true);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : prev));
    setIsPlaying(true);
  };

  const handleWheel = (e: React.WheelEvent<HTMLDivElement>) => {
    if (e.deltaY > 0) handleNext();
    else handlePrev();
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStartY(e.touches[0].clientY);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEndY(e.touches[0].clientY);
  };

  const handleTouchEnd = () => {
    const threshold = 50;
    if (touchStartY - touchEndY > threshold) {
      handleNext();
    } else if (touchEndY - touchStartY > threshold) {
      handlePrev();
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

  if (contents.length === 0)
    return (
      <>
        <Head>
          <title>{pageTitle}</title>
          <meta name="description" content={pageDescription} />
          <meta name="keywords" content={keywords} />
        </Head>
        <div className="h-screen w-full flex items-center justify-center bg-black">
          <p className="text-center text-white">No content available</p>
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
        <meta property="og:image" content={`${siteUrl}/images/pet-content-preview.jpg`} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={pageTitle} />
        <meta name="twitter:description" content={pageDescription} />
        <meta name="twitter:image" content={`${siteUrl}/images/pet-content-preview.jpg`} />
        <link rel="canonical" href={siteUrl} />
      </Head>

      <div
        className="relative h-screen w-full overflow-hidden bg-black"
        onWheel={handleWheel}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {/* Search Bar on the Top-Left */}
        <div className="fixed top-6 left-6 w-[250px] z-50">
          <div className="relative w-full">
            <input
              type="text"
              placeholder="Search pet videos..."
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              className="w-full py-2 px-4 rounded-lg bg-black bg-opacity-80 text-white border border-gray-600 focus:outline-none focus:border-red-500 shadow-md text-sm"
              aria-label="Search pet content"
            />
            {searchQuery && (
              <button
                onClick={() => {
                  setSearchQuery("");
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

        {/* Content Display */}
        <div
          className="transition-transform duration-500 ease-in-out"
          style={{ transform: `translateY(-${currentIndex * 100}vh)` }}
        >
          {filteredContents.length === 0 ? (
            <div className="h-screen w-full flex items-center justify-center text-white">
              No matching pet content found.
            </div>
          ) : (
            filteredContents.map((item, index) => (
              <div
                key={item.id}
                className="h-screen w-full flex items-center justify-center relative"
              >
                <div
                  className="relative w-[400px] h-[700px] bg-black rounded-lg overflow-hidden cursor-pointer"
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
                      aria-label={`Pet video: ${item.title}`}
                    />
                  ) : item.image_url ? (
                    <Image
                      src={item.image_url}
                      alt={item.title}
                      width={400}
                      height={700}
                      className="w-full h-full object-cover"
                      style={{ objectFit: "cover" }}
                      unoptimized
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-500">
                      No media available
                    </div>
                  )}

                  {/* Overlay Title */}
                  <div className="absolute bottom-16 left-1/2 transform -translate-x-1/2 text-red-600 text-xl font-bold text-center z-10">
                    {item.title}
                  </div>

                  {/* Mute Button */}
                  {item.video_url && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleMute();
                      }}
                      className="absolute top-4 right-4 bg-black bg-opacity-50 text-white px-3 py-1 rounded-full z-20 text-sm hover:bg-opacity-75 transition"
                      aria-label={isMuted ? "Unmute video" : "Mute video"}
                    >
                      {isMuted ? "Unmute 🔇" : "Mute 🔊"}
                    </button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Navigation Buttons */}
        <button
          onClick={handlePrev}
          disabled={currentIndex === 0}
          className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white text-4xl z-30 opacity-70 hover:opacity-100"
          aria-label="Previous pet content"
        >
          ↑
        </button>
        <button
          onClick={handleNext}
          disabled={currentIndex === filteredContents.length - 1}
          className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white text-4xl z-30 opacity-70 hover:opacity-100"
          aria-label="Next pet content"
        >
          ↓
        </button>

        {/* Scroll Dots */}
        <div className="absolute right-4 bottom-8 flex flex-col gap-2 z-20">
          {filteredContents.map((_, index) => (
            <div
              key={index}
              className={`w-2 h-2 rounded-full ${
                index === currentIndex ? "bg-white" : "bg-gray-500"
              }`}
              aria-hidden="true"
            />
          ))}
        </div>
      </div>
    </>
  );
}