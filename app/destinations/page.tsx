"use client";

import React, { useState, useEffect } from 'react';
import { API_BASE_URL } from '@/constants';
import Link from 'next/link';
import { MapPin, ArrowRight } from 'lucide-react';

interface Destination {
    _id: string;
    name: string;
    slug: string;
    heroImage: string;
    packageCount: number;
}

export default function DestinationsPage() {
    const [destinations, setDestinations] = useState<Destination[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDestinations = async () => {
            try {
                const res = await fetch(`${API_BASE_URL}/api/destinations`, { cache: 'no-store' });
                const data = await res.json();
                setDestinations(data);
            } catch (error) {
                console.error('Failed to fetch destinations', error);
            } finally {
                setLoading(false);
            }
        };
        fetchDestinations();
    }, []);

    return (
        <div className="min-h-screen bg-white">
            <div className="bg-gray-900 py-16 md:py-24 px-4 text-center">
                <h1 className="text-3xl md:text-5xl font-bold text-white mb-4 tracking-tight">Explore destinations</h1>
                <p className="text-gray-400 max-w-xl mx-auto text-sm md:text-base font-medium">
                    Discover the world's most beautiful places. Where will you go next?
                </p>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {[1, 2, 3, 4, 5, 6].map((i) => (
                            <div key={i} className="aspect-[4/3] bg-gray-100 rounded-xl animate-pulse"></div>
                        ))}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {destinations.map((dest) => (
                            <Link
                                key={dest._id}
                                href={`/destination/${dest.slug}`}
                                className="group relative block aspect-[4/3] rounded-xl overflow-hidden cursor-pointer"
                            >
                                <img
                                    src={dest.heroImage || '/images/placeholder.svg'}
                                    alt={dest.name}
                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />

                                <div className="absolute bottom-0 left-0 p-8 w-full">
                                    <h3 className="text-xl md:text-2xl font-bold text-white mb-1 group-hover:-translate-y-1 transition-transform duration-300 tracking-tight">
                                        {dest.name}
                                    </h3>
                                    <div className="flex items-center justify-between opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300 delay-75">
                                        <span className="text-gray-300 text-sm font-medium">{dest.packageCount || 'Explore'} Packages</span>
                                        <div className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-white">
                                            <ArrowRight className="w-4 h-4" />
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
