'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';

type Content = {
  id: number;
  title: string;
  video_url: string;
  description?: string;
};

const isEmbedUrl = (url: string) => {
  return url.includes('youtube.com/embed') || url.includes('player.vimeo.com');
};

export default function HeartTalkDetailPage() {
  const { id } = useParams();
  const [content, setContent] = useState<Content | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVideo = async () => {
      try {
        const res = await fetch(`/api/heart-talk/${id}`);
        const data = await res.json();
        setContent(data);
      } catch (err) {
        console.error('Failed to fetch video:', err);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchVideo();
  }, [id]);

  // Generate random stars for the background
  const stars = Array.from({ length: 100 }).map((_, i) => (
    <div
      key={i}
      className="absolute rounded-full bg-white"
      style={{
        top: `${Math.random() * 100}%`,
        left: `${Math.random() * 100}%`,
        width: `${Math.random() * 3 + 1}px`,
        height: `${Math.random() * 3 + 1}px`,
        opacity: Math.random() * 0.5 + 0.5,
        animation: `twinkle ${Math.random() * 3 + 2}s infinite alternate`
      }}
    />
  ));

  if (loading) return (
    <div className="min-h-screen bg-gradient-to-b from-blue-900 to-purple-900 overflow-hidden relative">
      {stars}
      <div className="cloud-animation">
        <div className="cloud cloud-1"></div>
        <div className="cloud cloud-2"></div>
        <div className="cloud cloud-3"></div>
      </div>
      <p className="text-center mt-10 text-white text-xl relative z-10">Loading heavenly content...</p>
    </div>
  );

  if (!content) return (
    <div className="min-h-screen bg-gradient-to-b from-blue-900 to-purple-900 overflow-hidden relative">
      {stars}
      <div className="cloud-animation">
        <div className="cloud cloud-1"></div>
        <div className="cloud cloud-2"></div>
        <div className="cloud cloud-3"></div>
      </div>
      <p className="text-center mt-10 text-white text-xl relative z-10">Video not found in the heavens...</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-900 to-purple-900 overflow-hidden relative pb-20">
      {/* Starry background */}
      {stars}
      
      {/* Animated clouds */}
      <div className="cloud-animation">
        <div className="cloud cloud-1"></div>
        <div className="cloud cloud-2"></div>
        <div className="cloud cloud-3"></div>
      </div>
      
      {/* "Drizzling" effect (subtle animated dots) */}
      <div className="absolute inset-0 overflow-hidden">
        {Array.from({ length: 50 }).map((_, i) => (
          <div
            key={`drizzle-${i}`}
            className="absolute rounded-full bg-white opacity-10"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              width: '2px',
              height: `${Math.random() * 10 + 5}px`,
              animation: `fall ${Math.random() * 5 + 5}s linear infinite`,
              animationDelay: `${Math.random() * 5}s`
            }}
          />
        ))}
      </div>

      <div className="relative z-10 max-w-4xl mx-auto p-6">
        {/* Heavenly title with glow effect */}
        <h1 className="text-4xl font-bold mb-8 text-center text-white font-serif tracking-wide">
          <span className="text-gold-400 bg-clip-text text-transparent bg-gradient-to-r from-yellow-200 to-yellow-500">
            {content.title}
          </span>
        </h1>

        {/* Player Container with heavenly glow */}
        <div className="w-full max-w-3xl mx-auto aspect-video mb-8 relative">
          <div className="absolute -inset-4 bg-blue-400 rounded-xl opacity-20 blur-xl"></div>
          <div className="absolute -inset-2 bg-purple-400 rounded-lg opacity-20 blur-lg"></div>
          
          {isEmbedUrl(content.video_url) ? (
            <iframe
              src={content.video_url}
              title={content.title}
              className="w-full h-full rounded-xl border-4 border-white/20 relative z-10 shadow-2xl"
              allowFullScreen
            />
          ) : (
            <video
              controls
              className="w-full h-full object-contain bg-black/70 rounded-xl border-4 border-white/20 relative z-10 shadow-2xl"
              src={content.video_url}
            >
              Your browser does not support the video tag.
            </video>
          )}
        </div>

        {/* Angelic description */}
        {content.description && (
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20 mt-8">
            <p className="text-white/90 text-lg text-center font-light leading-relaxed">
              {content.description}
            </p>
          </div>
        )}
      </div>

      {/* Add some CSS for animations */}
      <style jsx global>{`
        @keyframes twinkle {
          0% { opacity: 0.2; }
          100% { opacity: 1; }
        }
        
        @keyframes fall {
          0% { transform: translateY(-100vh); }
          100% { transform: translateY(100vh); }
        }
        
        .cloud {
          position: absolute;
          background: white;
          border-radius: 50%;
          opacity: 0.1;
          filter: blur(10px);
        }
        
        .cloud-1 {
          width: 200px;
          height: 60px;
          top: 10%;
          left: 10%;
          animation: float 30s infinite linear;
        }
        
        .cloud-2 {
          width: 300px;
          height: 100px;
          top: 30%;
          right: 15%;
          animation: float 40s infinite linear reverse;
        }
        
        .cloud-3 {
          width: 250px;
          height: 80px;
          bottom: 20%;
          left: 20%;
          animation: float 35s infinite linear;
        }
        
        @keyframes float {
          0% { transform: translateX(0) translateY(0); }
          25% { transform: translateX(50px) translateY(-20px); }
          50% { transform: translateX(100px) translateY(0); }
          75% { transform: translateX(50px) translateY(20px); }
          100% { transform: translateX(0) translateY(0); }
        }
      `}</style>
    </div>
  );
}