'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';

interface Comment {
  id: number;
  content: string;
  author: string | null;
  created_at: string;
  parentId: number | null;
  replies?: Comment[];
}

export default function ReadConfessionPage() {
  const { id } = useParams();
  const [comments, setComments] = useState<Comment[]>([]);
  const [confession, setConfession] = useState<any>(null);
  const [commentText, setCommentText] = useState('');
  const [author, setAuthor] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('commentAuthor') || '';
    }
    return '';
  });
  const [submitting, setSubmitting] = useState(false);
  const [replyingTo, setReplyingTo] = useState<number | null>(null);
  const [expandedComments, setExpandedComments] = useState<Record<number, boolean>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const handleAuthorChange = (name: string) => {
    setAuthor(name);
    if (typeof window !== 'undefined') {
      localStorage.setItem('commentAuthor', name);
    }
  };

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const [confessionRes, commentsRes] = await Promise.all([
          fetch(`/api/confessions/${id}`),
          fetch(`/api/confessions/${id}/comments`)
        ]);

        if (!confessionRes.ok) throw new Error('Failed to fetch confession');
        if (!commentsRes.ok) throw new Error('Failed to fetch comments');

        const [conf, allComments] = await Promise.all([
          confessionRes.json(),
          commentsRes.json()
        ]);

        setConfession(conf);
        setComments(nestComments(allComments));
        
        const expanded: Record<number, boolean> = {};
        allComments.forEach((c: Comment) => {
          expanded[c.id] = true;
        });
        setExpandedComments(expanded);
      } catch (err) {
        console.error('Error loading data:', err);
        setError(err instanceof Error ? err.message : 'Failed to load data');
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [id]);

  const nestComments = (comments: Comment[]): Comment[] => {
    const map = new Map<number, Comment & { replies: Comment[] }>();
    const roots: Comment[] = [];

    for (const c of comments) {
      map.set(c.id, { ...c, replies: [] });
    }

    for (const c of map.values()) {
      if (c.parentId) {
        const parent = map.get(c.parentId);
        if (parent) parent.replies.push(c);
      } else {
        roots.push(c);
      }
    }

    return roots;
  };

  const flatten = (comments: Comment[]): Comment[] =>
    comments.flatMap((c) => [c, ...(c.replies ? flatten(c.replies) : [])]);

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    setSubmitting(true);

    try {
      const res = await fetch(`/api/confessions/${id}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content: commentText,
          author: author || 'Anonymous',
          parentId: replyingTo,
        }),
      });

      if (!res.ok) throw new Error('Failed to post comment');

      const newComment = await res.json();
      const updated = [newComment, ...flatten(comments)];
      setComments(nestComments(updated));

      if (replyingTo) {
        setExpandedComments(prev => ({ ...prev, [replyingTo]: true }));
      }

      setCommentText('');
      setReplyingTo(null);
    } catch (err) {
      console.error('Error posting comment:', err);
      alert('Failed to post comment. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (commentId: number) => {
    const confirmed = confirm('Are you sure you want to delete this comment?');
    if (!confirmed) return;

    try {
      const res = await fetch(`/api/confessions/${id}/comments/${commentId}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ author: author || 'Anonymous' }), // Send author info for verification
      });

      if (!res.ok) throw new Error('Failed to delete comment');

      const updated = flatten(comments).filter((c) => c.id !== commentId);
      setComments(nestComments(updated));
    } catch (err) {
      console.error('Error deleting comment:', err);
      alert('Failed to delete comment. Please try again.');
    }
  };

  const toggleCommentExpansion = (commentId: number) => {
    setExpandedComments(prev => ({
      ...prev,
      [commentId]: !prev[commentId]
    }));
  };

  const renderComments = (comments: Comment[], level = 0) =>
    comments.map((c) => (
      <motion.div
        key={c.id}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
        className={`relative mb-4 ${level > 0 ? 'pl-6' : ''}`}
      >
        <div className={`bg-white rounded-xl shadow-sm p-4 ${level > 0 ? 'border-l-2 border-blue-100' : ''}`}>
          <div className="flex items-start gap-3">
            <div className="bg-blue-100 text-blue-800 rounded-full w-8 h-8 flex items-center justify-center font-medium text-sm">
              {c.author ? c.author.charAt(0).toUpperCase() : 'A'}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <h4 className="font-medium text-gray-900">
                  {c.author || 'Anonymous'}
                </h4>
                <span className="text-xs text-gray-500">
                  {new Date(c.created_at).toLocaleString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </span>
              </div>
              <p className="text-gray-700 mb-3 whitespace-pre-wrap">{c.content}</p>
              
              <div className="flex gap-4 text-sm">
                <button 
                  onClick={() => setReplyingTo(replyingTo === c.id ? null : c.id)}
                  className="text-blue-600 hover:text-blue-800 font-medium flex items-center gap-1"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                  Reply
                </button>
                {c.replies && c.replies.length > 0 && (
                  <button 
                    onClick={() => toggleCommentExpansion(c.id)}
                    className="text-gray-600 hover:text-gray-800 font-medium flex items-center gap-1"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                    {expandedComments[c.id] ? 'Hide replies' : `Show replies (${c.replies.length})`}
                  </button>
                )}
                {c.author && (c.author === author || (author === '' && c.author === 'Anonymous')) && (
                  <button 
                    onClick={() => handleDelete(c.id)}
                    className="text-red-600 hover:text-red-800 font-medium"
                  >
                    Delete
                  </button>
                )}
              </div>
            </div>
          </div>

          <AnimatePresence>
            {replyingTo === c.id && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.2 }}
                className="mt-4"
              >
                <form onSubmit={handleCommentSubmit} className="space-y-3">
                  <input
                    type="text"
                    placeholder="Your name (optional)"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    value={author}
                    onChange={(e) => handleAuthorChange(e.target.value)}
                  />
                  <textarea
                    placeholder={`Reply to ${c.author || 'Anonymous'}...`}
                    rows={3}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    required
                  />
                  <div className="flex gap-2">
                    <button
                      type="submit"
                      disabled={submitting}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
                    >
                      {submitting ? 'Posting...' : 'Post Reply'}
                    </button>
                    <button
                      type="button"
                      onClick={() => setReplyingTo(null)}
                      className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {c.replies && expandedComments[c.id] && (
          <div className="mt-3">
            {renderComments(c.replies, level + 1)}
          </div>
        )}
      </motion.div>
    ));

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="bg-red-50 border-l-4 border-red-400 p-4">
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
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="bg-white rounded-xl shadow-sm p-6 mb-8"
      >
        <h1 className="text-3xl font-bold text-gray-900 mb-3">{confession?.title}</h1>
        <div className="prose prose-blue max-w-none text-gray-700">
          <p className="whitespace-pre-wrap">{confession?.description}</p>
        </div>
      </motion.div>

      <div className="space-y-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          className="bg-white rounded-xl shadow-sm p-6"
        >
          <h2 className="text-xl font-bold text-gray-900 mb-4">Leave a Comment</h2>
          <form onSubmit={handleCommentSubmit} className="space-y-4">
            <input
              type="text"
              placeholder="Your name (optional)"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={author}
              onChange={(e) => handleAuthorChange(e.target.value)}
            />
            <textarea
              placeholder="Share your thoughts..."
              rows={4}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              required
            />
            <button
              type="submit"
              disabled={submitting}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
            >
              {submitting ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Posting...
                </span>
              ) : 'Post Comment'}
            </button>
          </form>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
          className="bg-white rounded-xl shadow-sm p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">Comments</h2>
            <span className="text-sm text-gray-500">{flatten(comments).length} comments</span>
          </div>

          {comments.length === 0 ? (
            <div className="text-center py-8">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
              <p className="mt-2 text-gray-500">No comments yet. Be the first to share your thoughts!</p>
            </div>
          ) : (
            <div className="space-y-6">
              {renderComments(comments)}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}