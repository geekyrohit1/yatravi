"use client";

import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Loader2, Phone, Share2, Megaphone, Save, Shield, CheckCircle, LayoutDashboard, Upload } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { API_BASE_URL } from '@/constants';

export default function SettingsPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [saved, setSaved] = useState(false);
    const { register, handleSubmit, reset, setValue, watch } = useForm();

    useEffect(() => {
        fetch(`${API_BASE_URL}/api/settings`, { credentials: 'include' })
            .then(res => res.json())
            .then(data => {
                reset(data);
                if (data.socialLinks) {
                    setValue('socialLinks.instagram', data.socialLinks.instagram);
                    setValue('socialLinks.facebook', data.socialLinks.facebook);
                    setValue('socialLinks.twitter', data.socialLinks.twitter);
                    setValue('socialLinks.youtube', data.socialLinks.youtube);
                    setValue('socialLinks.linkedin', data.socialLinks.linkedin);
                }
                setLoading(false);
            })
            .catch(() => setLoading(false));
    }, [reset, setValue]);

    const onSubmit = async (data: any) => {
        setSaving(true);
        setSaved(false);
        try {
            const res = await fetch(`${API_BASE_URL}/api/settings`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
                credentials: 'include'
            });
            if (res.ok) {
                setSaved(true);
                router.refresh();
                setTimeout(() => setSaved(false), 3000);
            } else {
                alert('Failed to save settings');
            }
        } catch (error) {
            console.error(error);
            alert('Error saving settings');
        } finally {
            setSaving(false);
        }
    };

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const formData = new FormData();
        formData.append('image', file);


        setUploading(true);
        try {
            const res = await fetch(`${API_BASE_URL}/api/upload`, {
                method: 'POST',
                body: formData,
                credentials: 'include'
            });

            if (!res.ok) {
                const errorText = await res.text();
                let errorMessage = 'Upload failed';
                try {
                    const errorData = JSON.parse(errorText);
                    errorMessage = errorData.message || errorMessage;
                } catch (e) {
                    errorMessage = `Server Error: ${res.status}`;
                }
                throw new Error(errorMessage);
            }

            const data = await res.json();
            setValue('joinPageHeroImage', data.url);
        } catch (error: any) {
            console.error('Upload failed', error);
            alert(error.message);
        } finally {
            setUploading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
            </div>
        );
    }

    return (
        <div className="max-w-3xl space-y-8">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-gray-900">Global Settings</h1>
                    <p className="text-gray-500 mt-1">Manage site-wide configuration.</p>
                </div>
                {saved && (
                    <div className="flex items-center gap-2 text-green-600 bg-green-50 px-4 py-2 rounded-xl">
                        <CheckCircle className="w-4 h-4" />
                        <span className="text-sm font-medium">Saved!</span>
                    </div>
                )}
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                {/* Contact Information */}
                <Card className="bg-white border-0 shadow-sm rounded-2xl">
                    <CardHeader className="pb-4">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-[#CD1C18]/10 flex items-center justify-center">
                                <Phone className="w-5 h-5 text-[#CD1C18]" />
                            </div>
                            <div>
                                <CardTitle className="text-lg font-semibold text-gray-900">Contact Information</CardTitle>
                                <CardDescription>Displayed on website for customer contact.</CardDescription>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label className="text-gray-700">Phone Number</Label>
                                <Input
                                    {...register('contactPhone')}
                                    className="rounded-xl border-gray-200"
                                    placeholder="+91 98765 43210"
                                />
                                <p className="text-xs text-gray-400">Shown on Consultation Banner</p>
                            </div>
                            <div className="space-y-2">
                                <Label className="text-gray-700">WhatsApp Number</Label>
                                <Input
                                    {...register('whatsappNumber')}
                                    className="rounded-xl border-gray-200"
                                    placeholder="+91 98765 43210"
                                />
                                <p className="text-xs text-gray-400">Used for WhatsApp chat button & links</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Social Media Links */}
                <Card className="bg-white border-0 shadow-sm rounded-2xl">
                    <CardHeader className="pb-4">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center">
                                <Share2 className="w-5 h-5 text-blue-600" />
                            </div>
                            <div>
                                <CardTitle className="text-lg font-semibold text-gray-900">Social Media Links</CardTitle>
                                <CardDescription>Social icons in website footer.</CardDescription>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label className="text-gray-700">Instagram</Label>
                                <Input
                                    {...register('socialLinks.instagram')}
                                    className="rounded-xl border-gray-200"
                                    placeholder="https://instagram.com/yatravi"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label className="text-gray-700">Facebook</Label>
                                <Input
                                    {...register('socialLinks.facebook')}
                                    className="rounded-xl border-gray-200"
                                    placeholder="https://facebook.com/yatravi"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label className="text-gray-700">Twitter / X</Label>
                                <Input
                                    {...register('socialLinks.twitter')}
                                    className="rounded-xl border-gray-200"
                                    placeholder="https://x.com/yatravi"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label className="text-gray-700">YouTube</Label>
                                <Input
                                    {...register('socialLinks.youtube')}
                                    className="rounded-xl border-gray-200"
                                    placeholder="https://youtube.com/@yatravi"
                                />
                            </div>
                            <div className="space-y-2 col-span-2">
                                <Label className="text-gray-700">LinkedIn</Label>
                                <Input
                                    {...register('socialLinks.linkedin')}
                                    className="rounded-xl border-gray-200"
                                    placeholder="https://linkedin.com/company/yatravi"
                                />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Feature Toggles */}
                <Card className="bg-white border-0 shadow-sm rounded-2xl">
                    <CardHeader className="pb-4">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-green-50 flex items-center justify-center">
                                <Shield className="w-5 h-5 text-green-600" />
                            </div>
                            <div>
                                <CardTitle className="text-lg font-semibold text-gray-900">Website Features</CardTitle>
                                <CardDescription>Enable or disable site features.</CardDescription>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        <div className="flex items-center justify-between p-4 rounded-xl bg-gray-50">
                            <div className="space-y-0.5">
                                <Label className="text-gray-900 font-medium">WhatsApp Chat Button</Label>
                                <p className="text-sm text-gray-500">Floating green button on bottom-right</p>
                            </div>
                            <Switch
                                checked={watch('enableWhatsappChat')}
                                onCheckedChange={(val) => setValue('enableWhatsappChat', val)}
                            />
                        </div>
                        <div className="flex items-center justify-between p-4 rounded-xl bg-gray-50">
                            <div className="space-y-0.5">
                                <Label className="text-gray-900 font-medium">Inquiry Popup</Label>
                                <p className="text-sm text-gray-500">Auto-show inquiry form after 7 seconds</p>
                            </div>
                            <Switch
                                checked={watch('enableInquiryPopup')}
                                onCheckedChange={(val) => setValue('enableInquiryPopup', val)}
                            />
                        </div>
                        <div className="flex items-center justify-between p-4 rounded-xl bg-gray-50">
                            <div className="space-y-0.5">
                                <Label className="text-gray-900 font-medium">Newsletter Section</Label>
                                <p className="text-sm text-gray-500">Email subscribe section on homepage</p>
                            </div>
                            <Switch
                                checked={watch('enableNewsletter')}
                                onCheckedChange={(val) => setValue('enableNewsletter', val)}
                            />
                        </div>
                    </CardContent>
                </Card>

                {/* Promotional Banner */}
                <Card className="bg-white border-0 shadow-sm rounded-2xl">
                    <CardHeader className="pb-4">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center">
                                <Megaphone className="w-5 h-5 text-amber-600" />
                            </div>
                            <div>
                                <CardTitle className="text-lg font-semibold text-gray-900">Sale Banner</CardTitle>
                                <CardDescription>Top strip announcement bar.</CardDescription>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-center justify-between p-4 rounded-xl bg-gray-50">
                            <div className="space-y-0.5">
                                <Label className="text-gray-900 font-medium">Enable Sale Banner</Label>
                                <p className="text-sm text-gray-500">Gradient announcement strip at top of pages</p>
                            </div>
                            <Switch
                                checked={watch('enableSaleBanner')}
                                onCheckedChange={(val) => setValue('enableSaleBanner', val)}
                            />
                        </div>
                        <div className="flex items-center justify-between p-4 rounded-xl bg-gray-50">
                            <div className="space-y-0.5">
                                <Label className="text-gray-900 font-medium">Premium Animations</Label>
                                <p className="text-sm text-gray-500">Shimmer, pulsing, and gradient movements</p>
                            </div>
                            <Switch
                                checked={watch('enableSaleBannerAnimation')}
                                onCheckedChange={(val) => setValue('enableSaleBannerAnimation', val)}
                            />
                        </div>
                        <div className="flex items-center justify-between p-4 rounded-xl bg-gray-50">
                            <div className="space-y-0.5">
                                <Label className="text-gray-900 font-medium">Show Countdown Timer</Label>
                                <p className="text-sm text-gray-500">Display live timer on the strip</p>
                            </div>
                            <Switch
                                checked={watch('enableSaleBannerTimer')}
                                onCheckedChange={(val) => setValue('enableSaleBannerTimer', val)}
                            />
                        </div>

                        {watch('enableSaleBanner') && (
                            <>
                                <div className="space-y-2">
                                    <Label className="text-gray-700">Banner Text</Label>
                                    <Input
                                        {...register('saleBannerText')}
                                        className="rounded-xl border-gray-200"
                                        placeholder="🎉 Summer Sale: Get 20% off on all packages!"
                                    />
                                    <p className="text-xs text-gray-400">You can use HTML like &lt;b&gt;bold&lt;/b&gt; or emojis 🎉</p>
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-gray-700">Banner Link (Optional)</Label>
                                    <Input
                                        {...register('saleBannerLink')}
                                        className="rounded-xl border-gray-200"
                                        placeholder="/packages"
                                    />
                                </div>
                                {watch('enableSaleBannerTimer') && (
                                    <div className="space-y-2">
                                        <Label className="text-gray-700">Countdown End Date &amp; Time</Label>
                                        <Input
                                            type="datetime-local"
                                            {...register('saleBannerTimerEndDate')}
                                            className="rounded-xl border-gray-200"
                                        />
                                        <p className="text-xs text-gray-400">Timer counts down to this date &amp; time</p>
                                    </div>
                                )}
                                <div className="space-y-2">
                                    <Label className="text-gray-700 font-medium">Gradient Colors</Label>
                                    <div className="grid grid-cols-3 gap-4">
                                        <div className="space-y-2">
                                            <Label className="text-gray-600 text-sm">Start (Left)</Label>
                                            <div className="flex items-center gap-2">
                                                <input
                                                    type="color"
                                                    value={watch('saleBannerBgColor') || '#0055ff'}
                                                    onChange={(e) => setValue('saleBannerBgColor', e.target.value)}
                                                    className="w-10 h-10 p-0.5 rounded-lg cursor-pointer border border-gray-200"
                                                />
                                                <Input
                                                    {...register('saleBannerBgColor')}
                                                    className="rounded-xl border-gray-200 uppercase font-mono text-sm"
                                                    placeholder="#0055ff"
                                                />
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <Label className="text-gray-600 text-sm">Mid (Center)</Label>
                                            <div className="flex items-center gap-2">
                                                <input
                                                    type="color"
                                                    value={watch('saleBannerTextColor') || '#e91e63'}
                                                    onChange={(e) => setValue('saleBannerTextColor', e.target.value)}
                                                    className="w-10 h-10 p-0.5 rounded-lg cursor-pointer border border-gray-200"
                                                />
                                                <Input
                                                    {...register('saleBannerTextColor')}
                                                    className="rounded-xl border-gray-200 uppercase font-mono text-sm"
                                                    placeholder="#e91e63"
                                                />
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <Label className="text-gray-600 text-sm">End (Right)</Label>
                                            <div className="flex items-center gap-2">
                                                <input
                                                    type="color"
                                                    value={watch('saleBannerBorderColor') || '#ffaa00'}
                                                    onChange={(e) => setValue('saleBannerBorderColor', e.target.value)}
                                                    className="w-10 h-10 p-0.5 rounded-lg cursor-pointer border border-gray-200"
                                                />
                                                <Input
                                                    {...register('saleBannerBorderColor')}
                                                    className="rounded-xl border-gray-200 uppercase font-mono text-sm"
                                                    placeholder="#ffaa00"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    <div
                                        className="h-6 rounded-xl mt-2 border border-gray-200"
                                        style={{ background: `linear-gradient(90deg, ${watch('saleBannerBgColor') || '#0055ff'} 0%, ${watch('saleBannerTextColor') || '#e91e63'} 50%, ${watch('saleBannerBorderColor') || '#ffaa00'} 100%)` }}
                                    />
                                    <p className="text-xs text-gray-400 text-center">Live gradient preview</p>
                                </div>
                            </>
                        )}
                    </CardContent>
                </Card>

                {/* Homepage Content */}
                <Card className="bg-white border-0 shadow-sm rounded-2xl">
                    <CardHeader className="pb-4">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center">
                                <LayoutDashboard className="w-5 h-5 text-indigo-600" />
                            </div>
                            <div>
                                <CardTitle className="text-lg font-semibold text-gray-900">Homepage Content</CardTitle>
                                <CardDescription>Edit visible text across homepage sections.</CardDescription>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-6">

                        {/* Hero Mobile Tagline */}
                        <div className="space-y-3">
                            <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wider border-b pb-2">🖼️ Mobile Hero Section</h3>
                            <div className="space-y-2">
                                <Label className="text-gray-700">Mobile Hero Fancy Tagline</Label>
                                <Input
                                    {...register('heroMobileTagline')}
                                    className="rounded-xl border-gray-200"
                                    placeholder="We care your trip • Yatravi"
                                />
                                <p className="text-xs text-gray-400 font-medium">This text appears at the bottom of the mobile hero video in a fancy script font.</p>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label className="text-gray-700">Search Placeholder</Label>
                                    <Input
                                        {...register('heroSearchPlaceholder')}
                                        className="rounded-xl border-gray-200"
                                        placeholder="Search your destination"
                                    />
                                    <p className="text-xs text-gray-400 font-medium">Text inside the search box.</p>
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-gray-700">Price Label</Label>
                                    <Input
                                        {...register('heroPriceLabel')}
                                        className="rounded-xl border-gray-200"
                                        placeholder="Starting from"
                                    />
                                    <p className="text-xs text-gray-400 font-medium">Text before the package price.</p>
                                </div>
                            </div>
                        </div>

                        {/* Consultation Banner */}
                        <div className="space-y-3">
                            <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wider border-b pb-2">📣 Consultation Banner</h3>
                            <div className="space-y-2">
                                <Label className="text-gray-700">Headline</Label>
                                <Input
                                    {...register('consultationBannerHeadline')}
                                    className="rounded-xl border-gray-200"
                                    placeholder="Confused about where to go?"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label className="text-gray-700">Subtext</Label>
                                <Input
                                    {...register('consultationBannerSubtext')}
                                    className="rounded-xl border-gray-200"
                                    placeholder="Talk to our travel experts..."
                                />
                            </div>
                        </div>

                        {/* Newsletter */}
                        <div className="space-y-3">
                            <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wider border-b pb-2">📧 Newsletter Section</h3>
                            <div className="space-y-2">
                                <Label className="text-gray-700">Headline</Label>
                                <Input
                                    {...register('newsletterHeadline')}
                                    className="rounded-xl border-gray-200"
                                    placeholder="Unlock Exclusive Travel Deals!"
                                />
                            </div>
                            <div className="grid grid-cols-3 gap-3">
                                <div className="space-y-2 col-span-2">
                                    <Label className="text-gray-700">Subtext</Label>
                                    <Input
                                        {...register('newsletterSubtext')}
                                        className="rounded-xl border-gray-200"
                                        placeholder="Subscribe to our newsletter and get up to"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-gray-700">Discount Badge</Label>
                                    <Input
                                        {...register('newsletterDiscount')}
                                        className="rounded-xl border-gray-200"
                                        placeholder="40% OFF"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Why Choose Us */}
                        <div className="space-y-3">
                            <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wider border-b pb-2">✅ Why Choose Us (Trust Strip)</h3>
                            <div className="grid grid-cols-2 gap-4">
                                {[0, 1, 2, 3].map((i) => (
                                    <div key={i} className="space-y-2 p-3 rounded-xl bg-gray-50 border border-gray-100">
                                        <Label className="text-gray-600 text-xs font-semibold uppercase tracking-wider">Item {i + 1}</Label>
                                        <Input
                                            {...register(`whyChooseUs.${i}.title` as any)}
                                            className="rounded-xl border-gray-200 text-sm"
                                            placeholder={['100% Verified Packages', '24/7 Expert Support', 'Best Price Guarantee', 'Hassle-free Planning'][i]}
                                        />
                                        <Input
                                            {...register(`whyChooseUs.${i}.desc` as any)}
                                            className="rounded-xl border-gray-200 text-sm text-gray-500"
                                            placeholder={['Trusted by thousands', 'Always here for you', 'Unbeatable value', 'Transparent process'][i]}
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Join Page Content */}
                        <div className="space-y-3">
                            <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wider border-b pb-2">🤝 Join Page Content</h3>
                            <div className="space-y-2">
                                <Label className="text-gray-700">Hero Badge</Label>
                                <Input
                                    {...register('joinPageHeroBadge')}
                                    className="rounded-xl border-gray-200"
                                    placeholder="Partner with Excellence"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label className="text-gray-700">Hero Title</Label>
                                <Input
                                    {...register('joinPageHeroTitle')}
                                    className="rounded-xl border-gray-200"
                                    placeholder="Grow with Yatravi"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label className="text-gray-700">Hero Subtitle</Label>
                                <textarea
                                    {...register('joinPageHeroSubtitle')}
                                    className="w-full min-h-[100px] p-3 rounded-xl border-gray-200 bg-white focus:ring-brand focus:border-brand border outline-none text-sm transition-all"
                                    placeholder="Join India's fastest-growing travel network..."
                                />
                            </div>
                            <div className="space-y-4">
                                <Label className="text-gray-700">Hero Background Image</Label>
                                <div className="flex flex-col md:flex-row gap-6 items-start">
                                    <div className="flex-1 w-full space-y-4">
                                        <div className="space-y-2">
                                            <Label className="text-xs text-gray-400">Image URL / Path</Label>
                                            <Input
                                                {...register('joinPageHeroImage')}
                                                className="rounded-xl border-gray-200"
                                                placeholder="/images/placeholder.svg"
                                            />
                                        </div>

                                        <div className="relative">
                                            <div className="absolute inset-0 flex items-center">
                                                <span className="w-full border-t border-gray-100"></span>
                                            </div>
                                            <div className="relative flex justify-center text-xs uppercase">
                                                <span className="bg-white px-2 text-gray-400">Or</span>
                                            </div>
                                        </div>

                                        <div className="relative">
                                            <Button
                                                type="button"
                                                variant="outline"
                                                disabled={uploading}
                                                className="w-full h-11 rounded-xl border-dashed border-2 border-gray-200 hover:border-[#CD1C18] hover:bg-[#CD1C18]/5 hover:text-[#CD1C18] transition-all"
                                            >
                                                {uploading ? (
                                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                ) : (
                                                    <Upload className="mr-2 h-4 w-4" />
                                                )}
                                                {uploading ? 'Uploading...' : 'Upload Local Image'}
                                            </Button>
                                            <input
                                                type="file"
                                                accept="image/*"
                                                className="absolute inset-0 opacity-0 cursor-pointer disabled:cursor-not-allowed"
                                                onChange={handleImageUpload}
                                                disabled={uploading}
                                            />
                                        </div>
                                    </div>

                                    <div className="w-full md:w-48 aspect-video md:aspect-[4/3] rounded-2xl bg-gray-50 flex flex-col items-center justify-center overflow-hidden border border-gray-100 shadow-sm relative group">
                                        {watch('joinPageHeroImage') ? (
                                            <>
                                                <img
                                                    src={watch('joinPageHeroImage')}
                                                    alt="Hero Preview"
                                                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                                    onError={(e) => {
                                                        (e.target as HTMLImageElement).src = '/images/placeholder.svg';
                                                    }}
                                                />
                                                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                                    <span className="text-white text-xs font-medium bg-black/40 px-2 py-1 rounded-lg backdrop-blur-sm">Preview</span>
                                                </div>
                                            </>
                                        ) : (
                                            <div className="flex flex-col items-center justify-center text-gray-300 p-4 text-center">
                                                <LayoutDashboard className="w-8 h-8 mb-2 opacity-20" />
                                                <span className="text-xs">No image selected</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>

                    </CardContent>
                </Card>

                {/* Save Button */}
                <div className="sticky bottom-4 flex justify-end pt-4">
                    <Button
                        type="submit"
                        disabled={saving}
                        className="bg-[#CD1C18] hover:bg-[#9B1313] text-white rounded-xl px-8 shadow-lg shadow-[#CD1C18]/30"
                    >
                        {saving ? (
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        ) : (
                            <Save className="w-4 h-4 mr-2" />
                        )}
                        Save Changes
                    </Button>
                </div>
            </form>
        </div >
    );
}
