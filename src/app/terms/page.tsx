'use client';

import React from 'react';
import Head from 'next/head';
import Link from 'next/link';

export default function TermsPage() {
  return (
    <>
      <Head>
        <title>Terms of Use | Lirrivelle</title>
        <meta name="description" content="Complete terms and conditions for using Lirrivelle" />
      </Head>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-12 text-gray-700">
        <div className="bg-white rounded-xl shadow-sm p-8 sm:p-10">
          <h1 className="text-3xl sm:text-4xl font-bold text-pink-600 mb-8 text-center">
            Lirrivelle Terms of Use
          </h1>

          <div className="prose prose-lg max-w-none">
            <section className="mb-10">
              <h2 className="text-xl sm:text-2xl font-semibold mb-4 text-pink-500">
                Welcome to Our Digital Sanctuary
              </h2>
              <p className="mb-4">
                Lirrivelle is a carefully curated collection of content I've gathered to create a peaceful online space. By accessing or using this website, you acknowledge that you have read, understood, and agree to be bound by these Terms of Use and our <Link href="/privacy-policy" className="text-pink-600 hover:underline">Privacy Policy</Link>. If you don't agree with any part of these terms, please refrain from using our site.
              </p>
              <p>
                This is a personal, non-commercial project created for sharing beautiful things. While we strive to maintain accuracy and quality, we make no representations or warranties of any kind about the completeness or reliability of any content.
              </p>
            </section>

            <section className="mb-10">
              <h2 className="text-xl sm:text-2xl font-semibold mb-4 text-pink-500">
                Content Usage and Intellectual Property
              </h2>
              <p className="mb-4">
                The content on Lirrivelle falls into several categories regarding ownership and usage rights:
              </p>
              <ul className="list-disc pl-6 mb-4 space-y-3">
                <li><strong>Original content</strong> created by me is free for personal, non-commercial use with attribution</li>
                <li><strong>Shared content</strong> from other creators is used with permission or under fair use principles</li>
                <li><strong>Public domain content</strong> is clearly marked when possible</li>
                <li><strong>User-submitted content</strong> (when applicable) remains property of the original creator</li>
              </ul>
              <p>
                If you believe any content infringes on your rights, please <Link href="/contact" className="text-pink-600 hover:underline">contact us</Link> immediately with details and we'll address your concerns promptly.
              </p>
            </section>

            <section className="mb-10">
              <h2 className="text-xl sm:text-2xl font-semibold mb-4 text-pink-500">
                Permitted Uses of Our Content
              </h2>
              <p className="mb-4">
                You're welcome to:
              </p>
              <ul className="list-disc pl-6 mb-4 space-y-3">
                <li>View and enjoy all content for personal, non-commercial purposes</li>
                <li>Share direct links to our pages through social media or messaging</li>
                <li>Download wallpapers or sounds for personal devices (where download options are provided)</li>
                <li>Print blog posts or articles for personal reading (not for distribution)</li>
                <li>Use our content as inspiration for your own creative projects (with proper attribution)</li>
              </ul>
              <p>
                Please review our <Link href="/privacy-policy" className="text-pink-600 hover:underline">Privacy Policy</Link> to understand what data we collect and how we use it when you interact with our site.
              </p>
            </section>

            <section className="mb-10">
              <h2 className="text-xl sm:text-2xl font-semibold mb-4 text-pink-500">
                Prohibited Activities
              </h2>
              <p className="mb-4">
                To maintain the quality and integrity of Lirrivelle, we prohibit:
              </p>
              <ul className="list-disc pl-6 mb-4 space-y-3">
                <li>Republishing or redistributing content without permission</li>
                <li>Using any content for commercial purposes</li>
                <li>Modifying or creating derivative works from our content</li>
                <li>Scraping, data mining, or using automated systems to access our content</li>
                <li>Attempting to compromise site security or server integrity</li>
                <li>Impersonating the site owner or other users</li>
                <li>Using the site in any way that violates applicable laws</li>
              </ul>
              <p>
                Violations may result in restricted access to our site and possible legal action where appropriate.
              </p>
            </section>

            <section className="mb-10">
              <h2 className="text-xl sm:text-2xl font-semibold mb-4 text-pink-500">
                Content Submission Policy
              </h2>
              <p className="mb-4">
                Currently, Lirrivelle does not accept unsolicited content submissions. All content is personally curated by the site owner. This policy helps maintain quality control and ensures proper attribution for all shared works.
              </p>
              <p>
                If you're interested in collaborating or having your work considered for inclusion, please <Link href="/contact" className="text-pink-600 hover:underline">contact us</Link> with details about your content and how you'd like it to be featured.
              </p>
            </section>

            <section className="mb-10">
              <h2 className="text-xl sm:text-2xl font-semibold mb-4 text-pink-500">
                Third-Party Links and Content
              </h2>
              <p className="mb-4">
                Lirrivelle may contain links to external websites or resources. These links are provided for convenience only, and we:
              </p>
              <ul className="list-disc pl-6 mb-4 space-y-3">
                <li>Don't endorse or assume responsibility for any third-party content</li>
                <li>Aren't responsible for the accuracy or legality of external sites</li>
                <li>Don't guarantee the availability or quality of external resources</li>
              </ul>
              <p>
                When leaving our site, we recommend reviewing the terms and privacy policies of any third-party sites you visit.
              </p>
            </section>

            <section className="mb-10">
              <h2 className="text-xl sm:text-2xl font-semibold mb-4 text-pink-500">
                Changes to These Terms
              </h2>
              <p className="mb-4">
                We may update these Terms of Use periodically to reflect changes in our practices or legal requirements. When we make changes:
              </p>
              <ul className="list-disc pl-6 mb-4 space-y-3">
                <li>We'll update the "Last updated" date at the bottom of this page</li>
                <li>Material changes will be announced on our homepage for 30 days</li>
                <li>Your continued use after changes constitutes acceptance of the new terms</li>
              </ul>
              <p>
                We encourage you to review these terms occasionally to stay informed about your rights and responsibilities when using Lirrivelle.
              </p>
            </section>

            <section className="mb-10 bg-pink-50 rounded-lg p-6">
              <h2 className="text-xl sm:text-2xl font-semibold mb-4 text-pink-600">
                Contact Information
              </h2>
              <p className="mb-4">
                For questions about these Terms of Use, content removal requests, or other concerns:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Use our <Link href="/contact" className="text-pink-600 hover:underline">contact form</Link></li>
                <li>Response time: Typically within 3-5 business days</li>
                <li>Please include "Terms Inquiry" in your message</li>
              </ul>
            </section>

            <div className="mt-12 pt-6 border-t border-gray-200 text-sm text-gray-500">
              <p>Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>
              <p className="mt-2">Lirrivelle is a personal passion project created to share beauty and inspiration. Thank you for being part of our community.</p>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}