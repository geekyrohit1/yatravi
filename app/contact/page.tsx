"use client";

import React, { useState, useEffect } from 'react';
import { Mail, Phone, MapPin, Send, User, Building2, Clock, CheckCircle2, ArrowRight } from 'lucide-react';
import { API_BASE_URL } from '@/constants';
import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";

const DEFAULT_CONTACT = {
    title: 'Get in Touch',
    subtitle: 'Ready to plan your next getaway? Our experts are here to craft your perfect itinerary.',
    heroImage: '/images/placeholder.svg',
    content: {
        experts: [
            { name: 'Mr. Rohit Kumar', role: 'Domestic & International Travel Expert', phone: '+91 95875 05726', email: 'sales@yatravi.com', photo: '' },
            { name: 'Mr. Arjun', role: 'Travel Consultant', phone: '+91 99821 32143', email: 'bookwithyatravi@gmail.com', photo: '' },
        ],
        offices: [
            { label: 'Head Office', address: 'Yatravi Shop No.6, Nearby Guest House, Bajawa 333021, Jhunjhunu, Rajasthan', mapLink: 'https://share.google/OJ298f6GxDfDMBQY8' },
            { label: 'Branch Office', address: 'Dev Nagar Colony Manpura Road Pratapgarh Rajasthan, 312605', mapLink: 'https://share.google/d8120iG26yREOWEgv' },
        ],
    },
};

export default function ContactPage() {
    const [pageData, setPageData] = useState<any>(null);
    const [formData, setFormData] = useState({ firstName: '', lastName: '', email: '', phone: '', message: '' });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    useEffect(() => {
        fetch(`${API_BASE_URL}/api/pages/contact`)
            .then(r => r.json())
            .then(d => {
                if (d && (d.title || d.heroImage || d.content)) {
                    setPageData(d);
                }
            })
            .catch(() => { });
    }, []);

    const page = {
        title: pageData?.title || DEFAULT_CONTACT.title,
        subtitle: pageData?.subtitle || DEFAULT_CONTACT.subtitle,
        heroImage: pageData?.heroImage || DEFAULT_CONTACT.heroImage,
        content: {
            experts: pageData?.content?.experts || DEFAULT_CONTACT.content.experts,
            offices: pageData?.content?.offices || DEFAULT_CONTACT.content.offices,
        },
    };

    const c = page.content;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            const res = await fetch(`${API_BASE_URL}/api/enquiries`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name: `${formData.firstName} ${formData.lastName}`.trim(), email: formData.email, phone: formData.phone, message: formData.message, source: 'Contact Us Page' })
            });
            if (res.ok) {
                setSubmitted(true);
                setFormData({ firstName: '', lastName: '', email: '', phone: '', message: '' });
                setTimeout(() => setSubmitted(false), 5000);
            }
            else alert('Failed to send message. Please try again.');
        } catch { alert('An error occurred. Please try again.'); }
        finally { setIsSubmitting(false); }
    };

    return (
        <div className="min-h-screen bg-[#FDFDFD] selection:bg-brand/20">
            {/* HERO SECTION - Immersive & Minimal */}
            <div className="relative pt-32 pb-20 md:pt-48 md:pb-32 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
                <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-gradient-to-br from-brand/5 to-transparent blur-[120px] rounded-full -mr-60 -mt-20 pointer-events-none" />

                <div className="text-center max-w-4xl mx-auto relative z-10 animate-in fade-in slide-in-from-bottom-8 duration-1000">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand/5 border border-brand/10 text-brand text-sm font-bold tracking-wider mb-8">
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-brand"></span>
                        </span>
                        We're Here for You
                    </div>
                    <h1 className="text-5xl md:text-7xl lg:text-8xl font-heading tracking-tight font-extrabold text-gray-950 mb-6 leading-[1.1]">
                        Let's Plan Your <br className="hidden md:block" /> <span className="text-transparent bg-clip-text bg-brand">Dream Journey</span>
                    </h1>
                    <p className="text-lg md:text-2xl text-gray-500 font-light max-w-2xl mx-auto leading-relaxed">
                        {page.subtitle}
                    </p>
                </div>
            </div>

            {/* MAIN CONTENT GRID */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-32 relative z-30">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 lg:items-start">

                    {/* LEFT COLUMN: Contact Info & Offices (Takes up 5 columns) */}
                    <div className="lg:col-span-5 space-y-12">

                        {/* EXPERTS SECTION */}
                        <div className="space-y-6">
                            <h3 className="text-2xl font-bold text-gray-900 tracking-tight">Talk to an Expert</h3>
                            <div className="grid gap-4">
                                {(c.experts || []).map((expert: any, i: number) => (
                                    <div key={i} className="group p-5 md:p-6 rounded-[2rem] bg-white border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.02)] hover:shadow-[0_20px_40px_rgb(0,0,0,0.06)] hover:border-gray-200 transition-all duration-300 flex items-center gap-5">
                                        <div className="relative shrink-0">
                                            <div className="w-16 h-16 rounded-full overflow-hidden bg-gray-50 border border-gray-100 flex items-center justify-center">
                                                {expert.photo ? (
                                                    <Image src={expert.photo} alt={expert.name} fill quality={100} className="object-cover shrink-0 group-hover:scale-110 transition-transform duration-500 rounded-full" />
                                                ) : (
                                                    <User className="w-8 h-8 text-gray-300" />
                                                )}
                                            </div>
                                            <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 text-white rounded-full border-2 border-white flex items-center justify-center shadow-sm">
                                                <CheckCircle2 className="w-3.5 h-3.5" />
                                            </div>
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h4 className="text-lg font-bold text-gray-900 truncate">{expert.name}</h4>
                                            <p className="text-xs font-bold text-brand tracking-wider truncate mb-2">{expert.role}</p>
                                            <div className="flex items-center gap-4 mt-1">
                                                {expert.phone && (
                                                    <a href={`tel:${expert.phone.replace(/\s/g, '')}`} className="text-gray-500 hover:text-brand transition-colors" title="Call">
                                                        <Phone className="w-4 h-4" />
                                                    </a>
                                                )}
                                                {expert.email && (
                                                    <a href={`mailto:${expert.email}`} className="text-gray-500 hover:text-brand transition-colors" title="Email">
                                                        <Mail className="w-4 h-4" />
                                                    </a>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>


                        {/* OPERATING HOURS */}
                        <div className="p-8 rounded-[2rem] bg-gradient-to-br from-brand to-brand-light text-white relative overflow-hidden shadow-2xl shadow-brand/20">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-brand/20 rounded-full -mr-16 -mt-16 blur-2xl" />
                            <div className="relative z-10 flex items-start gap-5">
                                <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center shrink-0">
                                    <Clock className="w-6 h-6 text-white" />
                                </div>
                                <div className="space-y-4 w-full">
                                    <h4 className="font-bold text-xl">Operating Hours</h4>
                                    <div className="space-y-3 text-sm text-gray-300 font-medium">
                                        <div className="flex justify-between items-center border-b border-white/10 pb-3">
                                            <span>Monday - Saturday</span>
                                            <span className="text-white">9:00 AM - 7:00 PM</span>
                                        </div>
                                        <div className="flex justify-between items-center pt-1">
                                            <span>Sunday</span>
                                            <span className="text-white">Closed</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>

                    {/* RIGHT COLUMN: Contact Form (Takes up 7 columns) */}
                    <div className="lg:col-span-7 lg:pl-8 xl:pl-16 mt-12 lg:mt-0">
                        <div className="bg-white rounded-[2.5rem] md:rounded-[3.5rem] shadow-[0_20px_80px_-20px_rgba(0,0,0,0.06)] border border-gray-100 p-8 md:p-14 relative overflow-hidden">
                            {/* Decorative background element */}
                            <div className="absolute top-0 right-0 w-80 h-80 bg-brand/5 rounded-full -mr-40 -mt-40 blur-[60px] pointer-events-none" />

                            {submitted ? (
                                <div className="absolute inset-0 z-50 bg-white/95 backdrop-blur-sm flex flex-col items-center justify-center text-center p-8 animate-in zoom-in-95 duration-500">
                                    <div className="w-24 h-24 bg-green-50 text-green-500 rounded-full flex items-center justify-center mb-8 relative">
                                        <div className="absolute inset-0 bg-green-400/20 rounded-full animate-ping"></div>
                                        <CheckCircle2 className="w-12 h-12 relative z-10" />
                                    </div>
                                    <h3 className="text-3xl font-bold text-gray-900 mb-4">Request Received!</h3>
                                    <p className="text-gray-500 text-lg max-w-sm mb-10">Thank you for reaching out. One of our travel specialists will contact you shortly to plan your journey.</p>
                                    <Button onClick={() => setSubmitted(false)} className="h-14 px-8 rounded-full bg-gray-900 hover:bg-gray-800 text-white font-bold transition-all shadow-xl hover:shadow-2xl hover:-translate-y-1">
                                        Send Another Message
                                    </Button>
                                </div>
                            ) : null}

                            <div className="relative z-10">
                                <h2 className="text-3xl md:text-4xl font-heading font-bold text-gray-900 mb-2">Start Your Journey</h2>
                                <p className="text-gray-500 mb-12 text-lg">Send us a message and we'll be in touch instantly.</p>

                                <form onSubmit={handleSubmit} className="space-y-6">
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                        <div className="space-y-2 group">
                                            <Label htmlFor="firstName" className="text-[13px] font-bold tracking-wider text-gray-400 group-focus-within:text-brand transition-colors">First Name</Label>
                                            <div className="relative">
                                                <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
                                                    <User className="h-5 w-5 text-gray-400 group-focus-within:text-brand transition-colors" />
                                                </div>
                                                <Input id="firstName" required value={formData.firstName} onChange={(e) => setFormData({ ...formData, firstName: e.target.value })} className="h-14 pl-12 bg-gray-50/50 border-gray-200 rounded-2xl focus:bg-white focus:ring-2 focus:ring-brand/20 focus:border-brand transition-all text-base shadow-sm" placeholder="John" />
                                            </div>
                                        </div>
                                        <div className="space-y-2 group">
                                            <Label htmlFor="lastName" className="text-[13px] font-bold tracking-wider text-gray-400 group-focus-within:text-brand transition-colors">Last Name</Label>
                                            <Input id="lastName" value={formData.lastName} onChange={(e) => setFormData({ ...formData, lastName: e.target.value })} className="h-14 bg-gray-50/50 border-gray-200 rounded-2xl focus:bg-white focus:ring-2 focus:ring-brand/20 focus:border-brand transition-all text-base px-5 shadow-sm" placeholder="Doe" />
                                        </div>
                                    </div>

                                    <div className="space-y-2 group">
                                        <Label htmlFor="email" className="text-[13px] font-bold text-gray-400 group-focus-within:text-brand transition-colors">Email Address</Label>
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
                                                <Mail className="h-5 w-5 text-gray-400 group-focus-within:text-brand transition-colors" />
                                            </div>
                                            <Input id="email" type="email" required value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} className="h-14 pl-12 bg-gray-50/50 border-gray-200 rounded-2xl focus:bg-white focus:ring-2 focus:ring-brand/20 focus:border-brand transition-all text-base shadow-sm" placeholder="john@example.com" />
                                        </div>
                                    </div>

                                    <div className="space-y-2 group">
                                        <Label htmlFor="phone" className="text-[13px] font-bold text-gray-400 group-focus-within:text-brand transition-colors">Phone Number <span className="text-gray-300 font-normal normal-case tracking-normal">(With country code)</span></Label>
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
                                                <Phone className="h-5 w-5 text-gray-400 group-focus-within:text-brand transition-colors" />
                                            </div>
                                            <Input id="phone" type="tel" required value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} className="h-14 pl-12 bg-gray-50/50 border-gray-200 rounded-2xl focus:bg-white focus:ring-2 focus:ring-brand/20 focus:border-brand transition-all text-base shadow-sm" placeholder="+91 95875 05726" />
                                        </div>
                                    </div>

                                    <div className="space-y-2 group mt-8">
                                        <Label htmlFor="message" className="text-[13px] font-bold tracking-wider text-gray-400 group-focus-within:text-brand transition-colors">Tell us about your trip</Label>
                                        <Textarea id="message" required rows={5} value={formData.message} onChange={(e) => setFormData({ ...formData, message: e.target.value })} className="bg-gray-50/50 border-gray-200 rounded-2xl focus:bg-white focus:ring-2 focus:ring-brand/20 focus:border-brand transition-all text-base p-5 resize-none shadow-sm" placeholder="Where do you want to go? When are you planning to travel? How many people?" />
                                    </div>

                                    <div className="pt-6">
                                        <Button type="submit" disabled={isSubmitting} className="w-full h-16 bg-brand hover:from-brand-dark hover:to-brand text-white font-bold text-lg rounded-2xl shadow-[0_8px_30px_rgba(var(--brand-rgb),0.3)] hover:shadow-[0_20px_40px_rgba(var(--brand-rgb),0.4)] transition-all duration-300 hover:-translate-y-1 active:scale-95 disabled:opacity-70 disabled:hover:translate-y-0 group flex gap-3 overflow-hidden relative border-none">
                                            {isSubmitting ? (
                                                <div className="w-6 h-6 border-3 border-white/30 border-t-white rounded-full animate-spin" />
                                            ) : (
                                                <>
                                                    <span className="relative z-10 flex items-center gap-2">
                                                        Submit Request
                                                        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                                    </span>
                                                    {/* Hover effect overlay */}
                                                    <div className="absolute inset-0 h-full w-full opacity-0 group-hover:opacity-100 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 -translate-x-full group-hover:animate-shimmer" />
                                                </>
                                            )}
                                        </Button>
                                        <p className="text-center text-xs text-gray-400 mt-6 font-medium flex items-center justify-center gap-1.5">
                                            <CheckCircle2 className="w-3.5 h-3.5" />
                                            We respect your privacy. No spam.
                                        </p>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>

                </div>
            </div>

            <style jsx global>{`
                @keyframes shimmer {
                    100% { transform: translateX(100%); }
                }
                .animate-shimmer {
                    animation: shimmer 1.5s infinite;
                }
            `}</style>
        </div>
    );
}
