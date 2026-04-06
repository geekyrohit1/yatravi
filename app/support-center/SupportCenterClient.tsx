"use client";

import React from 'react';
import { FAQSection } from '@/components/FAQSection';
import { MessageCircle, Mail, Phone, ArrowRight, HelpCircle } from 'lucide-react';
import { Card, CardContent } from "@/components/ui/card";

export default function SupportCenterClient({ initialData }: { initialData?: any }) {
    return (
        <div className="min-h-screen bg-white text-gray-800 font-sans selection:bg-brand/20">
            {/* Minimalist Hero Section */}
            <header className="relative pt-32 pb-24 px-6 overflow-hidden flex flex-col items-center text-center">
                {/* Subtle background glow */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-brand/5 blur-[100px] rounded-full pointer-events-none -z-10" />

                <div className="animate-in fade-in slide-in-from-bottom-8 duration-700 delay-100 flex flex-col items-center">
                    <div className="w-16 h-16 bg-white shadow-sm border border-gray-100 text-brand rounded-2xl flex items-center justify-center mb-8">
                        <HelpCircle className="w-8 h-8" strokeWidth={1.5} />
                    </div>
                    <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-gray-900 mb-6">
                        How can we help?
                    </h1>
                    <p className="max-w-xl text-lg md:text-xl text-gray-500 font-light leading-relaxed">
                        Find answers to your questions or get in touch with our dedicated support team to assist you along your journey.
                    </p>
                </div>
            </header>

            <main className="max-w-6xl mx-auto px-6 py-12">
                {/* Quick Actions - Ultra Clean Cards */}
                <section className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 mb-32 relative z-10 animate-in fade-in slide-in-from-bottom-12 duration-700 delay-200">
                    <a href="mailto:heslpdeskyatravi@gmail.com" className="group block focus:outline-none focus:ring-2 focus:ring-brand/50 rounded-3xl">
                        <Card className="border border-gray-100 shadow-sm hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.05)] transition-all duration-500 rounded-3xl bg-white/70 backdrop-blur-xl group-hover:-translate-y-1">
                            <CardContent className="p-10 flex flex-col items-start">
                                <div className="w-12 h-12 bg-gray-50 text-gray-700 rounded-xl flex items-center justify-center mb-8 group-hover:bg-brand group-hover:text-white transition-colors duration-500">
                                    <Mail className="w-5 h-5" strokeWidth={2} />
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 mb-2">Email Support</h3>
                                <p className="text-sm text-gray-500 mb-8 font-medium">heslpdeskyatravi@gmail.com</p>
                                <div className="mt-auto flex items-center gap-2 text-brand font-semibold text-sm">
                                    Send an email <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform" />
                                </div>
                            </CardContent>
                        </Card>
                    </a>

                    <a href="https://wa.me/919587505726" target="_blank" rel="noopener noreferrer" className="group block focus:outline-none focus:ring-2 focus:ring-brand/50 rounded-3xl">
                        <Card className="border border-gray-100 shadow-sm hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.05)] transition-all duration-500 rounded-3xl bg-white/70 backdrop-blur-xl group-hover:-translate-y-1">
                            <CardContent className="p-10 flex flex-col items-start">
                                <div className="w-12 h-12 bg-gray-50 text-gray-700 rounded-xl flex items-center justify-center mb-8 group-hover:bg-[#25D366] group-hover:text-white transition-colors duration-500">
                                    <MessageCircle className="w-5 h-5" strokeWidth={2} />
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 mb-2">WhatsApp</h3>
                                <p className="text-sm text-gray-500 mb-8 font-medium">+91 95875 05726</p>
                                <div className="mt-auto flex items-center gap-2 text-[#25D366] font-semibold text-sm">
                                    Start chatting <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform" />
                                </div>
                            </CardContent>
                        </Card>
                    </a>

                    <a href="tel:+919587505726" className="group block focus:outline-none focus:ring-2 focus:ring-brand/50 rounded-3xl">
                        <Card className="border border-gray-100 shadow-sm hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.05)] transition-all duration-500 rounded-3xl bg-white/70 backdrop-blur-xl group-hover:-translate-y-1">
                            <CardContent className="p-10 flex flex-col items-start">
                                <div className="w-12 h-12 bg-gray-50 text-gray-700 rounded-xl flex items-center justify-center mb-8 group-hover:bg-brand group-hover:text-white transition-colors duration-500">
                                    <Phone className="w-5 h-5" strokeWidth={2} />
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 mb-2">Direct Call</h3>
                                <p className="text-sm text-gray-500 mb-8 font-medium">Mon–Sat, 9AM–7PM IST</p>
                                <div className="mt-auto flex items-center gap-2 text-brand font-semibold text-sm">
                                    Call us now <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform" />
                                </div>
                            </CardContent>
                        </Card>
                    </a>
                </section>

                {/* FAQ Section - Seamless Container */}
                <section className="mb-32 max-w-4xl mx-auto animate-in fade-in duration-1000 delay-300">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-gray-900">Frequently Asked Questions</h2>
                    </div>
                    {/* Wrapping the FAQSection without heavy card borders to look cleaner */}
                    <div className="bg-transparent">
                        <FAQSection hideHeader className="py-0 md:py-0 bg-transparent" />
                    </div>
                </section>

                {/* Still Have Questions - Light, Airy Bottom Block */}
                <section className="bg-white rounded-[2.5rem] p-12 md:p-16 text-center border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.02)] relative overflow-hidden animate-in fade-in duration-1000 delay-500 flex flex-col items-center">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-brand/5 blur-[80px] rounded-full -translate-y-1/2 translate-x-1/2 pointer-events-none" />
                    <div className="absolute bottom-0 left-0 w-64 h-64 bg-brand/5 blur-[80px] rounded-full translate-y-1/2 -translate-x-1/2 pointer-events-none" />

                    <div className="relative z-10 max-w-2xl">
                        <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-gray-900 mb-4">
                            Can&apos;t find what you&apos;re looking for?
                        </h2>
                        <p className="text-gray-500 text-lg font-light mb-10 leading-relaxed">
                            Our team is available round the clock to assist you. Don&apos;t hesitate to reach out for personalized support.
                        </p>
                        <a
                            href="/contact"
                            className="inline-flex items-center justify-center px-8 py-3.5 bg-gray-900 text-white font-medium rounded-full hover:bg-black hover:shadow-lg transition-all active:scale-[0.98] group"
                        >
                            Open Contact Form
                            <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                        </a>
                    </div>
                </section>
            </main>
        </div>
    );
}
