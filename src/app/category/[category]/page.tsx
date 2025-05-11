'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import SearchBar from '@/components/SearchBar';

interface Content {
  id: number;
  title: string;
  description?: string;
  image_url?: string;
  video_url?: string;
  extra_links?: string;
  tags?: string[];
  category?: string;
  created_at?: string;
}

function stripHtml(html: string): string {
  if (!html) return '';
  return html.replace(/<[^>]+>/g, '');
}

export default function CategoryPage() {
  const router = useRouter();
  const { category } = useParams<{ category: string }>();
  const [contents, setContents] = useState<Content[]>([]);
  const [filteredContents, setFilteredContents] = useState<Content[]>([]);
  const [loading, setLoading] = useState(true);
  const [featuredContent, setFeaturedContent] = useState<Content | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    async function fetchContents() {
      try {
        const res = await fetch(`/api/content-by-category?category=${encodeURIComponent(category.replace(/-/g, ' '))}`);
        const data = await res.json();
        setContents(data);
        setFilteredContents(data);

        if (data.length > 0) {
          setFeaturedContent(data[0]);
        }
      } catch (error) {
        console.error('Failed to fetch content', error);
      } finally {
        setLoading(false);
      }
    }

    if (category) {
      fetchContents();
    }
  }, [category]);

  useEffect(() => {
    if (searchQuery) {
      const results = contents.filter(content =>
        content.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (content.description && content.description.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (content.tags && content.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase())))
      );
      setFilteredContents(results);
      
      // Update featured content if it exists in filtered results
      if (results.length > 0) {
        setFeaturedContent(results[0]);
      } else {
        setFeaturedContent(null);
      }
    } else {
      setFilteredContents(contents);
      if (contents.length > 0) {
        setFeaturedContent(contents[0]);
      }
    }
  }, [searchQuery, contents]);

  const handleReadMore = (id: number) => {
    router.push(`/blogs/${id}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-indigo-100 via-purple-100 to-pink-100">
        <p className="text-xl font-semibold text-indigo-600">Loading {category.replace(/-/g, ' ')}...</p>
      </div>
    );
  }

  if (contents.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-indigo-100 via-purple-100 to-pink-100">
        <p className="text-xl font-semibold text-indigo-600">No content found for {category.replace(/-/g, ' ')}</p>
      </div>
    );
  }

  return (
    <main className="bg-gradient-to-r from-indigo-50 via-purple-50 to-pink-50 min-h-screen">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8 flex flex-col gap-4">
          <h1 className="text-4xl font-serif font-bold text-indigo-700 uppercase tracking-tight">
            {category.replace(/-/g, ' ')}
          </h1>
          <SearchBar onSearch={setSearchQuery} />
          <div className="border-t-2 border-indigo-300 py-2">
            <p className="text-sm text-gray-500 uppercase tracking-widest">Latest Stories & Features</p>
          </div>
        </div>
      </header>

      {/* Featured Content - Only shows if matches search */}
      {featuredContent && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="bg-white rounded-lg shadow-2xl overflow-hidden mb-12 transition hover:shadow-3xl">
            {featuredContent.image_url && (
              <img
                src={featuredContent.image_url}
                alt={featuredContent.title}
                className="w-full h-[450px] object-cover"
              />
            )}
            <div className="p-8">
              <div className="flex flex-wrap gap-2 mb-4">
                {featuredContent.tags?.map((tag, index) => (
                  <span key={index} className="px-3 py-1 bg-indigo-100 text-indigo-700 text-xs font-medium rounded-full">
                    {tag}
                  </span>
                ))}
              </div>
              <h2 className="text-3xl font-serif font-bold mb-4 text-indigo-800">{featuredContent.title}</h2>
              {featuredContent.description && (
                <p className="text-lg text-gray-700 mb-6 leading-relaxed">
                  {stripHtml(featuredContent.description).slice(0, 300)}...
                </p>
              )}
              <button 
                onClick={() => handleReadMore(featuredContent.id)}
                className="px-6 py-2 bg-indigo-600 text-white font-medium uppercase tracking-wide hover:bg-indigo-700 transition rounded-md"
              >
                Read More
              </button>
            </div>
          </div>
        </section>
      )}

      {/* Content Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <h2 className="text-2xl font-serif font-bold mb-8 border-b-2 border-indigo-200 pb-2 text-indigo-700">
          {searchQuery ? `Search Results for "${searchQuery}"` : 'More Stories'}
        </h2>

        {filteredContents.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-lg text-gray-600">No articles found matching your search.</p>
            <button
              onClick={() => setSearchQuery('')}
              className="mt-4 px-4 py-2 bg-indigo-100 text-indigo-700 rounded-md hover:bg-indigo-200 transition"
            >
              Clear Search
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {(searchQuery ? filteredContents : filteredContents.slice(1)).map((content) => (
              <article key={content.id} className="bg-white rounded-lg shadow-md overflow-hidden transition hover:shadow-lg">
                {content.image_url && (
                  <div className="relative h-48 w-full overflow-hidden">
                    <img
                      src={content.image_url}
                      alt={content.title}
                      className="absolute h-full w-full object-cover"
                    />
                  </div>
                )}
                <div className="p-6">
                  <div className="flex flex-wrap gap-2 mb-3">
                    {content.tags?.slice(0, 2).map((tag, index) => (
                      <span key={index} className="px-2 py-1 bg-purple-100 text-purple-700 text-xs font-medium rounded">
                        {tag}
                      </span>
                    ))}
                  </div>
                  <h3 className="text-xl font-serif font-bold mb-3 text-indigo-800">{content.title}</h3>
                  {content.description && (
                    <p className="text-gray-600 mb-4">
                      {stripHtml(content.description).slice(0, 150)}...
                    </p>
                  )}
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-gray-400">
                      {content.created_at && new Date(content.created_at).toLocaleDateString()}
                    </span>
                    <button 
                      onClick={() => handleReadMore(content.id)}
                      className="text-sm font-semibold text-indigo-600 hover:text-indigo-800"
                    >
                      Read →
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      {/* Footer */}
      <footer className="bg-indigo-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="border-t-2 border-indigo-700 pt-8">
            <p className="text-gray-400 text-sm">
              © {new Date().getFullYear()} {category.replace(/-/g, ' ')} Magazine. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </main>
  );
}