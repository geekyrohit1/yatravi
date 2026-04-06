"use client";

import React, { useEffect, useState } from 'react';
import { API_BASE_URL } from '@/constants';
import { Badge } from "@/components/ui/badge";
import { Shield } from 'lucide-react';

const DEFAULT_BODY = `<h3>1. Introduction</h3>
<p>Welcome to Yatravi. We value the trust you place in us and recognize the importance of secure transactions and information privacy. This Privacy Policy describes how Yatravi collects, uses, shares or otherwise processes your personal information through Yatravi website.</p>
<h3>2. Information We Collect</h3>
<p>We may collect personal information such as your name, email address, phone number, and payment details when you book a trip or subscribe to our newsletter.</p>
<h3>3. How We Use Your Information</h3>
<p>We use the information we collect to process your bookings, send booking confirmations, respond to inquiries, improve our services, and send promotional emails which you can opt-out of at any time.</p>
<h3>4. Sharing of Information</h3>
<p>We do not sell your personal information to third parties. We may share your information with trusted partners solely for the purpose of fulfilling your travel bookings.</p>
<h3>5. Data Security</h3>
<p>We implement appropriate security measures to protect your personal information from unauthorized access, alteration, disclosure, or destruction.</p>
<h3>6. Your Rights</h3>
<p>You have the right to access, correct, or delete your personal information. Please contact our support team if you wish to exercise these rights.</p>
<h3>7. Changes to This Policy</h3>
<p>We may update this Privacy Policy from time to time. Any changes will be posted on this page with an updated revision date.</p>
<h3>8. Contact Us</h3>
<p>If you have any questions about this Privacy Policy, please contact us at <a href="mailto:support@yatravi.com">support@yatravi.com</a>.</p>`;

export default function PrivacyClient({ initialData }: { initialData?: any }) {
    const [content, setContent] = useState({ 
        body: initialData?.content?.body || DEFAULT_BODY, 
        lastUpdated: initialData?.content?.lastUpdated || 'February 2026' 
    });

    useEffect(() => {
        if (!initialData) {
            fetch(`${API_BASE_URL}/api/pages/privacy`)
                .then(r => r.json())
                .then(d => {
                    if (d?.content?.body) setContent({ body: d.content.body, lastUpdated: d.content.lastUpdated || 'February 2026' });
                })
                .catch(() => { });
        }
    }, [initialData]);

    return (
        <div className="min-h-screen bg-gray-50/50 py-24 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-[500px] bg-gradient-to-b from-brand/5 to-transparent pointer-events-none" />
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="text-center mb-16">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand/5 text-brand text-sm font-bold border border-brand/10 mb-6 backdrop-blur-md">
                        <Shield className="w-4 h-4" />
                        <span>Trusted Security</span>
                    </div>
                    <h1 className="text-4xl md:text-6xl font-heading tracking-tight font-bold text-gray-950 mb-6">Privacy Policy</h1>
                    <p className="text-lg text-gray-500 font-light last:mb-0">
                        We are committed to protecting your personal data and your privacy.
                    </p>
                </div>

                <div className="bg-white rounded-[2.5rem] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.06)] border border-gray-100 p-8 md:p-16 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-brand/5 blur-[80px] -mr-32 -mt-32 rounded-full" />

                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-12 pb-8 border-b border-gray-100 relative z-10">
                        <Badge variant="outline" className="text-gray-400 border-gray-200 px-4 py-1 text-xs tracking-wider font-bold">
                            Legal Document
                        </Badge>
                        <p className="text-sm font-bold text-gray-400">
                            Last Updated: <span className="text-gray-900">{content.lastUpdated}</span>
                        </p>
                    </div>

                    <div
                        className="prose prose-gray max-w-none prose-headings:font-heading prose-headings:tracking-tight prose-headings:font-bold prose-headings:text-gray-950 prose-p:text-gray-600 prose-p:leading-relaxed prose-p:text-lg prose-a:text-brand prose-a:font-bold prose-a:no-underline hover:prose-a:underline prose-li:text-gray-600 prose-strong:text-gray-950 relative z-10"
                        dangerouslySetInnerHTML={{ __html: content.body }}
                    />

                    <div className="mt-16 pt-12 border-t border-gray-100 flex flex-col md:flex-row items-center justify-between gap-8 relative z-10">
                        <div className="text-center md:text-left">
                            <h4 className="font-bold text-gray-900 mb-1">Have concerns?</h4>
                            <p className="text-gray-400 text-sm">Our legal team is here to clarify any policy details.</p>
                        </div>
                        <a href="/contact" className="px-8 py-3 bg-gray-50 hover:bg-gray-100 text-gray-900 font-bold rounded-xl transition-colors border border-gray-200">
                            Contact Legal Team
                        </a>
                    </div>
                </div>

                <div className="mt-12 text-center text-gray-400 text-sm font-medium">
                    &copy; 2026 Yatravi Travel Solutions. All rights reserved.
                </div>
            </div>
        </div>
    );
}
