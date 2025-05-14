'use client';

import React, { useState } from 'react';
import Image from 'next/image';

export default function UploadPage() {
  const [title, setTitle] = useState('');
  const [video, setVideo] = useState<File | null>(null);
  const [cover, setCover] = useState<File | null>(null);
  const [status, setStatus] = useState('');
  const [preview, setPreview] = useState({ cover: '', video: '' });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title || !video || !cover) {
      setStatus('All fields are required.');
      return;
    }

    const formData = new FormData();
    formData.append('title', title);
    formData.append('video', video);
    formData.append('cover', cover);

    setStatus('Uploading...');

    try {
      const res = await fetch('/api/uploady', {
        method: 'POST',
        body: formData,
      });

      const result = await res.json();

      if (res.ok) {
        setStatus('Upload successful!');
        setTitle('');
        setVideo(null);
        setCover(null);
        setPreview({ cover: '', video: '' });
      } else {
        setStatus(`Error: ${result.error}`);
      }
    } catch (err) {
      console.error(err);
      setStatus('Upload failed.');
    }
  };

  return (
    <div className="p-6 max-w-md mx-auto">
      <h1 className="text-2xl font-semibold mb-4">Upload Love Song</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="Song Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="border p-2 w-full"
          required
        />
        <input
          type="file"
          accept="video/*"
          onChange={(e) => {
            const file = e.target.files?.[0] || null;
            setVideo(file);
            if (file) {
              setPreview((p) => ({ ...p, video: URL.createObjectURL(file) }));
            }
          }}
          className="border p-2 w-full"
          required
        />
        <input
          type="file"
          accept="image/*"
          onChange={(e) => {
            const file = e.target.files?.[0] || null;
            setCover(file);
            if (file) {
              setPreview((p) => ({ ...p, cover: URL.createObjectURL(file) }));
            }
          }}
          className="border p-2 w-full"
          required
        />
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
          Upload
        </button>
      </form>

      {preview.cover && (
        <div className="mt-4">
          <h2 className="font-semibold">Cover Preview:</h2>
          <div className="mt-2 relative w-full h-48">
            <Image
              src={preview.cover}
              alt="Cover preview"
              fill
              style={{ objectFit: 'cover' }}
              className="rounded"
            />
          </div>
        </div>
      )}

      {preview.video && (
        <div className="mt-4">
          <h2 className="font-semibold">Video Preview:</h2>
          <video controls className="mt-2 w-full h-48">
            <source src={preview.video} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </div>
      )}

      {status && <p className="mt-4 text-sm">{status}</p>}
    </div>
  );
}