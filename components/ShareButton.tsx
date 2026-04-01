"use client";

import React, { useState } from 'react';
import { Share2, Check, Copy } from 'lucide-react';

interface ShareButtonProps {
    title: string;
    text?: string;
    url: string;
    className?: string; // Allow custom styling
}

const ShareButton: React.FC<ShareButtonProps> = ({ title, text, url, className = "" }) => {
    const [copied, setCopied] = useState(false);

    const handleShare = async () => {
        if (navigator.share) {
            try {
                await navigator.share({
                    title: title,
                    text: text,
                    url: url,
                });
            } catch (error) {
                console.error('Error sharing:', error);
            }
        } else {
            // Fallback to clipboard copy
            try {
                await navigator.clipboard.writeText(url);
                setCopied(true);
                setTimeout(() => setCopied(false), 2000);
            } catch (err) {
                console.error('Failed to copy text: ', err);
            }
        }
    };

    return (
        <button
            onClick={handleShare}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-300 ${copied
                ? 'bg-green-100 text-green-700 hover:bg-green-200'
                : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50 hover:text-brand hover:border-brand-light/20'
                } ${className}`}
            title="Share this package"
        >
            {copied ? (
                <>
                    <Check className="w-3.5 h-3.5" />
                    <span>Copied!</span>
                </>
            ) : (
                <>
                    <Share2 className="w-3.5 h-3.5" />
                    <span>Share</span>
                </>
            )}
        </button>
    );
};

export default ShareButton;
