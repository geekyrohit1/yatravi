"use client";

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import {
    ChevronLeft, Save, Globe, Info, RefreshCw, Share2, Code, Layout,
    TrendingUp, CheckCircle, AlertTriangle, Plus, Trash2, Smartphone, Monitor
} from 'lucide-react';
import Link from 'next/link';
import { API_BASE_URL } from '@/constants';
import { Button } from '@/components/Button';

export default function EditSEOPage() {
    const router = useRouter();
    const params = useParams();
    const { type, id } = params;

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [item, setItem] = useState<any>(null);
    const [activeTab, setActiveTab] = useState('general');

    // Advanced Analysis State
    const [focusKeyword, setFocusKeyword] = useState('');
    const [analysisScore, setAnalysisScore] = useState(0);

    // Schema Generator State
    const [faqItems, setFaqItems] = useState([{ q: '', a: '' }]);

    // SEO Form State
    const [seoData, setSeoData] = useState({
        title: '',
        description: '',
        keywords: '',
        canonicalUrl: '',
        robots: 'index, follow',
        ogTitle: '',
        ogDescription: '',
        ogImage: '',
        twitterTitle: '',
        twitterDescription: '',
        twitterImage: '',
        jsonLd: '',
        sitemapPriority: 0.8,
        sitemapFrequency: 'weekly'
    });

    useEffect(() => {
        if (id) fetchItemDetails();
    }, [id]);

    useEffect(() => {
        calculateScore();
    }, [seoData, focusKeyword]);

    const fetchItemDetails = async () => {
        try {
            const endpoint = type === 'package'
                ? `${API_BASE_URL}/api/packages/${id}`
                : `${API_BASE_URL}/api/destinations/${id}`;

            const res = await fetch(endpoint, { cache: 'no-store' });
            if (!res.ok) throw new Error('Failed to fetch details');

            const data = await res.json();
            setItem(data);

            const newSeoData = {
                title: data.seo?.title || data.title || data.name || '',
                description: data.seo?.description || data.overview || data.description || '',
                keywords: data.seo?.keywords || '',
                canonicalUrl: data.seo?.canonicalUrl || '',
                robots: data.seo?.robots || 'index, follow',
                ogTitle: data.seo?.ogTitle || '',
                ogDescription: data.seo?.ogDescription || '',
                ogImage: data.seo?.ogImage || data.image || data.heroImage || '',
                twitterTitle: data.seo?.twitterTitle || '',
                twitterDescription: data.seo?.twitterDescription || '',
                twitterImage: data.seo?.twitterImage || '',
                jsonLd: data.seo?.jsonLd || '',
                sitemapPriority: data.seo?.sitemapPriority || (type === 'package' ? 0.8 : 0.9),
                sitemapFrequency: data.seo?.sitemapFrequency || 'weekly'
            };

            setSeoData(newSeoData);

            // Try to guess focus keyword from first keyword
            if (data.seo?.keywords) {
                setFocusKeyword(data.seo.keywords.split(',')[0].trim());
            } else {
                setFocusKeyword(data.title || data.name || '');
            }

            setLoading(false);
        } catch (error) {
            console.error('Error fetching details:', error);
            setLoading(false);
        }
    };

    const calculateScore = () => {
        if (!focusKeyword) {
            setAnalysisScore(0);
            return;
        }
        let score = 0;
        const lowerKeyword = focusKeyword.toLowerCase();

        // 1. Keyword in Title (30 pts)
        if (seoData.title.toLowerCase().includes(lowerKeyword)) score += 30;

        // 2. Title Length (10 pts)
        if (seoData.title.length >= 30 && seoData.title.length <= 60) score += 10;

        // 3. Keyword in Description (20 pts)
        if (seoData.description.toLowerCase().includes(lowerKeyword)) score += 20;

        // 4. Description Length (10 pts)
        if (seoData.description.length >= 120 && seoData.description.length <= 160) score += 10;

        // 5. Keyword in URL/Slug (Simulated) (10 pts)
        if (item?.slug?.includes(lowerKeyword.replace(/ /g, '-'))) score += 10;
        else if (item?.slug?.replace(/-/g, ' ').includes(lowerKeyword)) score += 10;

        // 6. Keyword in Keywords list (10 pts)
        if (seoData.keywords.toLowerCase().includes(lowerKeyword)) score += 10;

        // 7. OG Image Set (10 pts)
        if (seoData.ogImage) score += 10;

        setAnalysisScore(Math.min(score, 100));
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);

        try {
            const endpoint = type === 'package'
                ? `${API_BASE_URL}/api/packages/${id}`
                : `${API_BASE_URL}/api/destinations/${id}`;

            const payload = {
                ...item,
                seo: seoData
            };

            const res = await fetch(endpoint, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (!res.ok) throw new Error('Failed to save');
            alert('Advanced SEO Settings Saved Successfully!');
        } catch (error) {
            console.error('Save failed:', error);
            alert('Failed to save SEO settings.');
        } finally {
            setSaving(false);
        }
    };

    const generateFaqSchema = () => {
        const schema = {
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": faqItems.filter(i => i.q && i.a).map(item => ({
                "@type": "Question",
                "name": item.q,
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": item.a
                }
            }))
        };
        setSeoData({ ...seoData, jsonLd: JSON.stringify(schema, null, 2) });
        alert("FAQ Schema Generated & Applied!");
    };

    const addFaqItem = () => setFaqItems([...faqItems, { q: '', a: '' }]);
    const removeFaqItem = (index: number) => setFaqItems(faqItems.filter((_, i) => i !== index));
    const updateFaqItem = (index: number, field: 'q' | 'a', value: string) => {
        const newItems = [...faqItems];
        newItems[index][field] = value;
        setFaqItems(newItems);
    };

    if (loading) return <div className="p-12 text-center">Loading...</div>;

    const hostname = typeof window !== 'undefined' ? window.location.hostname : 'yatravi.com';
    const previewUrl = `https://${hostname}/${type === 'package' ? 'packages' : 'destination'}/${item?.slug}`;

    return (
        <div className="p-8 max-w-7xl mx-auto">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-4">
                    <Link href="/admin/seo">
                        <Button variant="ghost" size="sm" className="bg-gray-100 hover:bg-gray-200 text-gray-600">
                            <ChevronLeft className="w-5 h-5" />
                        </Button>
                    </Link>
                    <div>
                        <h1 className="text-2xl font-heading font-bold text-gray-900">Advanced SEO Editor</h1>
                        <div className="flex items-center gap-2 mt-1">
                            {analysisScore >= 80 ? (
                                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                                    <CheckCircle className="w-3 h-3 mr-1" /> Excellent ({analysisScore}/100)
                                </span>
                            ) : analysisScore >= 50 ? (
                                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-yellow-100 text-yellow-800">
                                    <TrendingUp className="w-3 h-3 mr-1" /> Good ({analysisScore}/100)
                                </span>
                            ) : (
                                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-red-100 text-red-800">
                                    <AlertTriangle className="w-3 h-3 mr-1" /> Needs Work ({analysisScore}/100)
                                </span>
                            )}
                            <span className="text-gray-400 text-sm">|</span>
                            <span className="text-gray-500 text-sm truncate max-w-xs">{item?.title || item?.name}</span>
                        </div>
                    </div>
                </div>
                <div className="flex gap-3">
                    <Button onClick={handleSave} disabled={saving} className="shadow-lg shadow-brand/20">
                        {saving ? <RefreshCw className="w-4 h-4 animate-spin mr-2" /> : <Save className="w-4 h-4 mr-2" />}
                        Save Changes
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Sidebar Navigation */}
                <div className="lg:col-span-3">
                    <div className="bg-white rounded-2xl border border-gray-100 p-2 shadow-sm sticky top-6">
                        {[
                            { id: 'general', label: 'General', icon: Globe },
                            { id: 'analysis', label: 'Content Analysis', icon: TrendingUp },
                            { id: 'social', label: 'Social Media', icon: Share2 },
                            { id: 'advanced', label: 'Advanced & Schema', icon: Code },
                        ].map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${activeTab === tab.id
                                    ? 'bg-gray-900 text-white shadow-md'
                                    : 'text-gray-600 hover:bg-gray-50'
                                    }`}
                            >
                                <tab.icon className="w-4 h-4" />
                                <span>{tab.label}</span>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Main Content Area */}
                <div className="lg:col-span-9 space-y-6">

                    {/* General Tab */}
                    {activeTab === 'general' && (
                        <div className="space-y-6 animate-fade-in">
                            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                                <h2 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
                                    <Globe className="w-5 h-5 text-gray-400" /> Search Engine Listing
                                </h2>
                                <div className="space-y-5">
                                    <div>
                                        <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">Meta Title</label>
                                        <input
                                            type="text"
                                            value={seoData.title}
                                            onChange={(e) => setSeoData({ ...seoData, title: e.target.value })}
                                            className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-100 focus:border-gray-900 focus:ring-1 focus:ring-gray-900 outline-none transition-all"
                                        />
                                        <LimitIndicator current={seoData.title.length} min={30} max={60} />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">Meta Description</label>
                                        <textarea
                                            rows={4}
                                            value={seoData.description}
                                            onChange={(e) => setSeoData({ ...seoData, description: e.target.value })}
                                            className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-100 focus:border-gray-900 focus:ring-1 focus:ring-gray-900 outline-none transition-all resize-none"
                                        />
                                        <LimitIndicator current={seoData.description.length} min={120} max={160} />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">Keywords</label>
                                        <input
                                            type="text"
                                            value={seoData.keywords}
                                            onChange={(e) => setSeoData({ ...seoData, keywords: e.target.value })}
                                            placeholder="Comma separated..."
                                            className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-100 focus:border-gray-900 focus:ring-1 focus:ring-gray-900 outline-none transition-all"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Google Preview */}
                            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                                <h2 className="text-lg font-bold text-gray-900 mb-4">Google Search Preview</h2>
                                <div className="bg-white p-4 rounded-xl border border-gray-100 max-w-xl">
                                    <div className="flex items-center gap-2 mb-1">
                                        <div className="w-7 h-7 bg-gray-100 rounded-full flex items-center justify-center text-xs font-bold text-gray-500">Y</div>
                                        <div>
                                            <p className="text-xs text-gray-800">Yatravi Travels</p>
                                            <p className="text-[10px] text-gray-500 truncate max-w-[250px]">{previewUrl}</p>
                                        </div>
                                    </div>
                                    <h3 className="text-xl text-[#1a0dab] hover:underline cursor-pointer font-medium mb-1 line-clamp-1">
                                        {seoData.title || item?.title}
                                    </h3>
                                    <p className="text-sm text-gray-600 line-clamp-2">
                                        {seoData.description || "No description provided."}
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Content Analysis Tab */}
                    {activeTab === 'analysis' && (
                        <div className="space-y-6 animate-fade-in">
                            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                                <h2 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
                                    <TrendingUp className="w-5 h-5 text-gray-400" /> SEO Content Analysis
                                </h2>

                                <div className="mb-8">
                                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">Focus Keyword</label>
                                    <div className="flex gap-4">
                                        <input
                                            type="text"
                                            value={focusKeyword}
                                            onChange={(e) => setFocusKeyword(e.target.value)}
                                            placeholder="Enter main keyword..."
                                            className="flex-1 px-4 py-3 rounded-xl bg-gray-50 border border-gray-100 focus:border-gray-900 outline-none"
                                        />
                                        <div className="flex flex-col justify-center items-center px-6 bg-gray-50 rounded-xl border border-gray-100">
                                            <span className="text-xs text-gray-500 uppercase font-bold">Score</span>
                                            <span className={`text-xl font-bold ${analysisScore >= 80 ? 'text-green-600' : analysisScore >= 50 ? 'text-yellow-600' : 'text-red-600'
                                                }`}>{analysisScore}/100</span>
                                        </div>
                                    </div>
                                    <p className="text-xs text-gray-400 mt-2">Enter a keyword to see how well your content is optimized (Real-time)</p>
                                </div>

                                <div className="space-y-3">
                                    <AnalysisItem
                                        passed={seoData.title.toLowerCase().includes(focusKeyword.toLowerCase())}
                                        label="Focus keyword in SEO Title"
                                        desc="Use the focus keyword at the beginning of your title."
                                    />
                                    <AnalysisItem
                                        passed={seoData.title.length >= 30 && seoData.title.length <= 60}
                                        label="SEO Title length"
                                        desc="Title should be between 30 and 60 characters."
                                    />
                                    <AnalysisItem
                                        passed={seoData.description.toLowerCase().includes(focusKeyword.toLowerCase())}
                                        label="Focus keyword in Meta Description"
                                        desc="Your meta description should contain the focus keyword."
                                    />
                                    <AnalysisItem
                                        passed={seoData.description.length >= 120 && seoData.description.length <= 160}
                                        label="Meta Description length"
                                        desc="Description should be between 120 and 160 characters."
                                    />
                                    <AnalysisItem
                                        passed={item?.slug?.includes(focusKeyword.toLowerCase().replace(/ /g, '-')) || item?.slug?.replace(/-/g, ' ').includes(focusKeyword.toLowerCase())}
                                        label="Focus keyword in URL"
                                        desc="URL should contain the focus keyword."
                                    />
                                    <AnalysisItem
                                        passed={!!seoData.ogImage}
                                        label="Social Media Image"
                                        desc="An Open Graph image is set for social sharing."
                                    />
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Social Tab */}
                    {activeTab === 'social' && (
                        <div className="space-y-6 animate-fade-in">
                            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                                <h2 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
                                    <Share2 className="w-5 h-5 text-blue-600" /> Facebook & Open Graph
                                </h2>
                                <div className="space-y-5">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">OG Title</label>
                                            <input
                                                type="text"
                                                value={seoData.ogTitle}
                                                onChange={(e) => setSeoData({ ...seoData, ogTitle: e.target.value })}
                                                placeholder="Same as Meta Title"
                                                className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-100 focus:border-gray-900 outline-none"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">OG Description</label>
                                            <input
                                                type="text"
                                                value={seoData.ogDescription}
                                                onChange={(e) => setSeoData({ ...seoData, ogDescription: e.target.value })}
                                                placeholder="Same as Meta Description"
                                                className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-100 focus:border-gray-900 outline-none"
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">OG Image URL</label>
                                        <div className="flex gap-2">
                                            <input
                                                type="text"
                                                value={seoData.ogImage}
                                                onChange={(e) => setSeoData({ ...seoData, ogImage: e.target.value })}
                                                className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-100 focus:border-gray-900 outline-none"
                                            />
                                            {seoData.ogImage && <img src={seoData.ogImage} alt="Preview" className="w-12 h-12 rounded-lg object-cover border border-gray-200" />}
                                        </div>
                                    </div>

                                    {/* Facebook Preview Card */}
                                    <div className="mt-4 border border-gray-200 rounded-lg overflow-hidden max-w-sm mx-auto bg-gray-100">
                                        <div className="bg-gray-200 h-48 w-full flex items-center justify-center overflow-hidden">
                                            {seoData.ogImage ? <img src={seoData.ogImage} className="w-full h-full object-cover" /> : <p className="text-gray-400 font-bold">No Image</p>}
                                        </div>
                                        <div className="p-3 bg-gray-100 border-t border-gray-300">
                                            <p className="text-[10px] text-gray-500 uppercase font-bold truncate">{hostname}</p>
                                            <h3 className="text-sm font-bold text-gray-900 line-clamp-1 mt-0.5">{seoData.ogTitle || seoData.title || item?.title}</h3>
                                            <p className="text-xs text-gray-600 line-clamp-1 mt-1">{seoData.ogDescription || seoData.description}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Advanced Tab */}
                    {activeTab === 'advanced' && (
                        <div className="space-y-6 animate-fade-in">
                            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                                <h2 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
                                    <Code className="w-5 h-5 text-gray-400" /> Technical SEO
                                </h2>
                                <div className="space-y-5">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">Canonical URL</label>
                                            <input
                                                type="text"
                                                value={seoData.canonicalUrl}
                                                onChange={(e) => setSeoData({ ...seoData, canonicalUrl: e.target.value })}
                                                className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-100 focus:border-gray-900 outline-none"
                                                placeholder="https://..."
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">Robots Tag</label>
                                            <select
                                                value={seoData.robots}
                                                onChange={(e) => setSeoData({ ...seoData, robots: e.target.value })}
                                                className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-100 focus:border-gray-900 outline-none"
                                            >
                                                <option value="index, follow">index, follow</option>
                                                <option value="noindex, follow">noindex, follow</option>
                                                <option value="index, nofollow">index, nofollow</option>
                                                <option value="noindex, nofollow">noindex, nofollow</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Schema Generator */}
                            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                                <h2 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
                                    <Layout className="w-5 h-5 text-gray-400" /> Structured Data Generator
                                </h2>

                                <div className="space-y-6">
                                    <div>
                                        <h3 className="text-sm font-bold text-gray-800 mb-4">FAQ Schema Builder</h3>
                                        <div className="space-y-3 mb-4">
                                            {faqItems.map((item, index) => (
                                                <div key={index} className="flex gap-2 items-start">
                                                    <div className="flex-1 space-y-2">
                                                        <input
                                                            placeholder="Question"
                                                            className="w-full px-3 py-2 bg-gray-50 rounded-lg border border-gray-200 text-sm focus:border-gray-900 outline-none"
                                                            value={item.q}
                                                            onChange={(e) => updateFaqItem(index, 'q', e.target.value)}
                                                        />
                                                        <textarea
                                                            placeholder="Answer"
                                                            className="w-full px-3 py-2 bg-gray-50 rounded-lg border border-gray-200 text-sm focus:border-gray-900 outline-none resize-none"
                                                            rows={2}
                                                            value={item.a}
                                                            onChange={(e) => updateFaqItem(index, 'a', e.target.value)}
                                                        />
                                                    </div>
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => removeFaqItem(index)}
                                                        className="mt-1 text-red-500 hover:bg-red-50"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </Button>
                                                </div>
                                            ))}
                                        </div>
                                        <div className="flex gap-2">
                                            <Button variant="outline" size="sm" onClick={addFaqItem}>
                                                <Plus className="w-3 h-3 mr-1" /> Add Question
                                            </Button>
                                            <Button onClick={generateFaqSchema} size="sm" className="bg-gray-900 text-white">
                                                <Code className="w-3 h-3 mr-1" /> Generate & Apply JSON
                                            </Button>
                                        </div>
                                    </div>

                                    <div className="pt-4 border-t border-gray-100">
                                        <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">Raw JSON-LD Output</label>
                                        <textarea
                                            rows={8}
                                            value={seoData.jsonLd}
                                            onChange={(e) => setSeoData({ ...seoData, jsonLd: e.target.value })}
                                            className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-100 focus:border-gray-900 font-mono text-xs outline-none"
                                            placeholder='{ "@context": "https://schema.org", "@type": "Product", ... }'
                                        />
                                        <p className="text-xs text-gray-500 mt-2">The generated schema appears here. You can also manually edit it.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

const LimitIndicator = ({ current, min, max }: { current: number, min: number, max: number }) => {
    const isGood = current >= min && current <= max;
    const isTooLong = current > max;
    const color = isGood ? 'text-green-500' : isTooLong ? 'text-red-500' : 'text-yellow-500';

    return (
        <div className="flex justify-between mt-1.5">
            <span className="text-[10px] text-gray-400">Recommended: {min}-{max} characters</span>
            <span className={`text-[10px] font-bold ${color}`}>{current} chars</span>
        </div>
    );
};

const AnalysisItem = ({ passed, label, desc }: { passed: boolean, label: string, desc: string }) => (
    <div className="flex items-start gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors">
        <div className={`shrink-0 w-5 h-5 rounded-full flex items-center justify-center mt-0.5 ${passed ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
            {passed ? <CheckCircle className="w-3.5 h-3.5" /> : <AlertTriangle className="w-3.5 h-3.5" />}
        </div>
        <div>
            <h4 className={`text-sm font-bold ${passed ? 'text-green-800' : 'text-red-800'}`}>{label}</h4>
            <p className="text-xs text-gray-500">{desc}</p>
        </div>
    </div>
);
