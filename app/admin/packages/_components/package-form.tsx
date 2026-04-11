"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useForm, useFieldArray, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { Plus, Trash2, Save, Loader2, ArrowLeft, Upload, X, ChevronDown, Link as LinkIcon, Globe, MapPin, Clock, Camera, Car, Bed, BedDouble, Plane, Coffee, Utensils, Shield, Info, Image as ImageIcon, Search, Wand2, Star, Stars } from 'lucide-react';
import { API_BASE_URL, CATEGORIES } from '@/constants';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Package } from '@/types';

// Schema Definition
const packageSchema = z.object({
    title: z.string().min(3, "Title must be at least 3 characters"),
    location: z.string().min(2, "Location is required"),
    duration: z.coerce.number().min(1, "Duration must be at least 1 day"),
    price: z.coerce.number().min(0, "Price must be positive"),
    originalPrice: z.coerce.number().min(0),
    rating: z.coerce.number().min(0).max(5).default(0),
    reviewsCount: z.coerce.number().min(0).default(0),
    isBestSeller: z.boolean().default(false),
    category: z.string(),
    groupSize: z.string(),
    overview: z.string(),
    image: z.string().min(1, "Main image is required"),
    altText: z.string().optional(),
    verticalImage: z.string().optional().nullable(),
    gallery: z.array(z.string()),
    highlights: z.array(z.string()),
    inclusions: z.array(z.string()),
    exclusions: z.array(z.string()),
    thingsToPack: z.array(z.string()),
    itinerary: z.array(z.object({
        day: z.coerce.number(),
        title: z.string().nullable().optional().or(z.literal('')),
        description: z.string().nullable().optional().or(z.literal('')),
        highlights: z.array(z.string()).default([]),
        meals: z.object({
            breakfastIncluded: z.boolean().default(false),
            lunchIncluded: z.boolean().default(false),
            dinnerIncluded: z.boolean().default(false),
        }).default({ breakfastIncluded: false, lunchIncluded: false, dinnerIncluded: false }),
        activities: z.array(z.string()).nullable().optional(),
        detailedActivities: z.array(z.any()).nullable().optional(),
        stay: z.any().nullable().optional(),
        itineraryImages: z.array(z.string()).nullable().optional(),
        flights: z.array(z.any()).nullable().optional(),
    })),
    itinerarySummary: z.string().nullable().optional(),
    policies: z.object({
        cancellation: z.string().default(''),
        refund: z.string().default(''),
        payment: z.string().default('')
    }),
    faqs: z.array(z.object({
        question: z.string(),
        answer: z.string()
    })),
    // Visibility & Status
    status: z.enum(['draft', 'published']).default('published'),
    showOnHomepage: z.boolean().default(false),
    showInCollections: z.boolean().default(true),
    // Badges
    isTrending: z.boolean().default(false),
    isAlmostFull: z.boolean().default(false),
    // Categorization
    tags: z.array(z.string()),
    homepageSections: z.array(z.string()).default([]),
    // SEO
    slug: z.string().nullable().optional(),
    seo: z.object({
        title: z.string().optional().nullable(),
        description: z.string().optional().nullable(),
        keywords: z.string().optional().nullable(),
    }).optional().nullable(),
    inclusionHighlights: z.array(z.string()).default([]),
    regionBreakdown: z.string().nullable().optional(),
    validityDate: z.string().nullable().optional(),
    pickupPoint: z.string().optional().nullable(),
    dropPoint: z.string().optional().nullable(),
});

type PackageFormValues = z.infer<typeof packageSchema>;

// Simplified sub-components section removed to keep Heading & Description only in main form.


interface PackageFormProps {
    initialData?: Package;
    isEditMode?: boolean;
}

export default function PackageForm({ initialData, isEditMode = false }: PackageFormProps) {
    const router = useRouter();
    const [submitting, setSubmitting] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [destinations, setDestinations] = useState<any[]>([]);
    const [activeTab, setActiveTab] = useState("basic");

    useEffect(() => {
        const fetchDestinations = async () => {
            try {
                const res = await fetch(`${API_BASE_URL}/api/destinations`, {
                    credentials: 'include'
                });
                if (res.ok) {
                    const data = await res.json();
                    setDestinations(data);
                }
            } catch (error) {
                console.error("Failed to fetch destinations", error);
            }
        };
        fetchDestinations();
    }, []);

    const defaultValues = {
        title: initialData?.title || '',
        location: initialData?.location || '',
        duration: initialData?.duration || 3,
        price: initialData?.price || 0,
        originalPrice: initialData?.originalPrice || 0,
        rating: initialData?.rating || 0,
        reviewsCount: initialData?.reviewsCount || 0,
        isBestSeller: initialData?.isBestSeller || false,
        category: initialData?.category || 'Adventure',
        groupSize: initialData?.groupSize || 'Fixed Departure',
        overview: initialData?.overview || '',
        image: initialData?.image || '',
        altText: initialData?.altText || '',
        verticalImage: initialData?.verticalImage || '',
        gallery: initialData?.gallery || [],
        highlights: initialData?.highlights || [],
        inclusions: initialData?.inclusions || [],
        exclusions: initialData?.exclusions || [],
        thingsToPack: initialData?.thingsToPack || [],
        itinerary: (initialData?.itinerary || []).map((day: any) => ({
            day: day.day || 1,
            title: day.title || '',
            description: day.description || '',
            highlights: day.highlights || [],
            meals: (day.meals && !Array.isArray(day.meals)) 
                ? day.meals 
                : { 
                    breakfastIncluded: Array.isArray(day.meals) ? day.meals.some((m: string) => m.toLowerCase().includes('break')) : false,
                    lunchIncluded: Array.isArray(day.meals) ? day.meals.some((m: string) => m.toLowerCase().includes('lunch')) : false,
                    dinnerIncluded: Array.isArray(day.meals) ? day.meals.some((m: string) => m.toLowerCase().includes('dinner')) : false
                },
            activities: day.activities || [],
            detailedActivities: day.detailedActivities || [],
            stay: day.stay || null,
            itineraryImages: day.itineraryImages || [],
            flights: day.flights || []
        })),
        itinerarySummary: initialData?.itinerarySummary || '',
        policies: {
            cancellation: initialData?.policies?.cancellation || '',
            refund: initialData?.policies?.refund || '',
            payment: initialData?.policies?.payment || ''
        },
        faqs: initialData?.faqs || [],
        status: initialData?.status || 'published',
        showOnHomepage: initialData?.showOnHomepage || false,
        showInCollections: initialData?.showInCollections || true,
        isTrending: initialData?.isTrending || false,
        isAlmostFull: initialData?.isAlmostFull || false,
        tags: initialData?.tags || [],
        homepageSections: initialData?.homepageSections || [],
        slug: initialData?.slug || '',
        seo: {
            title: initialData?.seo?.title || '',
            description: initialData?.seo?.description || '',
            keywords: initialData?.seo?.keywords || '',
        },
        inclusionHighlights: initialData?.inclusionHighlights || [],
        regionBreakdown: initialData?.regionBreakdown || '',
        validityDate: initialData?.validityDate || '',
        pickupPoint: initialData?.pickupPoint || '',
        dropPoint: initialData?.dropPoint || '',
    };

    const form = useForm<PackageFormValues>({
        resolver: zodResolver(packageSchema) as any,
        defaultValues
    });

    const [fetchingTour, setFetchingTour] = useState<number | null>(null);

    const fetchTourDetails = async (url: string, index: number) => {
        if (!url) return;
        setFetchingTour(index);
        try {
            const res = await fetch(`${API_BASE_URL}/api/admin/fetch-tour?url=${encodeURIComponent(url)}`, {
                credentials: 'include'
            });
            if (res.ok) {
                const data = await res.json();
                if (data.title) setValue(`itinerary.${index}.title`, data.title);
                if (data.description) setValue(`itinerary.${index}.description`, data.description);
            } else {
                alert("Failed to fetch tour details. Please enter manually.");
            }
        } catch (error) {
            console.error("Fetch tour error", error);
        } finally {
            setFetchingTour(null);
        }
    };

    // Deeply nested components can trigger this event to upload images without prop drilling
    useEffect(() => {
        const handleCustomUpload = (e: Event) => {
            const customEvent = e as CustomEvent;
            const { file, fieldPath, isArray } = customEvent.detail;
            
            // Create a pseudo-event to match the expected signature
            const pseudoEvent = {
                target: { files: [file] }
            } as any;
            
            handleNestedImageUpload(pseudoEvent, fieldPath, isArray);
        };

        document.addEventListener('nestedImageUpload', handleCustomUpload);
        return () => document.removeEventListener('nestedImageUpload', handleCustomUpload);
    }, []);

    useEffect(() => {
        if (initialData) {
            // Deeply sanitize initialData to convert nulls to empty values/arrays expected by the form
            const sanitizedData = {
                ...defaultValues,
                ...initialData,
                itinerary: (initialData.itinerary || []).map((day: any) => ({
                    day: day.day || 1,
                    title: day.title || '',
                    description: day.description || '',
                    highlights: day.highlights || [],
                    meals: (day.meals && !Array.isArray(day.meals)) 
                        ? day.meals 
                        : { 
                            breakfastIncluded: Array.isArray(day.meals) ? day.meals.some((m: string) => m.toLowerCase().includes('break')) : false,
                            lunchIncluded: Array.isArray(day.meals) ? day.meals.some((m: string) => m.toLowerCase().includes('lunch')) : false,
                            dinnerIncluded: Array.isArray(day.meals) ? day.meals.some((m: string) => m.toLowerCase().includes('dinner')) : false
                        },
                    activities: day.activities || [],
                    detailedActivities: day.detailedActivities || [],
                    stay: day.stay || null,
                    itineraryImages: day.itineraryImages || [],
                    flights: day.flights || []
                })),
                gallery: initialData.gallery || [],
                tags: initialData.tags || [],
                highlights: initialData.highlights || [],
                inclusions: initialData.inclusions || [],
                exclusions: initialData.exclusions || [],
                policies: {
                    cancellation: initialData.policies?.cancellation || '',
                    refund: initialData.policies?.refund || '',
                    payment: initialData.policies?.payment || ''
                },
                regionBreakdown: initialData.regionBreakdown || '',
                validityDate: initialData.validityDate || '',
                pickupPoint: initialData.pickupPoint || '',
                dropPoint: initialData.dropPoint || '',
                altText: initialData.altText || '',
                seo: {
                    title: initialData.seo?.title || '',
                    description: initialData.seo?.description || '',
                    keywords: initialData.seo?.keywords || '',
                }
            };
            form.reset(sanitizedData as any);
        }
    }, [initialData]);

    const { control, register, handleSubmit, formState: { errors }, watch, setValue } = form;

    const title = watch('title');
    const slug = watch('slug');
    const altText = watch('altText');

    // Auto-generate slug and Alt Text from title while typing
    useEffect(() => {
        if (title) {
            // 1. Slug Generation (Only if empty or temp ID)
            if (!slug || slug.startsWith('pkg_')) {
                const generatedSlug = title
                    .toLowerCase()
                    .replace(/[^a-z0-9\s-]/g, '')
                    .replace(/\s+/g, '-')
                    .replace(/-+/g, '-')
                    .trim();

                if (generatedSlug !== slug) {
                    setValue('slug', generatedSlug, { shouldValidate: true });
                }
            }

            // 2. Alt Text Generation (Only if empty)
            if (!altText) {
                const generatedAlt = `${title} Hero Image`;
                setValue('altText', generatedAlt);
            }
        }
    }, [title, slug, altText, setValue]);

    // Field Arrays
    const { fields: highlightFields, append: appendHighlight, remove: removeHighlight } = useFieldArray({ control, name: "highlights" as any });
    const { fields: inclusionFields, append: appendInclusion, remove: removeInclusion } = useFieldArray({ control, name: "inclusions" as any });
    const { fields: exclusionFields, append: appendExclusion, remove: removeExclusion } = useFieldArray({ control, name: "exclusions" as any });
    const { fields: thingsToPackFields, append: appendThingsToPack, remove: removeThingsToPack } = useFieldArray({ control, name: "thingsToPack" as any });
    const { fields: itineraryFields, append: appendItinerary, remove: removeItinerary } = useFieldArray({ control, name: "itinerary" });
    const { fields: galleryFields, append: appendGallery, remove: removeGallery } = useFieldArray({ control, name: "gallery" as any });
    const { fields: faqFields, append: appendFaq, remove: removeFaq } = useFieldArray({ control, name: "faqs" });
    const { fields: tagFields, append: appendTag, remove: removeTag } = useFieldArray({ control, name: "tags" as any });

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, isMain: boolean = false) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const formData = new FormData();
        formData.append('image', file);

        setUploading(true);
        try {
            // Bypass Next.js proxy for large uploads by sending directly to backend
            const uploadUrl = typeof window !== 'undefined' && window.location.hostname === 'localhost'
                ? 'http://localhost:5000/api/upload'
                : `/api/upload`;

            const res = await fetch(uploadUrl, {
                method: 'POST',
                body: formData,
                credentials: 'include' // Send cookies for authMiddleware
            });
            const data = await res.json();

            if (!res.ok) throw new Error(data.message || 'Upload failed');

            if (isMain) {
                setValue('image', data.url);
            } else {
                appendGallery(data.url);
            }
        } catch (error: any) {
            console.error('Upload failed', error);
            alert(`Upload failed: ${error.message}`);
        } finally {
            setUploading(false);
        }
    };

    const handleNestedImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, fieldPath: string, isArray: boolean = false) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const formData = new FormData();
        formData.append('image', file);

        setUploading(true);
        try {
            const uploadUrl = typeof window !== 'undefined' && window.location.hostname === 'localhost'
                ? 'http://localhost:5000/api/upload'
                : `/api/upload`;

            const res = await fetch(uploadUrl, {
                method: 'POST',
                body: formData,
                credentials: 'include'
            });
            const data = await res.json();

            if (!res.ok) throw new Error(data.message || 'Upload failed');

            if (isArray) {
                // If appending to an array like itineraryImages
                const currentArr = watch(fieldPath as any) || [];
                setValue(fieldPath as any, [...currentArr, data.url], { shouldValidate: true, shouldDirty: true, shouldTouch: true });
            } else {
                // If setting a specific string like activity image
                setValue(fieldPath as any, data.url, { shouldValidate: true, shouldDirty: true, shouldTouch: true });
                // Force an update to the DOM value since deeply nested fields sometimes miss re-renders
                const el = document.querySelector(`input[name="${fieldPath}"]`) as HTMLInputElement;
                if(el) el.value = data.url;
            }
        } catch (error: any) {
            console.error('Nested upload failed', error);
            alert(`Upload failed: ${error.message}`);
        } finally {
            setUploading(false);
        }
    };

    const handleAddGalleryUrl = (url: string) => {
        if (!url) return;
        appendGallery(url);
    };

    const onSubmit = async (data: PackageFormValues) => {
        setSubmitting(true);
        try {
            const url = isEditMode
                ? `${API_BASE_URL}/api/packages/${initialData?.id}`
                : `${API_BASE_URL}/api/packages`;

            const method = isEditMode ? 'PUT' : 'POST';

            // For new packages, generate an ID if not present (backend usually handles _id, but frontend needs reference sometimes)
            // Existing schema uses 'id' as string ID. We'll let backend or simple Date.now() logic handle it if needed.
            // Actually, server/models/Package.js doesn't seem to require ID, but frontend types do. 
            // We'll generate a random string ID for new packages if backend doesn't autogenerate the string 'id' field.

            const payload = {
                ...data,
                id: isEditMode ? initialData?.id : `pkg_${Date.now()}`,
                itinerary: data.itinerary
            };

            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
                credentials: 'include' // Send cookies
            });

            if (!res.ok) {
                const errorData = await res.json().catch(() => ({}));
                throw new Error(errorData.message || 'Failed to save package');
            }

            // Force Next.js frontend to clear its cache for this new/updated package instantly 
            await fetch('/api/revalidate', { method: 'POST' }).catch(err => console.error('Cache revalidation failed', err));

            router.push('/admin/packages');
            router.refresh();
        } catch (error: any) {
            console.error(error);
            alert(`Error saving package: ${error.message}`);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <form
            onSubmit={handleSubmit(onSubmit, (errors) => {
                // Validation errors are handled by react-hook-form UI
                const errorFields = Object.keys(errors);
                let targetTab = "basic";

                // Switch to relevant tab based on error
                if (errorFields.some(field => ['overview', 'highlights', 'inclusions', 'exclusions', 'thingsToPack'].includes(field))) {
                    targetTab = "details";
                } else if (errorFields.includes('itinerary')) {
                    targetTab = "itinerary";
                } else if (errorFields.includes('image') || errorFields.includes('gallery')) {
                    targetTab = "media";
                } else if (errorFields.includes('policies')) {
                    targetTab = "policies";
                } else if (errorFields.includes('faqs')) {
                    targetTab = "faqs";
                }

                setActiveTab(targetTab);
                alert(`Validation Failed: ${errorFields.join(', ')}. Please check the ${targetTab} tab.`);
            })}
            className="space-y-8 pb-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
        >
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 py-6 border-b border-gray-100 mb-8">
                <div className="flex items-center gap-4">
                    <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => router.back()}
                        className="rounded-full hover:bg-gray-100 text-gray-500 hover:text-gray-900"
                    >
                        <ArrowLeft className="h-5 w-5" />
                    </Button>
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight text-gray-900">{isEditMode ? `Edit Package` : 'Create Package'}</h1>
                        <p className="text-gray-500 text-sm mt-1">Manage details, itinerary, and media for this package</p>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => router.back()}
                        className="rounded-xl border-gray-200 text-gray-600 hover:bg-gray-50 hover:text-gray-900 font-medium"
                    >
                        Cancel
                    </Button>
                    <Button
                        type="submit"
                        disabled={submitting || uploading}
                        className="bg-[#CD1C18] hover:bg-[#9B1313] text-white rounded-xl px-6 font-medium shadow-lg shadow-[#CD1C18]/20 transition-all hover:shadow-[#CD1C18]/40"
                    >
                        {submitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        <Save className="mr-2 h-4 w-4" />
                        Save Changes
                    </Button>
                </div>
            </div>

            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="w-full justify-start overflow-x-auto bg-transparent border-b border-gray-200 p-0 h-auto gap-1 mb-8 no-scrollbar scroll-smooth">
                    {['basic', 'details', 'itinerary', 'media', 'policies', 'faqs', 'seo'].map((tab) => (
                        <TabsTrigger
                            key={tab}
                            value={tab}
                            className="rounded-none border-b-2 border-transparent px-4 py-3 text-sm font-medium text-gray-500 hover:text-gray-700 data-[state=active]:border-[#CD1C18] data-[state=active]:text-[#CD1C18] data-[state=active]:bg-transparent transition-all capitalize"
                        >
                            {tab}
                        </TabsTrigger>
                    ))}
                </TabsList>

                {/* BASIC INFO */}
                <TabsContent value="basic" className="space-y-6 animate-in fade-in-50 slide-in-from-bottom-2 duration-300">
                    <Card className="border-none shadow-sm ring-1 ring-gray-100 rounded-2xl overflow-hidden bg-white">
                        <CardContent className="p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="col-span-1 md:col-span-2 space-y-2">
                                <Label className="text-base font-semibold text-gray-900">Package Title</Label>
                                <Input {...register('title')} className="h-12 rounded-xl border-gray-200 focus:border-[#CD1C18] focus:ring-[#CD1C18]/20 text-lg" placeholder="e.g. Magical Bali Escape" />
                                {errors.title && <p className="text-sm text-red-500">{errors.title.message}</p>}
                            </div>

                            <div className="space-y-2">
                                <Label className="text-sm font-medium text-gray-700">Display Location</Label>
                                <div className="relative">
                                    <select
                                        className="flex h-11 w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm ring-offset-background disabled:cursor-not-allowed disabled:opacity-50 focus:border-[#CD1C18] focus:ring-4 focus:ring-[#CD1C18]/10 outline-none transition-all appearance-none"
                                        {...register('location')}
                                    >
                                        <option value="">Select Destination</option>
                                        {destinations.map(dest => (
                                            <option key={dest._id || dest.id} value={dest.name}>
                                                {dest.name}
                                            </option>
                                        ))}
                                    </select>
                                    <div className="absolute right-3 top-3 pointer-events-none text-gray-500">
                                        <ChevronDown className="h-4 w-4" />
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label className="text-sm font-medium text-gray-700">Region Breakdown (Tour Summary Bar)</Label>
                                <Input 
                                    {...register('regionBreakdown')} 
                                    className="h-11 rounded-xl border-gray-200 focus:border-[#CD1C18] focus:ring-[#CD1C18]/20" 
                                    placeholder="e.g. 3D Singapore • 4D Kuta" 
                                />
                                <p className="text-[10px] text-gray-400 ml-1">Appears as a highlight bar on the package card</p>
                            </div>

                            <div className="space-y-2">
                                <Label className="text-sm font-medium text-gray-700">Category</Label>
                                <div className="relative">
                                    <select
                                        className="flex h-11 w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm ring-offset-background disabled:cursor-not-allowed disabled:opacity-50 focus:border-[#CD1C18] focus:ring-4 focus:ring-[#CD1C18]/10 outline-none transition-all appearance-none"
                                        {...register('category')}
                                    >
                                        {CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                                    </select>
                                    <div className="absolute right-3 top-3 pointer-events-none text-gray-500">
                                        <ChevronDown className="h-4 w-4" />
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label className="text-sm font-medium text-gray-700">Price (₹)</Label>
                                <div className="relative">
                                    <span className="absolute left-3 top-2.5 text-gray-500">₹</span>
                                    <Input type="number" {...register('price')} className="h-11 pl-7 rounded-xl border-gray-200 focus:border-[#CD1C18] focus:ring-[#CD1C18]/20" />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label className="text-sm font-medium text-gray-700">Original Price (₹)</Label>
                                <div className="relative">
                                    <span className="absolute left-3 top-2.5 text-gray-500">₹</span>
                                    <Input type="number" {...register('originalPrice')} className="h-11 pl-7 rounded-xl border-gray-200 focus:border-[#CD1C18] focus:ring-[#CD1C18]/20" />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label className="text-sm font-medium text-gray-700">Pickup Point</Label>
                                <Input 
                                    {...register('pickupPoint')} 
                                    className="h-11 rounded-xl border-gray-200 focus:border-[#CD1C18] focus:ring-[#CD1C18]/20" 
                                    placeholder="e.g. Delhi - IGI Airport" 
                                />
                            </div>

                            <div className="space-y-2">
                                <Label className="text-sm font-medium text-gray-700">Drop Point</Label>
                                <Input 
                                    {...register('dropPoint')} 
                                    className="h-11 rounded-xl border-gray-200 focus:border-[#CD1C18] focus:ring-[#CD1C18]/20" 
                                    placeholder="e.g. Bangkok - Suvarnabhumi Airport" 
                                />
                            </div>

                            <div className="space-y-2">
                                <Label className="text-sm font-medium text-gray-700">Duration (Days)</Label>
                                <Input type="number" {...register('duration')} className="h-11 rounded-xl border-gray-200 focus:border-[#CD1C18] focus:ring-[#CD1C18]/20" />
                            </div>

                            {/* Tags Section */}
                            <div className="col-span-1 md:col-span-2 space-y-4 pt-4 border-t border-gray-100">
                                <div className="flex justify-between items-center">
                                    <Label className="text-sm font-medium text-gray-700">Tags</Label>
                                    <Button type="button" size="sm" variant="outline" onClick={() => appendTag("New Tag")} className="rounded-lg">
                                        <Plus className="h-3 w-3 mr-1" /> Add Tag
                                    </Button>
                                </div>
                                <div className="flex flex-wrap gap-3">
                                    {tagFields.map((field, index) => (
                                        <div key={field.id} className="flex gap-2 items-center bg-blue-50 border border-blue-100 rounded-full pl-4 pr-2 py-1.5 hover:border-blue-300 transition-colors">
                                            <Input
                                                className="w-32 h-6 text-sm border-0 bg-transparent p-0 focus-visible:ring-0 placeholder:text-blue-300 text-blue-700"
                                                {...register(`tags.${index}` as any)}
                                                placeholder="Tag name"
                                            />
                                            <button type="button" onClick={() => removeTag(index)} className="w-6 h-6 flex items-center justify-center rounded-full text-blue-400 hover:text-red-500 hover:bg-red-50 transition-colors">
                                                <X className="h-3 w-3" />
                                            </button>
                                        </div>
                                    ))}
                                    {tagFields.length === 0 && (
                                        <p className="text-sm text-gray-400 italic">No tags added. Add tags for better filtering (e.g., "Summer", "Honeymoon").</p>
                                    )}
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label className="text-sm font-medium text-gray-700">Group Size Label</Label>
                                <Input {...register('groupSize')} className="h-11 rounded-xl border-gray-200 focus:border-[#CD1C18] focus:ring-[#CD1C18]/20" placeholder="e.g. Max 12 or Fixed Departure" />
                            </div>

                            <div className="space-y-2">
                                <Label className="text-sm font-medium text-gray-700">Validity Date (For Fixed Departure)</Label>
                                <Input {...register('validityDate')} className="h-11 rounded-xl border-gray-200 focus:border-[#CD1C18] focus:ring-[#CD1C18]/20" placeholder="e.g. Valid until Oct 30" />
                                <p className="text-[10px] text-gray-400 ml-1">e.g. Valid until Oct 30, 2024</p>
                            </div>

                            <div className="col-span-1 md:col-span-2 pt-4 flex items-center gap-3 p-4 bg-amber-50 rounded-xl border border-amber-100">
                                <Controller
                                    control={control}
                                    name="isBestSeller"
                                    render={({ field }) => (
                                        <Switch
                                            checked={field.value}
                                            onCheckedChange={field.onChange}
                                            className="data-[state=checked]:bg-amber-500"
                                        />
                                    )}
                                />
                                <div>
                                    <Label className="text-base font-semibold text-gray-900">Mark as Best Seller</Label>
                                    <p className="text-sm text-gray-500">Enable this to feature the package with a 'Best Seller' badge</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* DETAILS */}
                <TabsContent value="details" className="space-y-6 animate-in fade-in-50 slide-in-from-bottom-2 duration-300">
                    <Card className="border-none shadow-sm ring-1 ring-gray-100 rounded-2xl overflow-hidden bg-white">
                        <CardContent className="p-8 space-y-8">
                            <div className="space-y-2">
                                <Label className="text-base font-semibold text-gray-900">Overview</Label>
                                <Textarea className="min-h-[180px] rounded-xl border-gray-200 focus:border-[#CD1C18] focus:ring-[#CD1C18]/20 resize-y" {...register('overview')} placeholder="Describe the package in detail..." />
                            </div>

                            <div className="space-y-4 pt-4 border-t border-gray-100">
                                <Label className="text-base font-semibold text-gray-900">Inclusion Highlights (Icons)</Label>
                                <p className="text-sm text-gray-500 mb-4">Select the key features that should appear as icons on the package page.</p>
                                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
                                    {[
                                        { id: 'flight', label: 'Flights' },
                                        { id: 'stay', label: 'Stay' },
                                        { id: 'transfer', label: 'Transfer' },
                                        { id: 'breakfast', label: 'Breakfast' },
                                        { id: 'sightseeing', label: 'Sightseeing' },
                                        { id: 'visa', label: 'Visa' },
                                        { id: 'insurance', label: 'Insurance' }
                                    ].map((icon) => (
                                        <div key={icon.id} className="flex items-center space-x-2 bg-gray-50 p-2.5 rounded-lg border border-gray-100 group hover:bg-white hover:border-[#CD1C18]/30 transition-all">
                                            <Controller
                                                control={control}
                                                name="inclusionHighlights"
                                                render={({ field }) => {
                                                    const current = field.value || [];
                                                    const isChecked = current.includes(icon.id);
                                                    return (
                                                        <div className="flex items-center space-x-2">
                                                            <input
                                                                type="checkbox"
                                                                id={`icon-${icon.id}`}
                                                                className="w-4 h-4 rounded border-gray-300 text-[#CD1C18] focus:ring-[#CD1C18]"
                                                                checked={isChecked}
                                                                onChange={(e) => {
                                                                    const updated = e.target.checked
                                                                        ? [...current, icon.id]
                                                                        : current.filter(id => id !== icon.id);
                                                                    field.onChange(updated);
                                                                }}
                                                            />
                                                            <Label htmlFor={`icon-${icon.id}`} className="cursor-pointer text-[13px] font-medium leading-none text-gray-600 group-hover:text-gray-900">
                                                                {icon.label}
                                                            </Label>
                                                        </div>
                                                    );
                                                }}
                                            />
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                                {/* Highlights */}
                                <div className="space-y-4">
                                    <div className="flex justify-between items-center">
                                        <Label className="text-base font-semibold text-gray-900">Highlights</Label>
                                        <Button type="button" size="sm" variant="ghost" onClick={() => appendHighlight("New Highlight")} className="text-[#CD1C18] hover:text-[#9B1313] hover:bg-red-50">
                                            <Plus className="h-4 w-4 mr-1" /> Add
                                        </Button>
                                    </div>
                                    <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                                        {highlightFields.map((field, index) => (
                                            <div key={field.id} className="flex gap-2 group">
                                                <div className="flex-1">
                                                    <Input {...register(`highlights.${index}` as any)} className="h-10 rounded-lg border-gray-200 focus:border-[#CD1C18] focus:ring-[#CD1C18]/20" />
                                                </div>
                                                <Button type="button" size="icon" variant="ghost" onClick={() => removeHighlight(index)} className="text-gray-400 group-hover:text-red-500 hover:bg-red-50 rounded-lg opacity-0 group-hover:opacity-100 transition-all">
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Inclusions */}
                                <div className="space-y-4">
                                    <div className="flex justify-between items-center">
                                        <Label className="text-base font-semibold text-gray-900">Inclusions</Label>
                                        <Button type="button" size="sm" variant="ghost" onClick={() => appendInclusion("New Inclusion")} className="text-[#CD1C18] hover:text-[#9B1313] hover:bg-red-50">
                                            <Plus className="h-4 w-4 mr-1" /> Add
                                        </Button>
                                    </div>
                                    <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                                        {inclusionFields.map((field, index) => (
                                            <div key={field.id} className="flex gap-2 group">
                                                <div className="flex-1">
                                                    <Input {...register(`inclusions.${index}` as any)} className="h-10 rounded-lg border-gray-200 focus:border-[#CD1C18] focus:ring-[#CD1C18]/20" />
                                                </div>
                                                <Button type="button" size="icon" variant="ghost" onClick={() => removeInclusion(index)} className="text-gray-400 group-hover:text-red-500 hover:bg-red-50 rounded-lg opacity-0 group-hover:opacity-100 transition-all">
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Exclusions */}
                                <div className="space-y-4">
                                    <div className="flex justify-between items-center">
                                        <Label className="text-base font-semibold text-gray-900">Exclusions</Label>
                                        <Button type="button" size="sm" variant="ghost" onClick={() => appendExclusion("New Exclusion")} className="text-[#CD1C18] hover:text-[#9B1313] hover:bg-red-50">
                                            <Plus className="h-4 w-4 mr-1" /> Add
                                        </Button>
                                    </div>
                                    <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                                        {exclusionFields.map((field, index) => (
                                            <div key={field.id} className="flex gap-2 group">
                                                <div className="flex-1">
                                                    <Input {...register(`exclusions.${index}` as any)} className="h-10 rounded-lg border-gray-200 focus:border-[#CD1C18] focus:ring-[#CD1C18]/20" />
                                                </div>
                                                <Button type="button" size="icon" variant="ghost" onClick={() => removeExclusion(index)} className="text-gray-400 group-hover:text-red-500 hover:bg-red-50 rounded-lg opacity-0 group-hover:opacity-100 transition-all">
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Things to Pack */}
                            <div className="space-y-4 pt-6 border-t border-gray-100">
                                <div className="flex justify-between items-center">
                                    <Label className="text-base font-semibold text-gray-900">Things to Pack</Label>
                                    <Button type="button" size="sm" variant="outline" onClick={() => appendThingsToPack("Item")} className="rounded-lg">
                                        <Plus className="h-3 w-3 mr-1" /> Add Item
                                    </Button>
                                </div>
                                <div className="flex flex-wrap gap-3">
                                    {thingsToPackFields.map((field, index) => (
                                        <div key={field.id} className="flex gap-2 items-center bg-gray-50 border border-gray-200 rounded-full pl-4 pr-2 py-1.5 hover:border-gray-300 transition-colors">
                                            <Input className="w-32 h-6 text-sm border-0 bg-transparent p-0 focus-visible:ring-0 placeholder:text-gray-400" {...register(`thingsToPack.${index}` as any)} placeholder="Item name" />
                                            <button type="button" onClick={() => removeThingsToPack(index)} className="w-6 h-6 flex items-center justify-center rounded-full text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors">
                                                <X className="h-3 w-3" />
                                            </button>
                                        </div>
                                    ))}
                                    {thingsToPackFields.length === 0 && (
                                        <p className="text-sm text-gray-400 italic">No items added yet.</p>
                                    )}
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* ITINERARY */}
                <TabsContent value="itinerary" className="space-y-6 animate-in fade-in-50 slide-in-from-bottom-2 duration-300">
                    <Card className="border-none shadow-sm ring-1 ring-gray-100 rounded-2xl overflow-hidden bg-white">
                        <CardContent className="p-8">
                            <div className="flex justify-between items-center mb-8">
                                <div>
                                    <Label className="text-xl font-bold text-gray-900">Daily Itinerary</Label>
                                    <p className="text-sm text-gray-500 mt-1">Plan the day-by-day experience for travelers</p>
                                </div>
                                <Button type="button" onClick={() => appendItinerary({ 
                                    day: itineraryFields.length + 1, 
                                    title: '', 
                                    description: '', 
                                    highlights: [], 
                                    meals: { breakfastIncluded: false, lunchIncluded: false, dinnerIncluded: false } 
                                })} className="bg-gray-900 hover:bg-black text-white rounded-xl">
                                    <Plus className="mr-2 h-4 w-4" /> Add Day {itineraryFields.length + 1}
                                </Button>
                            </div>

                            <div className="space-y-6 relative before:absolute before:left-4 before:top-4 before:bottom-4 before:w-0.5 before:bg-gray-100 before:content-[''] pl-0 md:pl-4">
                                {itineraryFields.map((field, index) => (
                                    <div key={field.id} className="relative pl-8 md:pl-12">
                                        <div className="absolute left-0 top-0 w-8 h-8 md:w-10 md:h-10 rounded-full bg-white border-4 border-gray-100 flex items-center justify-center font-bold text-gray-500 shadow-sm z-10">
                                            {index + 1}
                                        </div>
                                        <Card className="border border-gray-100 shadow-sm hover:shadow-md transition-shadow rounded-xl">
                                            <CardContent className="p-4 md:p-6 space-y-4">
                                                <div className="flex justify-between items-start gap-4">
                                                    <div className="flex-1 space-y-4">
                                                        <Input
                                                            placeholder={`Day ${index + 1} Title`}
                                                            className="h-12 text-lg font-bold border-transparent bg-transparent hover:bg-gray-50 focus:bg-white focus:border-[#CD1C18] focus:ring-[#CD1C18]/10 rounded-xl px-2 transition-all"
                                                            {...register(`itinerary.${index}.title` as const)}
                                                        />

                                                        <Textarea
                                                            placeholder="Describe the activities for this day..."
                                                            className="min-h-[100px] bg-gray-50 border-gray-100 rounded-xl resize-y focus:bg-white focus:border-[#CD1C18] px-4 py-3 text-sm text-gray-700 transition-all shadow-inner"
                                                            {...register(`itinerary.${index}.description` as const)}
                                                        />

                                                        <div className="pt-4 space-y-4">
                                                            <div className="flex items-center justify-between">
                                                                <Label className="text-sm font-semibold text-gray-800 flex items-center gap-2">
                                                                    <Stars className="w-4 h-4 text-amber-500" />
                                                                    Day Highlights (for Scrolling Ticker)
                                                                </Label>
                                                                <Button 
                                                                    type="button" 
                                                                    variant="ghost" 
                                                                    size="sm" 
                                                                    onClick={() => {
                                                                        const current = watch(`itinerary.${index}.highlights` as any) || [];
                                                                        setValue(`itinerary.${index}.highlights` as any, [...current, ""]);
                                                                    }}
                                                                    className="text-[#CD1C18] hover:text-[#9B1313] text-xs h-7"
                                                                >
                                                                    <Plus className="w-3 h-3 mr-1" /> Add Highlight
                                                                </Button>
                                                            </div>

                                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                                                {(watch(`itinerary.${index}.highlights` as any) || []).map((_: any, hIdx: number) => (
                                                                    <div key={hIdx} className="flex gap-2">
                                                                        <Input 
                                                                            {...register(`itinerary.${index}.highlights.${hIdx}` as any)}
                                                                            placeholder="e.g. City Tour, Private Transfer"
                                                                            className="h-9 rounded-lg text-xs"
                                                                        />
                                                                        <Button 
                                                                            type="button" 
                                                                            size="icon" 
                                                                            variant="ghost" 
                                                                            onClick={() => {
                                                                                const current = watch(`itinerary.${index}.highlights` as any) || [];
                                                                                setValue(`itinerary.${index}.highlights` as any, current.filter((_: any, j: number) => j !== hIdx));
                                                                            }}
                                                                            className="text-gray-400 hover:text-red-500 h-9 w-9"
                                                                        >
                                                                            <Trash2 className="w-3.5 h-3.5" />
                                                                        </Button>
                                                                    </div>
                                                                ))}
                                                                {(watch(`itinerary.${index}.highlights` as any) || []).length === 0 && (
                                                                    <p className="text-[11px] text-gray-400 italic col-span-2 px-2">No dynamic highlights added for this day.</p>
                                                                )}
                                                            </div>

                                                            <div className="pt-4 border-t border-gray-100">
                                                                <Label className="text-sm font-semibold text-gray-800 flex items-center gap-2 mb-3">
                                                                    <Utensils className="w-4 h-4 text-green-500" />
                                                                    Meals Provided
                                                                </Label>
                                                                <div className="flex flex-wrap gap-6 px-2">
                                                                    <div className="flex items-center gap-2">
                                                                        <Controller
                                                                            control={control}
                                                                            name={`itinerary.${index}.meals.breakfastIncluded`}
                                                                            render={({ field }) => <Switch checked={field.value} onCheckedChange={field.onChange} />}
                                                                        />
                                                                        <span className="text-xs font-medium text-gray-600">Breakfast</span>
                                                                    </div>
                                                                    <div className="flex items-center gap-2">
                                                                        <Controller
                                                                            control={control}
                                                                            name={`itinerary.${index}.meals.lunchIncluded`}
                                                                            render={({ field }) => <Switch checked={field.value} onCheckedChange={field.onChange} />}
                                                                        />
                                                                        <span className="text-xs font-medium text-gray-600">Lunch</span>
                                                                    </div>
                                                                    <div className="flex items-center gap-2">
                                                                        <Controller
                                                                            control={control}
                                                                            name={`itinerary.${index}.meals.dinnerIncluded`}
                                                                            render={({ field }) => <Switch checked={field.value} onCheckedChange={field.onChange} />}
                                                                        />
                                                                        <span className="text-xs font-medium text-gray-600">Dinner</span>
                                                                    </div>
                                                                </div>
                                                            </div>

                                                            {/* Tours & Activities Block */}
                                                            <div className="pt-4 border-t border-gray-100 mt-4">
                                                                <div className="flex items-center justify-between mb-3">
                                                                    <Label className="text-sm font-semibold text-gray-800 flex items-center gap-2">
                                                                        <MapPin className="w-4 h-4 text-blue-500" />
                                                                        Tours & Activities
                                                                    </Label>
                                                                    <Button 
                                                                        type="button" 
                                                                        variant="ghost" 
                                                                        size="sm" 
                                                                        onClick={() => {
                                                                            const current = watch(`itinerary.${index}.detailedActivities` as any) || [];
                                                                            setValue(`itinerary.${index}.detailedActivities` as any, [...current, { title: '', image: '' }]);
                                                                        }}
                                                                        className="text-[#CD1C18] hover:text-[#9B1313] text-xs h-7"
                                                                    >
                                                                        <Plus className="w-3 h-3 mr-1" /> Add Activity
                                                                    </Button>
                                                                </div>
                                                                
                                                                <div className="space-y-3">
                                                                    {(watch(`itinerary.${index}.detailedActivities` as any) || []).map((activity: any, actIdx: number) => (
                                                                        <div key={actIdx} className="flex flex-col gap-3 p-3 bg-gray-50 border border-gray-100 rounded-xl relative group">
                                                                            <Button 
                                                                                type="button" 
                                                                                size="icon" 
                                                                                variant="ghost" 
                                                                                onClick={() => {
                                                                                    const current = watch(`itinerary.${index}.detailedActivities` as any) || [];
                                                                                    setValue(`itinerary.${index}.detailedActivities` as any, current.filter((_: any, j: number) => j !== actIdx));
                                                                                }}
                                                                                className="absolute top-2 right-2 text-gray-400 hover:text-red-500 h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                                                                            >
                                                                                <Trash2 className="w-4 h-4" />
                                                                            </Button>
                                                                            
                                                                            <div className="pr-10">
                                                                                <Label className="text-xs text-gray-500 mb-1 block">Activity Title</Label>
                                                                                <Input 
                                                                                    {...register(`itinerary.${index}.detailedActivities.${actIdx}.title` as any)}
                                                                                    placeholder="e.g. Scuba Diving at Coral Reef"
                                                                                    className="h-9 rounded-lg text-sm bg-white"
                                                                                />
                                                                            </div>
                                                                            
                                                                            <div>
                                                                                <Label className="text-xs text-gray-500 mb-1 block">Activity Image</Label>
                                                                                <div className="flex gap-2">
                                                                                    <Input 
                                                                                        {...register(`itinerary.${index}.detailedActivities.${actIdx}.image` as any)}
                                                                                        placeholder="Image URL"
                                                                                        className="h-9 rounded-lg text-sm bg-white flex-1"
                                                                                    />
                                                                                    <div className="relative overflow-hidden w-9 h-9 rounded-lg bg-white border border-gray-200 flex items-center justify-center hover:border-[#CD1C18] shrink-0 cursor-pointer shadow-sm group/btn">
                                                                                        <ImageIcon className="w-4 h-4 text-gray-400 group-hover/btn:text-[#CD1C18]" />
                                                                                        <input 
                                                                                            type="file" 
                                                                                            className="absolute inset-0 opacity-0 cursor-pointer"
                                                                                            accept="image/*"
                                                                                            onChange={(e) => {
                                                                                                const file = e.target.files?.[0];
                                                                                                if(file) {
                                                                                                    const event = new CustomEvent('nestedImageUpload', {
                                                                                                        detail: {
                                                                                                            file,
                                                                                                            fieldPath: `itinerary.${index}.detailedActivities.${actIdx}.image`,
                                                                                                            isArray: false
                                                                                                        }
                                                                                                    });
                                                                                                    document.dispatchEvent(event);
                                                                                                }
                                                                                            }}
                                                                                        />
                                                                                    </div>
                                                                                </div>
                                                                            </div>

                                                                            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                                                                <div>
                                                                                    <Label className="text-xs text-gray-500 mb-1 block">Time</Label>
                                                                                    <Input 
                                                                                        {...register(`itinerary.${index}.detailedActivities.${actIdx}.time` as any)}
                                                                                        placeholder="e.g. 09:00 AM"
                                                                                        className="h-9 rounded-lg text-sm bg-white"
                                                                                    />
                                                                                </div>
                                                                                <div>
                                                                                    <Label className="text-xs text-gray-500 mb-1 block">Duration</Label>
                                                                                    <Input 
                                                                                        {...register(`itinerary.${index}.detailedActivities.${actIdx}.duration` as any)}
                                                                                        placeholder="e.g. 2 Hours"
                                                                                        className="h-9 rounded-lg text-sm bg-white"
                                                                                    />
                                                                                </div>
                                                                                <div>
                                                                                    <Label className="text-xs text-gray-500 mb-1 block">Transfer</Label>
                                                                                    <select 
                                                                                        {...register(`itinerary.${index}.detailedActivities.${actIdx}.transferType` as any)}
                                                                                        className="w-full h-9 rounded-lg text-sm bg-white border border-gray-200 px-3 outline-none focus:ring-2 focus:ring-[#CD1C18]/20 transition-all text-gray-700"
                                                                                    >
                                                                                        <option value="">None / NA</option>
                                                                                        <option value="Private">Private (PVT)</option>
                                                                                        <option value="Shared">Shared (SIC)</option>
                                                                                    </select>
                                                                                </div>
                                                                            </div>

                                                                            <div>
                                                                                <Label className="text-xs text-gray-500 mb-1 block">Description</Label>
                                                                                <Textarea 
                                                                                    {...register(`itinerary.${index}.detailedActivities.${actIdx}.description` as any)}
                                                                                    placeholder="Detailed description of the activity..."
                                                                                    className="rounded-lg text-sm bg-white min-h-[80px]"
                                                                                />
                                                                            </div>
                                                                        </div>
                                                                    ))}
                                                                    {(watch(`itinerary.${index}.detailedActivities` as any) || []).length === 0 && (
                                                                        <p className="text-[11px] text-gray-400 italic px-2">No activities added for this day.</p>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <Button type="button" variant="ghost" size="icon" onClick={() => removeItinerary(index)} className="text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg shrink-0 mt-2">
                                                        <Trash2 className="h-5 w-5" />
                                                    </Button>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    </div>
                                ))}
                                {itineraryFields.length === 0 && (
                                    <div className="text-center py-12 pl-8">
                                        <p className="text-gray-400">No itinerary days added yet. Click "Add Day" to start.</p>
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* MEDIA */}
                <TabsContent value="media" className="space-y-6 animate-in fade-in-50 slide-in-from-bottom-2 duration-300">
                    <Card className="border-none shadow-sm ring-1 ring-gray-100 rounded-2xl overflow-hidden bg-white">
                        <CardContent className="p-8 space-y-8">
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <Label className="text-base font-semibold text-gray-900">Main Cover Image</Label>
                                    <span className="text-xs text-gray-500 font-medium">Auto-resized. Max: 20MB</span>
                                </div>
                                <p className="text-xs text-blue-600 bg-blue-50 p-2 rounded-md">
                                    Recommended shape: Landscape (e.g., 16:9 ratio, 1200x800px).
                                </p>
                                <div className="flex flex-col gap-4">
                                    {/* Image Preview */}
                                    <div className="relative w-full md:w-80 aspect-video bg-gray-50 rounded-2xl overflow-hidden border border-gray-100 shadow-sm group">
                                        {watch('image') ? (
                                            <img src={watch('image')} className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" />
                                        ) : (
                                            <div className="h-full w-full flex flex-col items-center justify-center text-gray-400 gap-2">
                                                <Upload className="h-8 w-8 opacity-20" />
                                                <span className="text-sm">No Image Selected</span>
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex-1 space-y-4 w-full">
                                        <div className="space-y-2">
                                            <Label className="text-sm text-gray-500">Image URL</Label>
                                            <Input {...register('image')} placeholder="https://..." className="h-11 rounded-xl" />
                                        </div>
                                        <div className="space-y-1">
                                            <Label className="text-[10px] font-bold uppercase tracking-widest text-brand/70">SEO: Hero Image Alt Text</Label>
                                            <Input {...register('altText')} placeholder="Describe the image for SEO (e.g. Couple enjoying Bali sunset)" className="h-9 rounded-lg text-sm border-brand/20 focus:border-brand focus:ring-brand/10 bg-brand/[0.02]" />
                                            <p className="text-[9px] text-gray-400 italic">Helps Google understand this image and improves rankings.</p>
                                        </div>
                                        <div className="relative">
                                            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                                <span className="text-sm text-gray-500 font-medium">OR</span>
                                            </div>
                                            <div className="border-t border-gray-200 my-4"></div>
                                        </div>
                                        <div className="relative group">
                                            <Button type="button" variant="outline" className="w-full h-12 rounded-xl border-dashed border-2 border-gray-200 hover:border-[#CD1C18] hover:bg-[#CD1C18]/5 hover:text-[#CD1C18] transition-all">
                                                <Upload className="mr-2 h-4 w-4" /> Upload New Image
                                            </Button>
                                            <input
                                                type="file"
                                                className="absolute inset-0 opacity-0 cursor-pointer"
                                                onChange={(e) => handleImageUpload(e, true)}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="border-t border-gray-100 pt-8 space-y-4">
                                <div className="flex justify-between items-center">
                                    <div>
                                        <Label className="text-base font-semibold text-gray-900">Gallery Images</Label>
                                        <p className="text-sm text-gray-500 mt-1">Add additional photos for the gallery slider</p>
                                    </div>
                                    <span className="text-sm bg-gray-100 text-gray-600 px-3 py-1 rounded-full">{galleryFields.length} Images</span>
                                </div>

                                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
                                    {galleryFields.map((field, index) => (
                                        <div key={field.id} className="relative aspect-square bg-gray-50 rounded-xl overflow-hidden group shadow-sm ring-1 ring-gray-100">
                                            <img src={watch(`gallery.${index}` as any)} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110" />
                                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
                                            <Button
                                                type="button"
                                                variant="destructive"
                                                size="icon"
                                                className="absolute top-2 right-2 h-8 w-8 rounded-lg opacity-0 group-hover:opacity-100 transition-all scale-90 group-hover:scale-100"
                                                onClick={() => removeGallery(index)}
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    ))}
                                    <div className="aspect-square bg-gray-50 border-2 border-dashed border-gray-200 rounded-xl flex flex-col items-center justify-center hover:border-[#CD1C18] hover:bg-[#CD1C18]/5 transition-all cursor-pointer relative group">
                                        <div className="h-10 w-10 rounded-full bg-white shadow-sm flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                                            <Plus className="h-5 w-5 text-gray-400 group-hover:text-[#CD1C18]" />
                                        </div>
                                        <span className="text-xs font-medium text-gray-500 group-hover:text-[#CD1C18]">Add Photo</span>
                                        <input
                                            type="file"
                                            className="absolute inset-0 opacity-0 cursor-pointer"
                                            onChange={(e) => handleImageUpload(e, false)}
                                        />
                                    </div>

                                    {/* Add via URL Button */}
                                    <Popover>
                                        <PopoverTrigger asChild>
                                            <div className="aspect-square bg-gray-50 border-2 border-dashed border-gray-200 rounded-xl flex flex-col items-center justify-center hover:border-blue-500 hover:bg-blue-50 hover:text-blue-500 transition-all cursor-pointer relative group">
                                                <div className="h-10 w-10 rounded-full bg-white shadow-sm flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                                                    <LinkIcon className="h-5 w-5 text-gray-400 group-hover:text-blue-500" />
                                                </div>
                                                <span className="text-xs font-medium text-blue-600 group-hover:text-blue-700">Add via URL</span>
                                            </div>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-80 p-4 bg-white rounded-2xl shadow-xl ring-1 ring-gray-100 border-0">
                                            <div className="space-y-4">
                                                <h4 className="font-semibold text-sm">Add Image from URL</h4>
                                                <div className="flex gap-2">
                                                    <Input
                                                        placeholder="https://example.com/image.jpg"
                                                        className="h-9"
                                                        onKeyDown={(e) => {
                                                            if (e.key === 'Enter') {
                                                                e.preventDefault();
                                                                handleAddGalleryUrl(e.currentTarget.value);
                                                                e.currentTarget.value = '';
                                                            }
                                                        }}
                                                    />
                                                    <Button size="sm" onClick={(e) => {
                                                        const input = e.currentTarget.previousElementSibling as HTMLInputElement;
                                                        handleAddGalleryUrl(input.value);
                                                        input.value = '';
                                                    }}>Add</Button>
                                                </div>
                                            </div>
                                        </PopoverContent>
                                    </Popover>
                                </div>
                            </div>

                            <div className="border-t border-gray-100 pt-8 space-y-4">
                                <div className="flex items-center justify-between">
                                    <Label className="text-base font-semibold text-gray-900">Portrait Mobile Image <span className="text-[#CD1C18]">*Budget Friendly</span></Label>
                                    <span className="text-xs text-gray-500 font-medium">9:16 Aspect Ratio</span>
                                </div>
                                <p className="text-xs text-rose-600 bg-rose-50 p-2 rounded-md font-medium">
                                    This vertical image is exclusively used for the &quot;Budget Friendly&quot; section mobile cards.
                                </p>
                                <div className="flex flex-col gap-4">
                                    <div className="relative w-full max-w-[200px] aspect-[9/16] bg-gray-50 rounded-2xl overflow-hidden border border-gray-100 shadow-sm group mx-auto md:mx-0">
                                        {watch('verticalImage') ? (
                                            <img src={watch('verticalImage') || undefined} className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" />
                                        ) : (
                                            <div className="h-full w-full flex flex-col items-center justify-center text-gray-400 gap-2 p-4 text-center">
                                                <ImageIcon className="h-8 w-8 opacity-20" />
                                                <span className="text-xs font-medium">No Vertical Image Selected</span>
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex-1 space-y-4 w-full max-w-sm">
                                        <div className="space-y-2">
                                            <Label className="text-sm text-gray-500">Image URL</Label>
                                            <Input {...register('verticalImage')} placeholder="https://..." className="h-11 rounded-xl" />
                                        </div>
                                        <div className="relative group">
                                            <Button type="button" variant="outline" className="w-full h-12 rounded-xl border-dashed border-2 border-gray-200 hover:border-[#CD1C18] hover:bg-[#CD1C18]/5 hover:text-[#CD1C18] transition-all">
                                                <Upload className="mr-2 h-4 w-4" /> Upload Vertical Image
                                            </Button>
                                            <input
                                                type="file"
                                                className="absolute inset-0 opacity-0 cursor-pointer"
                                                onChange={(e) => handleNestedImageUpload(e, 'verticalImage', false)}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* POLICIES */}
                <TabsContent value="policies" className="space-y-6 animate-in fade-in-50 slide-in-from-bottom-2 duration-300">
                    <Card className="border-none shadow-sm ring-1 ring-gray-100 rounded-2xl overflow-hidden bg-white">
                        <CardContent className="p-8 space-y-8">
                            <div className="space-y-3">
                                <Label className="text-base font-semibold text-gray-900">Cancellation Policy</Label>
                                <Textarea className="min-h-[140px] rounded-xl border-gray-200 focus:border-[#CD1C18] focus:ring-[#CD1C18]/20 leading-relaxed" {...register('policies.cancellation')} placeholder="Enter detailed cancellation terms..." />
                            </div>
                            <div className="space-y-3">
                                <Label className="text-base font-semibold text-gray-900">Refund Policy</Label>
                                <Textarea className="min-h-[140px] rounded-xl border-gray-200 focus:border-[#CD1C18] focus:ring-[#CD1C18]/20 leading-relaxed" {...register('policies.refund')} placeholder="Enter detailed refund terms..." />
                            </div>
                            <div className="space-y-3">
                                <Label className="text-base font-semibold text-gray-900">Payment Policy</Label>
                                <Textarea className="min-h-[140px] rounded-xl border-gray-200 focus:border-[#CD1C18] focus:ring-[#CD1C18]/20 leading-relaxed" {...register('policies.payment')} placeholder="Enter detailed payment terms..." />
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* FAQs */}
                <TabsContent value="faqs" className="space-y-6 animate-in fade-in-50 slide-in-from-bottom-2 duration-300">
                    <Card className="border-none shadow-sm ring-1 ring-gray-100 rounded-2xl overflow-hidden bg-white">
                        <CardContent className="p-8">
                            <div className="flex justify-between items-center mb-8">
                                <div>
                                    <Label className="text-xl font-bold text-gray-900">Frequently Asked Questions</Label>
                                    <p className="text-sm text-gray-500 mt-1">Add Q&A to help travelers decide</p>
                                </div>
                                <Button type="button" onClick={() => appendFaq({ question: '', answer: '' })} className="bg-gray-900 hover:bg-black text-white rounded-xl">
                                    <Plus className="mr-2 h-4 w-4" /> Add FAQ
                                </Button>
                            </div>
                            <div className="space-y-4">
                                {faqFields.map((field, index) => (
                                    <div key={field.id} className="border border-gray-100 p-6 rounded-2xl bg-white shadow-sm hover:shadow-md transition-shadow">
                                        <div className="flex justify-between mb-4">
                                            <Label className="font-semibold text-gray-700">Question {index + 1}</Label>
                                            <Button type="button" variant="ghost" size="sm" onClick={() => removeFaq(index)} className="text-red-500 hover:bg-red-50 rounded-lg">
                                                Remove
                                            </Button>
                                        </div>
                                        <div className="space-y-4">
                                            <Input placeholder="e.g. Is visa included?" {...register(`faqs.${index}.question`)} className="font-medium h-11 rounded-xl" />
                                            <Textarea placeholder="The answer..." {...register(`faqs.${index}.answer`)} className="min-h-[80px] rounded-xl resize-y" />
                                        </div>
                                    </div>
                                ))}
                                {faqFields.length === 0 && (
                                    <div className="text-center py-12 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
                                        <p className="text-gray-400">No FAQs added yet.</p>
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* SEO & CONFIG */}
                <TabsContent value="seo" className="space-y-6 animate-in fade-in-50 slide-in-from-bottom-2 duration-300">
                    <Card className="border-none shadow-sm ring-1 ring-gray-100 rounded-2xl overflow-hidden bg-white">
                        <CardContent className="p-8 space-y-8">
                            <div className="bg-blue-50 text-blue-700 px-4 py-3 rounded-xl text-sm mb-6">
                                <strong>Note:</strong> Slugs are automatically generated from the title upon saving to ensure SEO-friendly URLs. You can override it here if needed.
                            </div>

                            <div className="grid grid-cols-1 gap-6">
                                <div className="space-y-2">
                                    <Label className="font-medium">Meta Title (SEO)</Label>
                                    <Input {...register('seo.title')} placeholder="Enter custom meta title" className="h-11 rounded-xl" />
                                    <p className="text-xs text-gray-500">Visible on Google search results. Recommended: 50-60 characters.</p>
                                </div>

                                <div className="space-y-2">
                                    <Label className="font-medium">Meta Description (SEO)</Label>
                                    <Textarea {...register('seo.description')} placeholder="Enter compelling description" className="min-h-[80px] rounded-xl" />
                                    <p className="text-xs text-gray-500">Summary for search results. Recommended: 120-160 characters.</p>
                                </div>

                                <div className="space-y-2">
                                    <Label className="font-medium">URL Slug (SEO)</Label>
                                    <Input {...register('slug')} placeholder="auto-generated-slug" className="h-11 rounded-xl font-mono text-sm" />
                                    <p className="text-xs text-gray-500">Leave empty to auto-generate from title. Use lowercase, numbers, and hyphens only.</p>
                                </div>
                            </div>

                            <div className="space-y-4 pt-4 border-t border-gray-100 mb-8">
                                <h4 className="text-lg font-bold text-gray-900">Advanced SEO Management</h4>
                                <div className="bg-gradient-to-r from-gray-50 to-gray-100 p-6 rounded-2xl border border-gray-200">
                                    <div className="flex items-start gap-4">
                                        <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center shadow-sm shrink-0">
                                            <Globe className="w-6 h-6 text-gray-700" />
                                        </div>
                                        <div>
                                            <h5 className="font-bold text-gray-900">Master SEO Editor</h5>
                                            <p className="text-sm text-gray-600 mt-1 mb-4">
                                                Manage Meta Tags, Open Graph, Twitter Cards, and Content Analysis in one centralized place. Auto-Schema is managed by the backend.
                                            </p>
                                            {initialData?.id ? (
                                                <Button 
                                                    type="button"
                                                    onClick={() => window.open(`/admin/seo/edit/package/${initialData.id}`, '_blank')}
                                                    className="bg-gray-900 text-white hover:bg-gray-800 shadow-md"
                                                >
                                                    <Globe className="w-4 h-4 mr-2" />
                                                    Open Advanced SEO Editor
                                                </Button>
                                            ) : (
                                                <div className="text-sm text-amber-600 font-medium flex items-center bg-amber-50 px-3 py-2 rounded-lg border border-amber-100 inline-block w-fit">
                                                    <Info className="w-4 h-4 mr-2" />
                                                    Please save this package first to access the Advanced SEO Editor.
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>


                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-2">
                                    <Label className="font-medium">Rating (0-5)</Label>
                                    <div className="relative">
                                        <Input type="number" step="0.1" min="0" max="5" {...register('rating')} className="h-11 rounded-xl pl-10" />
                                        <div className="absolute left-3 top-3 text-amber-500">★</div>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label className="font-medium">Reviews Count</Label>
                                    <Input type="number" min="0" {...register('reviewsCount')} className="h-11 rounded-xl" />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label className="font-medium">Itinerary Summary (Short)</Label>
                                <Input {...register('itinerarySummary')} placeholder="e.g. 3D Ubud . 2D Kuta" className="h-11 rounded-xl" />
                                <p className="text-xs text-gray-500">This appears on standard package cards</p>
                            </div>

                            <div className="border-t border-gray-100 pt-8">
                                <h4 className="text-lg font-bold text-gray-900 mb-6">Visibility & Status</h4>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="space-y-2">
                                        <Label className="font-medium">Publish Status</Label>
                                        <select
                                            className="flex h-11 w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all outline-none"
                                            {...register('status')}
                                        >
                                            <option value="published">Published (Visible)</option>
                                            <option value="draft">Draft (Hidden)</option>
                                        </select>
                                    </div>

                                    <div className="flex flex-col gap-4">
                                        <div className="flex items-center justify-between p-4 rounded-xl border border-gray-100 bg-gray-50/50 hover:bg-gray-50 transition-colors">
                                            <Label className="cursor-pointer" htmlFor="showOnHomepage">Show on Homepage</Label>
                                            <Controller
                                                control={control}
                                                name="showOnHomepage"
                                                render={({ field }) => (
                                                    <Switch id="showOnHomepage" checked={field.value} onCheckedChange={field.onChange} />
                                                )}
                                            />
                                        </div>
                                        <div className="flex items-center justify-between p-4 rounded-xl border border-gray-100 bg-gray-50/50 hover:bg-gray-50 transition-colors">
                                            <Label className="cursor-pointer" htmlFor="showInCollections">Show in Collections</Label>
                                            <Controller
                                                control={control}
                                                name="showInCollections"
                                                render={({ field }) => (
                                                    <Switch id="showInCollections" checked={field.value} onCheckedChange={field.onChange} />
                                                )}
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Homepage Sections Custom Assignment */}
                                <div className="mt-8 pt-8 border-t border-gray-100">
                                    <h4 className="text-sm font-semibold text-gray-900 mb-4">Homepage Sections Display</h4>
                                    <p className="text-xs text-gray-500 mb-4">
                                        Select the sections this package should specifically appear in on the homepage.
                                        This overrides automatic sorting for the selected section.
                                    </p>
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                        {[
                                            { id: 'weekendGetaways', label: 'Weekend Getaways' },
                                            { id: 'honeymoon', label: 'Honeymoon Specials' },
                                            { id: 'international', label: 'International Getaways' },
                                            { id: 'domestic', label: 'Domestic Getaways' },
                                            { id: 'trending', label: 'Trending Collections' },
                                            { id: 'superSaver', label: 'Super Saver Deals' },
                                            { id: 'cityDepartures', label: 'Packages From Your City' }
                                        ].map((section) => (
                                            <div key={section.id} className="flex items-center space-x-2 bg-gray-50 p-3 rounded-lg border border-gray-100">
                                                <Controller
                                                    control={control}
                                                    name="homepageSections"
                                                    render={({ field }) => {
                                                        const currentSections = field.value || [];
                                                        const isChecked = currentSections.includes(section.id);

                                                        return (
                                                            <div className="flex items-center space-x-2">
                                                                <input
                                                                    type="checkbox"
                                                                    id={`section-${section.id}`}
                                                                    className="w-4 h-4 rounded border-gray-300 text-[#CD1C18] focus:ring-[#CD1C18]"
                                                                    checked={isChecked}
                                                                    onChange={(e) => {
                                                                        const newSections = e.target.checked
                                                                            ? [...currentSections, section.id]
                                                                            : currentSections.filter(s => s !== section.id);
                                                                        field.onChange(newSections);
                                                                    }}
                                                                />
                                                                <Label htmlFor={`section-${section.id}`} className="cursor-pointer text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                                                    {section.label}
                                                                </Label>
                                                            </div>
                                                        );
                                                    }}
                                                />
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <div className="border-t border-gray-100 pt-8">
                                <h4 className="text-lg font-bold text-gray-900 mb-6">Special Badges</h4>
                                <div className="flex flex-wrap gap-6">
                                    <div className="flex items-center gap-3 p-4 rounded-xl border border-gray-100 bg-white shadow-sm">
                                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${watch('isTrending') ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400'}`}>
                                            <span className="text-lg">🔥</span>
                                        </div>
                                        <div className="flex flex-col">
                                            <Label className="font-semibold">Trending</Label>
                                            <span className="text-xs text-gray-500">Hot selling item</span>
                                        </div>
                                        <Controller
                                            control={control}
                                            name="isTrending"
                                            render={({ field }) => (
                                                <Switch checked={field.value} onCheckedChange={field.onChange} className="ml-2" />
                                            )}
                                        />
                                    </div>

                                    <div className="flex items-center gap-3 p-4 rounded-xl border border-gray-100 bg-white shadow-sm">
                                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${watch('isAlmostFull') ? 'bg-amber-100 text-amber-600' : 'bg-gray-100 text-gray-400'}`}>
                                            <span className="text-lg">⚡</span>
                                        </div>
                                        <div className="flex flex-col">
                                            <Label className="font-semibold">Almost Full</Label>
                                            <span className="text-xs text-gray-500">Urgency badge</span>
                                        </div>
                                        <Controller
                                            control={control}
                                            name="isAlmostFull"
                                            render={({ field }) => (
                                                <Switch checked={field.value} onCheckedChange={field.onChange} className="ml-2" />
                                            )}
                                        />
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </form>
    );
}
