"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Plus, Edit, Trash2, MapPin, Globe, Star, Eye } from 'lucide-react';
import { API_BASE_URL } from '@/constants';

interface Destination {
    _id: string;
    name: string;
    slug: string;
    heroImage: string;
    isFeatured: boolean;
    isVisaFree: boolean;
    startingPrice?: number;
    packageCount?: number;
}

export default function DestinationsPage() {
    const [destinations, setDestinations] = useState<Destination[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchDestinations();
    }, []);

    const fetchDestinations = async () => {
        try {
            const res = await fetch(`${API_BASE_URL}/api/destinations`);
            const data = await res.json();
            setDestinations(data);
        } catch (error) {
            console.error("Failed to fetch destinations", error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this destination?')) return;

        try {
            const res = await fetch(`${API_BASE_URL}/api/destinations/${id}`, {
                method: 'DELETE'
            });
            if (res.ok) {
                setDestinations(prev => prev.filter(d => d._id !== id));
            } else {
                alert('Failed to delete destination');
            }
        } catch (error) {
            alert('Error deleting destination');
        }
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-gray-900">Destinations</h1>
                    <p className="text-gray-500 mt-1">Manage travel destinations and regions</p>
                </div>
                <Link href="/admin/destinations/create">
                    <Button className="bg-[#CD1C18] hover:bg-[#9B1313] text-white rounded-xl shadow-md shadow-[#CD1C18]/20">
                        <Plus className="h-4 w-4 mr-2" />
                        Add Destination
                    </Button>
                </Link>
            </div>

            {/* Stats Summary */}
            <div className="flex gap-4">
                <div className="bg-white rounded-xl px-5 py-3 shadow-sm flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center">
                        <Globe className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                        <p className="text-2xl font-bold text-gray-900">{destinations.length}</p>
                        <p className="text-xs text-gray-500">Total</p>
                    </div>
                </div>
                <div className="bg-white rounded-xl px-5 py-3 shadow-sm flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-amber-50 flex items-center justify-center">
                        <Star className="w-5 h-5 text-amber-600" />
                    </div>
                    <div>
                        <p className="text-2xl font-bold text-gray-900">{destinations.filter(d => d.isFeatured).length}</p>
                        <p className="text-xs text-gray-500">Featured</p>
                    </div>
                </div>
            </div>

            {/* Table */}
            <div className="bg-white rounded-2xl shadow-sm border-0 overflow-hidden">
                <Table>
                    <TableHeader>
                        <TableRow className="bg-gray-50/50">
                            <TableHead className="w-[100px]">Image</TableHead>
                            <TableHead>Name</TableHead>
                            <TableHead>Slug</TableHead>
                            <TableHead>Tags</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {loading ? (
                            <TableRow key="loading">
                                <TableCell colSpan={5} className="text-center py-16">
                                    <div className="animate-pulse text-gray-400">Loading destinations...</div>
                                </TableCell>
                            </TableRow>
                        ) : destinations.length === 0 ? (
                            <TableRow key="empty">
                                <TableCell colSpan={5} className="text-center py-16">
                                    <div className="flex flex-col items-center gap-2">
                                        <MapPin className="w-8 h-8 text-gray-300" />
                                        <p className="text-gray-500">No destinations found</p>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ) : (
                            destinations.map((dest) => (
                                <TableRow key={dest._id} className="hover:bg-gray-50/50">
                                    <TableCell>
                                        <div className="h-14 w-20 rounded-lg bg-gray-100 overflow-hidden">
                                            {dest.heroImage ? (
                                                <img src={dest.heroImage} alt="" className="h-full w-full object-cover" />
                                            ) : (
                                                <div className="h-full w-full flex items-center justify-center">
                                                    <MapPin className="w-5 h-5 text-gray-300" />
                                                </div>
                                            )}
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <span className="font-medium text-gray-900">{dest.name}</span>
                                    </TableCell>
                                    <TableCell>
                                        <span className="text-gray-500 text-sm font-mono">/{dest.slug}</span>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex gap-2 flex-wrap">
                                            {dest.isFeatured && (
                                                <Badge className="bg-amber-100 text-amber-700 text-[10px]">
                                                    <Star className="w-3 h-3 mr-1" /> Featured
                                                </Badge>
                                            )}
                                            {dest.isVisaFree && (
                                                <Badge className="bg-green-100 text-green-700 text-[10px]">
                                                    Visa Free
                                                </Badge>
                                            )}
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex items-center justify-end gap-1">
                                            <Link href={`/destination/${dest.slug}`} target="_blank">
                                                <Button variant="ghost" size="icon" className="rounded-lg hover:bg-gray-100">
                                                    <Eye className="h-4 w-4 text-gray-500" />
                                                </Button>
                                            </Link>
                                            <Link href={`/admin/destinations/edit/${dest._id}`}>
                                                <Button variant="ghost" size="icon" className="rounded-lg hover:bg-gray-100">
                                                    <Edit className="h-4 w-4 text-gray-500" />
                                                </Button>
                                            </Link>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={() => handleDelete(dest._id)}
                                                className="rounded-lg hover:bg-red-50 text-red-500 hover:text-red-600"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}
