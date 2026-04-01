"use client";

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import DestinationForm from '../../_components/destination-form';
import { API_BASE_URL } from '@/constants';

import { Button } from '@/components/ui/button';

export default function EditDestinationPage() {
    const params = useParams();
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        if (params.id) {
            fetch(`${API_BASE_URL}/api/destinations/${params.id}`)
                .then(res => {
                    if (!res.ok) throw new Error('Failed to fetch destination');
                    return res.json();
                })
                .then(data => {
                    setData(data);
                    setLoading(false);
                })
                .catch((err) => {
                    console.error(err);
                    setError(err.message);
                    setLoading(false);
                });
        }
    }, [params.id]);

    if (loading) return <div className="flex justify-center py-10">Loading...</div>;

    if (error) return (
        <div className="text-center py-10 text-red-500">
            <p>Error: {error}</p>
            <Button onClick={() => window.location.reload()} variant="outline" className="mt-4">
                Retry
            </Button>
        </div>
    );

    return (
        <div className="max-w-4xl mx-auto">
            {data ? <DestinationForm initialData={data} isEditMode={true} /> : <div>No data found</div>}
        </div>
    );
}
