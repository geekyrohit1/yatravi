"use client";
// Triggering Rebuild - Premium UI Slider v2


import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, Trash2, Save, Loader2, GripVertical, MapPin, ChevronUp, ChevronDown, Image as ImageIcon, Star, X, Upload, Search } from 'lucide-react';
import { API_BASE_URL } from '@/constants';

interface HeroSlide {
    destinationId: string;
    enabled: boolean;
    order: number;
    // Populated fields (from API)
    name?: string;
    slug?: string;
    heroImage?: string;
    tagline?: string;
    startingPrice?: number;
    // Custom overrides
    customTitle?: string;
    customTagline?: string;
    customImage?: string;
    customMobileImage?: string;
}

interface Destination {
    _id: string;
    name: string;
    slug: string;
    heroImage: string;
    verticalImage?: string;
    tagline?: string;
    startingPrice?: number;
}

interface HomepageSection {
    _id?: string;
    key: string;
    title: string;
    subtitle: string;
    enabled: boolean;
    order: number;
    type: 'packages' | 'destinations' | 'cards' | 'offers' | 'media' | 'slider' | 'links';
    mediaUrl?: string;
    mobileMediaUrl?: string;
    mediaSlides?: { desktop: string; mobile: string }[];
    isVideo?: boolean;
    filterType?: string;
    destinationItems?: any[];
    cards?: any[];
    queryConfig?: {
        tag: string;
        minPrice?: number;
        maxPrice?: number;
        limit?: number;
    };
}

interface FAQ {
    _id?: string;
    question: string;
    answer: string;
    order: number;
}

interface LinkItem {
    label: string;
    url: string;
}

interface HomepageConfig {
    heroSlider: HeroSlide[];
    sections: HomepageSection[];
    faq: FAQ[];
    quickLinks?: LinkItem[];
    importantLinks?: LinkItem[];
    mobileHeroVideo?: string;
    showMobileHeroVideo?: boolean;
}

export default function HomepageConfigPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [uploading, setUploading] = useState(false);

    // Bypass Next.js proxy for large/HD uploads by sending directly to backend
    const IS_LOCALHOST = typeof window !== 'undefined' && 
        (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');
    const UPLOAD_API_URL = IS_LOCALHOST
        ? 'http://localhost:5000/api/upload'
        : `/api/upload`;
    const [destinations, setDestinations] = useState<Destination[]>([]);
    const [config, setConfig] = useState<HomepageConfig>({
        heroSlider: [],
        sections: [],
        faq: [],
        quickLinks: [],
        importantLinks: []
    });

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            // Fetch destinations and config in parallel
            const [destRes, configRes] = await Promise.all([
                fetch(`${API_BASE_URL}/api/destinations`),
                fetch(`${API_BASE_URL}/api/homepage?admin=true`, { credentials: 'include' })
            ]);

            const destData = await destRes.json();
            const configData = await configRes.json();

            setDestinations(destData);

            // Map raw config to include populated destination data
            const mappedSlider = configData.heroSlider?.map((slide: any) => ({
                destinationId: slide.destinationId?._id || slide.destinationId,
                enabled: slide.enabled ?? true,
                order: slide.order ?? 0,
                name: slide.destinationId?.name || slide.name,
                slug: slide.destinationId?.slug || slide.slug,
                heroImage: slide.destinationId?.heroImage || slide.heroImage,
                tagline: slide.destinationId?.tagline || slide.tagline,
                startingPrice: slide.destinationId?.startingPrice || slide.startingPrice,
                customTitle: slide.customTitle || '',
                customTagline: slide.customTagline || '',
                customImage: slide.customImage || ''
            })) || [];

            setConfig({
                ...configData,
                heroSlider: mappedSlider
            });
        } catch (error) {
            console.error('Failed to fetch data', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            // Prepare slides for saving (only destinationId, enabled, order)
            const slidesToSave = config.heroSlider.map(slide => ({
                destinationId: slide.destinationId,
                enabled: slide.enabled,
                order: slide.order,
                customTagline: slide.customTagline,
                customImage: slide.customImage,
                customMobileImage: slide.customMobileImage
            }));

            const payload = {
                heroSlider: slidesToSave,
                sections: config.sections.map(s => ({
                    ...s,
                    // Ensure required fields are present
                    mediaUrl: s.mediaUrl || '',
                    mobileMediaUrl: s.mobileMediaUrl || '',
                    mediaSlides: s.mediaSlides || [],
                    isVideo: s.isVideo || false
                })),
                faq: config.faq,
                quickLinks: config.quickLinks || [],
                importantLinks: config.importantLinks || [],
                mobileHeroVideo: config.mobileHeroVideo || '',
                showMobileHeroVideo: config.showMobileHeroVideo || false
            };

            const res = await fetch(`${API_BASE_URL}/api/homepage`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
                credentials: 'include'
            });

            if (res.ok) {
                alert('Homepage configuration saved!');
                fetchData(); // Refresh to get updated data
                router.refresh();
            } else {
                const data = await res.json();
                alert('Failed to save configuration: ' + (data.message || 'Unknown error'));
            }
        } catch (error) {
            console.error('Save error:', error);
            alert('Error saving configuration');
        } finally {
            setSaving(false);
        }
    };

    const handleSlideUpload = async (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const formData = new FormData();
        formData.append('image', file);

        setUploading(true);
        try {
            const res = await fetch(UPLOAD_API_URL, {
                method: 'POST',
                body: formData,
                credentials: 'include'
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.message || 'Upload failed');

            const newSlider = [...config.heroSlider];
            newSlider[index].customImage = data.url;
            setConfig({ ...config, heroSlider: newSlider });
        } catch (error) {
            alert('Image upload failed');
        } finally {
            setUploading(false);
        }
    };

    const updateSlideField = (index: number, field: keyof HeroSlide, value: string) => {
        const newSlider = [...config.heroSlider];
        (newSlider[index] as any)[field] = value;
        setConfig({ ...config, heroSlider: newSlider });
    };

    const handleSlideMobileUpload = async (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const formData = new FormData();
        formData.append('image', file);

        setUploading(true);
        try {
            const res = await fetch(UPLOAD_API_URL, {
                method: 'POST',
                body: formData,
                credentials: 'include'
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.message || 'Upload failed');

            const newSlider = [...config.heroSlider];
            newSlider[index].customMobileImage = data.url;
            setConfig({ ...config, heroSlider: newSlider });
        } catch (error) {
            alert('Mobile image upload failed');
        } finally {
            setUploading(false);
        }
    };

    // Hero Slider functions
    const addDestinationSlide = (destId: string) => {
        const dest = destinations.find(d => d._id === destId);
        if (!dest) return;

        // Check if already added
        if (config.heroSlider.some(s => s.destinationId === destId)) {
            alert('This destination is already in the slider');
            return;
        }

        setConfig({
            ...config,
            heroSlider: [...config.heroSlider, {
                destinationId: dest._id,
                enabled: true,
                order: config.heroSlider.length,
                name: dest.name,
                slug: dest.slug,
                heroImage: dest.heroImage,
                tagline: dest.tagline,
                startingPrice: dest.startingPrice,
                customTitle: '',
                customTagline: '',
                customImage: ''
            }]
        });
    };

    const removeSlide = (index: number) => {
        const newSlider = config.heroSlider.filter((_, i) => i !== index);
        // Reorder remaining slides
        newSlider.forEach((slide, i) => slide.order = i);
        setConfig({ ...config, heroSlider: newSlider });
    };

    const toggleSlide = (index: number) => {
        const newSlider = [...config.heroSlider];
        newSlider[index].enabled = !newSlider[index].enabled;
        setConfig({ ...config, heroSlider: newSlider });
    };

    const moveSlide = (index: number, direction: 'up' | 'down') => {
        const newSlider = [...config.heroSlider];
        const targetIndex = direction === 'up' ? index - 1 : index + 1;

        if (targetIndex < 0 || targetIndex >= newSlider.length) return;

        // Swap
        [newSlider[index], newSlider[targetIndex]] = [newSlider[targetIndex], newSlider[index]];

        // Update order numbers
        newSlider.forEach((slide, i) => slide.order = i);

        setConfig({ ...config, heroSlider: newSlider });
    };

    // Section functions
    const updateSection = (index: number, field: keyof HomepageSection, value: any) => {
        const newSections = [...config.sections];
        (newSections[index] as any)[field] = value;
        setConfig({ ...config, sections: newSections });
    };

    const addSection = (key: string, type: string) => {
        if (config.sections.some(s => s.key === key)) {
            alert('This section already exists');
            return;
        }

        const newSection: HomepageSection = {
            key,
            title: key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase()),
            subtitle: '',
            enabled: true,
            order: config.sections.length + 1,
            type: type as any,
            cards: [],
            destinationItems: [],
            queryConfig: { tag: '', limit: 6 }
        };

        setConfig({ ...config, sections: [...config.sections, newSection] });
    };

    const removeSection = (index: number) => {
        if (!confirm('Are you sure you want to delete this section? All its items will be cleared.')) return;
        const newSections = config.sections.filter((_, i) => i !== index);
        // Re-order based on current order
        newSections.sort((a, b) => a.order - b.order).forEach((s, i) => s.order = i + 1);
        setConfig({ ...config, sections: newSections });
    };

    const moveSection = (index: number, direction: 'up' | 'down') => {
        const newSections = [...config.sections].sort((a, b) => a.order - b.order);
        const targetIndex = direction === 'up' ? index - 1 : index + 1;
        if (targetIndex < 0 || targetIndex >= newSections.length) return;

        [newSections[index], newSections[targetIndex]] = [newSections[targetIndex], newSections[index]];
        newSections.forEach((s, i) => s.order = i + 1);
        setConfig({ ...config, sections: newSections });
    };

    const handleCardImageUpload = async (sectionIndex: number, cardIndex: number, e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setUploading(true);
        try {
            const formData = new FormData();
            formData.append('image', file);
            const res = await fetch(UPLOAD_API_URL, {
                method: 'POST',
                body: formData,
                credentials: 'include'
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.message || 'Upload failed');

            const newSections = [...config.sections];
            if (!newSections[sectionIndex].cards) newSections[sectionIndex].cards = [];
            newSections[sectionIndex].cards![cardIndex].image = data.url;
            setConfig({ ...config, sections: newSections });
        } catch (error) {
            alert('Upload failed');
        } finally {
            setUploading(false);
        }
    };

    const handleMediaUpload = async (sectionIndex: number, e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setUploading(true);
        try {
            const formData = new FormData();
            formData.append('image', file);
            const res = await fetch(UPLOAD_API_URL, {
                method: 'POST',
                body: formData,
                credentials: 'include'
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.message || 'Upload failed');

            const newSections = [...config.sections];
            newSections[sectionIndex].mediaUrl = data.url;
            setConfig({ ...config, sections: newSections });
        } catch (error) {
            alert('Upload failed');
        } finally {
            setUploading(false);
        }
    };

    const handleMobileMediaUpload = async (sectionIndex: number, e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setUploading(true);
        try {
            const formData = new FormData();
            formData.append('image', file);
            const res = await fetch(UPLOAD_API_URL, {
                method: 'POST',
                body: formData,
                credentials: 'include'
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.message || 'Upload failed');

            const newSections = [...config.sections];
            newSections[sectionIndex].mobileMediaUrl = data.url;
            setConfig({ ...config, sections: newSections });
        } catch (error) {
            alert('Upload failed');
        } finally {
            setUploading(false);
        }
    };

    const handleMediaSlideUpload = async (sectionIndex: number, slideIndex: number, type: 'desktop' | 'mobile', e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setUploading(true);
        try {
            const formData = new FormData();
            formData.append('image', file);
            const res = await fetch(UPLOAD_API_URL, {
                method: 'POST',
                body: formData,
                credentials: 'include'
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.message || 'Upload failed');

            const newSections = [...config.sections];
            if (!newSections[sectionIndex].mediaSlides) newSections[sectionIndex].mediaSlides = [];
            newSections[sectionIndex].mediaSlides![slideIndex][type] = data.url;
            setConfig({ ...config, sections: newSections });
        } catch (error) {
            alert('Upload failed');
        } finally {
            setUploading(false);
        }
    };

    const handleSliderMobileUpload = async (sectionIndex: number, cardIndex: number, e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setUploading(true);
        try {
            const formData = new FormData();
            formData.append('image', file);
            const res = await fetch(UPLOAD_API_URL, {
                method: 'POST',
                body: formData,
                credentials: 'include'
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.message || 'Upload failed');

            const newSections = [...config.sections];
            if (!newSections[sectionIndex].cards) newSections[sectionIndex].cards = [];
            newSections[sectionIndex].cards[cardIndex].mobileImage = data.url;
            setConfig({ ...config, sections: newSections });
        } catch (error) {
            alert('Upload failed');
        } finally {
            setUploading(false);
        }
    };

    // FAQ functions
    const addFaq = () => {
        setConfig({
            ...config,
            faq: [...config.faq, {
                question: '',
                answer: '',
                order: config.faq.length
            }]
        });
    };

    const removeFaq = (index: number) => {
        const newFaq = config.faq.filter((_, i) => i !== index);
        setConfig({ ...config, faq: newFaq });
    };

    const updateFaq = (index: number, field: keyof FAQ, value: string | number) => {
        const newFaq = [...config.faq];
        (newFaq[index] as any)[field] = value;
        setConfig({ ...config, faq: newFaq });
    };

    // Get available destinations (not yet in slider)
    const availableDestinations = destinations.filter(
        d => !config.heroSlider.some(s => s.destinationId === d._id)
    );

    const formatPrice = (price?: number) => {
        if (!price) return '—';
        return new Intl.NumberFormat('en-IN').format(price);
    };

    // SEO Links functions
    const addQuickLink = (type: 'quickLinks' | 'importantLinks') => {
        setConfig({
            ...config,
            [type]: [...(config[type] || []), { label: '', url: '' }]
        });
    };

    const removeQuickLink = (type: 'quickLinks' | 'importantLinks', index: number) => {
        const newList = (config[type] || []).filter((_, i) => i !== index);
        setConfig({ ...config, [type]: newList });
    };

    const updateQuickLink = (type: 'quickLinks' | 'importantLinks', index: number, field: keyof LinkItem, value: string) => {
        const newList = [...(config[type] || [])];
        newList[index] = { ...newList[index], [field]: value };
        setConfig({ ...config, [type]: newList });
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-pulse text-gray-400">Loading configuration...</div>
            </div>
        );
    }

    return (
        <div className="space-y-8 pb-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 py-6 border-b border-gray-100 mb-8">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-gray-900">Homepage Configuration</h1>
                    <p className="text-gray-500 mt-1">Manage hero slider, featured sections, and FAQs</p>
                </div>
                <Button
                    onClick={handleSave}
                    disabled={saving}
                    className="bg-[#CD1C18] hover:bg-[#9B1313] text-white rounded-xl shadow-lg shadow-[#CD1C18]/20 transition-all hover:shadow-[#CD1C18]/40 px-6 h-11"
                >
                    {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    <Save className="mr-2 h-4 w-4" />
                    Save Changes
                </Button>
            </div>

            <Tabs defaultValue="hero" className="w-full">
                <TabsList className="w-full justify-start border-b border-gray-200 bg-transparent p-0 h-auto gap-8 mb-8">
                    <TabsTrigger
                        value="hero"
                        className="rounded-none border-b-2 border-transparent px-0 py-3 text-sm font-medium text-gray-500 hover:text-gray-700 data-[state=active]:border-[#CD1C18] data-[state=active]:text-[#CD1C18] data-[state=active]:bg-transparent transition-all"
                    >
                        Hero Slider
                    </TabsTrigger>
                    <TabsTrigger
                        value="sections"
                        className="rounded-none border-b-2 border-transparent px-0 py-3 text-sm font-medium text-gray-500 hover:text-gray-700 data-[state=active]:border-[#CD1C18] data-[state=active]:text-[#CD1C18] data-[state=active]:bg-transparent transition-all"
                    >
                        Sections
                    </TabsTrigger>
                    <TabsTrigger
                        value="faq"
                        className="rounded-none border-b-2 border-transparent px-0 py-3 text-sm font-medium text-gray-500 hover:text-gray-700 data-[state=active]:border-[#CD1C18] data-[state=active]:text-[#CD1C18] data-[state=active]:bg-transparent transition-all"
                    >
                        FAQ
                    </TabsTrigger>
                    <TabsTrigger
                        value="seo-links"
                        className="rounded-none border-b-2 border-transparent px-0 py-3 text-sm font-medium text-gray-500 hover:text-gray-700 data-[state=active]:border-[#CD1C18] data-[state=active]:text-[#CD1C18] data-[state=active]:bg-transparent transition-all"
                    >
                        SEO Links
                    </TabsTrigger>
                </TabsList>

                {/* HERO SLIDER TAB */}
                <TabsContent value="hero" className="space-y-8 animate-in fade-in-50 slide-in-from-bottom-2 duration-300">
                    {/* Add Destination */}
                    <Card className="border-none shadow-sm ring-1 ring-gray-100 rounded-2xl overflow-hidden bg-white">
                        <CardHeader className="bg-gray-50/50 border-b border-gray-100 pb-4">
                            <CardTitle className="text-base font-semibold text-gray-900">Add Destination to Slider</CardTitle>
                            <CardDescription>Select destinations to display in the main hero slider</CardDescription>
                        </CardHeader>
                        <CardContent className="p-6">
                            {availableDestinations.length > 0 ? (
                                <div className="flex flex-wrap gap-3">
                                    {availableDestinations.map(dest => (
                                        <button
                                            key={dest._id}
                                            onClick={() => addDestinationSlide(dest._id)}
                                            className="group flex items-center gap-3 pr-4 pl-2 py-2 rounded-xl border border-gray-200 bg-white hover:border-[#CD1C18] hover:shadow-md transition-all text-left"
                                        >
                                            <div className="w-10 h-10 rounded-lg bg-gray-100 overflow-hidden">
                                                {dest.heroImage && (
                                                    <img src={dest.heroImage} alt="" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                                                )}
                                            </div>
                                            <span className="text-sm font-medium text-gray-700 group-hover:text-[#CD1C18]">{dest.name}</span>
                                            <Plus className="w-4 h-4 text-gray-400 group-hover:text-[#CD1C18]" />
                                        </button>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-4 bg-gray-50 rounded-xl border border-dashed border-gray-200">
                                    <p className="text-sm text-gray-500">All available destinations are already in the slider.</p>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Current Slides */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-bold text-gray-900 px-1">Current Slides ({config.heroSlider.length})</h3>

                        {config.heroSlider.length === 0 ? (
                            <div className="py-16 text-center rounded-3xl border-2 border-dashed border-gray-200 bg-gray-50/50">
                                <MapPin className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                                <h3 className="text-lg font-medium text-gray-900">No Slides Added</h3>
                                <p className="text-gray-500 mt-1">Select destinations above to create your first hero slide</p>
                            </div>
                        ) : (
                            <div className="grid gap-4">
                                {config.heroSlider
                                    .sort((a, b) => a.order - b.order)
                                    .map((slide, index) => {
                                        const dest = destinations.find(d => d._id === slide.destinationId);
                                        const displayName = slide.name || dest?.name || 'Unknown';
                                        const displayImage = slide.heroImage || dest?.heroImage;
                                        const displayTagline = slide.tagline || dest?.tagline;
                                        const displayPrice = slide.startingPrice || dest?.startingPrice;

                                        // Determine what to show in preview
                                        const previewName = slide.customTitle || displayName;
                                        const previewTagline = slide.customTagline || displayTagline;
                                        const previewImage = slide.customImage || displayImage;

                                        return (
                                            <div
                                                key={slide.destinationId}
                                                className={`group relative flex flex-col gap-4 p-4 rounded-2xl border border-gray-100 bg-white shadow-sm hover:shadow-md transition-all ${!slide.enabled ? 'opacity-60 grayscale' : ''}`}
                                            >
                                                <div className="flex gap-6">
                                                    {/* Drag Handle / Order */}
                                                    <div className="flex flex-col items-center justify-center gap-1 border-r border-gray-100 pr-4">
                                                        <button
                                                            onClick={() => moveSlide(index, 'up')}
                                                            disabled={index === 0}
                                                            className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-900 disabled:opacity-30 transition-colors"
                                                        >
                                                            <ChevronUp className="w-4 h-4" />
                                                        </button>
                                                        <div className="text-sm font-mono font-medium text-gray-300 w-6 text-center">
                                                            {(index + 1).toString().padStart(2, '0')}
                                                        </div>
                                                        <button
                                                            onClick={() => moveSlide(index, 'down')}
                                                            disabled={index === config.heroSlider.length - 1}
                                                            className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-900 disabled:opacity-30 transition-colors"
                                                        >
                                                            <ChevronDown className="w-4 h-4" />
                                                        </button>
                                                    </div>

                                                    {/* Image */}
                                                    <div className="w-40 h-28 rounded-xl bg-gray-100 overflow-hidden flex-shrink-0 shadow-inner relative group/image">
                                                        {previewImage ? (
                                                            <img src={previewImage} alt={previewName} className="w-full h-full object-cover" />
                                                        ) : (
                                                            <div className="w-full h-full flex items-center justify-center">
                                                                <ImageIcon className="w-8 h-8 text-gray-300" />
                                                            </div>
                                                        )}
                                                        {!slide.enabled && (
                                                            <div className="absolute inset-0 bg-white/50 flex items-center justify-center backdrop-blur-[1px]">
                                                                <span className="bg-gray-900 text-white text-xs px-2 py-1 rounded-md font-medium">Hidden</span>
                                                            </div>
                                                        )}
                                                    </div>

                                                    {/* Content */}
                                                    <div className="flex-1 min-w-0 py-1">
                                                        <div className="flex justify-between items-start">
                                                            <div>
                                                                <div className="flex items-center gap-2">
                                                                    <h4 className="text-xl font-bold text-gray-900">{previewName}</h4>
                                                                    {slide.customTitle && <span className="text-[10px] bg-blue-50 text-blue-600 px-1.5 py-0.5 rounded border border-blue-100">Custom</span>}
                                                                </div>
                                                                <p className="text-sm text-gray-500 mt-1 line-clamp-1">{previewTagline || 'No tagline set'}</p>
                                                            </div>
                                                            <div className="flex items-center gap-2">
                                                                <Switch
                                                                    checked={slide.enabled}
                                                                    onCheckedChange={() => toggleSlide(index)}
                                                                />
                                                            </div>
                                                        </div>

                                                        <div className="mt-4 flex items-center justify-between">
                                                            <div className="flex items-center gap-2 px-3 py-1 bg-red-50 text-[#CD1C18] rounded-lg text-sm font-semibold">
                                                                <span>Starts from</span>
                                                                <span className="text-lg">₹{formatPrice(displayPrice)}</span>
                                                            </div>

                                                            <Button
                                                                variant="ghost"
                                                                size="sm"
                                                                onClick={() => removeSlide(index)}
                                                                className="text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg px-3"
                                                            >
                                                                <Trash2 className="w-4 h-4 mr-2" /> Remove
                                                            </Button>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Edit Section */}
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-gray-100 relative">
                                                    <div className="space-y-2">
                                                        <Label className="text-xs text-gray-500 font-medium">Custom Title override</Label>
                                                        <Input
                                                            value={slide.customTitle || ''}
                                                            onChange={(e) => updateSlideField(index, 'customTitle', e.target.value)}
                                                            placeholder={displayName}
                                                            className="h-9 text-sm"
                                                        />
                                                    </div>
                                                    <div className="space-y-2">
                                                        <Label className="text-xs text-gray-500 font-medium">Custom Tagline override</Label>
                                                        <Input
                                                            value={slide.customTagline || ''}
                                                            onChange={(e) => updateSlideField(index, 'customTagline', e.target.value)}
                                                            placeholder={displayTagline || 'Tagline'}
                                                            className="h-9 text-sm"
                                                        />
                                                    </div>
                                                    <div className="space-y-2 col-span-1 md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
                                                        <div className="space-y-2">
                                                            <Label className="text-xs text-gray-500 font-medium">Custom Image override (Desktop)</Label>
                                                            <p className="text-[10px] text-gray-400 -mt-1">Max 20MB. Recommended: 1920x600px+</p>
                                                            <div className="flex gap-2">
                                                                <Input
                                                                    value={slide.customImage || ''}
                                                                    onChange={(e) => updateSlideField(index, 'customImage', e.target.value)}
                                                                    placeholder="https://..."
                                                                    className="h-9 text-sm font-mono flex-1"
                                                                />
                                                                <div className="relative">
                                                                    <Button variant="outline" size="sm" className="h-9" disabled={uploading}>
                                                                        <Upload className="w-3.5 h-3.5 mr-2" />
                                                                        Upload
                                                                    </Button>
                                                                    <input
                                                                        type="file"
                                                                        className="absolute inset-0 opacity-0 cursor-pointer"
                                                                        onChange={(e) => handleSlideUpload(index, e)}
                                                                        disabled={uploading}
                                                                    />
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="space-y-2">
                                                            <Label className="text-xs text-gray-500 font-medium">Custom Mobile Image override</Label>
                                                            <p className="text-[10px] text-gray-400 -mt-1">Max 20MB. Recommended: 600x800px</p>
                                                            <div className="flex gap-2">
                                                                <Input
                                                                    value={slide.customMobileImage || ''}
                                                                    onChange={(e) => updateSlideField(index, 'customMobileImage', e.target.value)}
                                                                    placeholder="https://..."
                                                                    className="h-9 text-sm font-mono flex-1"
                                                                />
                                                                <div className="relative">
                                                                    <Button variant="outline" size="sm" className="h-9" disabled={uploading}>
                                                                        <Upload className="w-3.5 h-3.5 mr-2" />
                                                                        Upload
                                                                    </Button>
                                                                    <input
                                                                        type="file"
                                                                        className="absolute inset-0 opacity-0 cursor-pointer"
                                                                        onChange={(e) => handleSlideMobileUpload(index, e)}
                                                                        disabled={uploading}
                                                                    />
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                            </div>
                        )}
                    </div>

                    {/* Mobile Hero Video Section */}
                    <Card className="border-none shadow-sm ring-1 ring-gray-100 rounded-2xl overflow-hidden bg-white mt-8">
                        <CardHeader className="bg-gray-50/50 border-b border-gray-100 pb-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <CardTitle className="text-base font-semibold text-gray-900">Mobile Hero Video</CardTitle>
                                    <CardDescription>Upload a background video for the mobile hero section</CardDescription>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Label className="text-sm font-medium text-gray-700">{config.showMobileHeroVideo ? 'Enabled' : 'Disabled'}</Label>
                                    <Switch
                                        checked={config.showMobileHeroVideo || false}
                                        onCheckedChange={(checked) => setConfig({ ...config, showMobileHeroVideo: checked })}
                                    />
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="p-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <Label className="text-xs text-gray-500 font-medium uppercase tracking-wider">Video URL</Label>
                                    <p className="text-[10px] text-gray-400 -mt-1">Direct link to MP4 or WebM video</p>
                                    <div className="flex gap-2">
                                        <Input
                                            value={config.mobileHeroVideo || ''}
                                            onChange={(e) => setConfig({ ...config, mobileHeroVideo: e.target.value })}
                                            placeholder="https://example.com/video.mp4"
                                            className="h-10 rounded-lg border-gray-200"
                                        />
                                        <div className="relative">
                                            <Button variant="outline" className="h-10 rounded-lg" disabled={uploading}>
                                                <Upload className="w-4 h-4 mr-2" />
                                                Upload
                                            </Button>
                                            <input
                                                type="file"
                                                accept="video/*"
                                                className="absolute inset-0 opacity-0 cursor-pointer"
                                                onChange={async (e) => {
                                                    const file = e.target.files?.[0];
                                                    if (!file) return;
                                                    const formData = new FormData();
                                                    formData.append('image', file); // API uses 'image' key for all uploads
                                                    setUploading(true);
                                                    try {
                                                        const res = await fetch(UPLOAD_API_URL, {
                                                            method: 'POST',
                                                            body: formData,
                                                            credentials: 'include'
                                                        });
                                                        const data = await res.json();
                                                        if (!res.ok) throw new Error(data.message || 'Upload failed');
                                                        setConfig({ ...config, mobileHeroVideo: data.url });
                                                    } catch (error) {
                                                        alert("Upload failed. Please check file size and try again.");
                                                    } finally {
                                                        setUploading(false);
                                                    }
                                                }}
                                                disabled={uploading}
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-xs text-gray-500 font-medium uppercase tracking-wider">Preview</Label>
                                    <div className="h-[200px] w-full bg-gray-100 rounded-xl overflow-hidden flex items-center justify-center border border-gray-100 relative group">
                                        {config.mobileHeroVideo ? (
                                            <video 
                                                src={config.mobileHeroVideo} 
                                                className="w-full h-full object-cover"
                                                autoPlay muted loop playsInline
                                            />
                                        ) : (
                                            <div className="flex flex-col items-center gap-2 text-gray-400">
                                                <ImageIcon className="w-8 h-8" />
                                                <span className="text-xs">No video uploaded</span>
                                            </div>
                                        )}
                                        {config.mobileHeroVideo && (
                                            <button 
                                                onClick={() => setConfig({ ...config, mobileHeroVideo: '' })}
                                                className="absolute top-2 right-2 p-1.5 bg-black/50 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                            >
                                                <X className="w-4 h-4" />
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* SECTIONS TAB */}
                <TabsContent value="sections" className="space-y-8 animate-in fade-in-50 slide-in-from-bottom-2 duration-300">
                    <div className="flex items-center justify-between">
                        <div>
                            <h3 className="text-lg font-bold text-gray-900">Homepage Sections</h3>
                            <p className="text-sm text-gray-500">Configure layout and content for homepage sections</p>
                        </div>
                        <div className="flex gap-2">
                            <select 
                                className="h-9 rounded-xl border border-gray-200 bg-white px-3 text-xs font-medium focus:ring-2 focus:ring-[#CD1C18] outline-none"
                                onChange={(e) => {
                                    const val = e.target.value;
                                    if (!val) return;
                                    const [key, type] = val.split(':');
                                    addSection(key, type);
                                    e.target.value = '';
                                }}
                            >
                                <option value="">+ Add Section</option>
                                <optgroup label="Popular Collections">
                                    <option value="topDestinations:destinations">Top Destinations</option>
                                    <option value="offersAndUpdates:offers">Offers & Updates</option>
                                    <option value="trendingPackages:packages">Trending Packages (Tag)</option>
                                    <option value="trendingCollections:cards">Trending Collections (Cards)</option>
                                </optgroup>
                                <optgroup label="Package Filters">
                                    <option value="superSaver:packages">Super Saver Deals (Tag)</option>
                                    <option value="honeymoon:packages">Honeymoon Specials (Tag)</option>
                                    <option value="international:packages">International Getaways (Category)</option>
                                    <option value="domestic:packages">Domestic Getaways (Category)</option>
                                    <option value="weekendGetaways:packages">Weekend Getaways (Filter)</option>
                                    <option value="citydepartures:packages">Packages From Your City</option>
                                </optgroup>
                                <optgroup label="Layout Elements">
                                    <option value="promoBanner:media">Media Banner (Full Width)</option>
                                    <option value="promoSlider:slider">Promo Slider</option>
                                    <option value="quicklinks:links">SEO Quick Links</option>
                                </optgroup>
                                <option value="custom:packages">Custom Package Section</option>
                            </select>
                        </div>
                    </div>

                    <div className="grid gap-6">
                        {config.sections.sort((a, b) => a.order - b.order).map((section, index) => (
                            <Card key={section.key} className="border-none shadow-sm ring-1 ring-gray-100 rounded-2xl overflow-hidden bg-white">
                                <CardContent className="p-6">
                                    <div className="flex items-start gap-4">
                                        <div className="flex flex-col gap-1 mt-3">
                                            <button 
                                                onClick={() => moveSection(index, 'up')}
                                                disabled={index === 0}
                                                className="p-1 text-gray-400 hover:text-black hover:bg-gray-100 rounded-md disabled:opacity-0"
                                            >
                                                <ChevronUp className="h-4 w-4" />
                                            </button>
                                            <div className="cursor-grab text-gray-300 hover:text-gray-600 active:cursor-grabbing flex justify-center">
                                                <GripVertical className="h-6 w-6" />
                                            </div>
                                            <button 
                                                onClick={() => moveSection(index, 'down')}
                                                disabled={index === config.sections.length - 1}
                                                className="p-1 text-gray-400 hover:text-black hover:bg-gray-100 rounded-md disabled:opacity-0"
                                            >
                                                <ChevronDown className="h-4 w-4" />
                                            </button>
                                        </div>

                                        <div className="flex-1 space-y-6">
                                            {/* Header Row */}
                                            <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between bg-gray-50/50 p-4 rounded-xl border border-gray-100">
                                                <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
                                                    <div className="space-y-1.5">
                                                        <Label className="text-xs font-semibold uppercase tracking-wider text-gray-500">Section Title</Label>
                                                        <Input
                                                            value={section.title}
                                                            onChange={(e) => updateSection(index, 'title', e.target.value)}
                                                            className="h-10 rounded-lg border-gray-200 bg-white font-semibold text-gray-900"
                                                        />
                                                    </div>
                                                    <div className="space-y-1.5">
                                                        <Label className="text-xs font-semibold uppercase tracking-wider text-gray-500">Subtitle</Label>
                                                        <Input
                                                            value={section.subtitle || ''}
                                                            onChange={(e) => updateSection(index, 'subtitle', e.target.value)}
                                                            className="h-10 rounded-lg border-gray-200 bg-white"
                                                            placeholder="Optional subtitle"
                                                        />
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-3 pl-4 border-l border-gray-200">
                                                    <div className="flex flex-col items-end">
                                                        <Label className="text-sm font-medium text-gray-900">{section.enabled ? 'Visible' : 'Hidden'}</Label>
                                                        <span className="text-[10px] text-gray-500 uppercase tracking-widest">{section.key}</span>
                                                    </div>
                                                    <Switch
                                                        checked={section.enabled}
                                                        onCheckedChange={(checked) => updateSection(index, 'enabled', checked)}
                                                    />
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                                                        onClick={() => removeSection(index)}
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            </div>

                                            {/* Destination Items for destination-type sections */}
                                            {section.type === 'destinations' && (
                                                <div className="space-y-3 pl-2">
                                                    <Label className="text-sm font-semibold text-gray-900 flex items-center gap-2">
                                                        <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                                                        Featured Destinations
                                                    </Label>

                                                    <div className="bg-gray-50 rounded-xl p-4 border border-dashed border-gray-200">
                                                        {/* Current destinations */}
                                                        {(!section.destinationItems || section.destinationItems.length === 0) ? (
                                                            <p className="text-sm text-gray-400 italic mb-3">No destinations selected for this section yet.</p>
                                                        ) : (
                                                            <div className="flex flex-wrap gap-2 mb-4">
                                                                {(section.destinationItems || []).map((dest: any, destIndex: number) => (
                                                                    <div key={dest._id || destIndex} className="group flex flex-col items-center bg-white border border-gray-200 rounded-2xl p-2 shadow-sm hover:shadow-md transition-all w-48">
                                                                        <div className="w-full aspect-[16/9] rounded-xl bg-gray-100 overflow-hidden mb-2 border border-gray-50">
                                                                            {dest.heroImage && <img src={dest.heroImage} alt="" className="w-full h-full object-cover" />}
                                                                        </div>
                                                                        <div className="flex items-center justify-between w-full px-1">
                                                                            <span className="text-xs font-bold text-gray-900 truncate">{dest.name}</span>
                                                                            <button
                                                                                onClick={() => {
                                                                                    const newSections = [...config.sections];
                                                                                    newSections[index].destinationItems = (newSections[index].destinationItems || []).filter((_: any, i: number) => i !== destIndex);
                                                                                    setConfig({ ...config, sections: newSections });
                                                                                }}
                                                                                className="ml-1 p-0.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors"
                                                                            >
                                                                                <X className="w-3 h-3" />
                                                                            </button>
                                                                        </div>
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        )}

                                                        {/* Add destination dropdown */}
                                                        <div className="space-y-2">
                                                            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Add More</p>
                                                            <div className="flex flex-wrap gap-2">
                                                                {destinations
                                                                    .filter(d => !(section.destinationItems || []).some((item: any) => item._id === d._id))
                                                                    .slice(0, 10) // Limit to 10 suggestions to avoid clutter
                                                                    .map(dest => (
                                                                        <button
                                                                            key={dest._id}
                                                                            onClick={() => {
                                                                                const newSections = [...config.sections];
                                                                                newSections[index].destinationItems = [
                                                                                    ...(newSections[index].destinationItems || []),
                                                                                    { _id: dest._id, name: dest.name, slug: dest.slug, heroImage: dest.heroImage, verticalImage: dest.verticalImage }
                                                                                ];
                                                                                setConfig({ ...config, sections: newSections });
                                                                            }}
                                                                            className="flex items-center gap-2 px-3 py-2 text-xs font-medium bg-white rounded-xl border border-gray-200 hover:border-[#CD1C18] hover:text-[#CD1C18] transition-all"
                                                                        >
                                                                            <div className="w-5 h-5 rounded-full overflow-hidden shrink-0 border border-gray-100">
                                                                                <img src={dest.heroImage} alt="" className="w-full h-full object-cover" />
                                                                            </div>
                                                                            <Plus className="w-3 h-3" />
                                                                            {dest.name}
                                                                        </button>
                                                                    ))
                                                                }
                                                            </div>
                                                            <div className="mt-4 p-3 bg-blue-50/50 rounded-xl border border-blue-100/50 flex items-start gap-3">
                                                                <ImageIcon className="w-4 h-4 text-blue-500 mt-0.5 shrink-0" />
                                                                <div className="space-y-1">
                                                                    <p className="text-xs font-bold text-blue-900">HD Quality Recommendation</p>
                                                                    <p className="text-[10px] text-blue-700 leading-relaxed italic">
                                                                        For these cards, upload images in **16:9 ratio** (e.g., **1600x900px**). This ensures they remain sharp on both Desktop and Mobile view.
                                                                    </p>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            )}

                                            {/* Cards for 'cards', 'offers' or 'slider' type sections */}
                                            {(section.type === 'cards' || section.type === 'offers' || section.type === 'slider') && (
                                                <div className="space-y-4 pt-4 border-t border-gray-100">
                                                    <div className="flex justify-between items-center">
                                                        <Label className="text-sm font-semibold text-gray-900">
                                                            {section.type === 'offers' ? 'Offer Cards' : 'Collection Cards'}
                                                        </Label>
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            onClick={() => {
                                                                const newSections = [...config.sections];
                                                                if (!newSections[index].cards) newSections[index].cards = [];
                                                                newSections[index].cards!.push({ title: section.type === 'offers' ? 'Offer' : 'New Card', linkType: 'destination', linkValue: '' });
                                                                setConfig({ ...config, sections: newSections });
                                                            }}
                                                        >
                                                            <Plus className="w-3 h-3 mr-2" /> Add Card
                                                        </Button>
                                                    </div>

                                                    <div className="grid gap-4">
                                                        {(section.cards || []).map((card: any, cardIndex: number) => (
                                                            <div key={cardIndex} className="grid grid-cols-1 md:grid-cols-12 gap-4 p-4 bg-gray-50 rounded-xl border border-gray-200 relative group">
                                                                {/* Image Uploads */}
                                                                <div className="md:col-span-3 grid grid-cols-2 gap-2">
                                                                    {/* Desktop Image */}
                                                                    <div className="space-y-1.5">
                                                                        <div className="w-full h-16 bg-gray-200 rounded-lg overflow-hidden relative border border-gray-100">
                                                                            {card.image ? (
                                                                                <img src={card.image} alt="" className="w-full h-full object-cover" />
                                                                            ) : (
                                                                                <div className="flex items-center justify-center h-full text-gray-400 bg-gray-100"><ImageIcon className="w-4 h-4" /></div>
                                                                            )}
                                                                            <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" onChange={(e) => handleCardImageUpload(index, cardIndex, e)} />
                                                                        </div>
                                                                        <div className="text-center">
                                                                            <span className="text-[9px] text-gray-500 font-medium block leading-tight">Desktop</span>
                                                                            <span className="text-[8px] text-gray-400">1920x450px</span>
                                                                        </div>
                                                                    </div>

                                                                    {/* Mobile Image */}
                                                                    <div className="space-y-1.5">
                                                                        <div className="w-full h-16 bg-gray-200 rounded-lg overflow-hidden relative border border-gray-100">
                                                                            {card.mobileImage ? (
                                                                                <img src={card.mobileImage} alt="" className="w-full h-full object-cover" />
                                                                            ) : (
                                                                                <div className="flex items-center justify-center h-full bg-gray-100"><ImageIcon className="w-4 h-4" /></div>
                                                                            )}
                                                                            <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" onChange={(e) => handleSliderMobileUpload(index, cardIndex, e)} />
                                                                        </div>
                                                                        <div className="text-center">
                                                                            <span className="text-[9px] text-gray-500 font-medium block leading-tight">Mobile</span>
                                                                            <span className="text-[8px] text-gray-400">800x266px</span>
                                                                        </div>
                                                                    </div>
                                                                </div>

                                                                {/* Fields */}
                                                                <div className={`md:col-span-8 grid ${section.type === 'offers' ? 'grid-cols-1' : 'grid-cols-2'} gap-3`}>
                                                                    {section.type !== 'offers' && (
                                                                        <>
                                                                            <div className="space-y-1">
                                                                                <Label className="text-[10px] uppercase text-gray-500">Title</Label>
                                                                                <Input
                                                                                    value={card.title || ''}
                                                                                    onChange={(e) => {
                                                                                        const newSections = [...config.sections];
                                                                                        newSections[index].cards![cardIndex].title = e.target.value;
                                                                                        setConfig({ ...config, sections: newSections });
                                                                                    }}
                                                                                    className="h-8 text-sm"
                                                                                />
                                                                            </div>
                                                                            <div className="space-y-1">
                                                                                <Label className="text-[10px] uppercase text-gray-500">Subtitle</Label>
                                                                                <Input
                                                                                    value={card.subtitle || ''}
                                                                                    onChange={(e) => {
                                                                                        const newSections = [...config.sections];
                                                                                        newSections[index].cards![cardIndex].subtitle = e.target.value;
                                                                                        setConfig({ ...config, sections: newSections });
                                                                                    }}
                                                                                    className="h-8 text-sm"
                                                                                />
                                                                            </div>
                                                                        </>
                                                                    )}
                                                                    <div className="grid grid-cols-2 gap-3">
                                                                        <div className="space-y-1">
                                                                            <Label className="text-[10px] uppercase text-gray-500">Link Type</Label>
                                                                            <select
                                                                                className="flex h-8 w-full rounded-md border border-input bg-background px-3 py-1 text-sm ring-offset-background"
                                                                                value={card.linkType || 'destination'}
                                                                                onChange={(e) => {
                                                                                    const newSections = [...config.sections];
                                                                                    newSections[index].cards![cardIndex].linkType = e.target.value;
                                                                                    setConfig({ ...config, sections: newSections });
                                                                                }}
                                                                            >
                                                                                <option value="destination">Destination</option>
                                                                                <option value="package">Package</option>
                                                                                <option value="url">External URL</option>
                                                                            </select>
                                                                        </div>
                                                                        <div className="space-y-1">
                                                                            <Label className="text-[10px] uppercase text-gray-500">Link Value (Slug/URL)</Label>
                                                                            <Input
                                                                                value={card.linkValue || ''}
                                                                                onChange={(e) => {
                                                                                    const newSections = [...config.sections];
                                                                                    newSections[index].cards![cardIndex].linkValue = e.target.value;
                                                                                    setConfig({ ...config, sections: newSections });
                                                                                }}
                                                                                className="h-8 text-sm"
                                                                                placeholder={card.linkType === 'url' ? 'https://...' : 'slug-here'}
                                                                            />
                                                                        </div>
                                                                    </div>
                                                                </div>

                                                                {/* Delete */}
                                                                <div className="md:col-span-1 flex justify-end">
                                                                    <Button variant="ghost" size="icon" className="text-gray-400 hover:text-red-500" onClick={() => {
                                                                        const newSections = [...config.sections];
                                                                        newSections[index].cards = newSections[index].cards!.filter((_, i) => i !== cardIndex);
                                                                        setConfig({ ...config, sections: newSections });
                                                                    }}>
                                                                        <Trash2 className="w-4 h-4" />
                                                                    </Button>
                                                                </div>
                                                            </div>
                                                        ))}
                                                        <div className="mt-4 p-3 bg-blue-50/50 rounded-xl border border-blue-100/50 flex items-start gap-3">
                                                            <ImageIcon className="w-4 h-4 text-blue-500 mt-0.5 shrink-0" />
                                                            <div className="space-y-1">
                                                                <p className="text-xs font-bold text-blue-900">HD Quality Recommendation</p>
                                                                <p className="text-[10px] text-blue-700 leading-relaxed italic">
                                                                    For these cards, upload images in **16:9 ratio** (e.g., **1600x900px**). This ensures they remain sharp and professional on all devices.
                                                                </p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            )}                                            {/* Media Config for 'media' type */}
                                            {section.type === 'media' && (
                                                <div className="space-y-6 pt-4 border-t border-gray-100">
                                                    <div className="flex justify-between items-center px-2">
                                                        <div className="flex flex-col">
                                                            <Label className="text-sm font-bold text-gray-900">Media & Banner Configuration</Label>
                                                            <p className="text-[11px] text-gray-500">Add one or multiple images to create a slider</p>
                                                        </div>
                                                        <div className="flex items-center gap-6">
                                                            <div className="flex items-center gap-2">
                                                                <span className="text-xs text-gray-500">Is Video?</span>
                                                                <Switch
                                                                    checked={section.isVideo || false}
                                                                    onCheckedChange={(checked) => updateSection(index, 'isVideo', checked)}
                                                                />
                                                            </div>
                                                            <Button 
                                                                variant="outline" 
                                                                size="sm" 
                                                                className="h-8 border-dashed border-gray-300 hover:border-[#CD1C18] hover:text-[#CD1C18] bg-white transition-all"
                                                                onClick={() => {
                                                                    const newSections = [...config.sections];
                                                                    if (!newSections[index].mediaSlides) newSections[index].mediaSlides = [];
                                                                    newSections[index].mediaSlides.push({ desktop: '', mobile: '' });
                                                                    setConfig({ ...config, sections: newSections });
                                                                }}
                                                            >
                                                                <Plus className="w-3.5 h-3.5 mr-1.5" /> Add Slide
                                                            </Button>
                                                        </div>
                                                    </div>

                                                    <div className="space-y-4">
                                                        {/* Legacy single-upload (only show if no slides exist) */}
                                                        {(!section.mediaSlides || section.mediaSlides.length === 0) && (
                                                            <div className="bg-gray-50 rounded-2xl p-5 border border-gray-200">
                                                                <div className="flex gap-6 items-start">
                                                                    <div className="w-40 aspect-[21/9] bg-white rounded-xl overflow-hidden flex-shrink-0 relative border border-gray-200 shadow-sm">
                                                                        {section.mediaUrl ? (
                                                                            section.isVideo ? (
                                                                                <div className="flex items-center justify-center h-full bg-slate-800 text-white text-[10px] font-bold">VIDEO</div>
                                                                            ) : (
                                                                                <img src={section.mediaUrl} alt="" className="w-full h-full object-cover" />
                                                                            )
                                                                        ) : (
                                                                            <div className="flex items-center justify-center h-full bg-gray-50"><ImageIcon className="w-8 h-8 text-gray-200" /></div>
                                                                        )}
                                                                    </div>
                                                                    <div className="flex-1 space-y-4">
                                                                        <div className="grid grid-cols-2 gap-6">
                                                                            <div className="space-y-2">
                                                                                <div className="flex justify-between items-end">
                                                                                    <Label className="text-[11px] font-semibold text-gray-600 uppercase tracking-wider">Desktop Media URL</Label>
                                                                                    <span className="text-[10px] text-blue-600 font-bold italic">1920x450px</span>
                                                                                </div>
                                                                                <div className="flex gap-2">
                                                                                    <Input
                                                                                        value={section.mediaUrl || ''}
                                                                                        onChange={(e) => updateSection(index, 'mediaUrl', e.target.value)}
                                                                                        placeholder="https://ik.imagekit.io/..."
                                                                                        className="h-10 bg-white text-xs font-mono border-gray-200 focus:border-brand rounded-xl"
                                                                                    />
                                                                                    <div className="relative">
                                                                                        <Button variant="secondary" size="sm" className="h-10 w-10 p-0 rounded-xl bg-gray-100 hover:bg-gray-200" disabled={uploading}>
                                                                                            <Upload className="w-4 h-4" />
                                                                                        </Button>
                                                                                        <input
                                                                                            type="file"
                                                                                            className="absolute inset-0 opacity-0 cursor-pointer"
                                                                                            onChange={(e) => handleMediaUpload(index, e)}
                                                                                            disabled={uploading}
                                                                                        />
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                            <div className="space-y-2">
                                                                                <div className="flex justify-between items-end">
                                                                                    <Label className="text-[11px] font-semibold text-gray-600 uppercase tracking-wider">Mobile Media (Optional)</Label>
                                                                                    <span className="text-[10px] text-gray-400 italic">800x266px</span>
                                                                                </div>
                                                                                <div className="flex gap-2">
                                                                                    <Input
                                                                                        value={section.mobileMediaUrl || ''}
                                                                                        onChange={(e) => updateSection(index, 'mobileMediaUrl', e.target.value)}
                                                                                        placeholder="Mobile URL"
                                                                                        className="h-10 bg-white text-xs font-mono border-gray-200 focus:border-brand rounded-xl"
                                                                                    />
                                                                                    <div className="relative">
                                                                                        <Button variant="secondary" size="sm" className="h-10 w-10 p-0 rounded-xl bg-gray-100 hover:bg-gray-200" disabled={uploading}>
                                                                                            <Upload className="w-4 h-4" />
                                                                                        </Button>
                                                                                        <input
                                                                                            type="file"
                                                                                            className="absolute inset-0 opacity-0 cursor-pointer"
                                                                                            onChange={(e) => handleMobileMediaUpload(index, e)}
                                                                                            disabled={uploading}
                                                                                        />
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        )}

                                                        {/* Multiple Slides */}
                                                        {section.mediaSlides && section.mediaSlides.length > 0 && (
                                                            <div className="grid gap-4">
                                                                {section.mediaSlides.map((slide, sIdx) => (
                                                                    <div key={sIdx} className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm relative group/slide">
                                                                        <div className="absolute top-2 right-2 flex items-center gap-1 opacity-0 group-hover/slide:opacity-100 transition-opacity">
                                                                            <Button 
                                                                                variant="ghost" 
                                                                                size="icon" 
                                                                                className="h-7 w-7 text-gray-400 hover:text-red-500 hover:bg-red-50"
                                                                                onClick={() => {
                                                                                    const newSections = [...config.sections];
                                                                                    newSections[index].mediaSlides = newSections[index].mediaSlides!.filter((_, i) => i !== sIdx);
                                                                                    setConfig({ ...config, sections: newSections });
                                                                                }}
                                                                            >
                                                                                <X className="w-3.5 h-3.5" />
                                                                            </Button>
                                                                        </div>
                                                                        
                                                                        <div className="flex gap-6 items-start">
                                                                            {/* Preview */}
                                                                            <div className="w-40 aspect-[21/9] bg-gray-50 rounded-xl overflow-hidden flex-shrink-0 relative border border-gray-100 italic">
                                                                                {slide.desktop ? (
                                                                                    <img src={slide.desktop} alt="" className="w-full h-full object-cover" />
                                                                                ) : (
                                                                                    <div className="flex items-center justify-center h-full text-gray-300"><ImageIcon className="w-8 h-8 opacity-20" /></div>
                                                                                )}
                                                                                <div className="absolute bottom-1 right-1 bg-black/50 text-[8px] text-white px-1 rounded uppercase tracking-tighter">Slide {sIdx + 1}</div>
                                                                            </div>
                                                                            
                                                                            <div className="flex-1 grid grid-cols-2 gap-6">
                                                                                {/* Desktop */}
                                                                                <div className="space-y-2">
                                                                                    <Label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Desktop Media Slider Image</Label>
                                                                                    <div className="flex gap-2">
                                                                                        <Input
                                                                                            value={slide.desktop || ''}
                                                                                            onChange={(e) => {
                                                                                                const newSections = [...config.sections];
                                                                                                newSections[index].mediaSlides![sIdx].desktop = e.target.value;
                                                                                                setConfig({ ...config, sections: newSections });
                                                                                            }}
                                                                                            placeholder="Desktop URL"
                                                                                            className="h-10 bg-gray-50/50 text-xs font-mono border-gray-100 focus:bg-white rounded-xl"
                                                                                        />
                                                                                        <div className="relative">
                                                                                            <Button variant="secondary" size="sm" className="h-10 rounded-xl" disabled={uploading}>
                                                                                                <Upload className="w-3.5 h-3.5" />
                                                                                            </Button>
                                                                                            <input
                                                                                                type="file"
                                                                                                className="absolute inset-0 opacity-0 cursor-pointer"
                                                                                                onChange={(e) => handleMediaSlideUpload(index, sIdx, 'desktop', e)}
                                                                                                disabled={uploading}
                                                                                            />
                                                                                        </div>
                                                                                    </div>
                                                                                </div>
                                                                                {/* Mobile */}
                                                                                <div className="space-y-2">
                                                                                    <Label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Mobile Media Slider Image</Label>
                                                                                    <div className="flex gap-2">
                                                                                        <Input
                                                                                            value={slide.mobile || ''}
                                                                                            onChange={(e) => {
                                                                                                const newSections = [...config.sections];
                                                                                                newSections[index].mediaSlides![sIdx].mobile = e.target.value;
                                                                                                setConfig({ ...config, sections: newSections });
                                                                                            }}
                                                                                            placeholder="Mobile URL"
                                                                                            className="h-10 bg-gray-50/50 text-xs font-mono border-gray-100 focus:bg-white rounded-xl"
                                                                                        />
                                                                                        <div className="relative">
                                                                                            <Button variant="secondary" size="sm" className="h-10 rounded-xl" disabled={uploading}>
                                                                                                <Upload className="w-3.5 h-3.5" />
                                                                                            </Button>
                                                                                            <input
                                                                                                type="file"
                                                                                                className="absolute inset-0 opacity-0 cursor-pointer"
                                                                                                onChange={(e) => handleMediaSlideUpload(index, sIdx, 'mobile', e)}
                                                                                                disabled={uploading}
                                                                                            />
                                                                                        </div>
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        )}
                                                    </div>

                                                    <div className="px-1 py-1 border-t border-gray-100 mt-2">
                                                        <div className="flex flex-col gap-1.5">
                                                            <div className="flex justify-between items-center">
                                                                <Label className="text-xs font-bold text-gray-700">Custom Action Link (Button/Click)</Label>
                                                                <span className="text-[10px] text-gray-400 italic">Applies to all slides in this section</span>
                                                            </div>
                                                            <div className="flex gap-3">
                                                                <Input
                                                                    value={section.cards?.[0]?.linkValue || ''}
                                                                    onChange={(e) => {
                                                                        const newSections = [...config.sections];
                                                                        if (!newSections[index].cards) newSections[index].cards = [{}];
                                                                        if (newSections[index].cards.length === 0) newSections[index].cards[0] = {};
                                                                        newSections[index].cards[0].linkValue = e.target.value;
                                                                        newSections[index].cards[0].linkType = 'url';
                                                                        setConfig({ ...config, sections: newSections });
                                                                    }}
                                                                    placeholder="e.g. /destination/norway or https://..."
                                                                    className="h-10 bg-white text-sm rounded-xl border-gray-200"
                                                                />
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            )}

                                            {/* Links Config for 'links' type */}
                                            {section.type === 'links' && (
                                                <div className="space-y-6 pt-6 border-t border-gray-100">
                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                                        {/* Quick Links Group */}
                                                        <div className="space-y-4">
                                                            <div className="flex justify-between items-center">
                                                                <Label className="text-sm font-bold text-gray-900">Quick Links (Category 1)</Label>
                                                                <Button variant="outline" size="sm" onClick={() => addQuickLink('quickLinks')}>
                                                                    <Plus className="w-3 h-3 mr-2" /> Add Link
                                                                </Button>
                                                            </div>
                                                            <div className="grid gap-2 overflow-y-auto max-h-[300px] pr-2">
                                                                {(config.quickLinks || []).map((link, lIdx) => (
                                                                    <div key={lIdx} className="flex gap-2 items-center bg-gray-50/80 p-2 rounded-xl border border-gray-100">
                                                                        <Input 
                                                                            value={link.label} 
                                                                            onChange={(e) => updateQuickLink('quickLinks', lIdx, 'label', e.target.value)}
                                                                            placeholder="Label"
                                                                            className="h-9 text-xs bg-white"
                                                                        />
                                                                        <Input 
                                                                            value={link.url} 
                                                                            onChange={(e) => updateQuickLink('quickLinks', lIdx, 'url', e.target.value)}
                                                                            placeholder="URL"
                                                                            className="h-9 text-xs bg-white"
                                                                        />
                                                                        <Button variant="ghost" size="icon" onClick={() => removeQuickLink('quickLinks', lIdx)} className="h-9 w-9 text-gray-400 hover:text-red-500 hover:bg-red-50">
                                                                            <Trash2 className="h-4 w-4" />
                                                                        </Button>
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        </div>

                                                        {/* Important Links Group */}
                                                        <div className="space-y-4">
                                                            <div className="flex justify-between items-center">
                                                                <Label className="text-sm font-bold text-gray-900">Important Links (Category 2)</Label>
                                                                <Button variant="outline" size="sm" onClick={() => addQuickLink('importantLinks')}>
                                                                    <Plus className="w-3 h-3 mr-2" /> Add Link
                                                                </Button>
                                                            </div>
                                                            <div className="grid gap-2 overflow-y-auto max-h-[300px] pr-2">
                                                                {(config.importantLinks || []).map((link, lIdx) => (
                                                                    <div key={lIdx} className="flex gap-2 items-center bg-gray-50/80 p-2 rounded-xl border border-gray-100">
                                                                        <Input 
                                                                            value={link.label} 
                                                                            onChange={(e) => updateQuickLink('importantLinks', lIdx, 'label', e.target.value)}
                                                                            placeholder="Label"
                                                                            className="h-9 text-xs bg-white"
                                                                        />
                                                                        <Input 
                                                                            value={link.url} 
                                                                            onChange={(e) => updateQuickLink('importantLinks', lIdx, 'url', e.target.value)}
                                                                            placeholder="URL"
                                                                            className="h-9 text-xs bg-white"
                                                                        />
                                                                        <Button variant="ghost" size="icon" onClick={() => removeQuickLink('importantLinks', lIdx)} className="h-9 w-9 text-gray-400 hover:text-red-500 hover:bg-red-50">
                                                                            <Trash2 className="h-4 w-4" />
                                                                        </Button>
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            )}

                                            {/* Query Config for 'packages' type */}
                                            {section.type === 'packages' && (
                                                <div className="space-y-4 pt-4 border-t border-gray-100 bg-gray-50/30 p-4 rounded-xl">
                                                    <Label className="text-sm font-semibold text-gray-900 flex items-center gap-2">
                                                        <Search className="w-4 h-4" /> Package Filter Settings
                                                    </Label>
                                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                                        <div className="space-y-1.5">
                                                            <Label className="text-xs text-gray-500">Filter Tag</Label>
                                                            <Input
                                                                value={section.queryConfig?.tag || ''}
                                                                onChange={(e) => {
                                                                    const newSections = [...config.sections];
                                                                    if (!newSections[index].queryConfig) newSections[index].queryConfig = { tag: '' };
                                                                    newSections[index].queryConfig!.tag = e.target.value;
                                                                    setConfig({ ...config, sections: newSections });
                                                                }}
                                                                placeholder="e.g. Weekend, Honeymoon"
                                                                className="h-9 bg-white"
                                                            />
                                                        </div>
                                                        <div className="space-y-1.5">
                                                            <Label className="text-xs text-gray-500">Max Price (₹)</Label>
                                                            <Input
                                                                type="number"
                                                                value={section.queryConfig?.maxPrice || ''}
                                                                onChange={(e) => {
                                                                    const newSections = [...config.sections];
                                                                    if (!newSections[index].queryConfig) newSections[index].queryConfig = { tag: '' };
                                                                    newSections[index].queryConfig!.maxPrice = Number(e.target.value);
                                                                    setConfig({ ...config, sections: newSections });
                                                                }}
                                                                className="h-9 bg-white"
                                                            />
                                                        </div>
                                                        <div className="space-y-1.5">
                                                            <Label className="text-xs text-gray-500">Item Limit</Label>
                                                            <Input
                                                                type="number"
                                                                value={section.queryConfig?.limit || 6}
                                                                onChange={(e) => {
                                                                    const newSections = [...config.sections];
                                                                    if (!newSections[index].queryConfig) newSections[index].queryConfig = { tag: '' };
                                                                    newSections[index].queryConfig!.limit = Number(e.target.value);
                                                                    setConfig({ ...config, sections: newSections });
                                                                }}
                                                                className="h-9 bg-white"
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </TabsContent>

                {/* FAQ TAB */}
                <TabsContent value="faq" className="space-y-8 animate-in fade-in-50 slide-in-from-bottom-2 duration-300">
                    <div className="flex justify-between items-center">
                        <div>
                            <h3 className="text-lg font-bold text-gray-900">Frequently Asked Questions</h3>
                            <p className="text-sm text-gray-500">Manage Q&A for the homepage footer section</p>
                        </div>
                        <Button onClick={addFaq} className="bg-gray-900 hover:bg-black text-white rounded-xl shadow-lg shadow-gray-900/10">
                            <Plus className="mr-2 h-4 w-4" /> Add FAQ
                        </Button>
                    </div>

                    <div className="space-y-4">
                        {config.faq.map((faq, index) => (
                            <div key={index} className="group border border-gray-100 p-6 rounded-2xl bg-white shadow-sm hover:shadow-md transition-all">
                                <div className="flex justify-between items-start gap-6">
                                    <div className="flex-1 space-y-4">
                                        <div className="space-y-1.5">
                                            <Label className="text-xs font-semibold uppercase tracking-wider text-gray-400 group-hover:text-[#CD1C18] transition-colors">Question</Label>
                                            <Input
                                                value={faq.question}
                                                onChange={(e) => updateFaq(index, 'question', e.target.value)}
                                                placeholder="Enter question"
                                                className="h-11 rounded-xl border-gray-200 text-lg font-medium"
                                            />
                                        </div>
                                        <div className="space-y-1.5">
                                            <Label className="text-xs font-semibold uppercase tracking-wider text-gray-400">Answer</Label>
                                            <Textarea
                                                value={faq.answer}
                                                onChange={(e) => updateFaq(index, 'answer', e.target.value)}
                                                placeholder="Enter answer"
                                                className="min-h-[100px] rounded-xl border-gray-200 bg-gray-50/50 focus:bg-white transition-colors"
                                            />
                                        </div>
                                    </div>
                                    <Button variant="ghost" size="icon" onClick={() => removeFaq(index)} className="text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg mt-6">
                                        <Trash2 className="h-5 w-5" />
                                    </Button>
                                </div>
                            </div>
                        ))}
                        {config.faq.length === 0 && (
                            <div className="text-center py-16 bg-gray-50 rounded-3xl border border-dashed border-gray-200">
                                <p className="text-gray-400">No FAQs added yet. Click "Add FAQ" to start.</p>
                            </div>
                        )}
                    </div>
                </TabsContent>

                {/* SEO LINKS TAB */}
                <TabsContent value="seo-links" className="space-y-8 animate-in fade-in-50 slide-in-from-bottom-2 duration-300">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Quick Links */}
                        <div className="space-y-6">
                            <div className="flex justify-between items-center">
                                <div>
                                    <h3 className="text-lg font-bold text-gray-900">Quick Links</h3>
                                    <p className="text-sm text-gray-500">Links for destinations, city-wise packages, etc.</p>
                                </div>
                                <Button onClick={() => addQuickLink('quickLinks')} variant="outline" size="sm" className="rounded-xl border-dashed border-2 hover:border-[#CD1C18] hover:text-[#CD1C18]">
                                    <Plus className="mr-2 h-4 w-4" /> Add Link
                                </Button>
                            </div>
                            <div className="space-y-3">
                                {(config.quickLinks || []).map((link, idx) => (
                                    <div key={idx} className="flex gap-3 bg-white p-3 rounded-xl border border-gray-100 shadow-sm group">
                                        <div className="flex-1 space-y-3">
                                            <Input
                                                value={link.label}
                                                onChange={(e) => updateQuickLink('quickLinks', idx, 'label', e.target.value)}
                                                placeholder="Label (e.g. Packages from Delhi)"
                                                className="h-9 text-sm font-medium"
                                            />
                                            <Input
                                                value={link.url}
                                                onChange={(e) => updateQuickLink('quickLinks', idx, 'url', e.target.value)}
                                                placeholder="URL (e.g. /search?city=delhi)"
                                                className="h-9 text-xs font-mono bg-gray-50/50"
                                            />
                                        </div>
                                        <Button variant="ghost" size="icon" onClick={() => removeQuickLink('quickLinks', idx)} className="text-gray-400 hover:text-red-500 h-9 w-9 self-center">
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                ))}
                                {(config.quickLinks || []).length === 0 && (
                                    <div className="text-center py-10 bg-gray-50/50 rounded-2xl border border-dashed border-gray-200">
                                        <p className="text-sm text-gray-400">No links added. Start for SEO.</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Important Links */}
                        <div className="space-y-6">
                            <div className="flex justify-between items-center">
                                <div>
                                    <h3 className="text-lg font-bold text-gray-900">Important Links</h3>
                                    <p className="text-sm text-gray-500">Secondary SEO links for deep pages</p>
                                </div>
                                <Button onClick={() => addQuickLink('importantLinks')} variant="outline" size="sm" className="rounded-xl border-dashed border-2 hover:border-[#CD1C18] hover:text-[#CD1C18]">
                                    <Plus className="mr-2 h-4 w-4" /> Add Link
                                </Button>
                            </div>
                            <div className="space-y-3">
                                {(config.importantLinks || []).map((link, idx) => (
                                    <div key={idx} className="flex gap-3 bg-white p-3 rounded-xl border border-gray-100 shadow-sm group">
                                        <div className="flex-1 space-y-3">
                                            <Input
                                                value={link.label}
                                                onChange={(e) => updateQuickLink('importantLinks', idx, 'label', e.target.value)}
                                                placeholder="Label (e.g. Best Honeymoon Deals)"
                                                className="h-9 text-sm font-medium"
                                            />
                                            <Input
                                                value={link.url}
                                                onChange={(e) => updateQuickLink('importantLinks', idx, 'url', e.target.value)}
                                                placeholder="URL (e.g. /search?tag=honeymoon)"
                                                className="h-9 text-xs font-mono bg-gray-50/50"
                                            />
                                        </div>
                                        <Button variant="ghost" size="icon" onClick={() => removeQuickLink('importantLinks', idx)} className="text-gray-400 hover:text-red-500 h-9 w-9 self-center">
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                ))}
                                {(config.importantLinks || []).length === 0 && (
                                    <div className="text-center py-10 bg-gray-50/50 rounded-2xl border border-dashed border-gray-200">
                                        <p className="text-sm text-gray-400">No links added. Start for SEO.</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </TabsContent>
            </Tabs>
        </div >
    );
}
