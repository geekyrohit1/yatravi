"use client";

import React, { useState } from 'react';
import { Send, Instagram, Check, Copy, ExternalLink } from 'lucide-react';
import { useSettings } from '@/context/SettingsContext';

export const CommunityOffersFooter: React.FC = () => {
    const { settings } = useSettings();
    const [copied, setCopied] = useState<string | null>(null);

    const handleCopy = (code: string) => {
        navigator.clipboard.writeText(code);
        setCopied(code);
        setTimeout(() => setCopied(null), 2000);
    };

    const whatsappLink = settings.whatsappNumber
        ? `https://wa.me/${settings.whatsappNumber.replace(/[^0-9]/g, '')}?text=Hi,%20I%20want%20to%20join%20your%20WhatsApp%20community%20for%20travel%20deals`
        : '#';

    const instagramLink = settings.socialLinks?.instagram || '#';

    return (
        <div className="flex flex-col gap-2.5">
            {/* WhatsApp Mini Card */}
            <a
                href={whatsappLink}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => {
                    e.preventDefault();
                    handleCopy('WHATSAPP500');
                    if (whatsappLink !== '#') {
                        window.open(whatsappLink, '_blank');
                    }
                }}
                className="bg-white/5 border border-white/10 rounded-xl p-2.5 flex items-center justify-between cursor-pointer group hover:bg-white/10 hover:border-white/20 transition-all duration-300 relative overflow-hidden hover:shadow-[0_0_15px_rgba(255,255,255,0.05)]"
            >
                <div className="flex items-center gap-3 relative z-10">
                    <div className="bg-white/10 group-hover:bg-[#25D366] p-1.5 rounded-full transition-colors duration-300">
                        <Send className="w-4 h-4 text-[#25D366] group-hover:text-white transition-colors" />
                    </div>
                    <div>
                        <p className="text-[12.5px] font-normal text-white/70 tracking-wide">Join WhatsApp</p>
                        <p className="text-[10px] text-white/40 transition-colors font-sans">Get ₹500 OFF Code</p>
                    </div>
                </div>
                {copied === 'WHATSAPP500' ? <Check className="w-4 h-4 text-[#25D366]/60" /> : <ExternalLink className="w-4 h-4 text-white/20 group-hover:text-white/40 transition-colors" />}
            </a>

            {/* Instagram Mini Card */}
            <a
                href={instagramLink}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => {
                    if (instagramLink !== '#') {
                        handleCopy('INSTAFAM');
                    } else {
                        e.preventDefault();
                        handleCopy('INSTAFAM');
                    }
                }}
                className="bg-white/5 border border-white/5 rounded-xl p-2 flex items-center justify-between cursor-pointer group hover:bg-white/10 hover:border-white/10 transition-all duration-300 relative overflow-hidden"
            >
                <div className="flex items-center gap-3 relative z-10">
                    <div className="bg-white/5 group-hover:bg-gradient-to-tr group-hover:from-[#f09433]/40 group-hover:via-[#e6683c]/40 group-hover:to-[#bc1888]/40 p-1.5 rounded-full transition-all duration-300">
                        <Instagram className="w-4 h-4 text-white/40 group-hover:text-white transition-colors" />
                    </div>
                    <div>
                        <p className="text-[12.5px] font-normal text-white/70 tracking-wide">Follow Insta</p>
                        <p className="text-[10px] text-white/40 transition-colors font-sans">Unlock Secret Deals</p>
                    </div>
                </div>
                {copied === 'INSTAFAM' ? <Check className="w-4 h-4 text-blue-400" /> : <ExternalLink className="w-4 h-4 text-white group-hover:text-white transition-colors" />}
            </a>
        </div>
    );
};
