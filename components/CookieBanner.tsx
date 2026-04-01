"use client";

import React, { useState, useEffect } from 'react';
import { useConsent } from '@/context/ConsentContext';
import { Cookie, X, ShieldCheck, BarChart3, Fingerprint, Settings2, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export const CookieBanner: React.FC = () => {
    const { hasResponded, acceptAll, denyAll, updatePreferences } = useConsent();
    const [showDetails, setShowDetails] = useState(false);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        if (!hasResponded) {
            const timer = setTimeout(() => setIsVisible(true), 1500);
            return () => clearTimeout(timer);
        }
    }, [hasResponded]);

    if (!isVisible || hasResponded) return null;

    return (
        <div className="fixed bottom-4 left-4 right-4 md:right-auto md:left-8 md:bottom-8 md:w-[360px] z-[9999] animate-in slide-in-from-left-10 duration-700">
            <div className="bg-white/80 backdrop-blur-2xl border border-white/40 rounded-[2.5rem] shadow-[0_8px_32px_rgba(0,0,0,0.08)] overflow-hidden ring-1 ring-black/5">
                <div className="p-5 md:p-6">
                    {!showDetails ? (
                        <div className="flex flex-col gap-4">
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-2xl bg-brand/5 flex items-center justify-center shrink-0 border border-brand/10">
                                    <ShieldCheck className="w-5 h-5 text-brand" />
                                </div>
                                <div>
                                    <h3 className="text-sm font-bold text-gray-900 tracking-tight">Privacy Preferences</h3>
                                    <p className="text-gray-500 text-[11px] leading-snug">
                                        We use cookies to refine your experience.
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-center gap-2">
                                <Button
                                    onClick={acceptAll}
                                    size="sm"
                                    className="flex-1 h-10 bg-gray-900 hover:bg-black text-white text-[11px] font-bold rounded-2xl transition-all active:scale-[0.96]"
                                >
                                    Accept All
                                </Button>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setShowDetails(true)}
                                    className="h-10 w-10 border-gray-100 hover:bg-gray-50 text-gray-500 rounded-2xl p-0 shrink-0"
                                >
                                    <Settings2 className="w-4 h-4" />
                                </Button>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={denyAll}
                                    className="h-10 px-3 text-gray-400 hover:text-gray-900 hover:bg-gray-50 text-[11px] font-medium rounded-2xl"
                                >
                                    Necessary Only
                                </Button>
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-5 animate-in fade-in slide-in-from-bottom-4 duration-500">
                            <div className="flex items-center justify-between">
                                <h3 className="text-xs font-black tracking-widest text-gray-400">Settings</h3>
                                <button onClick={() => setShowDetails(false)} className="p-1 hover:bg-gray-100 rounded-full transition-colors">
                                    <X className="w-4 h-4 text-gray-400" />
                                </button>
                            </div>

                            <div className="space-y-2">
                                <PreferenceItem
                                    icon={<Check className="w-3.5 h-3.5 text-green-600" />}
                                    label="Essential"
                                    required
                                />
                                <PreferenceItem
                                    id="pref-analytics"
                                    icon={<BarChart3 className="w-3.5 h-3.5 text-blue-500" />}
                                    label="Analytics"
                                />
                                <PreferenceItem
                                    id="pref-personalization"
                                    icon={<Fingerprint className="w-3.5 h-3.5 text-purple-500" />}
                                    label="Personalization"
                                />
                            </div>

                            <Button
                                onClick={() => {
                                    const analytics = (document.getElementById('pref-analytics') as HTMLInputElement).checked;
                                    const personalization = (document.getElementById('pref-personalization') as HTMLInputElement).checked;
                                    updatePreferences({ analytics, personalization });
                                }}
                                className="w-full h-11 bg-brand hover:bg-brand-dark text-white text-[12px] font-bold rounded-2xl shadow-lg shadow-brand/10"
                            >
                                Save Preferences
                            </Button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

const PreferenceItem = ({ icon, label, required, id }: { icon: React.ReactNode, label: string, required?: boolean, id?: string }) => (
    <div className="flex items-center justify-between p-2.5 rounded-2xl bg-gray-50/50 border border-gray-100/50 transition-colors">
        <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded-xl bg-white border border-gray-100 flex items-center justify-center shadow-sm">
                {icon}
            </div>
            <span className="text-xs font-bold text-gray-700">{label}</span>
        </div>
        {required ? (
            <span className="text-[9px] font-black text-gray-400 tracking-tight pr-2">Active</span>
        ) : (
            <div className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" id={id} defaultChecked className="sr-only peer" />
                <div className="w-8 h-4 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:bg-brand"></div>
            </div>
        )}
    </div>
);
