"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
    Package, MapPin, Users, Star, FileText, Globe,
    Plus, Home, AlertTriangle, Clock, ArrowRight,
    TrendingUp, Eye, EyeOff
} from 'lucide-react';
import { API_BASE_URL } from '@/constants';

interface DashboardStats {
    totalPackages: number;
    publishedPackages: number;
    draftPackages: number;
    totalDestinations: number;
    featuredDestinations: number;
    totalEnquiries: number;
    pendingEnquiries: number;
    featuredPackages: number;
    recentPackages: { title: string; slug: string; status: string; image: string; createdAt: string }[];
    packagesNoImage: { title: string; slug: string }[];
    pendingPublish: { title: string; slug: string; createdAt: string }[];
    destinationsLowPackages: { name: string; slug: string }[];
}

export default function DashboardPage() {
    const [stats, setStats] = useState<DashboardStats | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch(`${API_BASE_URL}/api/dashboard/stats`, { credentials: 'include' })
            .then(res => {
                if (res.status === 401) {
                    window.location.href = '/admin/login';
                    throw new Error('Unauthorized');
                }
                return res.json();
            })
            .then(data => {
                setStats(data);
                setLoading(false);
            })
            .catch(err => {
                console.error("Failed to fetch stats", err);
                setLoading(false);
            });
    }, []);

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-pulse text-gray-400">Loading dashboard...</div>
            </div>
        );
    }

    const formatDate = (dateStr: string) => {
        return new Date(dateStr).toLocaleDateString('en-IN', {
            day: 'numeric', month: 'short'
        });
    };

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-gray-900">Dashboard</h1>
                    <p className="text-gray-500 mt-1">Welcome back! Here's your content overview.</p>
                </div>
                <div className="flex gap-3">
                    <Link href="/admin/packages/create">
                        <Button className="bg-[#CD1C18] hover:bg-[#9B1313] text-white rounded-xl shadow-md shadow-[#CD1C18]/20">
                            <Plus className="w-4 h-4 mr-2" /> Add Package
                        </Button>
                    </Link>
                </div>
            </div>

            {/* Top Metrics Grid */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
                {/* Total Packages */}
                <Card className="bg-white border-0 shadow-sm rounded-2xl hover:shadow-md transition-shadow">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-gray-500">Total Packages</CardTitle>
                        <div className="w-8 h-8 rounded-xl bg-[#CD1C18]/10 flex items-center justify-center">
                            <Package className="h-4 w-4 text-[#CD1C18]" />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold text-gray-900">{stats?.totalPackages || 0}</div>
                    </CardContent>
                </Card>

                {/* Published */}
                <Card className="bg-white border-0 shadow-sm rounded-2xl hover:shadow-md transition-shadow">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-gray-500">Published</CardTitle>
                        <div className="w-8 h-8 rounded-xl bg-green-50 flex items-center justify-center">
                            <Eye className="h-4 w-4 text-green-600" />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold text-green-600">{stats?.publishedPackages || 0}</div>
                    </CardContent>
                </Card>

                {/* Draft */}
                <Card className="bg-white border-0 shadow-sm rounded-2xl hover:shadow-md transition-shadow">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-gray-500">Drafts</CardTitle>
                        <div className="w-8 h-8 rounded-xl bg-amber-50 flex items-center justify-center">
                            <EyeOff className="h-4 w-4 text-amber-600" />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold text-amber-600">{stats?.draftPackages || 0}</div>
                    </CardContent>
                </Card>

                {/* Destinations */}
                <Card className="bg-white border-0 shadow-sm rounded-2xl hover:shadow-md transition-shadow">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-gray-500">Destinations</CardTitle>
                        <div className="w-8 h-8 rounded-xl bg-blue-50 flex items-center justify-center">
                            <MapPin className="h-4 w-4 text-blue-600" />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold text-gray-900">{stats?.totalDestinations || 0}</div>
                        <p className="text-xs text-gray-400 mt-1">{stats?.featuredDestinations || 0} featured</p>
                    </CardContent>
                </Card>

                {/* Enquiries */}
                <Card className="bg-white border-0 shadow-sm rounded-2xl hover:shadow-md transition-shadow">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-gray-500">Enquiries</CardTitle>
                        <div className="w-8 h-8 rounded-xl bg-purple-50 flex items-center justify-center">
                            <Users className="h-4 w-4 text-purple-600" />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold text-gray-900">{stats?.totalEnquiries || 0}</div>
                        {(stats?.pendingEnquiries || 0) > 0 && (
                            <Badge variant="secondary" className="mt-1 bg-purple-100 text-purple-700 text-[10px]">
                                {stats?.pendingEnquiries} new
                            </Badge>
                        )}
                    </CardContent>
                </Card>

                {/* Featured */}
                <Card className="bg-white border-0 shadow-sm rounded-2xl hover:shadow-md transition-shadow">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-gray-500">Best Sellers</CardTitle>
                        <div className="w-8 h-8 rounded-xl bg-[#FFA896]/20 flex items-center justify-center">
                            <Star className="h-4 w-4 text-[#CD1C18]" />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold text-gray-900">{stats?.featuredPackages || 0}</div>
                    </CardContent>
                </Card>
            </div>

            {/* Quick Actions */}
            <div className="grid gap-4 md:grid-cols-3">
                <Link href="/admin/packages/create">
                    <Card className="bg-gradient-to-br from-[#CD1C18] to-[#9B1313] border-0 shadow-lg rounded-2xl cursor-pointer hover:shadow-xl transition-all hover:-translate-y-0.5 group">
                        <CardContent className="p-6 flex items-center gap-4">
                            <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center">
                                <Plus className="h-6 w-6 text-white" />
                            </div>
                            <div className="flex-1">
                                <h3 className="font-semibold text-white">Add Package</h3>
                                <p className="text-white/70 text-sm">Create new holiday package</p>
                            </div>
                            <ArrowRight className="w-5 h-5 text-white/50 group-hover:text-white group-hover:translate-x-1 transition-all" />
                        </CardContent>
                    </Card>
                </Link>

                <Link href="/admin/destinations/create">
                    <Card className="bg-white border-0 shadow-sm rounded-2xl cursor-pointer hover:shadow-md transition-all hover:-translate-y-0.5 group">
                        <CardContent className="p-6 flex items-center gap-4">
                            <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center">
                                <Globe className="h-6 w-6 text-blue-600" />
                            </div>
                            <div className="flex-1">
                                <h3 className="font-semibold text-gray-900">Add Destination</h3>
                                <p className="text-gray-500 text-sm">New country or region</p>
                            </div>
                            <ArrowRight className="w-5 h-5 text-gray-300 group-hover:text-[#CD1C18] group-hover:translate-x-1 transition-all" />
                        </CardContent>
                    </Card>
                </Link>

                <Link href="/admin/homepage">
                    <Card className="bg-white border-0 shadow-sm rounded-2xl cursor-pointer hover:shadow-md transition-all hover:-translate-y-0.5 group">
                        <CardContent className="p-6 flex items-center gap-4">
                            <div className="w-12 h-12 rounded-xl bg-[#FFA896]/20 flex items-center justify-center">
                                <Home className="h-6 w-6 text-[#CD1C18]" />
                            </div>
                            <div className="flex-1">
                                <h3 className="font-semibold text-gray-900">Manage Homepage</h3>
                                <p className="text-gray-500 text-sm">Hero slider & sections</p>
                            </div>
                            <ArrowRight className="w-5 h-5 text-gray-300 group-hover:text-[#CD1C18] group-hover:translate-x-1 transition-all" />
                        </CardContent>
                    </Card>
                </Link>
            </div>

            {/* Insight Sections */}
            <div className="grid gap-6 md:grid-cols-2">
                {/* Recently Added Packages */}
                <Card className="bg-white border-0 shadow-sm rounded-2xl">
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <div>
                                <CardTitle className="text-lg font-semibold text-gray-900">Recently Added</CardTitle>
                                <CardDescription>Latest packages in the system</CardDescription>
                            </div>
                            <Clock className="w-5 h-5 text-gray-400" />
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        {stats?.recentPackages?.length ? (
                            stats.recentPackages.map((pkg, i) => (
                                <Link key={i} href={`/admin/packages/edit/${pkg.slug || 'unknown'}`}>
                                    <div className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors cursor-pointer group">
                                        <div className="w-12 h-12 rounded-lg bg-gray-100 overflow-hidden flex-shrink-0">
                                            {pkg.image ? (
                                                <img src={pkg.image} alt="" className="w-full h-full object-cover" />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center">
                                                    <Package className="w-5 h-5 text-gray-400" />
                                                </div>
                                            )}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="font-medium text-gray-900 truncate group-hover:text-[#CD1C18]">{pkg.title}</p>
                                            <p className="text-xs text-gray-400">{formatDate(pkg.createdAt)}</p>
                                        </div>
                                        <Badge
                                            variant="secondary"
                                            className={pkg.status === 'draft'
                                                ? 'bg-amber-100 text-amber-700'
                                                : 'bg-green-100 text-green-700'
                                            }
                                        >
                                            {pkg.status || 'Published'}
                                        </Badge>
                                    </div>
                                </Link>
                            ))
                        ) : (
                            <p className="text-gray-400 text-center py-4">No packages yet</p>
                        )}
                    </CardContent>
                </Card>

                {/* Warnings & Pending */}
                <div className="space-y-6">
                    {/* Packages Missing Image */}
                    {stats?.packagesNoImage?.length ? (
                        <Card className="bg-amber-50 border-0 shadow-sm rounded-2xl">
                            <CardHeader className="pb-2">
                                <div className="flex items-center gap-2">
                                    <AlertTriangle className="w-5 h-5 text-amber-600" />
                                    <CardTitle className="text-base font-semibold text-amber-900">Missing Hero Image</CardTitle>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <ul className="space-y-2">
                                    {stats.packagesNoImage.map((pkg, i) => (
                                        <li key={i}>
                                            <Link href={`/admin/packages/edit/${pkg.slug}`} className="text-amber-800 hover:text-amber-900 hover:underline text-sm">
                                                {pkg.title}
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            </CardContent>
                        </Card>
                    ) : null}

                    {/* Draft Packages Pending */}
                    {stats?.pendingPublish?.length ? (
                        <Card className="bg-white border-0 shadow-sm rounded-2xl">
                            <CardHeader className="pb-2">
                                <div className="flex items-center gap-2">
                                    <FileText className="w-5 h-5 text-gray-500" />
                                    <CardTitle className="text-base font-semibold text-gray-900">Drafts Pending Publish</CardTitle>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <ul className="space-y-2">
                                    {stats.pendingPublish.map((pkg, i) => (
                                        <li key={i} className="flex items-center justify-between">
                                            <Link href={`/admin/packages/edit/${pkg.slug}`} className="text-gray-700 hover:text-[#CD1C18] text-sm">
                                                {pkg.title}
                                            </Link>
                                            <span className="text-xs text-gray-400">{formatDate(pkg.createdAt)}</span>
                                        </li>
                                    ))}
                                </ul>
                            </CardContent>
                        </Card>
                    ) : null}

                    {/* Destinations Without Packages */}
                    {stats?.destinationsLowPackages?.length ? (
                        <Card className="bg-white border-0 shadow-sm rounded-2xl">
                            <CardHeader className="pb-2">
                                <div className="flex items-center gap-2">
                                    <MapPin className="w-5 h-5 text-gray-500" />
                                    <CardTitle className="text-base font-semibold text-gray-900">Destinations Need Packages</CardTitle>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <ul className="space-y-2">
                                    {stats.destinationsLowPackages.map((dest, i) => (
                                        <li key={i}>
                                            <Link href={`/admin/destinations/edit/${dest.slug}`} className="text-gray-700 hover:text-[#CD1C18] text-sm">
                                                {dest.name}
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            </CardContent>
                        </Card>
                    ) : null}

                    {/* All Good State */}
                    {!stats?.packagesNoImage?.length && !stats?.pendingPublish?.length && !stats?.destinationsLowPackages?.length && (
                        <Card className="bg-green-50 border-0 shadow-sm rounded-2xl">
                            <CardContent className="p-6 text-center">
                                <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-3">
                                    <TrendingUp className="w-6 h-6 text-green-600" />
                                </div>
                                <h3 className="font-semibold text-green-900">Everything looks good!</h3>
                                <p className="text-green-700 text-sm mt-1">No pending issues to address.</p>
                            </CardContent>
                        </Card>
                    )}
                </div>
            </div>
        </div>
    );
}
