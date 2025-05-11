'use client';

import { useState } from 'react';

export default function UploadPage() {
  const [imagePreview, setImagePreview] = useState('');
  const [form, setForm] = useState({
    title: '',
    description: '',
    category: '',
    tags: '',
    type: 'wallpaper', // ✅ default type set to wallpaper
  });
  const [loading, setLoading] = useState(false);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData();
    formData.append('title', form.title);
    formData.append('description', form.description);
    formData.append('category', form.category);
    formData.append('tags', form.tags);
    formData.append('type', form.type); // ✅ include type in FormData

    const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
    if (fileInput.files?.[0]) {
      formData.append('image', fileInput.files[0]);
    } else {
      alert('Please select an image.');
      setLoading(false);
      return;
    }

    const res = await fetch('/api/wallpaperupload', {
      method: 'POST',
      body: formData,
    });

    const data = await res.json();
    setLoading(false);

    if (data.success) {
      alert('Upload successful!');
      setForm({ title: '', description: '', category: '', tags: '', type: 'wallpaper' });
      setImagePreview('');
    } else {
      alert(`Error: ${data.message}`);
    }
  };

  return (
    <div className="p-8 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Upload Wallpaper</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          type="text"
          placeholder="Title"
          required
          value={form.title}
          onChange={e => setForm({ ...form, title: e.target.value })}
          className="border p-2 rounded"
        />
        <input
          type="text"
          placeholder="Description"
          value={form.description}
          onChange={e => setForm({ ...form, description: e.target.value })}
          className="border p-2 rounded"
        />
        <input
          type="text"
          placeholder="Category"
          value={form.category}
          onChange={e => setForm({ ...form, category: e.target.value })}
          className="border p-2 rounded"
        />
        <input
          type="text"
          placeholder='Tags (e.g. "nature,dark")'
          value={form.tags}
          onChange={e => setForm({ ...form, tags: e.target.value })}
          className="border p-2 rounded"
        />

        {/* Hidden input or select for type (optional to expose) */}
        <input type="hidden" name="type" value={form.type} />

        <input type="file" accept="image/*" required onChange={handleImageChange} />
        {imagePreview && (
          <img src={imagePreview} alt="Preview" className="max-w-full mt-2 rounded border" />
        )}
        <button type="submit" className="bg-blue-600 text-white py-2 px-4 rounded" disabled={loading}>
          {loading ? 'Uploading...' : 'Upload'}
        </button>
      </form>
    </div>
  );
}
