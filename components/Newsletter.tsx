"use client";

import React, { useState } from 'react';
import { Mail, ArrowRight } from 'lucide-react';
import { useSettings } from '@/context/SettingsContext';
import { API_BASE_URL } from '@/constants';

export const Newsletter: React.FC = () => {
    const { settings, loading } = useSettings();
    const [email, setEmail] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    // Show placeholder while loading to prevent layout shift
    if (loading) {
        return <div className="h-[280px] md:h-[350px] w-full bg-white" />;
    }

    // Don't render if disabled in admin settings
    if (!settings.enableNewsletter) return null;

    const headline = settings.newsletterHeadline || 'Unlock Exclusive Travel Deals!';
    const subtext = settings.newsletterSubtext || 'Subscribe to our newsletter and get up to';
    const discount = settings.newsletterDiscount || '40% OFF';

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email) return;

        setIsSubmitting(true);
        try {
            const res = await fetch(`${API_BASE_URL}/api/enquiries`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: 'Newsletter Subscriber',
                    email: email,
                    message: 'Subscribed to Newsletter',
                    source: 'Newsletter Signup'
                })
            });
            if (res.ok) {
                setIsSuccess(true);
                setEmail('');
                setTimeout(() => setIsSuccess(false), 3000);
            } else {
                alert('Failed to subscribe. Please try again later.');
            }
        } catch (err) {
            alert('An error occurred. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <section className="pt-4 md:pt-8 pb-0 bg-white min-h-[80px] md:min-h-[100px] relative overflow-hidden text-center">

            <div className="max-w-4xl mx-auto px-4 relative z-10 text-center">
                <div className="inline-block p-3 rounded-full bg-white shadow-sm mb-3 md:mb-4">
                    <Mail className="w-6 h-6 md:w-8 md:h-8 text-brand" />
                </div>

                <h2 className="text-xl md:text-3xl font-heading tracking-tight font-semibold text-gray-900 mb-3 md:mb-4">
                    {headline}
                </h2>
                <p className="text-gray-600 text-sm md:text-base mb-8 max-w-lg mx-auto">
                    {subtext} <span className="font-medium text-brand">{discount}</span> on your first trip booking.
                </p>

                {isSuccess ? (
                    <div className="bg-green-50 border border-green-100 rounded-2xl p-8 animate-in zoom-in duration-300 max-w-lg mx-auto">
                        <div className="w-12 h-12 bg-green-500 text-white rounded-full flex items-center justify-center mx-auto mb-4">
                            <ArrowRight className="w-6 h-6 rotate-[-45deg]" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2">Successfully Subscribed!</h3>
                        <p className="text-gray-600 text-sm font-medium">Check your inbox soon for your exclusive discount.</p>
                    </div>
                ) : (
                    <form className="flex flex-col sm:flex-row gap-4 max-w-lg mx-auto" onSubmit={handleSubmit}>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Enter your email address"
                            className="flex-1 px-6 py-4 rounded-full border border-gray-200 focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand shadow-sm transition-all"
                            required
                        />
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="px-8 py-4 rounded-full bg-brand text-white font-bold tracking-wide shadow-lg hover:shadow-xl hover:shadow-brand/20 transition-all flex items-center justify-center gap-2 group active:scale-95 disabled:opacity-50"
                        >
                            {isSubmitting ? 'Subscribing...' : 'Subscribe'}
                            {!isSubmitting && <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />}
                        </button>
                    </form>
                )}

                <p className="text-gray-400 text-xs mt-4">We respect your privacy. Unsubscribe at any time.</p>
            </div>
        </section>
    );
};
