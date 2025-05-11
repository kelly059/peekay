'use client';

import React from 'react';
import { useRouter } from 'next/navigation';

const AdminPanel = () => {
  const router = useRouter();

  const categories = [
    { name: "Blogs", icon: "📝", color: "bg-pink-100 border-pink-300" },
    { name: "Wallpapers", icon: "🖼", color: "bg-blue-100 border-blue-300" },
    { name: "Confessions", icon: "🕵", color: "bg-purple-100 border-purple-300" },
    { name: "Adult Talk", icon: "💋", color: "bg-rose-100 border-rose-300" },
    { name: "Relaxing Sounds", icon: "🎧", color: "bg-teal-100 border-teal-300" },
    { name: "Love Songs", icon: "❤", color: "bg-red-100 border-red-300" },
    { name: "Pet Lovers", icon: "🐾", color: "bg-yellow-100 border-yellow-300" }
  ];

  const handleAction = (category: string, action: string) => {
    router.push(`/admin/${category.toLowerCase().replace(/ /g, '-')}/${action}`);
  };

  return (
    <div className="min-h-screen p-6 bg-gradient-to-br from-rose-50 to-blue-50">
      {/* Header */}
      <div className="text-center mb-10">
        <h1 className="text-4xl font-bold text-rose-400 mb-2 font-[Comic-Sans]">Content Cloud</h1>
        <p className="text-lg text-gray-500">✨ Manage your magical content ✨</p>
      </div>

      {/* Categories Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
        {categories.map((category) => (
          <div 
            key={category.name} 
            className={`${category.color} border-2 rounded-2xl p-5 shadow-lg 
                       hover:shadow-xl transition-all hover:-translate-y-1`}
          >
            {/* Category Header */}
            <div className="flex items-center mb-4">
              <span className="text-3xl mr-3">{category.icon}</span>
              <h2 className="text-xl font-semibold text-gray-700">{category.name}</h2>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-2">
              <button 
                onClick={() => handleAction(category.name, 'upload')}
                className="px-4 py-2 bg-white rounded-full border-2 border-pink-300 
                          text-pink-500 hover:bg-pink-100 flex items-center"
              >
                <span className="mr-1">☁️</span> Upload
              </button>
              
              <button 
                onClick={() => handleAction(category.name, 'edit')}
                className="px-4 py-2 bg-white rounded-full border-2 border-blue-300 
                          text-blue-500 hover:bg-blue-100 flex items-center"
              >
                <span className="mr-1">✏️</span> Edit
              </button>
              
              <button 
                onClick={() => handleAction(category.name, 'delete')}
                className="px-4 py-2 bg-white rounded-full border-2 border-red-300 
                          text-red-500 hover:bg-red-100 flex items-center"
              >
                <span className="mr-1">🗑️</span> Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Decorative Elements */}
      <div className="fixed bottom-0 right-0 text-6xl opacity-10">🌸</div>
      <div className="fixed top-0 left-0 text-6xl opacity-10">🐾</div>
    </div>
  );
};

export default AdminPanel;