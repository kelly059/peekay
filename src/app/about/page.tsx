'use client';

import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import Head from 'next/head';

export default function AboutPage() {
  useEffect(() => {
    // Smooth scroll to top when component mounts
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5
      }
    }
  };

  return (
    <>
      <Head>
        <title>About Lirrivelle | A Cozy Digital Sanctuary</title>
        <meta name="description" content="Discover the story behind Lirrivelle - a soft, mysterious corner of the internet crafted with love, emotion, and serenity." />
      </Head>

      <div className="bg-gradient-to-b from-pink-50 to-purple-50 min-h-screen">
        <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={containerVariants}
            className="bg-white rounded-2xl shadow-lg overflow-hidden"
          >
            {/* Hero Section */}
            <div className="relative bg-gradient-to-r from-pink-500 to-purple-600 p-8 md:p-12 text-white">
              <div className="absolute inset-0 bg-black opacity-10"></div>
              <motion.div variants={itemVariants}>
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 relative z-10">
                  About <span className="font-cursive">Lirrivelle</span>
                </h1>
                <p className="text-xl md:text-2xl opacity-90 relative z-10">
                  A digital sanctuary for souls seeking calm, honesty, and magic
                </p>
              </motion.div>
            </div>

            {/* Content Section */}
            <div className="p-8 md:p-12">
              <motion.div variants={itemVariants} className="mb-10">
                <p className="text-lg md:text-xl text-gray-700 mb-6 leading-relaxed">
                  Welcome to <strong className="text-pink-600">Lirrivelle</strong> — a soft, mysterious corner of the internet crafted with love, emotion, and serenity. This space was created for souls who crave calm, honesty, and a little spark of magic in their day.
                </p>
                
                <p className="text-lg md:text-xl text-gray-700 mb-6 leading-relaxed">
                  It's more than just a website — it's an experience, a cozy universe where you're free to feel, share, and simply exist without judgment.
                </p>
              </motion.div>

              <motion.div variants={itemVariants} className="mb-12">
                <h2 className="text-3xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-600">
                  What You'll Discover at Lirrivelle
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {[
                    { icon: '📝', title: 'Blogs', desc: 'Thoughtful, emotional, and reflective pieces to warm your heart or stir your thoughts.' },
                    { icon: '🖼', title: 'Wallpapers', desc: 'A gallery of beautiful, hand-picked images to make your phone or desktop feel magical.' },
                    { icon: '🕵', title: 'Confessions', desc: 'A safe space for anonymous stories and secrets — because we all have something to share.' },
                    { icon: '💋', title: 'Whispers', desc: 'Short, flirty, or poetic bites of emotion that leave a lasting echo.' },
                    { icon: '🎧', title: 'Relaxing Sounds', desc: 'Soft melodies and calming nature audio to help you relax and breathe.' },
                    { icon: '❤', title: 'Heart Talk', desc: 'Gentle, healing words to ease stress, anxiety, or sadness — like a hug in text form.' },
                    { icon: '🐾', title: 'Pet Lover\'s Corner', desc: 'A happy space for animal lovers to share cuteness, joy, and fluff.', colSpan: 'md:col-span-2' }
                  ].map((item, index) => (
                    <motion.div 
                      key={index}
                      variants={itemVariants}
                      whileHover={{ y: -5 }}
                      className={`bg-gradient-to-br from-white to-gray-50 rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow ${item.colSpan || ''}`}
                    >
                      <div className="text-3xl mb-3">{item.icon}</div>
                      <h3 className="text-xl font-semibold text-gray-800 mb-2">{item.title}</h3>
                      <p className="text-gray-600">{item.desc}</p>
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              <motion.div variants={itemVariants} className="mb-10">
                <div className="bg-pink-50 rounded-xl p-8 md:p-10 border border-pink-100">
                  <h3 className="text-2xl font-bold text-pink-700 mb-4">From the Creator</h3>
                  <p className="text-lg text-gray-700 mb-4">
                    Every part of Lirrivelle is personally curated and uploaded by me — a one-person creator pouring love and emotion into this digital world. I believe in honesty, softness, and creating things that make people feel <em>something</em>.
                  </p>
                  <p className="text-lg text-gray-700">
                    Whether you're here to find peace, to confess something you can't say out loud, to read words that feel like a mirror, or just to breathe — you're welcome here. Lirrivelle is your cozy escape from the noise.
                  </p>
                </div>
              </motion.div>

              <motion.div 
                variants={itemVariants}
                className="text-center mt-12"
              >
                <div className="inline-block bg-gradient-to-r from-pink-500 to-purple-500 rounded-full p-1">
                  <div className="bg-white rounded-full px-8 py-4">
                    <p className="text-lg italic text-gray-700">
                      "Thank you for being here. You're not alone." <span className="text-xl">🌙</span>
                    </p>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </main>
      </div>
    </>
  );
}