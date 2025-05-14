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
  deleteToken: string;
  replies?: Comment[];
}

interface Confession {
  id: number;
  title: string;
  description: string;
  created_at: string;
}

export default function ReadConfessionPage() {
  const { id } = useParams();
  const [comments, setComments] = useState<Comment[]>([]);
  const [confession, setConfession] = useState<Confession | null>(null);
  const [commentText, setCommentText] = useState('');
  const [author, setAuthor] = useState('');
  const [replyingTo, setReplyingTo] = useState<number | null>(null);
  const [expandedComments, setExpandedComments] = useState<Record<number, boolean>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load author from localStorage if exists
  useEffect(() => {
    const savedAuthor = localStorage.getItem('commentAuthor');
    if (savedAuthor) {
      setAuthor(savedAuthor);
    }
  }, []);

  // Save author to localStorage when it changes
  useEffect(() => {
    if (author) {
      localStorage.setItem('commentAuthor', author);
    }
  }, [author]);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [confessionRes, commentsRes] = await Promise.all([
          fetch(`/api/confessions/${id}`),
          fetch(`/api/commenta?confessionId=${id}`)
        ]);

        if (!confessionRes.ok) throw new Error('Failed to load confession');
        if (!commentsRes.ok) throw new Error('Failed to load comments');

        const confessionData = await confessionRes.json();
        const commentsData = await commentsRes.json();

        if (confessionData.success) setConfession(confessionData.data);
        if (commentsData.success) {
          setComments(commentsData.data);
          const expanded = commentsData.data.reduce((acc: Record<number, boolean>, comment: Comment) => {
            acc[comment.id] = true;
            return acc;
          }, {});
          setExpandedComments(expanded);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    try {
      const res = await fetch('/api/commenta', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content: commentText,
          author: author || 'Anonymous',
          parentId: replyingTo,
          confessionId: id
        })
      });

      if (!res.ok) throw new Error('Failed to post comment');

      const { data: newComment } = await res.json();
      
      setComments(prev => {
        if (replyingTo) {
          // Add reply to parent comment
          return prev.map(comment => {
            if (comment.id === replyingTo) {
              return {
                ...comment,
                replies: [...(comment.replies || []), newComment]
              };
            }
            return comment;
          });
        }
        // Add new top-level comment
        return [newComment, ...prev];
      });

      setCommentText('');
      setReplyingTo(null);
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to post comment');
    }
  };

  const handleDelete = async (commentId: number) => {
    if (!confirm('Are you sure you want to delete this comment?')) return;
    
    try {
      const comment = findComment(comments, commentId);
      if (!comment) return;

      const res = await fetch(`/api/commenta?id=${commentId}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          author: author,
          deleteToken: comment.deleteToken
        })
      });

      if (!res.ok) throw new Error('Failed to delete comment');

      setComments(prev => removeComment(prev, commentId));
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to delete comment');
    }
  };

  // Helper functions
  const findComment = (comments: Comment[], id: number): Comment | null => {
    for (const comment of comments) {
      if (comment.id === id) return comment;
      if (comment.replies) {
        const found = findComment(comment.replies, id);
        if (found) return found;
      }
    }
    return null;
  };

  const removeComment = (comments: Comment[], id: number): Comment[] => {
    return comments
      .filter(comment => comment.id !== id)
      .map(comment => ({
        ...comment,
        replies: comment.replies ? removeComment(comment.replies, id) : []
      }));
  };

  const isCommentOwner = (comment: Comment) => {
    // Check if the current author matches the comment author
    // Also check localStorage in case the page was refreshed
    const savedAuthor = localStorage.getItem('commentAuthor');
    return comment.author === author || (savedAuthor && comment.author === savedAuthor);
  };

  const renderComment = (comment: Comment, depth = 0) => (
    <motion.div
      key={comment.id}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className={`mb-4 ${depth > 0 ? 'ml-8' : ''}`}
    >
      <div className={`p-4 rounded-lg shadow ${depth % 2 === 0 ? 'bg-gradient-to-br from-purple-50 to-blue-50' : 'bg-gradient-to-br from-pink-50 to-purple-50'}`}>
        <div className="flex items-start gap-3">
          <div className={`rounded-full w-8 h-8 flex items-center justify-center ${depth % 2 === 0 ? 'bg-blue-100 text-blue-800' : 'bg-purple-100 text-purple-800'}`}>
            {comment.author?.charAt(0).toUpperCase() || 'A'}
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <h4 className="font-medium text-gray-800">{comment.author || 'Anonymous'}</h4>
              <span className="text-xs text-gray-500">
                {new Date(comment.created_at).toLocaleString()}
              </span>
            </div>
            <p className="my-2 text-gray-700">{comment.content}</p>
            <div className="flex gap-4 text-sm">
              <button 
                onClick={() => setReplyingTo(comment.id)}
                className="text-blue-600 hover:text-blue-800 transition-colors"
              >
                Reply
              </button>
              {comment.replies?.length ? (
                <button 
                  onClick={() => setExpandedComments(prev => ({
                    ...prev,
                    [comment.id]: !prev[comment.id]
                  }))}
                  className="text-gray-600 hover:text-gray-800 transition-colors"
                >
                  {expandedComments[comment.id] ? (
                    <span className="flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                      </svg>
                      Hide replies
                    </span>
                  ) : (
                    <span className="flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                      Show replies ({comment.replies.length})
                    </span>
                  )}
                </button>
              ) : null}
              {isCommentOwner(comment) && (
                <button 
                  onClick={() => handleDelete(comment.id)}
                  className="text-red-600 hover:text-red-800 transition-colors"
                >
                  Delete
                </button>
              )}
            </div>
          </div>
        </div>

        <AnimatePresence>
          {replyingTo === comment.id && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="mt-4 overflow-hidden"
            >
              <form onSubmit={handleSubmit} className="space-y-3">
                <input
                  type="text"
                  placeholder="Your name (optional)"
                  value={author}
                  onChange={(e) => setAuthor(e.target.value)}
                  className="w-full p-2 border rounded focus:ring-2 focus:ring-purple-300 focus:border-transparent"
                />
                <textarea
                  placeholder="Write your reply..."
                  rows={3}
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  className="w-full p-2 border rounded focus:ring-2 focus:ring-purple-300 focus:border-transparent"
                  required
                />
                <div className="flex gap-2">
                  <button type="submit" className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 transition-colors flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                    </svg>
                    Post Reply
                  </button>
                  <button 
                    type="button"
                    onClick={() => setReplyingTo(null)}
                    className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {comment.replies?.length && expandedComments[comment.id] && (
        <div className="mt-3 relative">
          <div className="absolute left-5 top-0 bottom-0 w-0.5 bg-gradient-to-b from-purple-200 to-pink-200"></div>
          {comment.replies.map(reply => renderComment(reply, depth + 1))}
        </div>
      )}
    </motion.div>
  );

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-blue-50">
      <div className="text-center">
        <svg className="animate-spin h-10 w-10 text-purple-600 mx-auto mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        <p className="text-lg text-purple-800">Loading confession...</p>
      </div>
    </div>
  );

  if (error) return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-50 to-red-50">
      <div className="text-center p-6 bg-white rounded-lg shadow-md max-w-md">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-red-500 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <h2 className="text-xl font-bold text-gray-800 mb-2">Error Loading Content</h2>
        <p className="text-gray-600 mb-4">{error}</p>
        <button 
          onClick={() => window.location.reload()} 
          className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
        >
          Try Again
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 py-8">
      <div className="max-w-3xl mx-auto px-4">
        {/* Decorative elements */}
        <div className="absolute top-10 left-10 opacity-20">
          <svg width="100" height="100" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M50 0C40 20 0 30 0 50C0 70 40 80 50 100C60 80 100 70 100 50C100 30 60 20 50 0Z" fill="#8B5CF6"/>
          </svg>
        </div>
        <div className="absolute bottom-10 right-10 opacity-20">
          <svg width="120" height="120" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M60 0C40 30 0 40 0 60C0 80 30 90 60 120C90 90 120 80 120 60C120 40 80 30 60 0Z" fill="#EC4899"/>
          </svg>
        </div>

        <motion.div 
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="mb-8 bg-white p-6 rounded-xl shadow-lg border border-purple-100"
        >
          <h1 className="text-3xl font-bold mb-4 text-purple-800">{confession?.title}</h1>
          <p className="whitespace-pre-wrap text-gray-700 leading-relaxed">{confession?.description}</p>
          <div className="mt-4 flex justify-end">
            <span className="text-sm text-gray-500">
              {confession ? new Date(confession.created_at).toLocaleString() : ''}
            </span>
          </div>
        </motion.div>

        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="mb-8 bg-white p-6 rounded-xl shadow-lg border border-blue-100"
        >
          <h2 className="text-xl font-bold mb-4 text-blue-700 flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
            </svg>
            Leave a Comment
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="author" className="block text-sm font-medium text-gray-700 mb-1">Your name (optional)</label>
              <input
                type="text"
                id="author"
                placeholder="Anonymous"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-300 focus:border-transparent"
              />
            </div>
            <div>
              <label htmlFor="comment" className="block text-sm font-medium text-gray-700 mb-1">Your thoughts</label>
              <textarea
                id="comment"
                placeholder="Share your thoughts..."
                rows={4}
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-300 focus:border-transparent"
                required
              />
            </div>
            <button 
              type="submit" 
              className="px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-colors flex items-center justify-center"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
              </svg>
              Post Comment
            </button>
          </form>
        </motion.div>

        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-white p-6 rounded-xl shadow-lg border border-pink-100"
        >
          <h2 className="text-xl font-bold mb-4 text-pink-700 flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
            </svg>
            Comments
          </h2>
          {comments.length ? (
            <div className="space-y-4">
              {comments.map(comment => renderComment(comment))}
            </div>
          ) : (
            <div className="text-center py-8">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
              <p className="text-gray-500">No comments yet. Be the first to share your thoughts!</p>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}