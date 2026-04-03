"use client";

import React from 'react';
import { Handshake, TrendingUp, Users, ArrowRight, CheckCircle2, Building2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import NextImage from 'next/image';
import { X, CheckCircle } from 'lucide-react';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { useSettings } from '@/context/SettingsContext';

export default function JoinPage() {
    const { settings } = useSettings();
    const [showFormPopup, setShowFormPopup] = React.useState(false);
    const [isSubmitting, setIsSubmitting] = React.useState(false);
    const [isSuccess, setIsSuccess] = React.useState(false);
    return (
        <main className="min-h-screen bg-gray-50/30">
            <h1 className="sr-only">Join Yatravi - Partner with India's Fast Growing Travel Network</h1>

            {/* Premium Hero Section */}
            <div className="relative min-h-[500px] sm:h-[55vh] md:h-[65vh] flex items-center justify-center bg-gray-950 overflow-hidden">
                <div className="absolute inset-0 z-10 bg-gradient-to-b from-black/70 via-black/40 to-gray-50/30" />
                <div className="absolute inset-0">
                    <NextImage
                        src={settings.joinPageHeroImage || "/images/placeholder.svg"}
                        alt="Join Hero"
                        fill
                        className="object-cover opacity-50 scale-105"
                        priority
                    />
                </div>
                <div className="relative z-20 max-w-4xl mx-auto text-center px-4 py-12 md:py-0 flex flex-col items-center">
                    <Badge variant="outline" className="mb-6 border-white/30 text-white bg-white/10 backdrop-blur-md px-6 py-1.5 text-sm font-medium tracking-wider">
                        {settings.joinPageHeroBadge || 'Partner with Excellence'}
                    </Badge>
                    <h1 className="text-4xl sm:text-5xl md:text-7xl font-heading tracking-tight font-bold text-white mb-6 leading-tight">
                        {settings.joinPageHeroTitle?.split(' ')[0]} <span className="text-brand">{settings.joinPageHeroTitle?.split(' ').slice(1).join(' ')}</span>
                    </h1>
                    <p className="text-base sm:text-lg md:text-2xl text-white/80 font-light max-w-2xl mx-auto leading-relaxed mb-12">
                        {settings.joinPageHeroSubtitle || "Join India's fastest-growing travel network. Whether you're a travel agent, hotelier, or corporate partner, let's build success together."}
                    </p>
                    <div className="flex flex-col sm:flex-row gap-5 md:gap-6 justify-center w-full max-w-[340px] sm:max-w-md mx-auto">
                        <div className="flex-1">
                            <Button
                                onClick={() => {
                                    if (window.innerWidth < 1024) {
                                        setShowFormPopup(true);
                                    } else {
                                        document.getElementById('partner-form')?.scrollIntoView({ behavior: 'smooth' });
                                    }
                                }}
                                className="w-full h-[62px] bg-brand hover:bg-brand-dark text-white rounded-full shadow-2xl shadow-brand/40 text-lg font-bold transition-all active:scale-95 px-8 py-0 flex items-center justify-center border-none"
                            >
                                Become a Partner
                            </Button>
                        </div>
                        <div className="flex-1">
                            <Link href="#careers" className="block w-full">
                                <Button variant="outline" className="w-full h-[62px] border-white/30 text-white bg-white/5 backdrop-blur-md hover:bg-white hover:text-gray-950 rounded-full text-lg font-bold px-8 py-0 flex items-center justify-center">
                                    View Careers
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-4 sm:-mt-16 md:-mt-24 relative z-30 mb-20 md:mb-32">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {[
                        {
                            icon: TrendingUp,
                            title: "Expand Reach",
                            desc: "Access our extensive customer base and marketing channels to grow your business exponentially.",
                            color: "blue"
                        },
                        {
                            icon: Handshake,
                            title: "Fair Partnerships",
                            desc: "Transparent commissions and reliable payments. We believe in sustainable mutual growth.",
                            color: "green"
                        },
                        {
                            icon: Users,
                            title: "Dedicated Support",
                            desc: "Get a dedicated account manager to help you optimize your listings and maximize sales.",
                            color: "brand"
                        }
                    ].map((item, idx) => (
                        <Card key={idx} className="border-none shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_24px_50px_rgba(0,0,0,0.08)] bg-white rounded-[2.5rem] transition-all duration-500 hover:-translate-y-2 group overflow-hidden">
                            <CardContent className="p-10 text-center flex flex-col items-center">
                                <div className={`w-20 h-20 rounded-[1.5rem] flex items-center justify-center mb-8 transition-all duration-500 bg-gray-50 group-hover:bg-brand group-hover:text-white group-hover:rotate-6`}>
                                    <item.icon className="w-10 h-10" />
                                </div>
                                <h3 className="text-2xl font-bold text-gray-900 mb-4 group-hover:text-brand transition-colors">{item.title}</h3>
                                <p className="text-gray-500 leading-relaxed text-lg font-light">{item.desc}</p>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>

            {/* Partner Form Section - Premium Overhaul (Hidden on Mobile) */}
            <div id="partner-form" className="hidden lg:block py-24 bg-white relative overflow-hidden">
                <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-brand/5 blur-[120px] rounded-full -mr-80 -mt-80" />

                <div className="max-w-5xl mx-auto px-4 relative z-10">
                    <div className="text-center mb-16 space-y-4">
                        <Badge variant="outline" className="text-brand border-brand/20 bg-brand/5 px-4 tracking-wider text-[10px]">Registration</Badge>
                        <h2 className="text-4xl md:text-6xl font-heading tracking-tight font-bold text-gray-950">Partner Registration</h2>
                        <p className="text-xl text-gray-500 font-light max-w-2xl mx-auto">Fill in the details below and our partnership team will reach out to you within 24 hours.</p>
                    </div>

                    <Card className="border-none bg-white rounded-[3rem] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.1)] p-8 md:p-16 border border-gray-100">
                        <form className="space-y-10" onSubmit={(e) => { e.preventDefault(); setIsSuccess(true); }}>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                                <div className="space-y-3">
                                    <Label className="text-xs font-bold tracking-wider text-gray-400">Business Name</Label>
                                    <Input required className="h-14 bg-gray-50 border-gray-100 rounded-2xl focus:bg-white focus:ring-brand focus:border-brand border-2 transition-all shadow-sm" placeholder="Yatravi Travels Pvt Ltd" />
                                </div>
                                <div className="space-y-3">
                                    <Label className="text-xs font-bold tracking-wider text-gray-400">Contact Person</Label>
                                    <Input required className="h-14 bg-gray-50 border-gray-100 rounded-2xl focus:bg-white focus:ring-brand focus:border-brand border-2 transition-all shadow-sm" placeholder="Mr. Rohit Kumar" />
                                </div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                                <div className="space-y-3">
                                    <Label className="text-xs font-bold tracking-wider text-gray-400">Email Address</Label>
                                    <Input type="email" required className="h-14 bg-gray-50 border-gray-100 rounded-2xl focus:bg-white focus:ring-brand focus:border-brand border-2 transition-all shadow-sm" placeholder="partner@gmail.com" />
                                </div>
                                <div className="space-y-3">
                                    <Label className="text-xs font-bold tracking-wider text-gray-400">Phone Number</Label>
                                    <Input type="tel" required className="h-14 bg-gray-50 border-gray-100 rounded-2xl focus:bg-white focus:ring-brand focus:border-brand border-2 transition-all shadow-sm" placeholder="+91 95875 05726" />
                                </div>
                            </div>
                            <div className="space-y-3">
                                <Label className="text-xs font-bold tracking-wider text-gray-400">Business Type</Label>
                                <select className="w-full h-14 px-4 rounded-2xl bg-gray-50 border-gray-100 border-2 focus:bg-white focus:ring-brand focus:border-brand outline-none text-gray-700 transition-all shadow-sm">
                                    <option>Travel Agency</option>
                                    <option>Hotel / Resort</option>
                                    <option>Transport Provider</option>
                                    <option>Corporate Client</option>
                                    <option>Other</option>
                                </select>
                            </div>

                            <Button type="submit" className="w-full h-16 bg-gray-950 hover:bg-brand text-white font-bold text-lg rounded-2xl shadow-xl transition-all active:scale-95 group">
                                Submit Application
                                <ArrowRight className="ml-3 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                            </Button>
                        </form>
                    </Card>
                </div>
            </div>

            {/* Mobile Form Popup Modal using Sheet */}
            <Sheet open={showFormPopup} onOpenChange={setShowFormPopup}>
                <SheetContent side="bottom" className="h-[90vh] p-0 overflow-y-auto border-none rounded-t-[2.5rem] bg-white">
                    <SheetHeader className="bg-gray-950 p-8 text-white relative text-left sm:text-left space-y-0">
                        <Badge className="bg-brand text-white border-none mb-4 w-fit">Registration</Badge>
                        <SheetTitle className="text-3xl font-bold font-heading text-white">Partner with Us</SheetTitle>
                        <SheetDescription className="text-gray-400 text-sm mt-2">
                            Become a part of India's elite travel network.
                        </SheetDescription>
                    </SheetHeader>

                    <div className="p-8">
                        {isSuccess ? (
                            <div className="py-12 text-center animate-in zoom-in duration-300">
                                <div className="w-20 h-20 bg-green-50 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                                    <CheckCircle className="w-10 h-10" />
                                </div>
                                <h3 className="text-2xl font-bold text-gray-900 mb-2">Application Sent!</h3>
                                <p className="text-gray-500">We'll contact you within 24 hours.</p>
                                <Button onClick={() => setShowFormPopup(false)} className="mt-8 bg-gray-950 rounded-xl px-8 h-12">Close</Button>
                            </div>
                        ) : (
                            <form className="space-y-6" onSubmit={(e) => { e.preventDefault(); setIsSuccess(true); }}>
                                <div className="space-y-2">
                                    <Label className="text-[10px] font-black tracking-wider text-gray-400">Business Name</Label>
                                    <Input required className="bg-gray-50 border-gray-100 rounded-xl h-12" placeholder="Agency Name" />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-[10px] font-black tracking-wider text-gray-400">Mobile Number</Label>
                                    <Input type="tel" required className="bg-gray-50 border-gray-100 rounded-xl h-12" placeholder="+91 00000 00000" />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-[10px] font-black tracking-wider text-gray-400">Business Type</Label>
                                    <select className="w-full h-12 px-4 rounded-xl bg-gray-50 border-gray-100 border-2 outline-none text-sm">
                                        <option>Travel Agency</option>
                                        <option>Hotel / Resort</option>
                                        <option>Other</option>
                                    </select>
                                </div>
                                <Button type="submit" className="w-full h-14 bg-brand text-white font-bold rounded-xl mt-4">
                                    Submit Application <ArrowRight className="ml-2 w-4 h-4" />
                                </Button>
                            </form>
                        )}
                    </div>
                </SheetContent>
            </Sheet>

            {/* Careers Section - Premium */}
            <div id="careers" className="py-32 bg-gray-50/50">
                <div className="max-w-4xl mx-auto px-4 text-center space-y-8">
                    <div className="w-20 h-20 bg-brand/5 text-brand rounded-[2rem] flex items-center justify-center mx-auto mb-6 shadow-sm border border-brand/5">
                        <Building2 className="w-10 h-10" />
                    </div>
                    <h2 className="text-4xl md:text-5xl font-heading tracking-tight font-bold text-gray-950">Careers at Yatravi</h2>
                    <p className="text-xl text-gray-500 max-w-2xl mx-auto font-light leading-relaxed">
                        We are looking for passionate individuals who love travel and technology. If you want to redefine the traveler's experience, we'd love to have you.
                    </p>
                    <div className="pt-6">
                        <Link href="/contact" className="inline-flex items-center gap-3 px-10 py-4 bg-white text-gray-950 font-bold rounded-2xl hover:bg-brand hover:text-white transition-all shadow-lg border border-gray-100">
                            Send your resume <ArrowRight className="w-5 h-5" />
                        </Link>
                    </div>
                </div>
            </div>
        </main>
    );
}
