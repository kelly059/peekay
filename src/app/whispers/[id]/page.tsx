'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { motion } from 'framer-motion';

export default function ReadConfessionPage() {
  const { id } = useParams();
  const [confession, setConfession] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`/api/whispers/${id}`);
        
        if (!res.ok) throw new Error('Failed to fetch confession');
        
        const data = await res.json();
        setConfession(data);
      } catch (err) {
        console.error('Error loading confession:', err);
        setError(err instanceof Error ? err.message : 'Failed to load confession');
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [id]);

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-pink-500"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded-lg">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
      {/* Decorative header */}
      <div className="flex items-center justify-center mb-8">
        <div className="relative">
          <div className="absolute -inset-4">
            <div className="w-full h-full mx-auto rotate-180 opacity-30 blur-lg filter bg-gradient-to-r from-pink-400 to-purple-500"></div>
          </div>
          <h1 className="relative text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-purple-600">
            whispers
          </h1>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="relative bg-white rounded-xl shadow-lg p-6 border border-gray-100 overflow-hidden"
      >
        {/* Decorative corner */}
        <div className="absolute top-0 right-0 w-24 h-24 overflow-hidden">
          <div className="absolute transform rotate-45 bg-pink-100 text-pink-500 py-1 text-xs font-semibold text-center w-40 top-11 -right-16">
            WHISPERS #{id}
          </div>
        </div>

        {/* Confession content */}
        <div className="relative z-10">
          <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 text-pink-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
            </svg>
            {confession?.title}
          </h2>
          
          <div className="prose prose-pink max-w-none text-gray-700 mb-6">
            <p className="whitespace-pre-wrap text-lg leading-relaxed">{confession?.description}</p>
          </div>
          
          {confession?.created_at && (
            <div className="flex items-center text-sm text-gray-500 border-t border-gray-100 pt-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Confessed on {new Date(confession.created_at).toLocaleString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}
            </div>
          )}
        </div>

        {/* Decorative background elements */}
        <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-pink-50 to-transparent opacity-30 -z-0"></div>
        <div className="absolute top-1/4 -left-10 w-24 h-24 rounded-full bg-pink-100 opacity-20 blur-xl"></div>
        <div className="absolute bottom-1/4 -right-10 w-24 h-24 rounded-full bg-purple-100 opacity-20 blur-xl"></div>
      </motion.div>

      {/* Footer decoration */}
      <div className="mt-12 text-center text-gray-400 text-sm">
        <p>This confession will self-destruct in 24 hours... just kidding</p>
      </div>
    </div>
  );
}