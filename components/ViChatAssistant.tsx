'use client';

import { useState, useRef, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { X, Send, User, Phone, Loader2, Bot } from 'lucide-react';
import { API_BASE_URL } from '@/constants';

const FALLBACK_GEMINI_KEY = "AIzaSyBJR4DBl1Ju3HB9vNnFFzrlLfPUYPilpoM"; // Default key if process.env is missing

const AIStarsLogo = ({ className }: { className?: string }) => (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} xmlns="http://www.w3.org/2000/svg">
        <path d="M10 20.5c-.2 0-.4-.1-.5-.3l-2.1-5.5-5.5-2.1c-.2-.1-.4-.3-.4-.5s.2-.4.4-.5l5.5-2.1 2.1-5.5c.1-.2.3-.4.5-.4s.4.2.5.4l2.1 5.5 5.5 2.1c.2.1.4.3.4.5s-.2.4-.4.5l-5.5 2.1-2.1 5.5c-.1.2-.3.3-.5.3z" />
        <path d="M19 11c-.1 0-.3-.1-.4l-1.3-3.4-3.4-1.3c-.2-.1-.3-.3-.3-.4s.1-.3.3-.4l3.4-1.3 1.3-3.4c.1-.2.3-.3.4-.3s.3.1.4.3l1.3 3.4 3.4 1.3c.2.1.3.3.3.4s-.1.3-.3.4l-3.4 1.3-1.3 3.4c-.1.1-.3.2-.4.2z" />
        <path d="M22 5.5c-.1 0-.2 0-.2-.1l-.8-2-2-.8c-.1-.1-.2-.2-.2-.3s.1-.2.2-.3l2-.8.8-2c.1-.1.2-.2.2-.2s.1.1.2.2l.8 2 2 .8c.1.1.2.2.2.3s-.1.2-.2.3l-2 .8-.8 2c0 .1-.1.1-.2.1z" />
    </svg>
);

export default function ViChatAssistant({ isHidden = false }: { isHidden?: boolean }) {
    if (isHidden) return null;

    const [isOpen, setIsOpen] = useState(false);
    const pathname = usePathname() || '';

    // Removed upfront lead capture form state
    const [leadName, setLeadName] = useState('');
    const [leadPhone, setLeadPhone] = useState('');

    // Chat state
    const initialMessage = {
        role: 'assistant' as const,
        text: 'Hi! I am ViChat Assistant, your AI travel planner.\n\nHere is how I can help:\n* **Find destinations** matching your vibe\n* **Compare prices** for our premium packages\n* **Create a custom itinerary** based on your dates\n\nWhere would you like to travel today?'
    };

    const [messages, setMessages] = useState<{ role: 'user' | 'assistant', text: string, reasoning_details?: string }[]>([
        { role: 'assistant', text: 'Welcome to Yatravi. I am ViChat. Which premium destination are we discussing today?' }
    ]);
    const [inputMessage, setInputMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    // Extracted lead state
    const [leadNameData, setLeadNameData] = useState('');
    const [leadPhoneData, setLeadPhoneData] = useState('');
    const [leadEmailData, setLeadEmailData] = useState('');
    const [extractedFields, setExtractedFields] = useState<Set<string>>(new Set());

    // Auto scroll
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const [dbContext, setDbContext] = useState<string>('');

    // Fetch Yatravi Training Database Context On Mount
    useEffect(() => {
        const fetchDbTrainingData = async () => {
            try {
                const res = await fetch(`${API_BASE_URL}/api/ai-training-data`);
                const data = await res.json();
                if (data.success && data.aiContext) {
                    setDbContext(data.aiContext);
                }
            } catch (err) {
                // Silently fail if DB fetch fails; AI will fall back to generic knowledge
            }
        };
        fetchDbTrainingData();
    }, []);

    const OPENROUTER_API_KEY = process.env.NEXT_PUBLIC_OPENROUTER_API_KEY || "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";

    // Listen for custom event to open chat from other components
    useEffect(() => {
        const handleOpenChat = () => setIsOpen(true);
        window.addEventListener('openViChat', handleOpenChat);
        return () => window.removeEventListener('openViChat', handleOpenChat);
    }, []);

    // Floating trigger typewriter effect
    const [suggestionIndex, setSuggestionIndex] = useState(0);
    const [suggestionText, setSuggestionText] = useState('');
    const [isTyping, setIsTyping] = useState(true);

    const [suggestions, setSuggestions] = useState([
        "Where to next? Let's plan it...",
        "Discover exclusive holiday deals...",
        "Craft your perfect luxury escape...",
        "Unlock premium travel experiences...",
        "Find your dream destination..."
    ]);

    // Fetch dynamic suggestions from AI based on current date
    useEffect(() => {
        const fetchDynamicSuggestions = async () => {
            try {
                const today = new Date();
                const prompt = `Generate 4 very short (max 5 words each), exciting placeholder texts for a travel booking AI chat widget. 
                Consider today's date (${today.toDateString()}), any upcoming Indian or global festivals, or current travel seasons. 
                They must end with ellipsis (...). 
                Example: "Plan your Diwali trip...", "Escape the summer heat...", "Find the best deals...".
                Format as valid JSON array of strings ONLY. No markdown blocks, just the array.`;

                const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${OPENROUTER_API_KEY}`
                    },
                    body: JSON.stringify({
                        model: "arcee-ai/trinity-large-preview:free",
                        messages: [{ role: 'user', content: prompt }]
                    })
                });

                const data = await res.json();
                if (data && data.choices && data.choices[0]?.message?.content) {
                    let text = data.choices[0].message.content.trim();
                    let jsonStr = text;
                    const arrayMatch = text.match(/\[[\s\S]*\]/);
                    if (arrayMatch) {
                        jsonStr = arrayMatch[0];
                    }

                    try {
                        const parsed = JSON.parse(jsonStr);
                        if (Array.isArray(parsed) && parsed.length > 0) {
                            setSuggestions(parsed);
                        }
                    } catch (e) {
                        // Silently fail suggest parse
                    }
                }
            } catch (err) {
                console.error("Failed to fetch dynamic suggestions", err);
            }
        };
        fetchDynamicSuggestions();
    }, []);

    const quickReplies = [
        "Top Destinations",
        "Honeymoon Packages",
        "Budget Travel",
        "Talk to Expert"
    ];

    const handleClearChat = () => {
        setMessages([{ role: 'assistant', text: initialMessage.text }]);
        setIsOpen(false);
        setTimeout(() => setIsOpen(true), 100); // Small delay to re-trigger opening animation
    };



    useEffect(() => {
        let timeout: NodeJS.Timeout;
        if (isTyping) {
            if (suggestions.length > 0 && suggestionText.length < suggestions[suggestionIndex].length) {
                timeout = setTimeout(() => {
                    setSuggestionText(suggestions[suggestionIndex].slice(0, suggestionText.length + 1));
                }, 50);
            } else {
                timeout = setTimeout(() => setIsTyping(false), 2000);
            }
        } else {
            if (suggestionText.length > 0) {
                timeout = setTimeout(() => {
                    setSuggestionText(suggestionText.slice(0, -1));
                }, 30);
            } else {
                setSuggestionIndex((prev) => (prev + 1) % suggestions.length);
                setIsTyping(true);
            }
        }
        return () => clearTimeout(timeout);
    }, [suggestionText, isTyping, suggestionIndex, suggestions]);

    useEffect(() => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [messages]);

    // Removed handleLeadSubmit since we don't have the upfront form anymore

    const handleSendMessage = async (text?: string | React.FormEvent) => {
        let userMsg = '';

        if (typeof text === 'string') {
            userMsg = text.trim();
        } else {
            if (text) (text as React.FormEvent).preventDefault();
            userMsg = inputMessage.trim();
        }

        if (!userMsg || isLoading) return;

        setInputMessage('');
        setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
        setIsLoading(true);

        try {
            // Conversational lead-capture prompt
            const systemContext = `You are "ViChat", a high-status, professional travel consultant for Yatravi.
            
            COMPANY DETAILS:
            - Name: Yatravi
            - Established: 2024
            - Specialization: Lowest price holiday packages, premium luxury escapes, and hand-crafted itineraries.
            - Head Office: Bajawa 333021, Jhunjhunu, Rajasthan.
            - Branch Office: Manpura Road, Pratapgarh Raj. 312605.
            - Contact Numbers: +91 95875 05726 (WhatsApp), +91 99821 32143.
            - Emails: yatraviholidays@gmail.com (Partners), heslpdeskyatravi@gmail.com (Support).
            - Website: yatravi.com
            
            PERSONALITY:
            - Cold, direct, and authoritative. Do not use fluff or excessive emojis.
            - Speak with the confidence of an expert who knows the best premium deals.
            - Smart Marketing: Always emphasize the exclusivity and premium nature of Yatravi's packages while highlighting we offer the best prices.
            
            GOALS:
            1. ONLY discuss travel. Decline anything else firmly but professionally.
            2. Answer questions about Yatravi's offices, contact details, and how we work using the COMPANY DETAILS above.
            3. High-Speed Plan: If a user mentions a destination, provide a crisp, exciting "Perfect Trip Highlight" immediately.
               CRITICAL: ALWAYS use exact package names, prices (in ₹), and locations from the REAL YATRAVI DATABASE below. Do NOT hallucinate.
            4. Lead Capture (STEALTH MODE): Your primary goal is to extract: Name, Mobile Number, and Email. 
               - Do not ask for all at once. 
               - Weave it into the conversation as: "To lock in these premium rates, I'll need your [field]."
            5. Extraction Command: When you identify a piece of lead info (name, phone, or email), you MUST append a hidden tag at the end of your response like this:
               <lead_data>{"name": "Extracted Name", "phone": "Extracted Phone", "email": "Extracted Email"}</lead_data>
               (Only include fields you just discovered or previously confirmed).

            Once Name, Phone, and a basic destination are confirmed, inform them: "I have registered your interest. Our senior consultant will call you within 15 minutes to finalize your premium itinerary."

            --- REAL YATRAVI DATABASE (TRAINING CONTEXT) ---
            ${dbContext ? dbContext : "Focus on Yatravi's reputation for premium Indian and International travel at the lowest possible prices."}
            `;

            const chatHistory = messages
                .filter(m => m.text !== initialMessage.text)
                .map(m => ({
                    role: m.role,
                    content: m.text,
                    reasoning_details: m.reasoning_details
                }));

            const openRouterMessages = [
                { role: 'system', content: systemContext },
                ...chatHistory,
                { role: 'user', content: userMsg }
            ];

            // API call to OpenRouter (Trinity)
            const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${OPENROUTER_API_KEY}`
                },
                body: JSON.stringify({
                    model: "arcee-ai/trinity-large-preview:free",
                    messages: openRouterMessages,
                    reasoning: { enabled: true }
                })
            });

            const data = await response.json();

            if (data && data.choices && data.choices[0]?.message) {
                let modelReply = data.choices[0].message.content || "";
                const reasoning = data.choices[0].message.reasoning_details;

                // Extract lead data if present
                const leadMatch = modelReply.match(/<lead_data>([\s\S]*?)<\/lead_data>/);
                let currentLead = { name: leadNameData, phone: leadPhoneData, email: leadEmailData };

                if (leadMatch) {
                    try {
                        const extracted = JSON.parse(leadMatch[1]);
                        if (extracted.name) {
                            currentLead.name = extracted.name;
                            setLeadNameData(extracted.name);
                        }
                        if (extracted.phone) {
                            currentLead.phone = extracted.phone;
                            setLeadPhoneData(extracted.phone);
                        }
                        if (extracted.email) {
                            currentLead.email = extracted.email;
                            setLeadEmailData(extracted.email);
                        }
                        // Remove the tag from the visible message
                        modelReply = modelReply.replace(/<lead_data>[\s\S]*?<\/lead_data>/, '').trim();
                    } catch (e) {
                        console.error("Failed to parse lead JSON", e);
                    }
                }

                setMessages(prev => [...prev, {
                    role: 'assistant',
                    text: modelReply,
                    reasoning_details: reasoning
                }]);
                if (currentLead.name || currentLead.phone || currentLead.email) {
                    saveLeadToBackend(userMsg, modelReply, currentLead);
                }
            } else if (data.error) {
                setMessages(prev => [...prev, { role: 'assistant', text: `I'm having trouble connecting to my brain right now (Error: ${data.error.message || 'Unknown'}). Please try again.` }]);
            } else {
                setMessages(prev => [...prev, { role: 'assistant', text: "I'm sorry, I can't discuss that. Would you like to talk about our luxury travel packages instead?" }]);
            }
        } catch (error) {
            console.error("Chat Error:", error);
            setMessages(prev => [...prev, { role: 'assistant', text: "Sorry, there was a connection error. Please check your internet or try again later." }]);
        } finally {
            setIsLoading(false);
        }
    };

    const saveLeadToBackend = async (userPrompt: string, aiResponse: string, lead: { name: string, phone: string, email: string }) => {
        // Only save if we have at least name or phone, and prevent identical updates too frequently
        if (!lead.name && !lead.phone) return;

        try {
            const messageBody = `AI Captured Lead Information:\nName: ${lead.name || 'Not yet captured'}\nPhone: ${lead.phone || 'Not yet captured'}\nEmail: ${lead.email || 'Not yet captured'}\n\nLast Conversation State:\nUser: ${userPrompt}\nAI: ${aiResponse.substring(0, 200)}...`;

            await fetch('/api/enquiries', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: lead.name || "AI Multi-Step Lead",
                    email: lead.email || 'vi-ai-lead@yatravi.com',
                    phone: lead.phone || "Captured in Chat",
                    message: messageBody,
                    source: 'ViChat Managed Lead'
                })
            });
        } catch (err) {
            console.error("Failed to sync lead to database", err);
        }
    };

    return (
        <>
            {/* Floating Chat Input Mimic */}
            <button
                onClick={() => setIsOpen(true)}
                className={`fixed right-[75px] md:right-[100px] lg:right-[110px] lg:bottom-6 z-50 flex items-center justify-between w-[200px] md:w-[280px] h-12 md:h-16 bg-white rounded-full shadow-[0_10px_35px_-10px_rgba(58,123,213,0.5)] hover:shadow-[0_15px_45px_-10px_rgba(58,123,213,0.7)] transition-all duration-500 overflow-visible group ${isOpen ? 'translate-y-20 opacity-0 pointer-events-none' : 'translate-y-0 opacity-100 animate-float hover:scale-[1.03] origin-right'} p-[3px] ${(pathname.startsWith('/destination/') || pathname.startsWith('/packages/'))
                    ? 'bottom-[85px]'
                    : 'bottom-5'
                    }`}
            >
                {/* Glowing Outer Ring effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-brand via-brand-light to-brand-deep rounded-full blur-[2px] opacity-70 group-hover:opacity-100 transition-opacity duration-500"></div>

                {/* Inner White Box container */}
                <div className="relative w-full h-full bg-white rounded-full flex items-center justify-between pl-4 pr-1.5 overflow-hidden border border-white/50 backdrop-blur-md">
                    <span className="text-[11px] md:text-[14px] text-gray-700 font-bold truncate flex-1 min-w-0 pr-2 tracking-wide flex items-center">
                        <span className="truncate block">{suggestionText}</span>
                        <span className={`w-[1.5px] h-3.5 bg-brand ml-1 rounded-full shrink-0 transition-opacity duration-150 ${isTyping ? 'opacity-100' : 'opacity-0'}`}></span>
                    </span>

                    {/* Animated Avatar Container */}
                    <div className="relative shrink-0 flex items-center justify-center">
                        {/* Ping animation backing */}
                        <div className="absolute inset-0 rounded-full bg-brand-light/30 animate-ping opacity-60 scale-125"></div>
                        <div className="relative bg-gradient-to-br from-brand to-brand-light w-7 h-7 md:w-10 md:h-10 rounded-full flex items-center justify-center shadow-inner group-hover:rotate-12 transition-transform duration-300">
                            <AIStarsLogo className="w-4 h-4 md:w-6 md:h-6 text-white shrink-0 scale-110 group-hover:scale-100 drop-shadow-md transition-all duration-1000 ease-out" />
                        </div>
                    </div>
                </div>
            </button>

            {/* Chat Overlay (Subtle dimming to focus on side panel) */}
            <div
                className={`fixed inset-0 bg-black/5 z-[90] transition-opacity duration-500 backdrop-blur-sm ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
                onClick={() => setIsOpen(false)}
            />

            {/* Dedicated Sidebar Panel */}
            <div
                className={`fixed top-0 right-0 z-[100] h-[100dvh] w-full sm:w-[420px] bg-[#111111]/95 backdrop-blur-3xl border-l border-white/10 flex flex-col overflow-hidden transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${isOpen ? 'translate-x-0 shadow-[-20px_0_50px_rgba(0,0,0,0.5)]' : 'translate-x-full pointer-events-none'}`}
            >
                {/* Header */}
                <div className="px-5 py-5 bg-gradient-to-b from-[#1a1a1a] to-transparent text-white flex justify-between items-center shrink-0 border-b border-white/5 relative z-10 shadow-sm">
                    <div className="flex items-center gap-3">
                        <div className="relative w-10 h-10 bg-gradient-to-br from-brand to-brand-light rounded-full flex items-center justify-center shadow-lg">
                            <Bot className="w-6 h-6 text-white" />
                            <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-[#1a1a1a] rounded-full"></span>
                        </div>
                        <div>
                            <h3 className="text-sm font-bold tracking-wider flex items-center gap-2 text-white">ViChat assistant</h3>
                            <p className="text-[11px] text-gray-400 font-medium">Your Personal Travel AI</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={handleClearChat}
                            title="Reset Chat"
                            className="p-2 hover:bg-white/10 hover:text-brand rounded-full transition-all duration-300"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" /><path d="M3 3v5h5" /></svg>
                        </button>
                        <button
                            onClick={() => setIsOpen(false)}
                            aria-label="Close chat"
                            className="p-2 hover:bg-white/10 hover:rotate-90 rounded-full transition-all duration-300"
                        >
                            <X className="w-5 h-5 text-gray-300" />
                        </button>
                    </div>
                </div>

                {/* Content Area */}
                <div className="flex-1 overflow-y-auto p-4 bg-transparent flex flex-col gap-4 relative">
                    <>
                        {messages.map((msg, i) => (
                            <div key={i} className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'} animate-in slide-in-from-bottom-3 fade-in duration-500 fill-mode-both`}>
                                {msg.reasoning_details && (
                                    <details className="mb-2 w-[85%] text-[11px] text-gray-500 bg-white/5 border border-white/10 rounded-lg overflow-hidden transition-all backdrop-blur-sm">
                                        <summary className="px-3 py-1 cursor-pointer hover:bg-white/5 font-medium flex items-center gap-2 tracking-tight">
                                            <span className="text-brand">✨</span> Reasoning Details
                                        </summary>
                                        <div className="px-3 py-2 border-t border-white/5 italic opacity-80 whitespace-pre-wrap">
                                            {msg.reasoning_details}
                                        </div>
                                    </details>
                                )}
                                <div className={`max-w-[85%] rounded-[20px] px-5 py-3.5 text-[14px] leading-relaxed relative ${msg.role === 'user'
                                    ? 'bg-gradient-to-br from-brand to-brand-light text-white rounded-br-sm shadow-md'
                                    : 'bg-[#1e1e1e] text-gray-100 border border-white/10 rounded-bl-sm shadow-md backdrop-blur-md'
                                    }`}>
                                    {/* Basic Markdown Rendering */}
                                    {msg.text.split('\n').map((line, idx) => {
                                        if (line.startsWith('* **')) {
                                            return <p key={idx} className="mb-1 text-blue-100"><strong>{line.replace(/\* \*\*(.*?)\*\*/, '$1')}</strong></p>;
                                        } else if (line.startsWith('**')) {
                                            return <p key={idx} className="mb-1 font-bold">{line.replace(/\*\*(.*?)\*\*/g, '$1')}</p>;
                                        } else if (line.startsWith('* ')) {
                                            return <li key={idx} className="ml-4 list-disc marker:text-brand">{line.replace('* ', '')}</li>;
                                        } else if (line.trim() === '') {
                                            return <div key={idx} className="h-2"></div>;
                                        }
                                        return <p key={idx}>{line.replace(/\*\*(.*?)\*\*/g, '$1')}</p>;
                                    })}
                                </div>
                            </div>
                        ))}
                        {isLoading && (
                            <div className="flex justify-start pt-2">
                                <div className="bg-[#1e1e1e] border border-white/10 rounded-2xl rounded-bl-sm px-5 py-3 shadow-md flex items-center gap-3 text-gray-400 backdrop-blur-md">
                                    <div className="flex space-x-1">
                                        <div className="w-1.5 h-1.5 bg-brand rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                                        <div className="w-1.5 h-1.5 bg-brand rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                                        <div className="w-1.5 h-1.5 bg-brand rounded-full animate-bounce"></div>
                                    </div>
                                    <span className="text-[12px] font-medium tracking-wide">ViChat is thinking...</span>
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} className="h-1" />
                    </>
                </div>

                {/* Input Area */}
                <div className="p-4 bg-gradient-to-t from-[#0a0a0a] to-[#111111] shrink-0 border-t border-white/5 relative z-10 flex flex-col gap-3">

                    {/* Quick Replies */}
                    {messages.length === 1 && (
                        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide no-scrollbar snap-x">
                            {quickReplies.map((reply, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => handleSendMessage(reply)}
                                    className="snap-start shrink-0 px-4 py-1.5 text-[12px] bg-white/5 hover:bg-white/10 border border-white/10 rounded-full text-gray-300 transition-colors whitespace-nowrap"
                                >
                                    {reply}
                                </button>
                            ))}
                        </div>
                    )}

                    <form onSubmit={handleSendMessage} className="relative flex items-center">
                        <input
                            type="text"
                            value={inputMessage}
                            onChange={e => setInputMessage(e.target.value)}
                            placeholder="Type your message here..."
                            className="w-full pl-6 pr-14 py-4 bg-[#1e1e1e] border border-white/10 rounded-full text-[14px] text-gray-100 focus:outline-none focus:border-brand focus:bg-[#252525] focus:shadow-[0_0_15px_rgba(58,123,213,0.1)] transition-all placeholder:text-gray-500 shadow-inner"
                            disabled={isLoading}
                        />
                        <button
                            type="submit"
                            aria-label="Send message"
                            disabled={!inputMessage.trim() || isLoading}
                            className="absolute right-2 p-3 bg-gradient-to-br from-brand to-brand-light text-white rounded-full disabled:opacity-40 transition-all shadow-[0_4px_15px_-5px_rgba(58,123,213,0.6)] disabled:shadow-none hover:scale-105 active:scale-95"
                        >
                            <Send className="w-4 h-4 ml-0.5" />
                        </button>
                    </form>
                    <div className="text-center mt-3 pb-2 hidden">
                    </div>
                </div>
            </div>
        </>
    );
}
