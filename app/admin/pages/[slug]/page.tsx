"use client";

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import { API_BASE_URL } from '@/constants';
import { Save, Loader2, Upload, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const PAGE_META: Record<string, { label: string; hasHero: boolean }> = {
    about: { label: 'About Us', hasHero: true },
    contact: { label: 'Contact Us', hasHero: true },
    support: { label: 'Support Center', hasHero: false },
    privacy: { label: 'Privacy Policy', hasHero: false },
    terms: { label: 'Terms & Conditions', hasHero: false },
};

const DEFAULT_CONTENT: Record<string, any> = {
    about: {
        storyTitle: 'Redefining Travel Since 2024',
        storyBody: 'Yatravi began with a simple yet powerful idea: that travel should be more than just visiting a place—it should be an immersion.\n\nOur team of passionate explorers and travel experts came together to build a platform that bridges the gap between luxury and accessibility.',
        stats: [
            { value: '10k+', label: 'Happy Travelers' },
            { value: '500+', label: 'Destinations' },
            { value: '24/7', label: 'Support' },
            { value: '4.9', label: 'Average Rating' },
        ],
        values: [
            { title: 'Trust & Safety', desc: 'Your safety is our priority. We partner with only verified and trusted service providers globally.' },
            { title: 'Curated Experiences', desc: 'Every itinerary is hand-crafted by experts to ensure you get the best of every destination.' },
            { title: 'Global Reach, Local Touch', desc: 'Our extensive network allows us to offer local experiences with global standards.' },
        ],
        storyImage: '',
    },
    contact: {
        experts: [
            { name: 'Mr. Rohit Kumar', role: 'Domestic & International Travel Expert', phone: '+91 95875 05726', email: 'sales@yatravi.com', photo: '' },
            { name: 'Mr. Arjun', role: 'Travel Consultant', phone: '+91 99821 32143', email: 'bookwithyatravi@gmail.com', photo: '' },
        ],
        offices: [
            { label: 'Head Office', address: 'Yatravi Shop No.6, Nearby Guest House, Bajawa 333021, Jhunjhunu, Rajasthan', mapLink: 'https://share.google/OJ298f6GxDfDMBQY8' },
            { label: 'Branch Office', address: 'Dev Nagar Colony Manpura Road Pratapgarh Rajasthan, 312605', mapLink: 'https://share.google/d8120iG26yREOWEgv' },
        ],
    },
    support: {
        headline: 'Support Center',
        subtext: 'Find answers to common questions or get in touch with our team.',
    },
    privacy: {
        body: `<h3>1. Introduction</h3><p>Welcome to Yatravi...</p>`,
        lastUpdated: 'February 2026',
    },
    terms: {
        body: `<h3>1. Agreement to Terms</h3><p>By accessing or using the Yatravi website...</p>`,
        lastUpdated: 'February 2026',
    },
};

// ─────────────────────────────────────────────────────────────────────────────
// Standalone ImageUpload — must NOT be defined inside the parent component
// ─────────────────────────────────────────────────────────────────────────────
interface ImageUploadProps {
    label: string;
    value: string;
    onUpload: (url: string) => void;
    uploadKey: string;
}

function ImageUpload({ label, value, onUpload, uploadKey }: ImageUploadProps) {
    const [uploading, setUploading] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);

    const handleFile = async (file: File) => {
        setUploading(true);
        try {
            const formData = new FormData();
            formData.append('image', file);
            formData.append('title', `page-${uploadKey}-image`);

            const res = await fetch(`${API_BASE_URL}/api/upload`, {
                method: 'POST',
                credentials: 'include',
                body: formData,
            });

            if (res.ok) {
                const data = await res.json();
                onUpload(data.url);
            } else {
                const err = await res.json().catch(() => ({}));
                alert(`Upload failed: ${err.message || res.statusText}`);
            }
        } catch (e) {
            alert('Upload error. Check your connection and try again.');
        } finally {
            setUploading(false);
            // Reset input so the same file can be re-selected
            if (inputRef.current) inputRef.current.value = '';
        }
    };

    return (
        <div className="space-y-2">
            <div>
                <Label className="text-gray-700">{label}</Label>
                <p className="text-xs text-gray-500 mt-0.5">Auto-resized. Max size: 20MB. Recommended: Landscape format.</p>
            </div>

            {/* Preview */}
            {value && (
                <div className="relative h-40 rounded-xl overflow-hidden border border-gray-200">
                    <Image src={value} alt={label} fill className="object-cover" unoptimized />
                </div>
            )}

            <div className="flex gap-2">
                {/* URL input */}
                <Input
                    value={value}
                    onChange={(e) => onUpload(e.target.value)}
                    className="rounded-xl border-gray-200 text-sm"
                    placeholder="Paste image URL, or click → to upload"
                />

                {/* Upload button */}
                <Button
                    type="button"
                    variant="outline"
                    className="rounded-xl h-10 px-3 shrink-0"
                    disabled={uploading}
                    onClick={() => inputRef.current?.click()}
                >
                    {uploading
                        ? <Loader2 className="w-4 h-4 animate-spin" />
                        : <Upload className="w-4 h-4" />
                    }
                </Button>

                {/* Hidden file input */}
                <input
                    ref={inputRef}
                    type="file"
                    accept="image/jpeg,image/jpg,image/png,image/webp"
                    className="hidden"
                    onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleFile(file);
                    }}
                />
            </div>
        </div>
    );
}
// ─────────────────────────────────────────────────────────────────────────────

export default function AdminPageEditor() {
    const params = useParams();
    const router = useRouter();
    const slug = params.slug as string;
    const meta = PAGE_META[slug];

    const [saving, setSaving] = useState(false);
    const [pageData, setPageData] = useState<any>({
        title: '',
        subtitle: '',
        heroImage: '',
        content: DEFAULT_CONTENT[slug] || {},
    });

    useEffect(() => {
        fetch(`${API_BASE_URL}/api/pages/${slug}`)
            .then(res => res.json())
            .then(data => {
                if (data && (data.title || data.heroImage || (data.content && Object.keys(data.content).length > 0))) {
                    setPageData({
                        title: data.title || '',
                        subtitle: data.subtitle || '',
                        heroImage: data.heroImage || '',
                        content: { ...DEFAULT_CONTENT[slug], ...data.content },
                    });
                }
            })
            .catch(console.error);
    }, [slug]);

    if (!meta) {
        return <div className="p-8 text-center text-gray-500">Page not found.</div>;
    }

    const updateContent = (path: string[], value: any) => {
        setPageData((prev: any) => {
            const newContent = { ...prev.content };
            let ref: any = newContent;
            for (let i = 0; i < path.length - 1; i++) {
                ref[path[i]] = Array.isArray(ref[path[i]]) ? [...ref[path[i]]] : { ...ref[path[i]] };
                ref = ref[path[i]];
            }
            ref[path[path.length - 1]] = value;
            return { ...prev, content: newContent };
        });
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            const res = await fetch(`${API_BASE_URL}/api/pages/${slug}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify(pageData),
            });
            if (res.ok) {
                alert('Page saved successfully!');
            } else {
                const errData = await res.json().catch(() => ({}));
                alert(`Save failed (${res.status}): ${errData.message || res.statusText}`);
            }
        } catch (e: any) {
            alert(`Network error: ${e?.message || 'Could not reach server'}`);
        } finally {
            setSaving(false);
        }
    };


    const c = pageData.content;

    return (
        <div className="max-w-3xl mx-auto space-y-6">
            {/* Header */}
            <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" onClick={() => router.push('/admin/pages')} className="rounded-xl">
                    <ArrowLeft className="w-5 h-5" />
                </Button>
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">{meta.label}</h1>
                    <p className="text-sm text-gray-400">/{slug}</p>
                </div>
            </div>

            {/* Hero Section */}
            {meta.hasHero && (
                <Card className="bg-white border-0 shadow-sm rounded-2xl">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-base">Hero Section</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <ImageUpload
                            label="Hero Background Image"
                            value={pageData.heroImage}
                            onUpload={(url) => setPageData((p: any) => ({ ...p, heroImage: url }))}
                            uploadKey="hero"
                        />
                        <div className="space-y-2">
                            <Label>Hero Title</Label>
                            <Input value={pageData.title} onChange={(e) => setPageData((p: any) => ({ ...p, title: e.target.value }))} className="rounded-xl border-gray-200" placeholder="Journeys That Inspire" />
                        </div>
                        <div className="space-y-2">
                            <Label>Hero Subtitle</Label>
                            <Input value={pageData.subtitle} onChange={(e) => setPageData((p: any) => ({ ...p, subtitle: e.target.value }))} className="rounded-xl border-gray-200" placeholder="We don't just plan trips..." />
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* =========== ABOUT PAGE =========== */}
            {slug === 'about' && (
                <>
                    <Card className="bg-white border-0 shadow-sm rounded-2xl">
                        <CardHeader className="pb-2"><CardTitle className="text-base">Our Story Section</CardTitle></CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label>Story Title</Label>
                                <Input value={c.storyTitle || ''} onChange={(e) => updateContent(['storyTitle'], e.target.value)} className="rounded-xl border-gray-200" placeholder="Redefining Travel Since 2024" />
                            </div>
                            <div className="space-y-2">
                                <Label>Story Body</Label>
                                <textarea value={c.storyBody || ''} onChange={(e) => updateContent(['storyBody'], e.target.value)} rows={5} className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#CD1C18]/20 resize-y" placeholder="Our company story..." />
                            </div>
                            <ImageUpload label="Story Section Image" value={c.storyImage || ''} onUpload={(url) => updateContent(['storyImage'], url)} uploadKey="storyImage" />
                        </CardContent>
                    </Card>

                    <Card className="bg-white border-0 shadow-sm rounded-2xl">
                        <CardHeader className="pb-2"><CardTitle className="text-base">Stats (4 Numbers)</CardTitle></CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-2 gap-4">
                                {(c.stats || []).map((stat: any, i: number) => (
                                    <div key={i} className="space-y-2 p-3 rounded-xl bg-gray-50 border border-gray-100">
                                        <Label className="text-xs text-gray-500">Stat {i + 1}</Label>
                                        <Input value={stat.value} onChange={(e) => { const s = [...c.stats]; s[i] = { ...s[i], value: e.target.value }; updateContent(['stats'], s); }} className="rounded-xl border-gray-200 text-sm font-bold" placeholder="10k+" />
                                        <Input value={stat.label} onChange={(e) => { const s = [...c.stats]; s[i] = { ...s[i], label: e.target.value }; updateContent(['stats'], s); }} className="rounded-xl border-gray-200 text-sm text-gray-500" placeholder="Happy Travelers" />
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="bg-white border-0 shadow-sm rounded-2xl">
                        <CardHeader className="pb-2"><CardTitle className="text-base">Our Values (3 Cards)</CardTitle></CardHeader>
                        <CardContent className="space-y-4">
                            {(c.values || []).map((val: any, i: number) => (
                                <div key={i} className="space-y-2 p-3 rounded-xl bg-gray-50 border border-gray-100">
                                    <Label className="text-xs text-gray-500">Value {i + 1}</Label>
                                    <Input value={val.title} onChange={(e) => { const v = [...c.values]; v[i] = { ...v[i], title: e.target.value }; updateContent(['values'], v); }} className="rounded-xl border-gray-200 text-sm font-bold" placeholder="Trust & Safety" />
                                    <Input value={val.desc} onChange={(e) => { const v = [...c.values]; v[i] = { ...v[i], desc: e.target.value }; updateContent(['values'], v); }} className="rounded-xl border-gray-200 text-sm text-gray-500" placeholder="Description..." />
                                </div>
                            ))}
                        </CardContent>
                    </Card>
                </>
            )}

            {/* =========== CONTACT PAGE =========== */}
            {slug === 'contact' && (
                <>
                    <Card className="bg-white border-0 shadow-sm rounded-2xl">
                        <CardHeader className="pb-2"><CardTitle className="text-base">Expert Cards</CardTitle></CardHeader>
                        <CardContent className="space-y-5">
                            {(c.experts || []).map((expert: any, i: number) => (
                                <div key={i} className="space-y-3 p-4 rounded-xl bg-gray-50 border border-gray-100">
                                    <Label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Expert {i + 1}</Label>
                                    <ImageUpload
                                        label="Photo"
                                        value={expert.photo || ''}
                                        onUpload={(url) => { const e = [...c.experts]; e[i] = { ...e[i], photo: url }; updateContent(['experts'], e); }}
                                        uploadKey={`expert-${i}`}
                                    />
                                    <Input value={expert.name} onChange={(e) => { const ex = [...c.experts]; ex[i] = { ...ex[i], name: e.target.value }; updateContent(['experts'], ex); }} className="rounded-xl border-gray-200 text-sm" placeholder="Name" />
                                    <Input value={expert.role} onChange={(e) => { const ex = [...c.experts]; ex[i] = { ...ex[i], role: e.target.value }; updateContent(['experts'], ex); }} className="rounded-xl border-gray-200 text-sm" placeholder="Role / Title" />
                                    <Input value={expert.phone} onChange={(e) => { const ex = [...c.experts]; ex[i] = { ...ex[i], phone: e.target.value }; updateContent(['experts'], ex); }} className="rounded-xl border-gray-200 text-sm" placeholder="+91 XXXXX XXXXX" />
                                    <Input value={expert.email} onChange={(e) => { const ex = [...c.experts]; ex[i] = { ...ex[i], email: e.target.value }; updateContent(['experts'], ex); }} className="rounded-xl border-gray-200 text-sm" placeholder="email@yatravi.com" />
                                </div>
                            ))}
                        </CardContent>
                    </Card>

                    <Card className="bg-white border-0 shadow-sm rounded-2xl">
                        <CardHeader className="pb-2"><CardTitle className="text-base">Office Locations</CardTitle></CardHeader>
                        <CardContent className="space-y-5">
                            {(c.offices || []).map((office: any, i: number) => (
                                <div key={i} className="space-y-3 p-4 rounded-xl bg-gray-50 border border-gray-100">
                                    <Label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Office {i + 1}</Label>
                                    <Input value={office.label} onChange={(e) => { const o = [...c.offices]; o[i] = { ...o[i], label: e.target.value }; updateContent(['offices'], o); }} className="rounded-xl border-gray-200 text-sm" placeholder="Head Office" />
                                    <textarea value={office.address} onChange={(e) => { const o = [...c.offices]; o[i] = { ...o[i], address: e.target.value }; updateContent(['offices'], o); }} rows={2} className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#CD1C18]/20 resize-none" placeholder="Full address..." />
                                    <Input value={office.mapLink} onChange={(e) => { const o = [...c.offices]; o[i] = { ...o[i], mapLink: e.target.value }; updateContent(['offices'], o); }} className="rounded-xl border-gray-200 text-sm" placeholder="Google Maps share link" />
                                </div>
                            ))}
                        </CardContent>
                    </Card>
                </>
            )}

            {/* =========== SUPPORT PAGE =========== */}
            {slug === 'support' && (
                <Card className="bg-white border-0 shadow-sm rounded-2xl">
                    <CardHeader className="pb-2"><CardTitle className="text-base">Page Header</CardTitle></CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label>Headline</Label>
                            <Input value={c.headline || ''} onChange={(e) => updateContent(['headline'], e.target.value)} className="rounded-xl border-gray-200" placeholder="Support Center" />
                        </div>
                        <div className="space-y-2">
                            <Label>Subtext</Label>
                            <Input value={c.subtext || ''} onChange={(e) => updateContent(['subtext'], e.target.value)} className="rounded-xl border-gray-200" placeholder="Find answers to common questions..." />
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* =========== PRIVACY / TERMS PAGE =========== */}
            {(slug === 'privacy' || slug === 'terms') && (
                <Card className="bg-white border-0 shadow-sm rounded-2xl">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-base">Page Content (HTML)</CardTitle>
                        <p className="text-xs text-gray-400 mt-1">Use &lt;h3&gt;, &lt;p&gt;, &lt;ul&gt;, &lt;li&gt; tags for formatting.</p>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label>Last Updated</Label>
                            <Input value={c.lastUpdated || ''} onChange={(e) => updateContent(['lastUpdated'], e.target.value)} className="rounded-xl border-gray-200" placeholder="February 2026" />
                        </div>
                        <div className="space-y-2">
                            <Label>Body HTML</Label>
                            <textarea value={c.body || ''} onChange={(e) => updateContent(['body'], e.target.value)} rows={20} className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-[#CD1C18]/20 resize-y" placeholder="<h3>1. Section Title</h3><p>Content here...</p>" />
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Save Button */}
            <div className="sticky bottom-4 flex justify-end pb-4">
                <Button onClick={handleSave} disabled={saving} className="bg-[#CD1C18] hover:bg-[#9B1313] text-white rounded-xl px-8 shadow-lg shadow-[#CD1C18]/30">
                    {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
                    Save Changes
                </Button>
            </div>
        </div>
    );
}
