"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useForm, Controller, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { Loader2, ArrowLeft, Upload, Plus, Trash2, X, ChevronDown, Save, Calendar, Wallet, FileText, Languages, Banknote, Globe, Car, Utensils, Clock, MapPin, Image as ImageIcon, HelpCircle, MessageCircle } from 'lucide-react';
import { API_BASE_URL } from '@/constants';

const destinationSchema = z.object({
    name: z.string().min(2, "Name is required"),
    slug: z.string().optional(),
    heroImage: z.string().min(1, "Hero Image is required"),
    verticalImage: z.string().optional(),
    bannerImage: z.string().optional(),
    tagline: z.string().optional(),
    description: z.string().optional(),
    isFeatured: z.boolean().default(false),
    isVisaFree: z.boolean().default(false),
    order: z.coerce.number().default(0),
    startingPrice: z.coerce.number().default(0),
    priceLabel: z.string().default('per person'),
    // New Fields
    facts: z.object({
        currency: z.string().optional(),
        language: z.string().optional(),
        timezone: z.string().optional(),
        bestTime: z.string().optional(),
        budget: z.string().optional(),
        visaInfo: z.string().optional(),
        gettingAround: z.string().optional(),
        localDish: z.string().optional()
    }).optional(),
    attractions: z.array(z.object({
        name: z.string(),
        image: z.string(),
        description: z.string().optional()
    })).optional(),
    faqs: z.array(z.object({
        question: z.string(),
        answer: z.string()
    })).optional()
});

type DestinationFormValues = z.infer<typeof destinationSchema>;

interface DestinationFormProps {
    initialData?: any;
    isEditMode?: boolean;
}

export default function DestinationForm({ initialData, isEditMode = false }: DestinationFormProps) {
    const router = useRouter();
    const [submitting, setSubmitting] = useState(false);
    const [uploading, setUploading] = useState(false);

    const defaultValues = {
        name: initialData?.name || '',
        slug: initialData?.slug || '',
        heroImage: initialData?.heroImage || '',
        verticalImage: initialData?.verticalImage || '',
        bannerImage: initialData?.bannerImage || '',
        tagline: initialData?.tagline || '',
        description: initialData?.description || '',
        isFeatured: initialData?.isFeatured || false,
        isVisaFree: initialData?.isVisaFree || false,
        order: initialData?.order || 0,
        startingPrice: initialData?.startingPrice || 0,
        priceLabel: initialData?.priceLabel || 'per person',
        facts: {
            currency: initialData?.facts?.currency || '',
            language: initialData?.facts?.language || '',
            timezone: initialData?.facts?.timezone || '',
            bestTime: initialData?.facts?.bestTime || '',
            budget: initialData?.facts?.budget || '',
            visaInfo: initialData?.facts?.visaInfo || '',
            gettingAround: initialData?.facts?.gettingAround || '',
            localDish: initialData?.facts?.localDish || ''
        },
        attractions: initialData?.attractions || [],
        faqs: initialData?.faqs || []
    };

    const form = useForm<DestinationFormValues>({
        resolver: zodResolver(destinationSchema) as any,
        defaultValues
    });

    // Reset form when initialData changes (fixes editing issue)
    useEffect(() => {
        if (initialData) {
            form.reset(defaultValues);
        }
    }, [initialData]);

    const { register, handleSubmit, formState: { errors }, setValue, watch, control } = form;

    const name = watch('name');
    const slug = watch('slug');

    // Auto-generate slug from name while typing
    useEffect(() => {
        if (name && !slug) {
            const generatedSlug = name
                .toLowerCase()
                .replace(/[^a-z0-9\s-]/g, '')
                .replace(/\s+/g, '-')
                .replace(/-+/g, '-')
                .trim();

            if (generatedSlug !== slug) {
                setValue('slug', generatedSlug, { shouldValidate: true });
            }
        }
    }, [name, setValue]);

    const { fields: attractionFields, append: appendAttraction, remove: removeAttraction } = useFieldArray({ control, name: "attractions" });
    const { fields: faqFields, append: appendFaq, remove: removeFaq } = useFieldArray({ control, name: "faqs" });

    const handleAttractionImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setUploading(true);
        try {
            const formData = new FormData();
            formData.append('image', file);

            // Bypass Next.js proxy for large uploads by sending directly to backend
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
            setValue(`attractions.${index}.image` as any, data.url);
        } catch (error: any) {
            alert(`Upload failed: ${error.message}`);
        } finally {
            setUploading(false);
        }
    };

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, fieldName: 'heroImage' | 'bannerImage' = 'heroImage') => {
        const file = e.target.files?.[0];
        if (!file) return;
        setUploading(true);
        try {
            const formData = new FormData();
            formData.append('image', file);

            // Bypass Next.js proxy for large uploads by sending directly to backend
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
            setValue(fieldName, data.url);
        } catch (error: any) {
            console.error('Upload failed', error);
            alert(`Upload failed: ${error.message}`);
        } finally {
            setUploading(false);
        }
    };

    const onSubmit = async (data: DestinationFormValues) => {
        setSubmitting(true);
        try {
            const url = isEditMode
                ? `${API_BASE_URL}/api/destinations/${initialData?._id}`
                : `${API_BASE_URL}/api/destinations`;
            const method = isEditMode ? 'PUT' : 'POST';

            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
                credentials: 'include'
            });

            if (!res.ok) {
                const errorData = await res.json().catch(() => ({}));
                throw new Error(errorData.message || 'Failed to save destination');
            }
            router.push('/admin/destinations');
            router.refresh();
        } catch (error: any) {
            console.error(error);
            alert(`Error saving destination: ${error.message}`);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="max-w-5xl mx-auto pb-10">
            {/* Header */}
            <div className="flex items-center justify-between mb-8 bg-white/80 backdrop-blur-sm sticky top-0 z-50 py-4 border-b border-gray-100">
                <div className="flex items-center gap-4">
                    <Button type="button" variant="ghost" size="icon" onClick={() => router.back()} className="rounded-full">
                        <ArrowLeft className="h-5 w-5" />
                    </Button>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 tracking-tight">{isEditMode ? 'Edit Destination' : 'New Destination'}</h1>
                        <p className="text-sm text-gray-500">Manage destination details, guide, and attractions.</p>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <Button type="button" variant="outline" onClick={() => router.back()} className="rounded-xl">
                        Cancel
                    </Button>
                    <Button type="submit" disabled={submitting} className="rounded-xl bg-[#CD1C18] hover:bg-[#a51613] min-w-[140px]">
                        {submitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                        Save Changes
                    </Button>
                </div>
            </div>

            <Tabs defaultValue="basic" className="w-full space-y-8">
                <TabsList className="w-full justify-start border-b border-gray-200 bg-transparent p-0 h-auto rounded-none space-x-6">
                    <TabsTrigger
                        value="basic"
                        className="rounded-none border-b-2 border-transparent px-4 py-3 text-gray-500 data-[state=active]:border-[#CD1C18] data-[state=active]:text-[#CD1C18] data-[state=active]:shadow-none bg-transparent"
                    >
                        Basic Info
                    </TabsTrigger>
                    <TabsTrigger
                        value="guide"
                        className="rounded-none border-b-2 border-transparent px-4 py-3 text-gray-500 data-[state=active]:border-[#CD1C18] data-[state=active]:text-[#CD1C18] data-[state=active]:shadow-none bg-transparent"
                    >
                        Guide & Facts
                    </TabsTrigger>
                    <TabsTrigger
                        value="attractions"
                        className="rounded-none border-b-2 border-transparent px-4 py-3 text-gray-500 data-[state=active]:border-[#CD1C18] data-[state=active]:text-[#CD1C18] data-[state=active]:shadow-none bg-transparent"
                    >
                        Attractions
                    </TabsTrigger>
                    <TabsTrigger
                        value="faqs"
                        className="rounded-none border-b-2 border-transparent px-4 py-3 text-gray-500 data-[state=active]:border-[#CD1C18] data-[state=active]:text-[#CD1C18] data-[state=active]:shadow-none bg-transparent"
                    >
                        FAQs
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="basic" className="focus:outline-none">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Left Column - Main Info */}
                        <div className="lg:col-span-2 space-y-6">
                            <Card className="border-gray-100 shadow-sm rounded-2xl overflow-hidden">
                                <CardContent className="pt-6 space-y-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <Label className="text-gray-700 font-medium">Destination Name</Label>
                                            <Input {...register('name')} placeholder="e.g. Bali" className="h-11 rounded-xl border-gray-200 focus:border-[#CD1C18] focus:ring-[#CD1C18]/20 bg-gray-50/50" />
                                            {errors.name && <p className="text-red-500 text-xs mt-1 font-medium">{errors.name.message}</p>}
                                        </div>
                                        <div className="space-y-2">
                                            <Label className="text-gray-700 font-medium">Tagline</Label>
                                            <Input {...register('tagline')} placeholder="e.g. Island of Gods" className="h-11 rounded-xl border-gray-200 focus:border-[#CD1C18] focus:ring-[#CD1C18]/20 bg-gray-50/50" />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <Label className="text-gray-700 font-medium">Slug (Auto-generated)</Label>
                                        <Input {...register('slug')} disabled className="h-11 rounded-xl border-gray-200 bg-gray-100 text-gray-500" />
                                    </div>

                                    <div className="space-y-2">
                                        <Label className="text-gray-700 font-medium">SEO Description</Label>
                                        <Textarea {...register('description')} placeholder="Meta description for search engines..." className="min-h-[120px] rounded-xl border-gray-200 focus:border-[#CD1C18] focus:ring-[#CD1C18]/20 bg-gray-50/50 resize-none" />
                                    </div>
                                </CardContent>
                            </Card>

                            <Card className="border-gray-100 shadow-sm rounded-2xl overflow-hidden">
                                <div className="px-6 py-4 border-b border-gray-50 bg-gray-50/50">
                                    <h3 className="font-semibold text-gray-900">Media</h3>
                                </div>
                                <CardContent className="pt-6 space-y-6">
                                    <div className="space-y-3">
                                        <Label className="text-gray-700 font-medium">Hero Image (Card/Thumbnail)</Label>
                                        <div className="p-4 border-2 border-dashed border-gray-200 rounded-2xl bg-gray-50/50 hover:bg-gray-50 transition-colors">
                                            <div className="flex flex-col md:flex-row gap-6 items-start">
                                                <div className="w-full md:w-64 aspect-video bg-white rounded-xl overflow-hidden border border-gray-100 shadow-sm shrink-0 flex items-center justify-center relative group">
                                                    {watch('heroImage') ? (
                                                        <>
                                                            <img src={watch('heroImage')} className="w-full h-full object-cover" />
                                                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                                                <Button type="button" variant="secondary" size="sm" onClick={() => setValue('heroImage', '')} className="rounded-full bg-white/90 hover:bg-white text-red-600">
                                                                    <Trash2 className="w-4 h-4" />
                                                                </Button>
                                                            </div>
                                                        </>
                                                    ) : (
                                                        <div className="flex flex-col items-center gap-2 text-gray-400">
                                                            <Upload className="w-8 h-8 opacity-50" />
                                                            <span className="text-xs font-medium">No Image</span>
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="flex-1 space-y-4 w-full">
                                                    <div className="space-y-2">
                                                        <Input {...register('heroImage')} placeholder="Paste image URL..." className="h-11 rounded-xl border-gray-200 focus:border-[#CD1C18] focus:ring-[#CD1C18]/20 bg-white" />
                                                        <p className="text-xs text-gray-400">Used for homepage "Top Destinations". **Required: 16:9 Aspect Ratio** (e.g. 1200x675px). Max: 50MB.</p>
                                                    </div>
                                                    <div className="relative">
                                                        <Button type="button" variant="outline" className="w-full rounded-xl border-gray-200 hover:bg-white hover:border-[#CD1C18] hover:text-[#CD1C18] transition-all h-11" disabled={uploading}>
                                                            {uploading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Upload className="mr-2 h-4 w-4" />}
                                                            Upload Hero Image
                                                        </Button>
                                                        <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" onChange={(e) => handleImageUpload(e, 'heroImage')} />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        {errors.heroImage && <p className="text-red-500 text-xs mt-1 font-medium">{errors.heroImage.message}</p>}
                                    </div>

                                    <div className="space-y-3 pt-4 border-t border-gray-100">
                                        <Label className="text-gray-700 font-medium">Vertical Image (Mobile/Top Destinations)</Label>
                                        <div className="p-4 border-2 border-dashed border-gray-200 rounded-2xl bg-gray-50/50 hover:bg-gray-50 transition-colors">
                                            <div className="flex flex-col md:flex-row gap-6 items-start">
                                                <div className="w-full md:w-32 aspect-[3/4] bg-white rounded-xl overflow-hidden border border-gray-100 shadow-sm shrink-0 flex items-center justify-center relative group">
                                                    {watch('verticalImage') ? (
                                                        <>
                                                            <img src={watch('verticalImage')} className="w-full h-full object-cover" />
                                                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                                                <Button type="button" variant="secondary" size="sm" onClick={() => setValue('verticalImage', '')} className="rounded-full bg-white/90 hover:bg-white text-red-600">
                                                                    <Trash2 className="w-4 h-4" />
                                                                </Button>
                                                            </div>
                                                        </>
                                                    ) : (
                                                        <div className="flex flex-col items-center gap-2 text-gray-400">
                                                            <Upload className="w-6 h-6 opacity-50" />
                                                            <span className="text-[10px] font-medium">No Image</span>
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="flex-1 space-y-4 w-full">
                                                    <div className="space-y-2">
                                                        <Input {...register('verticalImage')} placeholder="Paste vertical image URL..." className="h-11 rounded-xl border-gray-200 focus:border-[#CD1C18] focus:ring-[#CD1C18]/20 bg-white" />
                                                        <p className="text-xs text-gray-400">Used for mobile views and Vertical Destination cards. **Recommended Size: 600x800px or 3:4 Aspect Ratio**.</p>
                                                    </div>
                                                    <div className="relative">
                                                        <Button type="button" variant="outline" className="w-full rounded-xl border-gray-200 hover:bg-white hover:border-[#CD1C18] hover:text-[#CD1C18] transition-all h-11" disabled={uploading}>
                                                            {uploading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Upload className="mr-2 h-4 w-4" />}
                                                            Upload Vertical Image
                                                        </Button>
                                                        <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" onChange={(e) => handleImageUpload(e, 'verticalImage' as any)} />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-3 pt-4 border-t border-gray-100">
                                        <Label className="text-gray-700 font-medium">Wide Banner Image (Desktop Header)</Label>
                                        <div className="p-4 border-2 border-dashed border-gray-200 rounded-2xl bg-gray-50/50 hover:bg-gray-50 transition-colors">
                                            <div className="flex flex-col md:flex-row gap-6 items-start">
                                                <div className="w-full md:w-64 aspect-[21/9] bg-white rounded-xl overflow-hidden border border-gray-100 shadow-sm shrink-0 flex items-center justify-center relative group">
                                                    {watch('bannerImage') ? (
                                                        <>
                                                            <img src={watch('bannerImage')} className="w-full h-full object-cover" />
                                                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                                                <Button type="button" variant="secondary" size="sm" onClick={() => setValue('bannerImage', '')} className="rounded-full bg-white/90 hover:bg-white text-red-600">
                                                                    <Trash2 className="w-4 h-4" />
                                                                </Button>
                                                            </div>
                                                        </>
                                                    ) : (
                                                        <div className="flex flex-col items-center gap-2 text-gray-400">
                                                            <Upload className="w-8 h-8 opacity-50" />
                                                            <span className="text-xs font-medium">No Image</span>
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="flex-1 space-y-4 w-full">
                                                    <div className="space-y-2">
                                                        <Input {...register('bannerImage')} placeholder="Paste banner URL..." className="h-11 rounded-xl border-gray-200 focus:border-[#CD1C18] focus:ring-[#CD1C18]/20 bg-white" />
                                                        <p className="text-xs text-gray-400">Recommended size: 1920x600px or wider. Max: 20MB.</p>
                                                    </div>
                                                    <div className="relative">
                                                        <Button type="button" variant="outline" className="w-full rounded-xl border-gray-200 hover:bg-white hover:border-[#CD1C18] hover:text-[#CD1C18] transition-all h-11" disabled={uploading}>
                                                            {uploading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Upload className="mr-2 h-4 w-4" />}
                                                            Upload Banner Image
                                                        </Button>
                                                        <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" onChange={(e) => handleImageUpload(e, 'bannerImage')} />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Right Column - Settings */}
                        <div className="space-y-6">
                            <Card className="border-gray-100 shadow-sm rounded-2xl overflow-hidden">
                                <div className="px-6 py-4 border-b border-gray-50 bg-gray-50/50">
                                    <h3 className="font-semibold text-gray-900">Configuration</h3>
                                </div>
                                <CardContent className="pt-6 space-y-6">
                                    <div className="space-y-2">
                                        <Label className="text-gray-700 font-medium">Display Order</Label>
                                        <Input type="number" {...register('order')} className="h-11 rounded-xl border-gray-200 focus:border-[#CD1C18] focus:ring-[#CD1C18]/20 bg-gray-50/50" />
                                        <p className="text-xs text-gray-500">Lower numbers appear first in lists.</p>
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-gray-700 font-medium">Starting Price (₹)</Label>
                                        <div className="relative">
                                            <span className="absolute left-3 top-3 text-gray-500">₹</span>
                                            <Input type="number" {...register('startingPrice')} className="pl-7 h-11 rounded-xl border-gray-200 focus:border-[#CD1C18] focus:ring-[#CD1C18]/20 bg-gray-50/50" />
                                        </div>
                                        <p className="text-xs text-gray-500">Benchmark price for "From ₹X".</p>
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-gray-700 font-medium">Price Label</Label>
                                        <Input {...register('priceLabel')} className="h-11 rounded-xl border-gray-200 focus:border-[#CD1C18] focus:ring-[#CD1C18]/20 bg-gray-50/50" />
                                        <p className="text-xs text-gray-500">Text displayed after the price, e.g. "per person" or "per night".</p>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card className="border-gray-100 shadow-sm rounded-2xl overflow-hidden">
                                <div className="px-6 py-4 border-b border-gray-50 bg-gray-50/50">
                                    <h3 className="font-semibold text-gray-900">Visibility</h3>
                                </div>
                                <CardContent className="pt-6 space-y-6">
                                    <div className="flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 transition-colors border border-transparent hover:border-gray-100">
                                        <div className="space-y-0.5">
                                            <Label className="text-base font-medium">Featured</Label>
                                            <p className="text-xs text-gray-500">Show in main sliders</p>
                                        </div>
                                        <Controller
                                            control={control}
                                            name="isFeatured"
                                            render={({ field }) => (
                                                <Switch checked={field.value} onCheckedChange={field.onChange} />
                                            )}
                                        />
                                    </div>
                                    <div className="flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 transition-colors border border-transparent hover:border-gray-100">
                                        <div className="space-y-0.5">
                                            <Label className="text-base font-medium">Visa Free</Label>
                                            <p className="text-xs text-gray-500">Add to 'Visa Free' list</p>
                                        </div>
                                        <Controller
                                            control={control}
                                            name="isVisaFree"
                                            render={({ field }) => (
                                                <Switch checked={field.value} onCheckedChange={field.onChange} />
                                            )}
                                        />
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </TabsContent>

                <TabsContent value="guide" className="focus:outline-none">
                    <Card className="border-gray-100 shadow-sm rounded-2xl overflow-hidden">
                        <div className="px-6 py-4 border-b border-gray-50 bg-gray-50/50 flex justify-between items-center">
                            <div>
                                <h3 className="font-semibold text-gray-900">Key Facts & Guide</h3>
                                <p className="text-xs text-gray-500">Essential information for travelers.</p>
                            </div>
                        </div>
                        <CardContent className="pt-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-8">
                                <div className="space-y-3">
                                    <Label className="text-gray-700 font-semibold flex items-center gap-2">
                                        <Calendar className="w-4 h-4 text-blue-500" /> Best Time to Visit
                                    </Label>
                                    <Input {...register('facts.bestTime')} placeholder="e.g. April - October" className="h-11 rounded-xl border-gray-200 focus:border-[#CD1C18] focus:ring-[#CD1C18]/20 bg-gray-50/50 hover:bg-white transition-colors" />
                                </div>
                                <div className="space-y-3">
                                    <Label className="text-gray-700 font-semibold flex items-center gap-2">
                                        <Wallet className="w-4 h-4 text-green-500" /> Average Budget
                                    </Label>
                                    <Input {...register('facts.budget')} placeholder="e.g. ₹50,000 - ₹80,000" className="h-11 rounded-xl border-gray-200 focus:border-[#CD1C18] focus:ring-[#CD1C18]/20 bg-gray-50/50 hover:bg-white transition-colors" />
                                </div>
                                <div className="space-y-3">
                                    <Label className="text-gray-700 font-semibold flex items-center gap-2">
                                        <FileText className="w-4 h-4 text-purple-500" /> Visa Information
                                    </Label>
                                    <Input {...register('facts.visaInfo')} placeholder="e.g. Visa on Arrival (30 Days)" className="h-11 rounded-xl border-gray-200 focus:border-[#CD1C18] focus:ring-[#CD1C18]/20 bg-gray-50/50 hover:bg-white transition-colors" />
                                </div>
                                <div className="space-y-3">
                                    <Label className="text-gray-700 font-semibold flex items-center gap-2">
                                        <Languages className="w-4 h-4 text-orange-500" /> Language
                                    </Label>
                                    <Input {...register('facts.language')} placeholder="e.g. English, Local Dialect" className="h-11 rounded-xl border-gray-200 focus:border-[#CD1C18] focus:ring-[#CD1C18]/20 bg-gray-50/50 hover:bg-white transition-colors" />
                                </div>
                                <div className="space-y-3">
                                    <Label className="text-gray-700 font-semibold flex items-center gap-2">
                                        <Banknote className="w-4 h-4 text-emerald-600" /> Currency
                                    </Label>
                                    <Input {...register('facts.currency')} placeholder="e.g. USD ($)" className="h-11 rounded-xl border-gray-200 focus:border-[#CD1C18] focus:ring-[#CD1C18]/20 bg-gray-50/50 hover:bg-white transition-colors" />
                                </div>
                                <div className="space-y-3">
                                    <Label className="text-gray-700 font-semibold flex items-center gap-2">
                                        <Clock className="w-4 h-4 text-indigo-500" /> Timezone
                                    </Label>
                                    <Input {...register('facts.timezone')} placeholder="e.g. GMT+4" className="h-11 rounded-xl border-gray-200 focus:border-[#CD1C18] focus:ring-[#CD1C18]/20 bg-gray-50/50 hover:bg-white transition-colors" />
                                </div>
                                <div className="space-y-3">
                                    <Label className="text-gray-700 font-semibold flex items-center gap-2">
                                        <Car className="w-4 h-4 text-red-500" /> Getting Around
                                    </Label>
                                    <Input {...register('facts.gettingAround')} placeholder="e.g. Metro, Taxi, Walking" className="h-11 rounded-xl border-gray-200 focus:border-[#CD1C18] focus:ring-[#CD1C18]/20 bg-gray-50/50 hover:bg-white transition-colors" />
                                </div>
                                <div className="space-y-3">
                                    <Label className="text-gray-700 font-semibold flex items-center gap-2">
                                        <Utensils className="w-4 h-4 text-yellow-500" /> Local Dish
                                    </Label>
                                    <Input {...register('facts.localDish')} placeholder="e.g. Signature Dish" className="h-11 rounded-xl border-gray-200 focus:border-[#CD1C18] focus:ring-[#CD1C18]/20 bg-gray-50/50 hover:bg-white transition-colors" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="attractions" className="focus:outline-none">
                    <Card className="border-gray-100 shadow-sm rounded-2xl overflow-hidden">
                        <div className="px-6 py-4 border-b border-gray-50 bg-gray-50/50 flex justify-between items-center">
                            <div>
                                <h3 className="font-semibold text-gray-900">Must Visit Places</h3>
                                <p className="text-xs text-gray-500">Add top attractions for this destination.</p>
                            </div>
                            <Button type="button" size="sm" onClick={() => appendAttraction({ name: '', image: '', description: '' })} className="rounded-xl bg-[#CD1C18] hover:bg-[#a51613]">
                                <Plus className="h-4 w-4 mr-2" /> Add Place
                            </Button>
                        </div>
                        <CardContent className="pt-6 space-y-6">
                            {attractionFields.length === 0 && (
                                <div className="text-center py-12 text-gray-500 bg-gray-50/50 rounded-2xl border-2 border-dashed border-gray-100">
                                    No attractions added yet. Click "Add Place" to start.
                                </div>
                            )}

                            {attractionFields.map((field, index) => (
                                <div key={field.id} className="p-6 rounded-2xl border border-gray-100 bg-white shadow-sm space-y-6 hover:shadow-md transition-shadow relative group">
                                    <div className="absolute right-4 top-4 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <Button type="button" variant="ghost" size="sm" onClick={() => removeAttraction(index)} className="text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg">
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                    <h4 className="font-medium text-sm text-gray-500 uppercase tracking-wide">Place #{index + 1}</h4>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <Label className="text-gray-700 font-medium flex items-center gap-2">
                                                <MapPin className="w-4 h-4 text-red-500" /> Place Name
                                            </Label>
                                            <Input {...register(`attractions.${index}.name` as any)} placeholder="e.g. Uluwatu Temple" className="h-11 rounded-xl border-gray-200 focus:border-[#CD1C18] focus:ring-[#CD1C18]/20 bg-gray-50/50" />
                                        </div>
                                        <div className="space-y-2">
                                            <Label className="text-gray-700 font-medium flex items-center gap-2">
                                                <FileText className="w-4 h-4 text-blue-500" /> Short Description
                                            </Label>
                                            <Input {...register(`attractions.${index}.description` as any)} placeholder="Brief highlight..." className="h-11 rounded-xl border-gray-200 focus:border-[#CD1C18] focus:ring-[#CD1C18]/20 bg-gray-50/50" />
                                        </div>
                                        <div className="col-span-1 md:col-span-2 space-y-3">
                                            <Label className="text-gray-700 font-medium flex items-center gap-2">
                                                <ImageIcon className="w-4 h-4 text-purple-500" /> Image Media
                                            </Label>
                                            <div className="flex flex-col md:flex-row gap-4 items-start">
                                                <div className="shrink-0">
                                                    {watch(`attractions.${index}.image` as any) ? (
                                                        <img src={watch(`attractions.${index}.image` as any)} className="h-24 w-32 object-cover rounded-xl border border-gray-100 shadow-sm" />
                                                    ) : <div className="h-24 w-32 bg-gray-50 rounded-xl border border-dashed border-gray-200 flex items-center justify-center text-xs text-gray-400">No Image</div>}
                                                </div>

                                                <div className="flex-1 w-full space-y-3">
                                                    <p className="text-xs text-gray-400">Max size: 20MB. Recommended shape: Landscape or Square.</p>
                                                    <div className="flex gap-2">
                                                        <Input {...register(`attractions.${index}.image` as any)} placeholder="Image URL..." className="h-11 rounded-xl border-gray-200 focus:border-[#CD1C18] focus:ring-[#CD1C18]/20 bg-gray-50/50 flex-1" />
                                                        <div className="relative">
                                                            <Button type="button" variant="outline" className="h-11 rounded-xl border-gray-200 px-4">
                                                                <Upload className="h-4 w-4" />
                                                            </Button>
                                                            <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" onChange={(e) => handleAttractionImageUpload(e, index)} />
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="faqs" className="focus:outline-none">
                    <Card className="border-gray-100 shadow-sm rounded-2xl overflow-hidden">
                        <div className="px-6 py-4 border-b border-gray-50 bg-gray-50/50 flex justify-between items-center">
                            <div>
                                <h3 className="font-semibold text-gray-900">Frequently Asked Questions</h3>
                                <p className="text-xs text-gray-500">Help travelers with common queries.</p>
                            </div>
                            <Button type="button" size="sm" onClick={() => appendFaq({ question: '', answer: '' })} className="rounded-xl bg-[#CD1C18] hover:bg-[#a51613]">
                                <Plus className="h-4 w-4 mr-2" /> Add FAQ
                            </Button>
                        </div>
                        <CardContent className="pt-6 space-y-6">
                            {faqFields.length === 0 && (
                                <div className="text-center py-12 text-gray-500 bg-gray-50/50 rounded-2xl border-2 border-dashed border-gray-100">
                                    No FAQs added yet.
                                </div>
                            )}

                            {faqFields.map((field, index) => (
                                <div key={field.id} className="p-6 rounded-2xl border border-gray-100 bg-white shadow-sm space-y-4 hover:shadow-md transition-shadow relative group">
                                    <div className="absolute right-4 top-4 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <Button type="button" variant="ghost" size="sm" onClick={() => removeFaq(index)} className="text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg">
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                    <h4 className="font-medium text-sm text-gray-500 uppercase tracking-wide">Question #{index + 1}</h4>

                                    <div className="space-y-4">
                                        <div className="space-y-2">
                                            <Label className="text-gray-700 font-medium flex items-center gap-2">
                                                <HelpCircle className="w-4 h-4 text-orange-500" /> Question
                                            </Label>
                                            <Input {...register(`faqs.${index}.question` as any)} placeholder="e.g. Is it safe for solo travelers?" className="h-11 rounded-xl border-gray-200 focus:border-[#CD1C18] focus:ring-[#CD1C18]/20 bg-gray-50/50" />
                                        </div>
                                        <div className="space-y-2">
                                            <Label className="text-gray-700 font-medium flex items-center gap-2">
                                                <MessageCircle className="w-4 h-4 text-green-500" /> Answer
                                            </Label>
                                            <Textarea {...register(`faqs.${index}.answer` as any)} placeholder="Detailed answer..." className="min-h-[100px] rounded-xl border-gray-200 focus:border-[#CD1C18] focus:ring-[#CD1C18]/20 bg-gray-50/50 resize-y" />
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </CardContent>
                    </Card>
                </TabsContent>

            </Tabs>
        </form>
    );
}
