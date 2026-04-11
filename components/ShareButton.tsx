"use client";

import React, { useState } from 'react';
import { Share2, Check, Copy } from 'lucide-react';

interface ShareButtonProps {
    title: string;
    text?: string;
    url: string;
    className?: string; // Allow custom styling
    rounded?: string;   // Allow custom border radius
}

const ShareButton: React.FC<ShareButtonProps> = ({ title, text, url, className = "", rounded = "rounded-full" }) => {
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
            // Fallback to clipboard copy with robust check
            try {
                if (navigator.clipboard && window.isSecureContext) {
                    await navigator.clipboard.writeText(url);
                    setCopied(true);
                    setTimeout(() => setCopied(false), 2000);
                } else {
                    // Legacy fallback for non-secure contexts or unsupported browsers
                    const textArea = document.createElement("textarea");
                    textArea.value = url;
                    // Ensure it's not visible but still part of the DOM
                    textArea.style.position = "fixed";
                    textArea.style.left = "-9999px";
                    textArea.style.top = "0";
                    document.body.appendChild(textArea);
                    textArea.focus();
                    textArea.select();
                    try {
                        document.execCommand('copy');
                        setCopied(true);
                        setTimeout(() => setCopied(false), 2000);
                    } catch (err) {
                        console.error('Fallback copy failed', err);
                    }
                    document.body.removeChild(textArea);
                }
            } catch (err) {
                console.error('Failed to copy text: ', err);
            }
        }
    };

    return (
        <button
            onClick={handleShare}
            className={`flex items-center gap-2 px-3 py-1.5 ${rounded} text-xs font-semibold tracking-tight transition-all duration-200 active:scale-95 bg-white text-slate-600 border border-gray-200 hover:border-gray-300 shadow-sm ${className}`}
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
