"use client";

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import PackageForm from '../../_components/package-form';
import { API_BASE_URL } from '@/constants';
import { Package } from '@/types';

export default function EditPackagePage() {
    const params = useParams();
    const [pkg, setPkg] = useState<Package | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (params.id) {
            setLoading(true);
            setError(null);
            fetch(`${API_BASE_URL}/api/packages/${params.id}`, { cache: 'no-store' })
                .then(res => {
                    if (!res.ok) throw new Error(`Failed to fetch package (${res.status})`);
                    return res.json();
                })
                .then(data => {
                    if (!data || Object.keys(data).length === 0) {
                        throw new Error('Package data is empty');
                    }
                    setPkg(data);
                    setLoading(false);
                })
                .catch(err => {
                    console.error("Error fetching package:", err);
                    setError(err.message);
                    setLoading(false);
                });
        }
    }, [params.id]);

    if (loading) return (
        <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#CD1C18]"></div>
            <p className="text-gray-500 font-medium">Loading package details...</p>
        </div>
    );

    if (error) return (
        <div className="max-w-md mx-auto mt-20 p-8 bg-red-50 rounded-2xl border border-red-100 text-center space-y-4">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto">
                <span className="text-2xl text-red-600">⚠️</span>
            </div>
            <h2 className="text-xl font-bold text-gray-900">Fetch Failed</h2>
            <p className="text-gray-600">{error}</p>
            <button 
                onClick={() => window.location.reload()}
                className="px-6 py-2 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors"
            >
                Retry
            </button>
        </div>
    );

    if (!pkg) return (
        <div className="max-w-md mx-auto mt-20 text-center space-y-4">
            <h2 className="text-xl font-bold">Package Not Found</h2>
            <p className="text-gray-500">The package you are looking for does not exist or has been removed.</p>
            <button onClick={() => window.history.back()} className="text-blue-600 hover:underline">Go Back</button>
        </div>
    );

    return (
        <div className="max-w-5xl mx-auto">
            <PackageForm initialData={pkg} isEditMode={true} />
        </div>
    );
}
