"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { ShieldCheck, Heart, Globe, Users, Star, Target, Award } from 'lucide-react';
import { API_BASE_URL } from '@/constants';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const VALUE_ICONS = [ShieldCheck, Heart, Globe];
const STAT_ICONS = [Users, Globe, Star, Award];

const DEFAULTS = {
    title: 'Journeys That Inspire',
    subtitle: "We don't just plan trips; we curate experiences that become lifelong memories. Welcome to the new standard of travel.",
    heroImage: '/images/placeholder.svg',
    content: {
        storyTitle: 'Redefining Travel Since 2024',
        storyBody: 'Yatravi began with a simple yet powerful idea: that travel should be more than just visiting a place—it should be an immersion.\n\nOur team of passionate explorers and travel experts came together to build a platform that bridges the gap between luxury and accessibility.',
        storyImage: '/images/placeholder.svg',
        stats: [
            { value: '10k+', label: 'Happy Travelers' },
            { value: '500+', label: 'Destinations' },
            { value: '24/7', label: 'Support' },
            { value: '4.9', label: 'Average Rating' },
        ],
        values: [
            { title: 'Trust & Safety', desc: 'Your safety is our priority. We partner only with verified and trusted service providers globally.' },
            { title: 'Curated Experiences', desc: 'Every itinerary is hand-crafted by experts to ensure you experience the best of every destination.' },
            { title: 'Global Reach, Local Touch', desc: 'Our extensive network allows us to offer local experiences with the comfort of global standards.' },
        ],
    },
};

export default function AboutPage() {
    const [data, setData] = useState(DEFAULTS);

    useEffect(() => {
        fetch(`${API_BASE_URL}/api/pages/about`)
            .then(res => res.json())
            .then(d => {
                if (d && (d.title || (d.content && Object.keys(d.content).length > 0))) {
                    setData({
                        title: d.title || DEFAULTS.title,
                        subtitle: d.subtitle || DEFAULTS.subtitle,
                        heroImage: d.heroImage || DEFAULTS.heroImage,
                        content: { ...DEFAULTS.content, ...d.content },
                    });
                }
            })
            .catch(() => { });
    }, []);

    const c = data.content;

    return (
        <main className="min-h-screen bg-white">
            <h1 className="sr-only">About Yatravi - Our Story and Mission</h1>
            {/* Hero Section */}
            <div className="relative h-[60vh] flex items-center justify-center bg-gray-950 overflow-hidden">
                <div className="absolute inset-0 z-10 bg-gradient-to-b from-black/60 via-black/40 to-white" />
                <div className="absolute inset-0">
                    <Image src={data.heroImage} alt="About Hero" fill quality={100} className="object-cover shrink-0 opacity-60 scale-105" priority />
                </div>

                <div className="relative z-20 text-center px-4 max-w-4xl mx-auto flex flex-col items-center">
                    <Badge variant="outline" className="mb-6 border-white/30 text-white bg-white/10 backdrop-blur-md px-4 py-1 animate-in fade-in slide-in-from-bottom-4 duration-700">
                        Since 2024
                    </Badge>
                    <h1 className="text-5xl md:text-7xl font-heading tracking-tighter font-bold text-white mb-6 animate-in fade-in slide-in-from-bottom-6 duration-1000">
                        {data.title}
                    </h1>
                    <p className="text-xl md:text-2xl text-white/90 font-medium max-w-2xl mx-auto leading-relaxed drop-shadow-lg">
                        {data.subtitle}
                    </p>
                </div>
            </div>

            {/* Mission & Story */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 -mt-20 relative z-30">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center bg-white rounded-[3rem] p-8 md:p-16 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.1)] border border-gray-100">
                    <div className="space-y-8">
                        <div className="space-y-2">
                            <h2 className="text-sm font-bold text-brand tracking-wider">Our founding</h2>
                            <h2 className="text-4xl md:text-5xl font-heading tracking-tight font-bold text-gray-900 leading-tight">
                                {c.storyTitle}
                            </h2>
                        </div>
                        <div className="space-y-6 text-gray-500 text-lg leading-relaxed font-light">
                            {(c.storyBody || '').split('\n\n').filter(Boolean).map((para: string, i: number) => (
                                <p key={i}>{para}</p>
                            ))}
                        </div>
                    </div>

                    <div className="relative group">
                        <div className="aspect-[4/5] rounded-[2.5rem] overflow-hidden shadow-2xl relative">
                            <Image src={c.storyImage || '/images/placeholder.svg'} alt="Our Story" fill quality={100} className="object-cover shrink-0 group-hover:scale-105 transition-transform duration-1000" />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                        </div>
                        <div className="absolute -bottom-10 -left-10 bg-white/80 backdrop-blur-xl p-8 rounded-[2rem] shadow-2xl border border-white/20 hidden md:block max-w-xs">
                            <Target className="w-8 h-8 text-brand mb-4" />
                            <p className="font-heading tracking-tight font-semibold text-gray-900 text-xl italic leading-snug">
                                &quot;Travel is the only thing you buy that makes you richer.&quot;
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Stats - Premium Overhaul */}
            <div className="py-24 bg-gray-50/50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-12">
                        {(c.stats || []).map((stat: any, idx: number) => {
                            const Icon = STAT_ICONS[idx] || Users;
                            return (
                                <div key={idx} className="flex flex-col items-center text-center group">
                                    <div className="w-16 h-16 bg-white rounded-2xl shadow-xl flex items-center justify-center mb-6 group-hover:bg-brand group-hover:text-white transition-all duration-500 -rotate-3 group-hover:rotate-0">
                                        <Icon className="w-7 h-7 text-brand group-hover:text-white transition-colors" />
                                    </div>
                                    <div className="text-5xl md:text-6xl font-heading tracking-tighter font-bold text-gray-950 mb-2 tabular-nums">
                                        {stat.value}
                                    </div>
                                    <div className="text-sm font-bold text-gray-400 tracking-widest">{stat.label}</div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* Our Values - Shadcn Cards */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32">
                <div className="text-center max-w-3xl mx-auto mb-20 space-y-4">
                    <Badge variant="outline" className="text-brand border-brand/20 bg-brand/5 px-4 mb-2">Our Philosophy</Badge>
                    <h2 className="text-4xl md:text-5xl font-heading tracking-tight font-bold text-gray-900">Why Choose Yatravi?</h2>
                    <p className="text-gray-500 text-lg">We believe in travel that enriches the soul and expands the horizon.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                    {(c.values || []).map((item: any, idx: number) => {
                        const Icon = VALUE_ICONS[idx] || ShieldCheck;
                        return (
                            <Card key={idx} className="border-none shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_24px_50px_rgba(0,0,0,0.08)] bg-white rounded-[2rem] transition-all duration-500 hover:-translate-y-2 group">
                                <CardContent className="p-10 text-center flex flex-col items-center">
                                    <div className="w-20 h-20 bg-gray-50 rounded-[1.5rem] flex items-center justify-center mb-8 group-hover:bg-brand/10 transition-colors duration-500">
                                        <Icon className="w-10 h-10 text-brand transition-transform duration-500 group-hover:scale-110" />
                                    </div>
                                    <h4 className="font-heading tracking-tight font-bold text-2xl text-gray-900 mb-4">{item.title}</h4>
                                    <p className="text-gray-500 leading-relaxed font-light">{item.desc}</p>
                                </CardContent>
                            </Card>
                        );
                    })}
                </div>
            </div>

            {/* CTA Section - Bonus Premium Touch */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-32">
                <div className="bg-brand rounded-[3rem] p-12 md:p-24 text-center text-white relative overflow-hidden shadow-2xl shadow-brand/20">
                    <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl -mr-48 -mt-48" />
                    <div className="absolute bottom-0 left-0 w-96 h-96 bg-black/10 rounded-full blur-3xl -ml-48 -mb-48" />

                    <div className="relative z-10 space-y-8">
                        <h2 className="text-4xl md:text-6xl font-heading tracking-tight font-bold leading-tight max-w-3xl mx-auto">
                            Ready to Start Your Next Story?
                        </h2>
                        <p className="text-white/80 text-xl max-w-xl mx-auto font-light leading-relaxed">
                            Join thousands of happy travelers who have discovered the Yatravi way of exploring the world.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                            <button className="bg-white text-brand px-10 py-4 rounded-2xl font-bold text-lg hover:bg-gray-50 transition-colors shadow-xl">
                                Plan My Trip
                            </button>
                            <button className="bg-transparent border border-white/30 text-white px-10 py-4 rounded-2xl font-bold text-lg hover:bg-white/10 transition-colors backdrop-blur-sm">
                                View Destinations
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}
