'use client';

import { useEffect, useState } from 'react';

interface Content {
  id: number;
  title: string;
}

export default function DeletePage() {
  const [post, setPost] = useState<Content[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchPost();
  }, []);

  const fetchPost = async () => {
    try {
      const res = await fetch('/api/get-posts');
      const data = await res.json();
      setPost(data.posts); // Still 'posts' from API
    } catch (error) {
      console.error('Error fetching posts:', error);
    }
  };

  const handleDelete = async (id: number) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this post?');
    if (!confirmDelete) return;

    setLoading(true);

    try {
      const res = await fetch(`/api/delete-post?id=${id}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        setPost(prev => prev.filter(p => p.id !== id));
        alert('Post deleted successfully!');
      } else {
        alert('Failed to delete post.');
      }
    } catch (error) {
      console.error('Delete error:', error);
      alert('Something went wrong.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Delete a Blog Post</h1>

      {post.length === 0 ? (
        <p>No posts available.</p>
      ) : (
        <ul className="space-y-4">
          {post.map(p => (
            <li key={p.id} className="flex justify-between items-center border p-4 rounded">
              <span>{p.title}</span>
              <button
                onClick={() => handleDelete(p.id)}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded"
                disabled={loading}
              >
                {loading ? 'Deleting...' : 'Delete'}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
