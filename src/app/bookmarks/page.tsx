'use client';

import { useEffect, useState } from 'react';
import Head from 'next/head';

// Helper function to clean up category names for URLs
function getSlug(text: string) {
  return text
    .replace(
      /[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/gu,
      ''
    ) // remove emoji unicode
    .replace(/[^\w\s-]/g, '') // remove non-word characters
    .trim()
    .toLowerCase()
    .replace(/\s+/g, '-'); // replace spaces with hyphens
}

export default function CategoriesPage() {
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchCategories() {
      try {
        const res = await fetch('/api/categories');
        const json = await res.json();

        if (json.success && Array.isArray(json.data)) {
          setCategories(json.data);
        } else {
          console.error('Unexpected API response:', json);
          setCategories([]);
        }
      } catch (error) {
        console.error('Failed to fetch categories', error);
        setCategories([]);
      } finally {
        setLoading(false);
      }
    }

    fetchCategories();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="flex flex-col items-center space-y-4">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-8 h-8 bg-indigo-500 rounded-full animate-ping"></div>
            </div>
          </div>
          <p className="text-lg font-medium text-gray-700 animate-pulse">Curating categories...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>Explore Categories | Modern Collection</title>
        <meta
          name="description"
          content="Browse our beautifully curated categories for every interest"
        />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </Head>

      <main className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        {/* Hero Section */}
        <section className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-600 opacity-10"></div>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28 relative">
            <div className="text-center">
              <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-4 tracking-tight">
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-500">
                  Discover Our World
                </span>
              </h1>
              <p className="max-w-2xl mx-auto text-xl md:text-2xl text-gray-600 font-light">
                Explore our meticulously curated collection of categories
              </p>
              <div className="mt-8 flex justify-center">
                <div className="relative group">
                  <div className="absolute -inset-1 bg-gradient-to-r from-indigo-400 to-purple-500 rounded-lg blur opacity-25 group-hover:opacity-50 transition duration-300"></div>
                  <button className="relative px-6 py-3 bg-white rounded-lg text-gray-900 font-medium shadow-lg hover:shadow-xl transition-all duration-300">
                    View All Collections
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Categories Grid */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
          {categories.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {categories.map((category, index) => (
                <div
                  key={category}
                  className="relative group overflow-hidden rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-500"
                  style={{
                    transitionDelay: `${index * 50}ms`,
                    transform: 'translateY(0)',
                    opacity: 1,
                  }}
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-indigo-100 to-purple-100 opacity-60 group-hover:opacity-80 transition-opacity duration-500"></div>
                  <div className="relative h-full min-h-[250px] flex flex-col p-6">
                    <div className="flex-1 flex flex-col justify-center">
                      <h3 className="text-2xl font-bold text-gray-900 group-hover:text-indigo-700 transition-colors duration-300 mb-3">
                        {category}
                      </h3>
                      <p className="text-gray-600 group-hover:text-gray-800 transition-colors duration-300">
                        Explore {category.replace(/^[^\w\s]+/, '').toLowerCase()} category
                      </p>
                    </div>
                    <div className="mt-6">
                      <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-white text-indigo-700 shadow-sm group-hover:bg-indigo-50 group-hover:text-indigo-800 transition-all duration-300">
                        Explore
                        <svg
                          className="ml-2 -mr-1 h-4 w-4"
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </span>
                    </div>
                  </div>
                  <a
                    href={`/category/${getSlug(category)}`}
                    className="absolute inset-0 z-10"
                    aria-label={`Explore ${category}`}
                  ></a>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <div className="mx-auto max-w-md">
                <svg
                  className="mx-auto h-16 w-16 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="1.5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <h3 className="mt-5 text-2xl font-medium text-gray-900">No categories available</h3>
                <p className="mt-2 text-gray-500">
                  We&apos;re currently curating our collections. Please check back soon.
                </p>
                <div className="mt-6">
                  <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700">
                    Notify me
                  </button>
                </div>
              </div>
            </div>
          )}
        </section>

        {/* CTA Section */}
        <section className="bg-gradient-to-r from-indigo-500 to-purple-600 py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
              <span className="block">Ready to explore more?</span>
            </h2>
            <p className="mt-4 text-xl text-indigo-100 max-w-3xl mx-auto">
              Join thousands of satisfied customers discovering amazing products every day.
            </p>
            <div className="mt-8 flex justify-center">
              <div className="inline-flex rounded-md shadow">
                <a
                  href="#"
                  className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-indigo-600 bg-white hover:bg-indigo-50 transition-all duration-300 transform hover:scale-105"
                >
                  Get Started
                </a>
              </div>
              <div className="ml-3 inline-flex">
                <a
                  href="#"
                  className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 bg-opacity-60 hover:bg-opacity-70 transition-all duration-300"
                >
                  Learn more
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}