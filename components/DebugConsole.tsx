"use client";

import React, { useState, useEffect, useRef } from 'react';
import { Terminal, X, ChevronUp, ChevronDown, Trash2 } from 'lucide-react';

export const DebugConsole = () => {
    const [logs, setLogs] = useState<{ type: string; msg: string; time: string }[]>([]);
    const [isOpen, setIsOpen] = useState(false);
    const [isMinimized, setIsMinimized] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (process.env.NODE_ENV !== 'development') return;

        const originalLog = console.log;
        const originalError = console.error;
        const originalWarn = console.warn;

        const addLog = (type: string, ...args: any[]) => {
            const msg = args.map(arg => 
                typeof arg === 'object' ? JSON.stringify(arg, null, 2) : String(arg)
            ).join(' ');
            
            const time = new Date().toLocaleTimeString([], { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' });
            
            setLogs(prev => [{ type, msg, time }, ...prev].slice(0, 50));
            originalLog.apply(console, args);
        };

        console.log = (...args) => addLog('log', ...args);
        console.error = (...args) => addLog('error', ...args);
        console.warn = (...args) => addLog('warn', ...args);

        return () => {
            console.log = originalLog;
            console.error = originalError;
            console.warn = originalWarn;
        };
    }, []);

    if (process.env.NODE_ENV !== 'development') return null;

    return (
        <div className="fixed bottom-4 left-4 z-[999999] flex flex-col items-start gap-2 font-mono pointer-events-none">
            {/* Toggle Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="pointer-events-auto bg-brand-dark text-white p-3 rounded-full shadow-2xl flex items-center gap-2 hover:scale-105 active:scale-95 transition-all"
            >
                <Terminal size={20} />
                {isOpen && <span className="text-[10px] font-bold">Debug Console</span>}
            </button>

            {/* Console Window */}
            {isOpen && (
                <div 
                    data-lenis-prevent
                    className={`pointer-events-auto bg-gray-950 text-green-400 w-[90vw] md:w-[400px] rounded-2xl shadow-2xl border border-white/10 flex flex-col transition-all overflow-hidden ${
                        isMinimized ? 'h-12' : 'h-[300px]'
                    }`}
                >
                    {/* Header */}
                    <div className="flex items-center justify-between p-3 bg-white/5 border-b border-white/10 shrink-0">
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-red-500" />
                            <span className="text-[10px] font-bold text-white uppercase tracking-widest">System Logs</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <button onClick={() => setLogs([])} className="p-1 hover:text-white transition-colors">
                                <Trash2 size={14} />
                            </button>
                            <button onClick={() => setIsMinimized(!isMinimized)} className="p-1 hover:text-white transition-colors">
                                {isMinimized ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                            </button>
                            <button onClick={() => setIsOpen(false)} className="p-1 hover:text-white transition-colors">
                                <X size={16} />
                            </button>
                        </div>
                    </div>

                    {/* Logs Area */}
                    {!isMinimized && (
                        <div 
                            ref={scrollRef}
                            className="flex-1 overflow-y-auto p-4 text-[11px] space-y-2 no-scrollbar"
                        >
                            {logs.length === 0 ? (
                                <p className="text-gray-500 italic">Watching for logs...</p>
                            ) : (
                                logs.map((log, i) => (
                                    <div key={i} className={`flex gap-3 animate-in fade-in duration-300 ${
                                        log.type === 'error' ? 'text-red-400' : log.type === 'warn' ? 'text-yellow-400' : 'text-green-400'
                                    }`}>
                                        <span className="text-gray-600 shrink-0">[{log.time}]</span>
                                        <span className="break-all whitespace-pre-wrap">{log.msg}</span>
                                    </div>
                                ))
                            )}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};
