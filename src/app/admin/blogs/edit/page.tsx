'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function EditListPage() {
  const [blogs, setBlogs] = useState<any[]>([]);

  useEffect(() => {
    async function fetchBlogs() {
      const res = await fetch('/api/contenty'); // ✅ fixed typo
      if (res.ok) {
        const data = await res.json();
        setBlogs(data);
      } else {
        console.error('Failed to fetch blogs');
      }
    }
    fetchBlogs();
  }, []);

  // Function to remove HTML tags from description
  const stripHtml = (html: string) => {
    return html.replace(/<[^>]+>/g, '');
  };

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">All Blogs</h1>
      <div className="flex flex-col gap-6">
        {blogs.map(blog => (
          <Link
            key={blog.id}
            href={`/admin/edit/${blog.id}`}
            className="border p-4 hover:bg-gray-100 rounded flex items-center gap-4"
          >
            {blog.cover_image && (
              <img
                src={blog.cover_image}
                alt={blog.title}
                className="w-24 h-24 object-cover rounded"
              />
            )}
            <div>
              <h2 className="text-xl font-semibold">{blog.title}</h2>
              <p className="text-gray-600 text-sm">
                {stripHtml(blog.description)?.slice(0, 100)}...
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
