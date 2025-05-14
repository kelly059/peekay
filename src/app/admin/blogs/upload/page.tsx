'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';
import Placeholder from '@tiptap/extension-placeholder';
import Underline from '@tiptap/extension-underline';
import TextAlign from '@tiptap/extension-text-align';
import {
  FiBold, FiItalic, FiLink, FiImage, FiUnderline,
  FiAlignLeft, FiAlignCenter, FiAlignRight
} from 'react-icons/fi';

interface CustomImageAttributes {
  src: string;
  alt?: string;
  title?: string;
  'data-id'?: string | null;
}

const CustomImage = Image.extend({
  addAttributes() {
    return {
      ...this.parent?.(),
      'data-id': {
        default: null,
      },
    };
  },
});

export default function UploadPage() {
  const [message, setMessage] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const router = useRouter();

  const editor = useEditor({
    extensions: [
      StarterKit,
      CustomImage.configure({
        HTMLAttributes: {
          class: 'rounded-lg max-w-full h-auto mx-auto my-4 block',
        },
        inline: false,
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-pink-600 underline hover:text-pink-700',
        },
      }),
      Placeholder.configure({
        placeholder: 'Write your blog content here...',
      }),
      Underline,
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
    ],
    content: '',
    editorProps: {
      attributes: {
        class: 'prose prose-sm sm:prose lg:prose-lg xl:prose-xl mx-auto focus:outline-none min-h-[300px]',
      },
    },
  });

  const addImage = useCallback(() => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';

    input.onchange = async () => {
      const file = input.files?.[0];
      if (!file || !editor) return;

      setIsUploading(true);
      const placeholderId = `image-${Date.now()}`;

      const placeholderImage =
        'data:image/svg+xml;base64,' +
        btoa(`
          <svg width="400" height="300" xmlns="http://www.w3.org/2000/svg">
            <rect width="400" height="300" fill="#e5e7eb"/>
            <text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="#6b7280" font-size="20">Uploading...</text>
          </svg>
        `);

      const imageAttributes: CustomImageAttributes = {
        src: placeholderImage,
        'data-id': placeholderId
      };

      editor.chain().focus().setImage(imageAttributes).run();

      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
        const transaction = editor.state.tr;
        let replaced = false;

        editor.state.doc.descendants((node, pos) => {
          if (node.type.name === 'image' && node.attrs['data-id'] === placeholderId) {
            const imageNode = editor.schema.nodes.image.create({
              ...node.attrs,
              src: result,
            });
            const paragraph = editor.schema.nodes.paragraph.create();
            transaction.replaceWith(pos, pos + node.nodeSize, [imageNode, paragraph]);
            replaced = true;
            return false;
          }
          return true;
        });

        if (replaced) {
          editor.view.dispatch(transaction);
        }

        setTimeout(() => editor.chain().focus().run(), 50);
        setIsUploading(false);
      };

      reader.readAsDataURL(file);
    };

    input.click();
  }, [editor]);

  const addLink = useCallback(() => {
    const previousUrl = editor?.getAttributes('link').href;
    const url = window.prompt('Enter URL', previousUrl);

    if (url === null) return;
    if (url === '') {
      editor?.chain().focus().extendMarkRange('link').unsetLink().run();
      return;
    }

    editor?.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
  }, [editor]);

  const handleUpload = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setMessage('Uploading...');
    setIsUploading(true);

    const form = new FormData(e.currentTarget);
    form.append('content', editor?.getHTML() || '');

    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: form,
      });
      const result = await response.json();

      if (result.success) {
        setMessage('✅ Upload successful! Redirecting...');
        setTimeout(() => router.push('/blogs'), 1500);
      } else {
        setMessage(`❌ Error: ${result.error || 'Upload failed'}`);
      }
    } catch (error) {
      setMessage(`❌ Error: ${error instanceof Error ? error.message : 'Network error'}`);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-md overflow-hidden">
        <div className="p-8">
          <h2 className="text-3xl font-bold text-center text-pink-600 mb-6">Create New Blog Post</h2>

          <form onSubmit={handleUpload} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
              <input
                type="text"
                name="title"
                placeholder="Your amazing title"
                required
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
              <select
                name="category"
                required
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
              >
                <option value="">Select a category</option>
                <option value="technology">Technology</option>
                <option value="programming">Programming</option>
                <option value="web-development">Web Development</option>
                <option value="mobile-development">Mobile Development</option>
                <option value="data-science">Data Science</option>
                <option value="artificial-intelligence">Artificial Intelligence</option>
                <option value="cybersecurity">Cybersecurity</option>
                <option value="cloud-computing">Cloud Computing</option>
                <option value="lifestyle">Lifestyle</option>
                <option value="travel">Travel</option>
                <option value="food">Food & Cooking</option>
                <option value="health">Health & Fitness</option>
                <option value="personal-development">Personal Development</option>
                <option value="finance">Finance & Investing</option>
                <option value="business">Business & Entrepreneurship</option>
                <option value="marketing">Marketing</option>
                <option value="design">Design</option>
                <option value="photography">Photography</option>
                <option value="gaming">Gaming</option>
                <option value="entertainment">Entertainment</option>
                <option value="education">Education</option>
                <option value="science">Science</option>
                <option value="politics">Politics</option>
                <option value="sports">Sports</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tags (comma separated)</label>
              <input
                type="text"
                name="tags"
                placeholder="e.g. react, nextjs, webdev"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Content</label>
              <div className="flex flex-wrap gap-1 mb-2 p-2 bg-gray-100 rounded-lg">
                <button type="button" onClick={() => editor?.chain().focus().toggleBold().run()} className={`p-2 rounded ${editor?.isActive('bold') ? 'bg-gray-300' : 'hover:bg-gray-200'}`} title="Bold"><FiBold /></button>
                <button type="button" onClick={() => editor?.chain().focus().toggleItalic().run()} className={`p-2 rounded ${editor?.isActive('italic') ? 'bg-gray-300' : 'hover:bg-gray-200'}`} title="Italic"><FiItalic /></button>
                <button type="button" onClick={() => editor?.chain().focus().toggleUnderline().run()} className={`p-2 rounded ${editor?.isActive('underline') ? 'bg-gray-300' : 'hover:bg-gray-200'}`} title="Underline"><FiUnderline /></button>
                <button type="button" onClick={addLink} className={`p-2 rounded ${editor?.isActive('link') ? 'bg-gray-300' : 'hover:bg-gray-200'}`} title="Link"><FiLink /></button>
                <button type="button" onClick={addImage} className="p-2 rounded hover:bg-gray-200" title="Image" disabled={isUploading}><FiImage /></button>
                <div className="border-l border-gray-400 h-6 my-1 mx-2"></div>
                <button type="button" onClick={() => editor?.chain().focus().setTextAlign('left').run()} className={`p-2 rounded ${editor?.isActive({ textAlign: 'left' }) ? 'bg-gray-300' : 'hover:bg-gray-200'}`} title="Align Left"><FiAlignLeft /></button>
                <button type="button" onClick={() => editor?.chain().focus().setTextAlign('center').run()} className={`p-2 rounded ${editor?.isActive({ textAlign: 'center' }) ? 'bg-gray-300' : 'hover:bg-gray-200'}`} title="Align Center"><FiAlignCenter /></button>
                <button type="button" onClick={() => editor?.chain().focus().setTextAlign('right').run()} className={`p-2 rounded ${editor?.isActive({ textAlign: 'right' }) ? 'bg-gray-300' : 'hover:bg-gray-200'}`} title="Align Right"><FiAlignRight /></button>
              </div>
              <EditorContent editor={editor} className="border border-gray-300 rounded-lg p-4 bg-white" />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Cover Image or Video</label>
              <input
                type="file"
                name="file"
                accept="image/*,video/*"
                required
                className="block w-full text-sm text-gray-700 bg-white border border-gray-300 rounded-lg cursor-pointer focus:outline-none"
              />
            </div>

            <button
              type="submit"
              disabled={isUploading}
              className="w-full bg-pink-600 hover:bg-pink-700 text-white py-3 rounded-lg font-semibold transition-colors"
            >
              {isUploading ? 'Uploading...' : 'Publish Blog'}
            </button>
            {message && <p className="text-center text-sm text-gray-600">{message}</p>}
          </form>
        </div>
      </div>
    </div>
  );
}