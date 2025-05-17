'use client';

import React from 'react';
import Head from 'next/head';
import Link from 'next/link';

export default function PrivacyPolicyPage() {
  return (
    <>
      <Head>
        <title>Privacy Policy | Lirrivelle</title>
        <meta 
          name="description" 
          content="Your privacy matters to us. Learn how Lirrivelle handles your data with care and respect." 
        />
      </Head>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-12 text-gray-700">
        <div className="bg-white rounded-xl shadow-lg p-8 sm:p-10">
          <div className="text-center mb-10">
            <h1 className="text-3xl sm:text-4xl font-bold text-pink-600 mb-3">
              Your Privacy Matters
            </h1>
            <p className="text-lg text-gray-500">
              Simple, transparent data practices
            </p>
          </div>

          <div className="prose prose-lg max-w-none">
            <section className="mb-10 bg-pink-50 rounded-lg p-6">
              <h2 className="text-xl sm:text-2xl font-semibold mb-4 text-pink-600">
                The Basics
              </h2>
              <p>
                Lirrivelle is built on respect for your privacy. We collect minimal data to operate the site and improve your experience across all our content sections.
              </p>
            </section>

            <section className="mb-10">
              <h2 className="text-xl sm:text-2xl font-semibold mb-4 text-pink-500">
                What We Collect
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-medium text-gray-800 mb-2">Automatically Collected</h3>
                  <ul className="list-disc pl-5 space-y-1 text-sm">
                    <li>Browser type & version</li>
                    <li>Device type (mobile/desktop)</li>
                    <li>Country/region (not precise location)</li>
                    <li>Pages visited & time spent</li>
                  </ul>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-medium text-gray-800 mb-2">Only If You Choose</h3>
                  <ul className="list-disc pl-5 space-y-1 text-sm">
                    <li>Comments you post</li>
                    <li>Wallpaper download preferences</li>
                    <li>Confession/whisper submissions</li>
                  </ul>
                </div>
              </div>
              <p>
                We never sell or share personal data. All information is used solely to operate and improve Lirrivelle.
              </p>
            </section>

            <section className="mb-10">
              <h2 className="text-xl sm:text-2xl font-semibold mb-4 text-pink-500">
                How We Protect You
              </h2>
              <div className="bg-gradient-to-r from-pink-50 to-purple-50 rounded-lg p-6">
                <ul className="list-disc pl-6 space-y-3">
                  <li><strong>Secure Connections:</strong> HTTPS encryption everywhere</li>
                  <li><strong>Minimal Data:</strong> We only collect what we need</li>
                  <li><strong>No Tracking:</strong> We don&apos;t use invasive tracking</li>
                  <li><strong>Regular Cleaning:</strong> Old data is automatically purged</li>
                </ul>
              </div>
            </section>

            <section className="mb-10">
              <h2 className="text-xl sm:text-2xl font-semibold mb-4 text-pink-500">
                Your Choices
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="border border-gray-200 rounded-lg p-4">
                  <h3 className="font-medium mb-2">Browser Controls</h3>
                  <p className="text-sm">Manage cookies through your browser settings</p>
                </div>
                <div className="border border-gray-200 rounded-lg p-4">
                  <h3 className="font-medium mb-2">Opt-Out</h3>
                  <p className="text-sm">Disable JavaScript to limit data collection</p>
                </div>
                <div className="border border-gray-200 rounded-lg p-4">
                  <h3 className="font-medium mb-2">Data Requests</h3>
                  <p className="text-sm">Contact us to request data deletion</p>
                </div>
                <div className="border border-gray-200 rounded-lg p-4">
                  <h3 className="font-medium mb-2">Anonymous Browsing</h3>
                  <p className="text-sm">Use private/incognito modes</p>
                </div>
              </div>
            </section>

            <section className="mb-10">
              <h2 className="text-xl sm:text-2xl font-semibold mb-4 text-pink-500">
                About Cookies
              </h2>
              <p className="mb-4">
                We use only essential cookies to:
              </p>
              <ul className="list-disc pl-6 mb-4 space-y-2">
                <li>Remember your preferences</li>
                <li>Maintain login sessions (if applicable)</li>
                <li>Provide basic analytics</li>
              </ul>
              <p>
                You can disable cookies in your browser, though some features may not work properly.
              </p>
            </section>

            <section className="mb-10">
              <h2 className="text-xl sm:text-2xl font-semibold mb-4 text-pink-500">
                Children&apos;s Privacy
              </h2>
              <p>
                Lirrivelle is not directed at children under 13. We do not knowingly collect any information from children.
              </p>
            </section>

            <section className="mb-10">
              <h2 className="text-xl sm:text-2xl font-semibold mb-4 text-pink-500">
                Policy Changes
              </h2>
              <p>
                We may update this policy occasionally. The date below shows when it was last revised. Continued use of Lirrivelle means you accept the current policy.
              </p>
            </section>

            <section className="mb-10">
              <h2 className="text-xl sm:text-2xl font-semibold mb-4 text-pink-500">
                Ezoic and Third-Party Services
              </h2>
              <p>
                This website may use third-party platforms, including Ezoic, to improve performance, personalize content, and serve relevant advertisements. These services may use cookies or similar technologies to collect data about your visit, such as browser type, IP address, and pages visited.
              </p>
              <p className="mt-2">
                For more information, you can view Ezoic&apos;s privacy policy at{' '}
                <a
                  href="https://g.ezoic.net/privacy/lirrivelle.com"
                  className="text-pink-600 underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  https://g.ezoic.net/privacy/lirrivelle.com
                </a>.
              </p>
            </section>

            <section className="bg-pink-50 rounded-lg p-6 mt-12">
              <h2 className="text-xl sm:text-2xl font-semibold mb-4 text-pink-600">
                Contact Us
              </h2>
              <p className="mb-4">
                For privacy questions or requests:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Use our <Link href="/contact" className="text-pink-600 underline">contact form</Link></li>
                <li>Include &quot;Privacy Request&quot; in your message</li>
                <li>Allow 3-5 business days for response</li>
              </ul>
            </section>

            <div className="mt-12 pt-6 border-t border-gray-200 text-sm text-gray-500">
              <p>Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>
              <p className="mt-2">Thank you for trusting Lirrivelle with your time and attention.</p>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
