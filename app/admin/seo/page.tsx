"use client";

import React, { useState, useEffect } from 'react';
import { Search, Edit, CheckCircle, AlertCircle, Globe, LayoutTemplate, MapPin } from 'lucide-react';
import Link from 'next/link';
import { API_BASE_URL } from '@/constants';
import { Button } from '@/components/Button';

export default function SEOManager() {
    const [items, setItems] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all'); // all, package, destination
    const [search, setSearch] = useState('');

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [packagesRes, destinationsRes] = await Promise.all([
                fetch(`${API_BASE_URL}/api/packages?all=true`),
                fetch(`${API_BASE_URL}/api/destinations`)
            ]);

            const packages = await packagesRes.json();
            const destinations = await destinationsRes.json();

            // Normalize data
            const normalizedPackages = packages.map((p: any) => ({
                id: p._id,
                title: p.title,
                slug: p.slug,
                type: 'package',
                image: p.image,
                seo: p.seo || {},
                status: p.status
            }));

            const normalizedDestinations = destinations.map((d: any) => ({
                id: d._id,
                title: d.name,
                slug: d.slug,
                type: 'destination',
                image: d.heroImage,
                seo: d.seo || {},
                status: 'published'
            }));

            setItems([...normalizedPackages, ...normalizedDestinations]);
            setLoading(false);
        } catch (error) {
            console.error('Failed to fetch data:', error);
            setLoading(false);
        }
    };

    const getSEOStatus = (item: any) => {
        const hasTitle = item.seo?.title && item.seo.title.length > 0;
        const hasDesc = item.seo?.description && item.seo.description.length > 0;

        if (hasTitle && hasDesc) return { label: 'Optimized', color: 'text-green-600', icon: CheckCircle };
        if (hasTitle || hasDesc) return { label: 'Partial', color: 'text-yellow-600', icon: AlertCircle };
        return { label: 'Missing', color: 'text-red-500', icon: AlertCircle };
    };

    const filteredItems = items.filter(item => {
        const matchesType = filter === 'all' || item.type === filter;
        const matchesSearch = item.title.toLowerCase().includes(search.toLowerCase());
        return matchesType && matchesSearch;
    });

    return (
        <>
            <div className="p-8">
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-3xl font-heading font-bold text-gray-900">SEO Manager</h1>
                        <p className="text-gray-500 mt-1">Manage search engine optimization for all your pages</p>
                    </div>
                    <div className="flex gap-4">
                        <div className="flex bg-white rounded-xl border border-gray-200 p-1">
                            <button
                                onClick={() => setFilter('all')}
                                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${filter === 'all' ? 'bg-gray-900 text-white' : 'text-gray-500 hover:text-gray-900'}`}
                            >
                                All
                            </button>
                            <button
                                onClick={() => setFilter('package')}
                                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${filter === 'package' ? 'bg-gray-900 text-white' : 'text-gray-500 hover:text-gray-900'}`}
                            >
                                Packages
                            </button>
                            <button
                                onClick={() => setFilter('destination')}
                                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${filter === 'destination' ? 'bg-gray-900 text-white' : 'text-gray-500 hover:text-gray-900'}`}
                            >
                                Destinations
                            </button>
                        </div>
                    </div>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
                                <Globe className="w-6 h-6" />
                            </div>
                            <div>
                                <p className="text-gray-500 text-sm font-medium">Total Pages</p>
                                <h3 className="text-2xl font-bold text-gray-900">{items.length}</h3>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-green-50 text-green-600 rounded-xl">
                                <CheckCircle className="w-6 h-6" />
                            </div>
                            <div>
                                <p className="text-gray-500 text-sm font-medium">Fully Optimized</p>
                                <h3 className="text-2xl font-bold text-gray-900">
                                    {items.filter(i => i.seo?.title && i.seo?.description).length}
                                </h3>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-red-50 text-red-600 rounded-xl">
                                <AlertCircle className="w-6 h-6" />
                            </div>
                            <div>
                                <p className="text-gray-500 text-sm font-medium">Needs Attention</p>
                                <h3 className="text-2xl font-bold text-gray-900">
                                    {items.filter(i => !i.seo?.title || !i.seo?.description).length}
                                </h3>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Search Bar */}
                <div className="relative mb-6">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                        type="text"
                        placeholder="Search pages..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900/10"
                    />
                </div>

                {/* Table */}
                <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
                    {loading ? (
                        <div className="p-12 text-center text-gray-500">Loading SEO data...</div>
                    ) : (
                        <table className="w-full text-left">
                            <thead className="bg-gray-50/50 border-b border-gray-100">
                                <tr>
                                    <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Page Name</th>
                                    <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Type</th>
                                    <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">SEO Title</th>
                                    <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Status</th>
                                    <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider text-right">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {filteredItems.map((item) => {
                                    const status = getSEOStatus(item);
                                    const StatusIcon = status.icon;

                                    return (
                                        <tr key={`${item.type}-${item.id}`} className="hover:bg-gray-50/50 transition-colors group">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-10 h-10 rounded-lg bg-gray-100 overflow-hidden flex-shrink-0">
                                                        <img src={item.image} alt="" className="w-full h-full object-cover" />
                                                    </div>
                                                    <div>
                                                        <p className="font-bold text-gray-900 text-sm line-clamp-1">{item.title}</p>
                                                        <p className="text-xs text-gray-400 font-mono mt-0.5">/{item.slug}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-bold uppercase tracking-wider ${item.type === 'package' ? 'bg-blue-50 text-blue-700' : 'bg-purple-50 text-purple-700'
                                                    }`}>
                                                    {item.type === 'package' ? <LayoutTemplate className="w-3 h-3" /> : <MapPin className="w-3 h-3" />}
                                                    {item.type}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <p className="text-sm text-gray-600 max-w-xs truncate">
                                                    {item.seo?.title || <span className="text-gray-400 italic">Default Title</span>}
                                                </p>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className={`flex items-center gap-2 text-xs font-bold ${status.color}`}>
                                                    <StatusIcon className="w-4 h-4" />
                                                    {status.label}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <Link href={`/admin/seo/edit/${item.type}/${item.id}`}>
                                                    <Button variant="outline" size="sm" className="bg-transparent hover:bg-white">
                                                        <Edit className="w-4 h-4" />
                                                        <span className="sr-only">Edit</span>
                                                    </Button>
                                                </Link>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>
        </>
    );
}
