"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Plus, Search, Edit, Trash2, Eye, Package as PackageIcon } from 'lucide-react';
import { API_BASE_URL } from '@/constants';
import { Package } from '@/types';

export default function PackagesPage() {
    const [packages, setPackages] = useState<Package[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchPackages();
    }, []);

    const fetchPackages = async () => {
        try {
            const res = await fetch(`${API_BASE_URL}/api/packages?all=true`, { credentials: 'include' });
            const data = await res.json();
            setPackages(data);
        } catch (error) {
            console.error("Failed to fetch packages", error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this package?')) return;

        try {
            const res = await fetch(`${API_BASE_URL}/api/packages/${id}`, {
                method: 'DELETE',
                credentials: 'include'
            });
            if (res.ok) {
                setPackages(prev => prev.filter(p => p.id !== id));
            } else {
                alert('Failed to delete package');
            }
        } catch (error) {
            alert('Error deleting package');
        }
    };

    const filteredPackages = packages.filter(p =>
        p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.location.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-gray-900">Packages</h1>
                    <p className="text-gray-500 mt-1">Manage all holiday packages</p>
                </div>
                <Link href="/admin/packages/create">
                    <Button className="bg-[#CD1C18] hover:bg-[#9B1313] text-white rounded-xl shadow-md shadow-[#CD1C18]/20">
                        <Plus className="h-4 w-4 mr-2" />
                        Add Package
                    </Button>
                </Link>
            </div>

            {/* Search */}
            <div className="flex items-center gap-4">
                <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                        placeholder="Search packages..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 rounded-xl border-gray-200"
                    />
                </div>
                <div className="text-sm text-gray-500">
                    {filteredPackages.length} packages
                </div>
            </div>

            {/* Table */}
            <div className="bg-white rounded-2xl shadow-sm border-0 overflow-hidden">
                <Table>
                    <TableHeader>
                        <TableRow className="bg-gray-50/50">
                            <TableHead className="w-[80px]">Image</TableHead>
                            <TableHead>Title</TableHead>
                            <TableHead>Location</TableHead>
                            <TableHead>Price</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {loading ? (
                            <TableRow key="loading">
                                <TableCell colSpan={6} className="text-center py-16">
                                    <div className="animate-pulse text-gray-400">Loading packages...</div>
                                </TableCell>
                            </TableRow>
                        ) : filteredPackages.length === 0 ? (
                            <TableRow key="empty">
                                <TableCell colSpan={6} className="text-center py-16">
                                    <div className="flex flex-col items-center gap-2">
                                        <PackageIcon className="w-8 h-8 text-gray-300" />
                                        <p className="text-gray-500">No packages found</p>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ) : (
                            filteredPackages.map((pkg) => (
                                <TableRow key={pkg._id || pkg.id} className="hover:bg-gray-50/50">
                                    <TableCell>
                                        <div className="h-12 w-16 rounded-lg bg-gray-100 overflow-hidden">
                                            {pkg.image ? (
                                                <img src={pkg.image} alt="" className="h-full w-full object-cover" />
                                            ) : (
                                                <div className="h-full w-full flex items-center justify-center">
                                                    <PackageIcon className="w-5 h-5 text-gray-300" />
                                                </div>
                                            )}
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-2">
                                            <span className="font-medium text-gray-900">{pkg.title}</span>
                                            {pkg.isBestSeller && (
                                                <Badge className="bg-amber-100 text-amber-700 text-[10px]">Featured</Badge>
                                            )}
                                            {pkg.status === 'draft' && (
                                                <Badge variant="secondary" className="bg-gray-100 text-gray-600 text-[10px]">Draft</Badge>
                                            )}
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-gray-600">{pkg.location}</TableCell>
                                    <TableCell className="font-medium">₹{(pkg.price || 0).toLocaleString()}</TableCell>
                                    <TableCell>
                                        <Badge
                                            variant="secondary"
                                            className={pkg.status === 'draft'
                                                ? 'bg-amber-100 text-amber-700'
                                                : 'bg-green-100 text-green-700'
                                            }
                                        >
                                            {pkg.status === 'draft' ? 'Draft' : 'Published'}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex items-center justify-end gap-1">
                                            <Link href={`/packages/${pkg.slug}`} target="_blank">
                                                <Button variant="ghost" size="icon" className="rounded-lg hover:bg-gray-100">
                                                    <Eye className="h-4 w-4 text-gray-500" />
                                                </Button>
                                            </Link>
                                            <Link href={`/admin/packages/edit/${pkg.id || pkg._id}`}>
                                                <Button variant="ghost" size="icon" className="rounded-lg hover:bg-gray-100">
                                                    <Edit className="h-4 w-4 text-gray-500" />
                                                </Button>
                                            </Link>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={() => handleDelete(pkg.id || pkg._id!)}
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
