'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import Image from 'next/image';

export default function EditPage() {
  const router = useRouter();
  const params = useParams();
  const postId = params.id;

  const [message, setMessage] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    category: '',
    tags: '',
    coverUrl: '',
  });

  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({
        placeholder: 'Edit your blog content here...',
      }),
    ],
    content: '',
    editorProps: {
      attributes: {
        class: 'prose mx-auto focus:outline-none min-h-[300px]',
      },
    },
  });

  // Fetch the existing post
  useEffect(() => {
    async function fetchPost() {
      if (!postId || !editor) return;
      try {
        const res = await fetch(`/api/posts/${postId}`);
        const data = await res.json();
        if (data.success) {
          const post = data.post;

          setFormData({
            title: post.title || '',
            category: post.category || '',
            tags: Array.isArray(post.tags) ? post.tags.join(', ') : '',
            coverUrl: post.cover_image || '',
          });

          editor.commands.setContent(post.description || '');
        }
      } catch (error) {
        console.error('Failed to fetch post', error);
      }
    }

    fetchPost();
  }, [postId, editor]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSaving(true);
    setMessage('Saving changes...');

    const body = {
      id: postId,
      title: formData.title,
      category: formData.category,
      tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag !== ''),
      content: editor?.getHTML() || '',
    };

    try {
      const res = await fetch('/api/edit', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });
      const result = await res.json();
      if (result.success) {
        setMessage('✅ Changes saved! Redirecting...');
        setTimeout(() => router.push('/blogs'), 1500);
      } else {
        setMessage(`❌ Error: ${result.error}`);
      }
    } catch (error: unknown) {
      setMessage(`❌ Error: ${error instanceof Error ? error.message : 'An unknown error occurred'}`);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-md overflow-hidden">
        <div className="p-8">
          <h2 className="text-3xl font-bold text-center text-pink-600 mb-6">Edit Blog Post</h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block mb-1">Title</label>
              <input
                type="text"
                value={formData.title}
                onChange={e => setFormData(prev => ({ ...prev, title: e.target.value }))}
                required
                className="w-full p-3 border border-gray-300 rounded-lg"
              />
            </div>

            <div>
              <label className="block mb-1">Category</label>
              <input
                type="text"
                value={formData.category}
                onChange={e => setFormData(prev => ({ ...prev, category: e.target.value }))}
                required
                className="w-full p-3 border border-gray-300 rounded-lg"
              />
            </div>

            <div>
              <label className="block mb-1">Tags (comma separated)</label>
              <input
                type="text"
                value={formData.tags}
                onChange={e => setFormData(prev => ({ ...prev, tags: e.target.value }))}
                className="w-full p-3 border border-gray-300 rounded-lg"
              />
            </div>

            <div>
              <label className="block mb-2">Content</label>
              <EditorContent editor={editor} className="border border-gray-300 rounded-lg p-4 bg-white" />
            </div>

            {formData.coverUrl && (
              <div>
                <label className="block mb-1">Current Cover</label>
                <div className="w-full h-64 relative rounded-lg overflow-hidden">
                  <Image
                    src={formData.coverUrl}
                    alt="Cover"
                    fill
                    style={{ objectFit: 'cover' }}
                    className="rounded-lg"
                  />
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={isSaving}
              className="w-full bg-pink-600 hover:bg-pink-700 text-white py-3 rounded-lg font-semibold"
            >
              {isSaving ? 'Saving...' : 'Save Changes'}
            </button>

            {message && <p className="text-center text-sm text-gray-600">{message}</p>}
          </form>
        </div>
      </div>
    </div>
  );
}