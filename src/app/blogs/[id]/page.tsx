'use client';

import { notFound, useParams } from 'next/navigation';
import { useEffect, useState, useCallback } from 'react';
import React from 'react';

interface Content {
  id: number;
  title: string;
  description: string;
  video_url?: string;
  created_at: string;
  tags: string[];
}

interface Comment {
  id: number;
  content: string;
  author: string | null;
  created_at: string;
}

export default function BlogPage() {
  const { id } = useParams();
  const [content, setContent] = useState<Content | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [commentText, setCommentText] = useState('');
  const [loading, setLoading] = useState(false);

  const fetchContent = useCallback(async () => {
    const res = await fetch(`/api/contents?id=${id}`);
    if (res.ok) {
      const data = await res.json();
      setContent(data);
    } else {
      notFound();
    }
  }, [id]);

  const fetchComments = useCallback(async () => {
    const res = await fetch(`/api/comments?contentId=${id}`);
    const data = await res.json();
    setComments(data);
  }, [id]);

  const handlePostComment = async () => {
    if (!commentText.trim()) return;
    setLoading(true);

    const deleteToken = crypto.randomUUID();

    const res = await fetch('/api/comments', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contentId: id,
        content: commentText,
        author: null,
        deleteToken,
      }),
    });

    const data = await res.json();

    const localTokens = JSON.parse(localStorage.getItem('myCommentTokens') || '{}');
    localTokens[data.id] = deleteToken;
    localStorage.setItem('myCommentTokens', JSON.stringify(localTokens));

    setCommentText('');
    fetchComments();
    setLoading(false);
  };

  const handleDeleteComment = async (commentId: number) => {
    const localTokens = JSON.parse(localStorage.getItem('myCommentTokens') || '{}');
    const deleteToken = localTokens[commentId];

    if (!deleteToken) {
      alert("You're not allowed to delete this comment.");
      return;
    }

    await fetch(`/api/comments?commentId=${commentId}&deleteToken=${deleteToken}`, {
      method: 'DELETE',
    });

    fetchComments();
  };

  useEffect(() => {
    fetchContent();
    fetchComments();
  }, [id, fetchContent, fetchComments]);

  if (!content) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="animate-pulse text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600 text-2xl font-bold">
          Loading...
        </div>
      </div>
    );
  }

  const myCommentTokens =
    typeof window !== 'undefined'
      ? JSON.parse(localStorage.getItem('myCommentTokens') || '{}')
      : {};

  const formatDescription = (html: string) => {
    if (!html) return '';

    // Modern magazine text formatting
    const formatted = html
      // Headings
      .replace(/<h1/g, '<h1 class="text-4xl font-bold mb-6 leading-tight break-words"')
      .replace(/<h2/g, '<h2 class="text-3xl font-bold mb-5 mt-12 break-words"')
      .replace(/<h3/g, '<h3 class="text-2xl font-bold mb-4 mt-10 break-words"')
      // Paragraphs
      .replace(/<p/g, '<p class="mb-6 text-lg leading-relaxed break-words"')
      // Images
      .replace(
        /<img/g,
        '<img class="rounded-lg max-w-full h-auto my-8 mx-auto block"'
      )
      // Blockquotes
      .replace(
        /<blockquote/g,
        '<blockquote class="border-l-4 border-gray-300 dark:border-gray-600 pl-6 my-8 italic text-gray-700 dark:text-gray-300 break-words"'
      )
      // Lists
      .replace(/<ul/g, '<ul class="list-disc pl-6 mb-6 space-y-2 break-words"')
      .replace(/<ol/g, '<ol class="list-decimal pl-6 mb-6 space-y-2 break-words"')
      // Code blocks
      .replace(/<pre/g, '<pre class="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg overflow-x-auto my-6 break-words"')
      .replace(/<code/g, '<code class="text-sm break-words"');

    return formatted;
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      {/* Modern Magazine Layout */}
      <div className="max-w-3xl mx-auto px-4 py-16">
        {/* Article Header */}
        <header className="mb-12">
          {content.tags?.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {content.tags.map((tag) => (
                <span
                  key={tag}
                  className="text-xs px-3 py-1 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 uppercase tracking-wider"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}

          <h1 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900 dark:text-white leading-tight break-words">
            {content.title}
          </h1>

          <div className="text-sm text-gray-500 dark:text-gray-400 mb-8">
            {new Date(content.created_at).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </div>

          {/* Featured Media */}
          {content.video_url && (
            <div className="mb-12 rounded-lg overflow-hidden">
              <div className="relative pt-[56.25%] bg-black">
                <video
                  controls
                  className="absolute inset-0 w-full h-full object-cover"
                >
                  <source src={content.video_url} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              </div>
            </div>
          )}
        </header>

        {/* Article Content */}
        <article className="mb-20">
          <div 
            className="prose prose-lg dark:prose-invert max-w-none break-words"
            dangerouslySetInnerHTML={{
              __html: formatDescription(content.description),
            }}
          />
        </article>

        {/* Comments Section */}
        <section className="border-t border-gray-200 dark:border-gray-700 pt-12">
          <h2 className="text-2xl font-bold mb-8 text-gray-900 dark:text-white">
            Comments ({comments.length})
          </h2>

          {/* Comment Form */}
          <div className="mb-12">
            <textarea
              className="w-full p-4 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent dark:bg-gray-800 dark:text-white transition-all duration-200 resize-none break-words"
              rows={4}
              placeholder="Share your thoughts..."
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
            />
            <div className="flex justify-end mt-4">
              <button
                onClick={handlePostComment}
                className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-all duration-200 font-medium"
                disabled={loading}
              >
                {loading ? 'Posting...' : 'Post Comment'}
              </button>
            </div>
          </div>

          {/* Comments List */}
          <div className="space-y-6">
            {comments.length > 0 ? (
              comments.map((comment) => (
                <div
                  key={comment.id}
                  className="p-6 bg-gray-50 dark:bg-gray-800 rounded-lg break-words"
                >
                  <div className="flex justify-between items-start mb-2">
                    <span className="font-medium text-gray-900 dark:text-white">
                      {comment.author || 'Anonymous'}
                    </span>
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {new Date(comment.created_at).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric'
                      })}
                    </span>
                  </div>
                  <p className="text-gray-700 dark:text-gray-300 mb-3">
                    {comment.content}
                  </p>
                  {myCommentTokens[comment.id] && (
                    <button
                      onClick={() => handleDeleteComment(comment.id)}
                      className="text-sm text-pink-600 dark:text-pink-400 hover:text-pink-800 dark:hover:text-pink-300 transition-colors"
                    >
                      Delete
                    </button>
                  )}
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                No comments yet. Be the first to share your thoughts.
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}