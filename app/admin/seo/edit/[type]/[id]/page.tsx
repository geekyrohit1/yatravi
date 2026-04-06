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
    const [analysisScore, setAnalysisScore] = useState(0);
    const [lsiKeywords, setLsiKeywords] = useState<string[]>([]);
    const [isGeneratingLsi, setIsGeneratingLsi] = useState(false);
    const [previewDevice, setPreviewDevice] = useState<'mobile' | 'desktop'>('mobile');
    
    // Rank Tracker State
    const [isCheckingRank, setIsCheckingRank] = useState(false);
    const [rankData, setRankData] = useState<any>(null);
    const [showConfetti, setShowConfetti] = useState(false);

    // Schema Generator State
    const [faqItems, setFaqItems] = useState([{ q: '', a: '' }]);

    // SEO Form State (focusKeyword included here so it saves to DB)
    const [seoData, setSeoData] = useState({
        title: '',
        description: '',
        keywords: '',
        focusKeyword: '',
        canonicalUrl: '',
        robots: 'index, follow',
        ogTitle: '',
        ogDescription: '',
        ogImage: '',
        twitterTitle: '',
        twitterDescription: '',
        twitterImage: '',
        jsonLd: '',
        autoGenerateSchema: true,
        schemaTypes: [] as string[],
        sitemapPriority: 0.8,
        sitemapFrequency: 'weekly',
        quickLinks: [] as { label: string, url: string }[],
        // Branding fields
        siteName: '',
        titleSeparator: '|'
    });

    useEffect(() => {
        if (id) fetchItemDetails();
    }, [id]);

    useEffect(() => {
        calculateScore();
    }, [seoData]);

    const fetchItemDetails = async () => {
        try {
            let endpoint = '';
            if (type === 'package') endpoint = `${API_BASE_URL}/api/packages/${id}`;
            else if (type === 'destination') endpoint = `${API_BASE_URL}/api/destinations/${id}`;
            else if (type === 'page') endpoint = `${API_BASE_URL}/api/pages/id/${id}`;
            else if (type === 'global') endpoint = `${API_BASE_URL}/api/settings`;

            const res = await fetch(endpoint, { cache: 'no-store' });
            if (!res.ok) throw new Error('Failed to fetch details');

            const data = await res.json();
            setItem(data);

            const seoSource = type === 'global' ? data.globalSeo : data.seo;

            // Clean up old defaults if they exist in DB
            const dbTitle = seoSource?.defaultTitle || '';
            const dbDesc = seoSource?.defaultDescription || '';
            const dbKeywords = seoSource?.defaultKeywords || '';

            // Old defaults to ignore
            const oldTitle = 'Yatravi - We Care Your Trip';
            const oldDesc = 'Book the best holiday packages and travel experiences with Yatravi.';
            const oldKeywords = 'travel, tourism, holiday packages, yatravi';

            const newSeoData = {
                title: type === 'global' 
                    ? (dbTitle === oldTitle || !dbTitle ? 'Yatravi | We Care Your Trip - Lowest Price Holiday Packages' : dbTitle) 
                    : (seoSource?.title || data.title || data.name || ''),
                description: type === 'global' 
                    ? (dbDesc === oldDesc || !dbDesc ? 'Explore the world with Yatravi. Lowest price holiday packages and premium travel experiences.' : dbDesc) 
                    : (seoSource?.description || data.overview || data.description || ''),
                keywords: type === 'global' 
                    ? (dbKeywords === oldKeywords || !dbKeywords ? 'travel agency, holiday packages, tour packages, cheapest tours' : dbKeywords) 
                    : (seoSource?.keywords || ''),
                focusKeyword: type === 'global' 
                    ? (seoSource?.defaultKeywords ? (dbKeywords === oldKeywords ? 'holiday packages' : seoSource.defaultKeywords.split(',')[0].trim()) : 'holiday packages') 
                    : (seoSource?.focusKeyword || (seoSource?.keywords ? seoSource.keywords.split(',')[0].trim() : '') || data.title || data.name || ''),
                canonicalUrl: seoSource?.canonicalUrl || '',
                robots: seoSource?.robots || 'index, follow',
                ogTitle: seoSource?.ogTitle || '',
                ogDescription: seoSource?.ogDescription || '',
                ogImage: type === 'global' 
                    ? (seoSource?.defaultOgImage || '/og-image.png') 
                    : (seoSource?.ogImage || data.image || data.heroImage || ''),
                twitterTitle: seoSource?.twitterTitle || '',
                twitterDescription: seoSource?.twitterDescription || '',
                twitterImage: seoSource?.twitterImage || '',
                jsonLd: seoSource?.jsonLd || (type === 'global' ? JSON.stringify(data.globalSeo?.organizationSchema || {}, null, 2) : ''),
                autoGenerateSchema: seoSource?.autoGenerateSchema !== undefined ? seoSource.autoGenerateSchema : true,
                schemaTypes: seoSource?.schemaTypes || (type === 'package' ? ['Product', 'FAQPage', 'BreadcrumbList'] : type === 'destination' ? ['TouristDestination', 'FAQPage', 'BreadcrumbList'] : ['WebPage']),
                sitemapPriority: seoSource?.sitemapPriority || (type === 'package' ? 0.8 : type === 'destination' ? 0.9 : 0.5),
                sitemapFrequency: seoSource?.sitemapFrequency || (type === 'global' ? 'monthly' : 'weekly'),
                quickLinks: seoSource?.quickLinks || [],
                // Branding mapping
                siteName: type === 'global' ? (seoSource?.siteName || 'Yatravi') : 'Yatravi',
                titleSeparator: type === 'global' ? (seoSource?.titleSeparator || '|') : '|'
            };
            
            setRankData({
                rank: seoSource?.currentRank || 0,
                previousRank: seoSource?.previousRank || 0,
                lastChecked: seoSource?.lastRankCheck,
                history: seoSource?.rankHistory || []
            });

            setSeoData(newSeoData);

            setLoading(false);
        } catch (error) {
            console.error('Error fetching details:', error);
            setLoading(false);
        }
    };

    const [checklist, setChecklist] = useState<any[]>([]);

    const calculateScore = () => {
        if (!seoData.focusKeyword) {
            setAnalysisScore(0);
            setChecklist([]);
            return;
        }

        const checks = [];
        let score = 0;
        const lowerKeyword = seoData.focusKeyword.toLowerCase();
        
        // --- 1. TITLE CHECKS ---
        const titleLower = seoData.title.toLowerCase();
        const hasKeywordInTitle = titleLower.includes(lowerKeyword);
        const keywordAtStart = titleLower.startsWith(lowerKeyword.substring(0, 5)) || titleLower.indexOf(lowerKeyword) < 10;
        
        checks.push({
            id: 'title-keyword',
            label: 'Focus keyword in SEO Title',
            passed: hasKeywordInTitle,
            priority: 'critical',
            score: 20,
            desc: hasKeywordInTitle ? 'Great! Keyword found in title.' : 'Your focus keyword must be in the SEO Title.'
        });

        if (hasKeywordInTitle) {
            score += 20;
            checks.push({
                id: 'title-start',
                label: 'Keyword at the beginning of Title',
                passed: keywordAtStart,
                priority: 'recommended',
                score: 10,
                desc: keywordAtStart ? 'Perfect positioning!' : 'Try moving the keyword to the start of the title to improve visibility.'
            });
            if (keywordAtStart) score += 10;
        }

        const isTitleLengthGood = seoData.title.length >= 30 && seoData.title.length <= 60;
        checks.push({
            id: 'title-length',
            label: 'SEO Title length',
            passed: isTitleLengthGood,
            priority: 'recommended',
            score: 10,
            desc: isTitleLengthGood ? 'Length is optimal.' : 'Titles should be between 30-60 characters.'
        });
        if (isTitleLengthGood) score += 10;

        // --- 2. DESCRIPTION CHECKS ---
        const hasKeywordInDesc = seoData.description.toLowerCase().includes(lowerKeyword);
        checks.push({
            id: 'desc-keyword',
            label: 'Focus keyword in Meta Description',
            passed: hasKeywordInDesc,
            priority: 'critical',
            score: 15,
            desc: hasKeywordInDesc ? 'Keyword present in description.' : 'Add your focus keyword to the meta description.'
        });
        if (hasKeywordInDesc) score += 15;

        const isDescLengthGood = seoData.description.length >= 120 && seoData.description.length <= 160;
        checks.push({
            id: 'desc-length',
            label: 'Meta Description length',
            passed: isDescLengthGood,
            priority: 'recommended',
            score: 10,
            desc: isDescLengthGood ? 'Good description length.' : 'Target 120-160 characters for best results.'
        });
        if (isDescLengthGood) score += 10;

        // --- 3. URL/SLUG CHECKS ---
        const hasKeywordInSlug = item?.slug?.includes(lowerKeyword.replace(/ /g, '-')) || item?.slug?.replace(/-/g, ' ').includes(lowerKeyword);
        checks.push({
            id: 'slug-keyword',
            label: 'Focus keyword in URL slug',
            passed: hasKeywordInSlug,
            priority: 'recommended',
            score: 10,
            desc: hasKeywordInSlug ? 'Keyword found in URL.' : 'Ideally, the URL slug should contain your keyword.'
        });
        if (hasKeywordInSlug) score += 10;

        // --- 4. CONTENT SCANNING (DENSITY & LINKS) ---
        const fullContent = (item?.overview || '') + (JSON.stringify(item?.itinerary || ''));
        const contentLower = fullContent.toLowerCase();
        
        // Count occurrences
        const count = (contentLower.match(new RegExp(lowerKeyword, 'g')) || []).length;
        const isDensityGood = count >= 2;
        checks.push({
            id: 'density',
            label: 'Keyword Density',
            passed: isDensityGood,
            priority: 'critical',
            score: 15,
            desc: isDensityGood ? `Good! Keyword appears ${count} times.` : 'Try to use the focus keyword at least 2-3 times in the content.'
        });
        if (isDensityGood) score += 15;

        const hasInternalLinks = contentLower.includes('yatravi.com') || contentLower.includes('href="/"') || contentLower.includes('href="/packages') || contentLower.includes('href="/destination');
        checks.push({
            id: 'internal-links',
            label: 'Internal Linking',
            passed: hasInternalLinks,
            priority: 'recommended',
            score: 10,
            desc: hasInternalLinks ? 'Internal links found.' : 'Add at least one link to another page on Yatravi to improve SEO juice.'
        });
        if (hasInternalLinks) score += 5;

        // --- 5. TECHNICAL ---
        checks.push({
            id: 'schema-status',
            label: 'Schema Markup Health',
            passed: seoData.autoGenerateSchema,
            priority: 'critical',
            score: 5,
            desc: seoData.autoGenerateSchema ? 'Auto-schema is active.' : 'Enable auto-generate schema for better Google visibility.'
        });
        if (seoData.autoGenerateSchema) score += 5;

        setChecklist(checks);
        setAnalysisScore(Math.min(score, 100));
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);

        try {
            // Use direct backend URL (bypass Next.js proxy) so auth cookie is forwarded correctly
            // This matches the pattern used by Package Form and Destination Form
            const directBase = typeof window !== 'undefined' && window.location.hostname === 'localhost'
                ? 'http://localhost:5000'
                : '';
    
            let endpoint = '';
            if (type === 'package') endpoint = `${directBase}/api/packages/${id}`;
            else if (type === 'destination') endpoint = `${directBase}/api/destinations/${id}`;
            else if (type === 'page') endpoint = `${directBase}/api/pages/id/${id}`;
            else if (type === 'global') endpoint = `${directBase}/api/settings`;
    
            const { __v, ...itemWithoutVersion } = item || {};
            let payload = {};
            
            if (type === 'global') {
                payload = {
                    ...itemWithoutVersion,
                    globalSeo: {
                        ...itemWithoutVersion.globalSeo,
                        defaultTitle: seoData.title,
                        defaultDescription: seoData.description,
                        defaultKeywords: seoData.keywords,
                        defaultOgImage: seoData.ogImage,
                        // Update branding fields (Mapping fix)
                        siteName: seoData.siteName || 'Yatravi',
                        titleSeparator: seoData.titleSeparator || '|',
                        twitterHandle: itemWithoutVersion.globalSeo?.twitterHandle || '@yatravi'
                    }
                };
            } else {
                payload = {
                    ...itemWithoutVersion,
                    seo: seoData
                };
            }
    
            const res = await fetch(endpoint, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
                credentials: 'include'
            });

            if (!res.ok) {
                const errData = await res.json().catch(() => ({}));
                throw new Error(errData.message || `Server error: ${res.status}`);
            }
            alert('Advanced SEO Settings Saved Successfully!');
        } catch (error: any) {
            console.error('Save failed:', error);
            alert(`Failed to save SEO settings: ${error.message}`);
        } finally {
            setSaving(false);
        }
    };

    const checkLiveRank = async () => {
        if (!seoData.focusKeyword) {
            alert('Please enter a focus keyword first');
            return;
        }

        setIsCheckingRank(true);
        try {
            const res = await fetch(`${API_BASE_URL}/api/admin/seo-tools/check-rank`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    keyword: seoData.focusKeyword,
                    type,
                    id
                }),
                credentials: 'include'
            });

            if (!res.ok) {
                const errData = await res.json();
                throw new Error(errData.message || 'Check failed');
            }

            const data = await res.json();
            setRankData(data);
            
            if (data.rank > 0 && data.rank <= 3) {
                setShowConfetti(true);
                setTimeout(() => setShowConfetti(false), 5000);
            }

            alert(data.rank > 0 ? `Live Rank Found: #${data.rank}` : "Rank Not Found in Top 100.");
        } catch (error: any) {
            console.error('Rank Check Error:', error);
            alert(error.message);
        } finally {
            setIsCheckingRank(false);
        }
    };
    const generateLsi = async () => {
        if (!seoData.focusKeyword) {
            alert('Please enter a focus keyword first');
            return;
        }

        try {
            setIsGeneratingLsi(true);
            const res = await fetch(`${API_BASE_URL}/api/admin/seo-tools/generate-lsi`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    keyword: seoData.focusKeyword,
                    type,
                    title: item?.title || item?.name
                }),
                credentials: 'include'
            });

            if (!res.ok) throw new Error('AI failed to generate keywords');
            
            const data = await res.json();
            setLsiKeywords(data.keywords || []);
        } catch (error) {
            console.error('LSI Error:', error);
            alert('AI is currently busy, try again later');
        } finally {
            setIsGeneratingLsi(false);
        }
    };

    const addLsiToKeywords = (keyword: string) => {
        const currentKeywords = seoData.keywords.split(',').map(k => k.trim()).filter(Boolean);
        if (currentKeywords.includes(keyword)) {
            return;
        }
        
        const newKeywords = [...currentKeywords, keyword].join(', ');
        setSeoData({ ...seoData, keywords: newKeywords });
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

    const generateQuickLinks = () => {
        const subject = item?.title || item?.name || '';
        if (!subject) return;

        const cities = ["Mumbai", "Delhi", "Bangalore", "Ahmedabad", "Kolkata", "Hyderabad", "Pune", "Surat", "Jaipur", "Lucknow", "Chennai", "Chandigarh", "Amritsar", "Ludhiana", "Kanpur"];
        const variations = ["Packages from", "Tour from", "Holidays from", "Trip from"];
        const otherPhrases = [
            "Itinerary", "Couple Package", "Family Trip", "7 Days Package", 
            "5 Nights Package", "6 Nights Package", "Luxury Package", 
            "Budget Tour", "Best Time to Visit", "Visa for Indians", 
            "Cheap Packages", "Customized Tour", "Top Places to visit in"
        ];

        const generated: { label: string, url: string }[] = [];
        const slug = item?.slug || '';
        const baseUrl = type === 'package' ? `/packages/${slug}` : `/destination/${slug}`;

        // 1. City Variations (Variations + Subject + City)
        cities.forEach(city => {
            const verb = variations[Math.floor(Math.random() * variations.length)];
            generated.push({
                label: `${subject} ${verb} ${city}`,
                url: baseUrl
            });
        });

        // 2. Keyword Variations
        otherPhrases.forEach(phrase => {
            generated.push({
                label: phrase.includes('visit') ? `${phrase} ${subject}` : `${subject} ${phrase}`,
                url: baseUrl
            });
        });

        setSeoData({ ...seoData, quickLinks: generated.slice(0, 35) });
        alert(`Generated ${generated.slice(0, 35).length} SEO Quick Links! Click Save to apply.`);
    };

    const addQuickLink = () => {
        setSeoData({ ...seoData, quickLinks: [...seoData.quickLinks, { label: '', url: type === 'package' ? `/packages/${item?.slug}` : `/destination/${item?.slug}` }] });
    };

    const removeQuickLink = (index: number) => {
        setSeoData({ ...seoData, quickLinks: seoData.quickLinks.filter((_, i) => i !== index) });
    };

    const updateQuickLink = (index: number, field: 'label' | 'url', value: string) => {
        const newLinks = [...seoData.quickLinks];
        newLinks[index][field] = value;
        setSeoData({ ...seoData, quickLinks: newLinks });
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
                            { id: 'links', label: 'Quick Links (SEO)', icon: Plus },
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
                                
                                {type === 'global' && (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-8 p-5 bg-brand/5 rounded-3xl border border-brand/10">
                                        <div className="md:col-span-2">
                                            <p className="text-[10px] font-black text-brand uppercase tracking-widest mb-4">Site Identity Setting</p>
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">Global Site Name</label>
                                            <input
                                                type="text"
                                                value={seoData.siteName}
                                                onChange={(e) => setSeoData({ ...seoData, siteName: e.target.value })}
                                                placeholder="e.g. Yatravi"
                                                className="w-full px-4 py-3 rounded-xl bg-white border border-gray-100 focus:border-brand focus:ring-1 focus:ring-brand outline-none transition-all font-medium"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">Title Separator</label>
                                            <input
                                                type="text"
                                                value={seoData.titleSeparator}
                                                onChange={(e) => setSeoData({ ...seoData, titleSeparator: e.target.value })}
                                                placeholder="e.g. | or -"
                                                className="w-full px-4 py-3 rounded-xl bg-white border border-gray-100 focus:border-brand focus:ring-1 focus:ring-brand outline-none transition-all font-medium"
                                            />
                                        </div>
                                    </div>
                                )}

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
                                        <div className="flex justify-between items-center mb-2">
                                            <label className="block text-xs font-bold uppercase tracking-wider text-gray-500">Keywords</label>
                                            <button 
                                                onClick={generateLsi}
                                                disabled={isGeneratingLsi || !seoData.focusKeyword}
                                                className="text-[10px] font-bold text-brand hover:text-brand-dark uppercase tracking-widest flex items-center gap-1.5 transition-all disabled:opacity-50"
                                            >
                                                {isGeneratingLsi ? (
                                                    <><span className="animate-spin">🌀</span> Generating...</>
                                                ) : (
                                                    <><TrendingUp className="w-3 h-3" /> Get AI LSI Suggestions</>
                                                )}
                                            </button>
                                        </div>
                                        <input
                                            type="text"
                                            value={seoData.keywords}
                                            onChange={(e) => setSeoData({ ...seoData, keywords: e.target.value })}
                                            placeholder="Comma separated..."
                                            className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-100 focus:border-gray-900 focus:ring-1 focus:ring-gray-900 outline-none transition-all"
                                        />
                                        
                                        {/* LSI Keywords Cloud - Now in General Tab */}
                                        {lsiKeywords.length > 0 && (
                                            <div className="mt-4 p-4 bg-gray-50/50 rounded-2xl border border-gray-100 animate-fade-in">
                                                <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-3">AI Suggested Related Keywords</p>
                                                <div className="flex flex-wrap gap-2">
                                                    {lsiKeywords.map((tag, idx) => (
                                                        <button
                                                            key={idx}
                                                            onClick={() => addLsiToKeywords(tag)}
                                                            className="px-3 py-1.5 bg-white border border-gray-100 rounded-lg text-[11px] font-medium text-gray-700 hover:border-brand hover:text-brand transition-all flex items-center gap-1.5 group"
                                                        >
                                                            <Plus className="w-3 h-3 text-gray-300 group-hover:text-brand" />
                                                            {tag}
                                                        </button>
                                                    ))}
                                                </div>
                                                <p className="text-[9px] text-gray-400 mt-3 italic">Click any keyword to add it to your main Keywords list above.</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Google Preview Upgrade */}
                            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                                <div className="flex items-center justify-between mb-6">
                                    <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                                        <Globe className="w-5 h-5 text-brand" /> Google Search Preview
                                    </h2>
                                    <div className="flex bg-gray-100 p-1 rounded-xl">
                                        <button
                                            onClick={() => setPreviewDevice('mobile')}
                                            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                                                previewDevice === 'mobile' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'
                                            }`}
                                        >
                                            <Smartphone className="w-3.5 h-3.5" /> Mobile
                                        </button>
                                        <button
                                            onClick={() => setPreviewDevice('desktop')}
                                            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                                                previewDevice === 'desktop' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'
                                            }`}
                                        >
                                            <Monitor className="w-3.5 h-3.5" /> Desktop
                                        </button>
                                    </div>
                                </div>

                                <div className={`mx-auto transition-all duration-500 ${previewDevice === 'mobile' ? 'max-w-sm' : 'max-w-2xl'}`}>
                                    <div className={`bg-white rounded-2xl border border-gray-100 shadow-xl p-5 ${previewDevice === 'mobile' ? 'aspect-[4/3]' : ''}`}>
                                        {previewDevice === 'mobile' ? (
                                            /* Mobile Layout */
                                            <div className="animate-fade-in">
                                                <div className="flex items-center gap-3 mb-2">
                                                    <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-[10px] font-bold text-brand border border-gray-100 shadow-sm">
                                                        Y
                                                    </div>
                                                    <div className="overflow-hidden">
                                                        <p className="text-[12px] font-medium text-[#202124] leading-tight">Yatravi</p>
                                                        <p className="text-[10px] text-[#4d5156] truncate">https://{hostname} › {type === 'package' ? 'packages' : 'destinations'}</p>
                                                    </div>
                                                    <div className="ml-auto">
                                                        <span className="text-gray-400">⋮</span>
                                                    </div>
                                                </div>
                                                <h3 className="text-[20px] text-[#1a0dab] font-medium leading-tight mb-2">
                                                    {truncateText(seoData.title || item?.title || 'Your Title Here', 60)}
                                                </h3>
                                                <p className="text-[14px] text-[#4d5156] leading-relaxed line-clamp-3">
                                                    {truncateText(seoData.description || 'Provide a compelling description to improve click-through rate on Google.', 160)}
                                                </p>
                                            </div>
                                        ) : (
                                            /* Desktop Layout */
                                            <div className="animate-fade-in">
                                                <div className="mb-1">
                                                    <cite className="text-[14px] text-[#202124] not-italic">
                                                        https://{hostname} <span className="text-[#5f6368]">› {type === 'package' ? 'packages' : 'destinations'} › {item?.slug}</span>
                                                    </cite>
                                                </div>
                                                <h3 className="text-[20px] text-[#1a0dab] hover:underline cursor-pointer font-medium mb-1 truncate">
                                                    {truncateText(seoData.title || item?.title || 'Your Title Here', 60)}
                                                </h3>
                                                <p className="text-[14px] text-[#4d5156] leading-relaxed max-w-[600px]">
                                                    {truncateText(seoData.description || 'Provide a compelling description to improve click-through rate on Google.', 160)}
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                    <div className="mt-4 flex items-center justify-center gap-6">
                                        <div className="flex items-center gap-2">
                                            <div className={`w-2 h-2 rounded-full ${seoData.title.length > 60 ? 'bg-red-500' : 'bg-green-500'}`} />
                                            <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Title Health</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <div className={`w-2 h-2 rounded-full ${seoData.description.length > 160 ? 'bg-red-500' : 'bg-green-500'}`} />
                                            <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Desc Health</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Content Analysis Tab */}
                    {activeTab === 'analysis' && (
                        <div className="space-y-6 animate-fade-in">
                            {/* Focus Keyword Header */}
                            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                                <div className="flex flex-col md:flex-row gap-6 items-center">
                                    <div className="flex-1 w-full">
                                        <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2">Focus Keyword</label>
                                        <div className="relative">
                                            <input
                                                type="text"
                                                value={seoData.focusKeyword}
                                                onChange={(e) => setSeoData({ ...seoData, focusKeyword: e.target.value })}
                                                placeholder="e.g. Hong Kong Tour Package"
                                                className="w-full px-5 py-4 rounded-2xl bg-gray-50 border border-gray-100 focus:border-brand focus:ring-4 focus:ring-brand/5 outline-none transition-all text-lg font-medium"
                                            />
                                            <div className="absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-white rounded-lg shadow-sm border border-gray-100">
                                                <TrendingUp className="w-5 h-5 text-brand" />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="shrink-0 flex items-center gap-6 p-6 bg-gray-900 rounded-3xl text-white shadow-xl shadow-gray-200">
                                        <div className="relative w-20 h-20">
                                            <svg className="w-full h-full transform -rotate-90">
                                                <circle cx="40" cy="40" r="36" fill="transparent" stroke="rgba(255,255,255,0.1)" strokeWidth="8" />
                                                <circle cx="40" cy="40" r="36" fill="transparent" stroke="currentColor" strokeWidth="8"
                                                    strokeDasharray={226}
                                                    strokeDashoffset={226 - (226 * analysisScore) / 100}
                                                    className={`${analysisScore >= 80 ? 'text-green-400' : analysisScore >= 50 ? 'text-yellow-400' : 'text-red-400'} transition-all duration-1000`}
                                                />
                                            </svg>
                                            <div className="absolute inset-0 flex items-center justify-center font-bold text-2xl">
                                                {analysisScore}
                                            </div>
                                        </div>
                                        <div>
                                            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Overall Score</p>
                                            <p className="text-xl font-bold">{analysisScore >= 80 ? 'Optimized' : analysisScore >= 50 ? 'Developing' : 'Unoptimized'}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Checklist Groups */}
                            <div className="grid grid-cols-1 gap-6">
                                {/* 1. Critical Errors */}
                                {checklist.some(c => !c.passed && c.priority === 'critical') && (
                                    <div className="bg-red-50/30 rounded-3xl border border-red-100 p-6">
                                        <h3 className="text-red-900 font-bold mb-4 flex items-center gap-2">
                                            <AlertTriangle className="w-5 h-5" /> Critical Fixes Required
                                        </h3>
                                        <div className="space-y-3">
                                            {checklist.filter(c => !c.passed && c.priority === 'critical').map(item => (
                                                <ChecklistItem key={item.id} item={item} />
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* 2. Recommended Improvements */}
                                {checklist.some(c => !c.passed && c.priority === 'recommended') && (
                                    <div className="bg-yellow-50/30 rounded-3xl border border-yellow-100 p-6">
                                        <h3 className="text-yellow-900 font-bold mb-4 flex items-center gap-2">
                                            <Info className="w-5 h-5" /> Recommended Improvements
                                        </h3>
                                        <div className="space-y-3">
                                            {checklist.filter(c => !c.passed && c.priority === 'recommended').map(item => (
                                                <ChecklistItem key={item.id} item={item} />
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* 3. Completed Tasks */}
                                <div className="bg-green-50/30 rounded-3xl border border-green-100 p-6">
                                    <h3 className="text-green-900 font-bold mb-4 flex items-center gap-2">
                                        <CheckCircle className="w-5 h-5" /> Completed Tasks
                                    </h3>
                                    <div className="space-y-3">
                                        {checklist.filter(c => c.passed).length > 0 ? (
                                            checklist.filter(c => c.passed).map(item => (
                                                <ChecklistItem key={item.id} item={item} />
                                            ))
                                        ) : (
                                            <p className="text-sm text-green-700/60 italic">No tasks completed yet. Start fixing issues to see them here.</p>
                                        )}
                                    </div>
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

                    {/* Quick Links Tab */}
                    {activeTab === 'links' && (
                        <div className="space-y-6 animate-fade-in">
                            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                                <div className="flex items-center justify-between mb-8">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2.5 bg-brand/10 text-brand rounded-xl">
                                            <Plus className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <h2 className="text-xl font-bold text-gray-900">SEO Quick Links</h2>
                                            <p className="text-sm text-gray-500">Add city-wise variations and keywords for better ranking</p>
                                        </div>
                                    </div>
                                    <div className="flex gap-3">
                                        <Button 
                                            variant="outline" 
                                            onClick={generateQuickLinks}
                                            className="border-brand/20 text-brand hover:bg-brand/5"
                                        >
                                            <RefreshCw className="w-4 h-4 mr-2" /> Magic Generate (30+)
                                        </Button>
                                        <Button onClick={addQuickLink} variant="outline" className="bg-gray-50">
                                            <Plus className="w-4 h-4 mr-2" /> Add Manual
                                        </Button>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-h-[600px] overflow-y-auto pr-3 custom-scrollbar">
                                    {seoData.quickLinks?.map((link, idx) => (
                                        <div key={idx} className="group p-4 bg-gray-50/50 rounded-2xl border border-gray-100 hover:border-brand/30 hover:bg-white transition-all relative">
                                            <div className="space-y-3">
                                                <input
                                                    type="text"
                                                    value={link.label}
                                                    onChange={(e) => updateQuickLink(idx, 'label', e.target.value)}
                                                    placeholder="e.g. Dubai Tour from Mumbai"
                                                    className="w-full bg-transparent text-sm font-bold text-gray-900 focus:outline-none"
                                                />
                                                <input
                                                    type="text"
                                                    value={link.url}
                                                    onChange={(e) => updateQuickLink(idx, 'url', e.target.value)}
                                                    placeholder="/packages/dubai..."
                                                    className="w-full bg-transparent text-[10px] text-gray-400 font-mono focus:outline-none"
                                                />
                                            </div>
                                            <button
                                                onClick={() => removeQuickLink(idx)}
                                                className="absolute top-2 right-2 p-1.5 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-lg opacity-0 group-hover:opacity-100 transition-all"
                                            >
                                                <Trash2 className="w-3.5 h-3.5" />
                                            </button>
                                        </div>
                                    ))}
                                    {(!seoData.quickLinks || seoData.quickLinks.length === 0) && (
                                        <div className="col-span-full py-16 text-center bg-gray-50/50 rounded-3xl border-2 border-dashed border-gray-200">
                                            <p className="text-gray-400 italic">No links generated yet. Click "Magic Generate" to build them instantly! ✨</p>
                                        </div>
                                    )}
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
                                    <div className="bg-white border border-gray-100 p-5 rounded-2xl shadow-sm">
                                        <div className="flex items-center justify-between mb-4">
                                            <div className="flex items-center gap-3">
                                                <div className={`p-2 rounded-lg ${seoData.autoGenerateSchema ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400'}`}>
                                                    <RefreshCw className={`w-5 h-5 ${seoData.autoGenerateSchema && 'animate-spin-slow'}`} />
                                                </div>
                                                <div>
                                                    <h3 className="font-bold text-gray-900">Auto-Generate Schema</h3>
                                                    <p className="text-xs text-gray-500">Automatically build JSON-LD based on content</p>
                                                </div>
                                            </div>
                                            <button
                                                onClick={() => setSeoData({ ...seoData, autoGenerateSchema: !seoData.autoGenerateSchema })}
                                                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${seoData.autoGenerateSchema ? 'bg-green-500' : 'bg-gray-300'}`}
                                            >
                                                <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${seoData.autoGenerateSchema ? 'translate-x-6' : 'translate-x-1'}`} />
                                            </button>
                                        </div>

                                        {seoData.autoGenerateSchema ? (
                                            <div className="space-y-4 animate-fade-in">
                                                <div className="p-4 bg-blue-50/50 rounded-xl border border-blue-100/50">
                                                    <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-3">Enabled Schema Types</p>
                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                                        {[
                                                            { 
                                                                id: type === 'global' ? 'Organization' : (type === 'package' ? 'Product' : (type === 'page' ? 'Organization' : 'TouristDestination')), 
                                                                label: type === 'global' ? 'Travel Agency (Brand Info)' : (type === 'package' ? 'Product (Price & Rating)' : (type === 'page' ? 'Brand Info (Company Profile)' : 'Tourist Destination')) 
                                                            },
                                                            { id: 'FAQPage', label: type === 'page' ? 'FAQ (Q&A Sections)' : (type === 'global' ? 'FAQ Page (Homepage Q&A)' : 'FAQ Page (Google Q&A)') },
                                                            { 
                                                                id: type === 'global' ? 'WebSite' : 'BreadcrumbList', 
                                                                label: type === 'global' ? 'WebSite (Site Search)' : 'Breadcrumb (Site Path)' 
                                                            }
                                                        ].map((st) => (
                                                            <label key={st.id} className="flex items-center gap-3 p-3 bg-white border border-gray-100 rounded-xl cursor-pointer hover:border-brand transition-all">
                                                                <input
                                                                    type="checkbox"
                                                                    checked={seoData.schemaTypes.includes(st.id)}
                                                                    onChange={(e) => {
                                                                        const types = [...seoData.schemaTypes];
                                                                        if (e.target.checked) types.push(st.id);
                                                                        else return setSeoData({ ...seoData, schemaTypes: types.filter(t => t !== st.id) });
                                                                        setSeoData({ ...seoData, schemaTypes: types });
                                                                    }}
                                                                    className="w-4 h-4 rounded border-gray-300 text-brand focus:ring-brand"
                                                                />
                                                                <span className="text-xs font-medium text-gray-700">{st.label}</span>
                                                            </label>
                                                        ))}
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-2 p-3 bg-green-50 rounded-xl border border-green-100">
                                                    <CheckCircle className="w-4 h-4 text-green-600" />
                                                    <p className="text-[11px] text-green-700 font-medium">Smart generator will build the scripts during Save.</p>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="pt-2 animate-fade-in">
                                                <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">Manual JSON-LD Code</label>
                                                <textarea
                                                    rows={10}
                                                    value={seoData.jsonLd}
                                                    onChange={(e) => setSeoData({ ...seoData, jsonLd: e.target.value })}
                                                    className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-100 focus:border-gray-900 font-mono text-[11px] outline-none transition-all"
                                                    placeholder='{ "@context": "https://schema.org", ... }'
                                                />
                                                <div className="mt-3 p-3 bg-yellow-50 rounded-xl border border-yellow-100 flex items-start gap-2">
                                                    <AlertTriangle className="w-4 h-4 text-yellow-600 mt-0.5" />
                                                    <p className="text-[10px] text-yellow-700">Manual mode enabled. Code will not be automatically updated from content.</p>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

const truncateText = (text: string, limit: number) => {
    if (text.length <= limit) return text;
    return text.substring(0, limit) + "...";
};

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

const ChecklistItem = ({ item }: { item: any }) => (
    <div className={`flex items-start gap-4 p-4 rounded-2xl transition-all border ${
        item.passed 
            ? 'bg-white border-green-100 opacity-80' 
            : item.priority === 'critical' 
                ? 'bg-white border-red-100 shadow-sm' 
                : 'bg-white border-yellow-100'
    }`}>
        <div className={`shrink-0 w-6 h-6 rounded-full flex items-center justify-center mt-0.5 ${
            item.passed ? 'bg-green-500 text-white' : item.priority === 'critical' ? 'bg-red-100 text-red-600' : 'bg-yellow-100 text-yellow-600'
        }`}>
            {item.passed ? <CheckCircle className="w-4 h-4" /> : item.priority === 'critical' ? <AlertTriangle className="w-3.5 h-3.5" /> : <Info className="w-3.5 h-3.5" />}
        </div>
        <div className="flex-1">
            <div className="flex items-center justify-between">
                <h4 className={`text-sm font-bold ${item.passed ? 'text-gray-500' : 'text-gray-900'}`}>{item.label}</h4>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider ${
                    item.passed ? 'bg-gray-100 text-gray-400' : item.priority === 'critical' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'
                }`}>
                    {item.passed ? 'Done' : item.priority}
                </span>
            </div>
            <p className="text-xs text-gray-500 mt-1">{item.desc}</p>
        </div>
    </div>
);
