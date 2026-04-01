"use client";

import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Upload, Copy, Trash2, Check, Image as ImageIcon, FolderOpen } from 'lucide-react';
import { API_BASE_URL } from '@/constants';

interface ImageFile {
    _id: string;
    path: string;
    filename: string;
    title: string;
}

export default function MediaPage() {
    const [images, setImages] = useState<ImageFile[]>([]);
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);
    const [copiedId, setCopiedId] = useState<string | null>(null);

    useEffect(() => {
        fetchImages();
    }, []);

    const fetchImages = async () => {
        try {
            const res = await fetch(`${API_BASE_URL}/api/images`);
            const data = await res.json();
            setImages(data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploading(true);
        const formData = new FormData();
        formData.append('image', file);

        try {
            // Bypass Next.js proxy for large uploads by sending directly to backend
            const uploadUrl = typeof window !== 'undefined' && window.location.hostname === 'localhost'
                ? 'http://localhost:5000/api/upload'
                : `/api/upload`;

            const res = await fetch(uploadUrl, {
                method: 'POST',
                body: formData,
                credentials: 'include'
            });

            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.message || 'Upload failed');
            }

            const data = await res.json();
            if (!res.ok) throw new Error(data.message || 'Upload failed');

            if (data.image) {
                setImages(prev => [data.image, ...prev]);
            }
        } catch (error: any) {
            alert(`Upload failed: ${error.message}`);
        } finally {
            setUploading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Delete this image? This cannot be undone.')) return;
        try {
            const res = await fetch(`${API_BASE_URL}/api/images/${id}`, {
                method: 'DELETE',
                credentials: 'include'
            });
            if (res.ok) {
                setImages(prev => prev.filter(img => img._id !== id));
            }
        } catch (error) {
            alert('Delete failed');
        }
    };

    const copyToClipboard = (url: string, id: string) => {
        navigator.clipboard.writeText(url);
        setCopiedId(id);
        setTimeout(() => setCopiedId(null), 2000);
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-gray-900">Media Library</h1>
                    <p className="text-gray-500 mt-1">Upload and manage images for packages and destinations</p>
                </div>
                <div className="relative">
                    <Button
                        disabled={uploading}
                        className="bg-[#CD1C18] hover:bg-[#9B1313] text-white rounded-xl shadow-md shadow-[#CD1C18]/20"
                    >
                        <Upload className="h-4 w-4 mr-2" />
                        {uploading ? 'Uploading...' : 'Upload Image'}
                    </Button>
                    <input
                        type="file"
                        className="absolute inset-0 opacity-0 cursor-pointer"
                        onChange={handleUpload}
                        accept="image/*"
                        disabled={uploading}
                    />
                </div>
            </div>

            {/* Stats */}
            <div className="flex gap-4">
                <div className="bg-white rounded-xl px-5 py-3 shadow-sm flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-purple-50 flex items-center justify-center">
                        <ImageIcon className="w-5 h-5 text-purple-600" />
                    </div>
                    <div>
                        <p className="text-2xl font-bold text-gray-900">{images.length}</p>
                        <p className="text-xs text-gray-500">Total Images</p>
                    </div>
                </div>
            </div>

            {/* Grid */}
            {loading ? (
                <div className="flex items-center justify-center h-64">
                    <div className="animate-pulse text-gray-400">Loading images...</div>
                </div>
            ) : images.length === 0 ? (
                <div className="bg-white rounded-2xl shadow-sm p-16 text-center">
                    <FolderOpen className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500 mb-2">No images uploaded yet</p>
                    <p className="text-sm text-gray-400">Upload images to use them in packages and destinations</p>
                </div>
            ) : (
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                    {images.map((img) => (
                        <Card key={img._id} className="overflow-hidden group relative bg-white border-0 shadow-sm rounded-xl hover:shadow-md transition-shadow">
                            <div className="aspect-square relative bg-gray-100">
                                <img src={img.path} alt={img.title || 'Image'} className="w-full h-full object-cover" />
                                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-all duration-200 flex items-center justify-center gap-2">
                                    <Button
                                        size="icon"
                                        variant="secondary"
                                        className="rounded-lg bg-white/90 hover:bg-white"
                                        onClick={() => copyToClipboard(img.path, img._id)}
                                    >
                                        {copiedId === img._id ? (
                                            <Check className="h-4 w-4 text-green-600" />
                                        ) : (
                                            <Copy className="h-4 w-4 text-gray-700" />
                                        )}
                                    </Button>
                                    <Button
                                        size="icon"
                                        className="rounded-lg bg-red-500 hover:bg-red-600 text-white"
                                        onClick={() => handleDelete(img._id)}
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>
                            <div className="p-2 text-xs truncate text-gray-500 bg-white">
                                {img.filename || 'Untitled'}
                            </div>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
}
