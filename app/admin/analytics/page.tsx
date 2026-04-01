"use client";

import React, { useState, useEffect } from 'react';
import {
    LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
    XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
    TrendingUp, Users, Target, Laptop,
    Calendar, RefreshCcw, Download, Eye
} from 'lucide-react';
import { API_BASE_URL } from '@/constants';

export default function AnalyticsPage() {
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [range, setRange] = useState('7d');

    const fetchData = async () => {
        setLoading(true);
        try {
            const res = await fetch(`${API_BASE_URL}/api/admin/analytics/stats?range=${range}`, {
                credentials: 'include'
            });
            const result = await res.json();
            if (res.ok) {
                setData(result);
            } else {
                console.error("Server error:", result.message);
                setData(null);
            }
        } catch (err) {
            console.error("Failed to fetch analytics", err);
            setData(null);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [range]);

    if (loading && !data) {
        return <div className="flex items-center justify-center h-96 animate-pulse text-gray-400">Loading insights...</div>;
    }

    if (!data && !loading) {
        return (
            <div className="flex flex-col items-center justify-center h-96 bg-white rounded-3xl border border-dashed border-gray-200">
                <Target className="w-12 h-12 text-gray-200 mb-4" />
                <h3 className="text-lg font-bold text-gray-900">No data found</h3>
                <p className="text-gray-500 text-sm">Please check if you are logged in as admin.</p>
                <Button onClick={fetchData} className="mt-4 bg-[#CD1C18]">Retry</Button>
            </div>
        );
    }

    const COLORS = ['#CD1C18', '#FF6B6B', '#4D96FF', '#6BCB77', '#FFD93D'];

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-gray-900">Analytics Insights</h1>
                    <p className="text-gray-500 mt-1">Real-time performance and visitor behavior tracking.</p>
                </div>
                <div className="flex items-center gap-2 bg-white p-1 rounded-xl border border-gray-200 shadow-sm">
                    {['24h', '7d', '30d'].map((r) => (
                        <Button
                            key={r}
                            variant={range === r ? "default" : "ghost"}
                            size="sm"
                            onClick={() => setRange(r)}
                            className={range === r ? "bg-[#CD1C18] text-white rounded-lg px-4" : "text-gray-500 hover:text-gray-900"}
                        >
                            {r.toUpperCase()}
                        </Button>
                    ))}
                    <div className="w-px h-4 bg-gray-200 mx-1" />
                    <Button variant="ghost" size="icon" onClick={fetchData} disabled={loading}>
                        <RefreshCcw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                    </Button>
                </div>
            </div>

            {/* Quick Stats Grid */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card className="bg-white border-0 shadow-sm rounded-2xl">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-gray-500">Total Page Views</CardTitle>
                        <Eye className="h-4 w-4 text-[#CD1C18]" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{data?.pageViews?.reduce((acc: number, curr: any) => acc + curr.count, 0) || 0}</div>
                        <p className="text-xs text-green-600 mt-1 flex items-center gap-1">
                            <TrendingUp className="w-3 h-3" /> Live traffic
                        </p>
                    </CardContent>
                </Card>

                <Card className="bg-white border-0 shadow-sm rounded-2xl">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-gray-500">Lead Intent</CardTitle>
                        <Target className="h-4 w-4 text-purple-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{data?.leadIntent || 0}</div>
                        <p className="text-xs text-gray-400 mt-1">Clicks on "Request Quote"</p>
                    </CardContent>
                </Card>

                <Card className="bg-white border-0 shadow-sm rounded-2xl">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-gray-500">Conversion Interest</CardTitle>
                        <Users className="h-4 w-4 text-blue-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {(() => {
                                const totalViews = data?.pageViews?.reduce((acc: number, curr: any) => acc + curr.count, 0) || 0;
                                if (totalViews === 0) return '0.0';
                                return ((data.leadIntent / totalViews) * 100).toFixed(1);
                            })()}%
                        </div>
                        <p className="text-xs text-gray-400 mt-1">Visit to Lead ratio</p>
                    </CardContent>
                </Card>

                <Card className="bg-white border-0 shadow-sm rounded-2xl">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-gray-500">Top Device</CardTitle>
                        <Laptop className="h-4 w-4 text-amber-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{data?.devices?.[0]?._id || 'Desktop'}</div>
                        <p className="text-xs text-gray-400 mt-1">Primary user platform</p>
                    </CardContent>
                </Card>
            </div>

            {/* Charts Section */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {/* Traffic Trend */}
                <Card className="md:col-span-2 bg-white border-0 shadow-sm rounded-3xl overflow-hidden">
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <div>
                                <CardTitle className="text-lg font-bold">Traffic Trend</CardTitle>
                                <CardDescription>Page views frequency over time</CardDescription>
                            </div>
                            <Calendar className="w-5 h-5 text-gray-300" />
                        </div>
                    </CardHeader>
                    <CardContent className="h-[350px] pt-4">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={data?.pageViews}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                <XAxis
                                    dataKey="_id"
                                    stroke="#94a3b8"
                                    fontSize={12}
                                    tickLine={false}
                                    axisLine={false}
                                    tickFormatter={(val) => val.split('-').slice(1).join('/')}
                                />
                                <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                                <Tooltip
                                    contentStyle={{ backgroundColor: 'white', borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                                    itemStyle={{ color: '#CD1C18', fontWeight: 'bold' }}
                                />
                                <Line
                                    type="monotone"
                                    dataKey="count"
                                    stroke="#CD1C18"
                                    strokeWidth={3}
                                    dot={{ r: 4, fill: '#CD1C18', strokeWidth: 2, stroke: 'white' }}
                                    activeDot={{ r: 6, strokeWidth: 0 }}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>

                {/* Device Distribution */}
                <Card className="bg-white border-0 shadow-sm rounded-3xl overflow-hidden">
                    <CardHeader>
                        <CardTitle className="text-lg font-bold">Platforms</CardTitle>
                        <CardDescription>User device preference</CardDescription>
                    </CardHeader>
                    <CardContent className="h-[350px] flex flex-col items-center justify-center pt-0">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={data?.devices || []}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={70}
                                    outerRadius={100}
                                    paddingAngle={5}
                                    dataKey="count"
                                    nameKey="_id"
                                >
                                    {data?.devices?.map((entry: any, index: number) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip />
                                <Legend verticalAlign="bottom" height={36} />
                            </PieChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>

                {/* Popular Destinations */}
                <Card className="md:col-span-3 bg-white border-0 shadow-sm rounded-3xl overflow-hidden">
                    <CardHeader>
                        <CardTitle className="text-lg font-bold">Trending Destinations</CardTitle>
                        <CardDescription>Most viewed location detail pages</CardDescription>
                    </CardHeader>
                    <CardContent className="h-[400px] pt-4">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={data?.popularDestinations}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                <XAxis
                                    dataKey="_id"
                                    stroke="#94a3b8"
                                    fontSize={12}
                                    tickLine={false}
                                    axisLine={false}
                                />
                                <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                                <Tooltip
                                    cursor={{ fill: '#f8fafc' }}
                                    contentStyle={{ backgroundColor: 'white', borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                                />
                                <Bar
                                    dataKey="count"
                                    fill="#CD1C18"
                                    radius={[8, 8, 0, 0]}
                                    barSize={45}
                                />
                            </BarChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
