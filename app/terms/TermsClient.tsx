"use client";

import React, { useEffect, useState } from 'react';
import { API_BASE_URL } from '@/constants';
import { Badge } from "@/components/ui/badge";
import { FileText } from 'lucide-react';

const DEFAULT_BODY = `<h3>1. Agreement to Terms</h3>
<p>By accessing or using the Yatravi website, you agree to be bound by these Terms and Conditions and our Privacy Policy. If you do not agree to these terms, please do not use our services.</p>
<h3>2. Booking and Payments</h3>
<p>All bookings are subject to availability. Prices are subject to change without notice until a booking is confirmed. Full payment or a deposit (as specified) is required to secure your booking.</p>
<h3>3. Cancellations and Refunds</h3>
<p>Cancellation policies vary by package and provider. Please review the specific cancellation terms provided at the time of booking. Refunds, if applicable, will be processed according to these terms.</p>
<h3>4. User Responsibilities</h3>
<p>You are responsible for ensuring that you have valid travel documents (passports, visas, etc.) for your trip. You agree to provide accurate information during the booking process.</p>
<h3>5. Limitation of Liability</h3>
<p>Yatravi acts as an agent for travel service providers. We are not liable for any acts, errors, omissions, or negligence of any such suppliers.</p>
<h3>6. Intellectual Property</h3>
<p>The content on this website, including text, graphics, logos, and images, is the property of Yatravi and is protected by copyright laws.</p>
<h3>7. Governing Law</h3>
<p>These terms shall be governed by and construed in accordance with the laws of India. Any disputes shall be subject to the exclusive jurisdiction of the courts in India.</p>
<h3>8. Contact Information</h3>
<p>For any queries regarding these terms, please contact us at <a href="mailto:support@yatravi.com">support@yatravi.com</a>.</p>`;

export default function TermsClient({ initialData }: { initialData?: any }) {
    const [content, setContent] = useState({ 
        body: initialData?.content?.body || DEFAULT_BODY, 
        lastUpdated: initialData?.content?.lastUpdated || 'February 2026' 
    });

    useEffect(() => {
        if (!initialData) {
            fetch(`${API_BASE_URL}/api/pages/terms`)
                .then(r => r.json())
                .then(d => {
                    if (d?.content?.body) setContent({ body: d.content.body, lastUpdated: d.content.lastUpdated || 'February 2026' });
                })
                .catch(() => { });
        }
    }, [initialData]);

    return (
        <div className="min-h-screen bg-gray-50/50 py-24 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-full h-[500px] bg-gradient-to-b from-brand/5 to-transparent pointer-events-none" />
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="text-center mb-16">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand/5 text-brand text-sm font-bold border border-brand/10 mb-6 backdrop-blur-md">
                        <FileText className="w-4 h-4" />
                        <span>Service Agreement</span>
                    </div>
                    <h1 className="text-4xl md:text-6xl font-heading tracking-tight font-bold text-gray-950 mb-6">Terms & Conditions</h1>
                    <p className="text-lg text-gray-500 font-light max-w-2xl mx-auto leading-relaxed">
                        Please read these terms carefully before using our services.
                    </p>
                </div>

                <div className="bg-white rounded-[2.5rem] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.06)] border border-gray-100 p-8 md:p-16 relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-64 h-64 bg-brand/5 blur-[80px] -ml-32 -mt-32 rounded-full" />

                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-12 pb-8 border-b border-gray-100 relative z-10">
                        <Badge variant="outline" className="text-gray-400 border-gray-200 px-4 py-1 text-xs tracking-wider font-bold">
                            Legal Guidelines
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
                            <h4 className="font-bold text-gray-900 mb-1">Questions about our terms?</h4>
                            <p className="text-gray-400 text-sm">Our support team is available to help you understand our policies.</p>
                        </div>
                        <a href="/contact" className="px-8 py-3 bg-gray-50 hover:bg-gray-100 text-gray-900 font-bold rounded-xl transition-colors border border-gray-200">
                            Get Clarification
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
