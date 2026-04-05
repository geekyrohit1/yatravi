"use client";

import React, { useState, useEffect, useCallback, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
    LayoutDashboard,
    BarChart3,
    Package,
    MapPin,
    Users,
    Image as ImageIcon,
    Settings,
    Menu,
    LogOut,
    Home,
    Globe,
    UserCog,
    FileText,
    Clock,
    AlertTriangle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent } from '@/components/ui/sheet';
import { cn } from '@/lib/utils';
import { API_BASE_URL } from '@/constants';

const SIDEBAR_ITEMS = [
    { name: 'Dashboard', icon: LayoutDashboard, href: '/admin/dashboard' },
    { name: 'Analytics', icon: BarChart3, href: '/admin/analytics' },
    { name: 'Homepage', icon: Home, href: '/admin/homepage' },
    { name: 'Pages', icon: FileText, href: '/admin/pages' },
    { name: 'Packages', icon: Package, href: '/admin/packages' },
    { name: 'Destinations', icon: MapPin, href: '/admin/destinations' },
    { name: 'Leads', icon: Users, href: '/admin/leads' },
    { name: 'Media', icon: ImageIcon, href: '/admin/media' },
    { name: 'SEO Manager', icon: Globe, href: '/admin/seo' },
    { name: 'Admin Users', icon: UserCog, href: '/admin/users' },
    { name: 'Settings', icon: Settings, href: '/admin/settings' },
];

const INACTIVITY_TIMEOUT = 30 * 60 * 1000;      // 30 minutes
const WARNING_BEFORE = 2 * 60 * 1000;             // warn 2 min before logout
const WARNING_TIMEOUT = INACTIVITY_TIMEOUT - WARNING_BEFORE; // 28 minutes

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const [isMobileOpen, setIsMobileOpen] = useState(false);
    const [sessionExpired, setSessionExpired] = useState(false);
    const [showWarning, setShowWarning] = useState(false);
    const [warningCountdown, setWarningCountdown] = useState(120); // 2 min = 120s
    const [showLogoutModal, setShowLogoutModal] = useState(false);

    const inactivityTimer = useRef<NodeJS.Timeout | null>(null);
    const warningTimer = useRef<NodeJS.Timeout | null>(null);
    const countdownRef = useRef<NodeJS.Timeout | null>(null);

    const performLogout = useCallback(async (showExpiredModal = false) => {
        try {
            await fetch(`${API_BASE_URL}/api/auth/logout`, { method: 'POST', credentials: 'include' });
        } catch (_) {}
        if (showExpiredModal) {
            setSessionExpired(true);
        } else {
            window.location.href = '/admin/login';
        }
    }, []);

    const resetInactivityTimer = useCallback(() => {
        // Clear existing timers
        if (inactivityTimer.current) clearTimeout(inactivityTimer.current);
        if (warningTimer.current) clearTimeout(warningTimer.current);
        if (countdownRef.current) clearInterval(countdownRef.current);
        setShowWarning(false);
        setWarningCountdown(120);

        // Set warning timer at 28 min
        warningTimer.current = setTimeout(() => {
            setShowWarning(true);
            setWarningCountdown(120);
            // Start countdown
            countdownRef.current = setInterval(() => {
                setWarningCountdown(prev => {
                    if (prev <= 1) {
                        clearInterval(countdownRef.current!);
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
        }, WARNING_TIMEOUT);

        // Set logout timer at 30 min
        inactivityTimer.current = setTimeout(() => {
            performLogout(true);
        }, INACTIVITY_TIMEOUT);
    }, [performLogout]);

    // Monkey-patch fetch to intercept 401 responses globally
    useEffect(() => {
        const isLoginPage = pathname === '/admin/login' || pathname === '/admin/forgot-password';
        if (isLoginPage) return;

        const originalFetch = window.fetch;
        window.fetch = async (...args) => {
            const response = await originalFetch(...args);
            if (response.status === 401 && !sessionExpired) {
                const cloned = response.clone();
                try {
                    const data = await cloned.json();
                    // Only trigger if it's a session/auth issue, not a wrong password
                    if (data.message && (
                        data.message.toLowerCase().includes('session') ||
                        data.message.toLowerCase().includes('not authorized') ||
                        data.message.toLowerCase().includes('expired')
                    )) {
                        setSessionExpired(true);
                    }
                } catch (_) {}
            }
            return response;
        };

        return () => {
            window.fetch = originalFetch;
        };
    }, [pathname, sessionExpired]);

    // Inactivity tracker
    useEffect(() => {
        const isLoginPage = pathname === '/admin/login' || pathname === '/admin/forgot-password';
        if (isLoginPage) return;

        const events = ['mousedown', 'mousemove', 'keydown', 'scroll', 'touchstart', 'click'];
        const handleActivity = () => resetInactivityTimer();

        events.forEach(e => window.addEventListener(e, handleActivity, { passive: true }));
        resetInactivityTimer(); // start on mount

        return () => {
            events.forEach(e => window.removeEventListener(e, handleActivity));
            if (inactivityTimer.current) clearTimeout(inactivityTimer.current);
            if (warningTimer.current) clearTimeout(warningTimer.current);
            if (countdownRef.current) clearInterval(countdownRef.current);
        };
    }, [pathname, resetInactivityTimer]);

    // Don't render admin shell for login/forgot-password pages
    if (pathname === '/admin/login' || pathname === '/admin/forgot-password') {
        return <>{children}</>;
    }

    const NavItem = ({ item, mobile = false }: { item: typeof SIDEBAR_ITEMS[0], mobile?: boolean }) => {
        const isActive = pathname.startsWith(item.href);
        return (
            <Link
                href={item.href}
                onClick={() => mobile && setIsMobileOpen(false)}
                className={cn(
                    "flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all text-sm font-medium",
                    isActive
                        ? "bg-[#CD1C18]/10 text-[#CD1C18]"
                        : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                )}
            >
                <item.icon className={cn("h-4 w-4", isActive && "text-[#CD1C18]")} />
                {item.name}
            </Link>
        );
    };

    return (
        <div className="admin-panel-root min-h-screen bg-gray-50 flex">

            {/* ── Logout Confirmation Modal ── */}
            {showLogoutModal && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[9999] flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl shadow-2xl max-w-sm w-full p-6 text-center space-y-4">
                        <div className="mx-auto w-14 h-14 bg-slate-100 rounded-full flex items-center justify-center">
                            <LogOut className="h-7 w-7 text-slate-700" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-gray-900">Logout</h2>
                            <p className="text-sm text-gray-500 mt-1">
                                Are you sure you want to logout from the admin panel?
                            </p>
                        </div>
                        <div className="flex gap-3 pt-2">
                            <Button
                                variant="outline"
                                className="flex-1 rounded-xl"
                                onClick={() => setShowLogoutModal(false)}
                            >
                                Cancel
                            </Button>
                            <Button
                                className="flex-1 bg-[#CD1C18] hover:bg-[#9B1313] text-white rounded-xl"
                                onClick={() => {
                                    setShowLogoutModal(false);
                                    performLogout(false);
                                }}
                            >
                                Yes, Logout
                            </Button>
                        </div>
                    </div>
                </div>
            )}

            {/* ── Session Expired Modal ── */}
            {sessionExpired && (
                <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[9999] flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl shadow-2xl max-w-sm w-full p-6 text-center space-y-4">
                        <div className="mx-auto w-14 h-14 bg-red-100 rounded-full flex items-center justify-center">
                            <AlertTriangle className="h-7 w-7 text-red-600" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-gray-900">Session Expired</h2>
                            <p className="text-sm text-gray-500 mt-1">
                                For your security, you have been automatically logged out. Please login again to continue.
                            </p>
                        </div>
                        <Button
                            className="w-full bg-slate-900 hover:bg-slate-800 text-white"
                            onClick={() => { window.location.href = '/admin/login'; }}
                        >
                            Login Again
                        </Button>
                    </div>
                </div>
            )}

            {/* ── Inactivity Warning Modal ── */}
            {showWarning && !sessionExpired && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[9998] flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl shadow-2xl max-w-sm w-full p-6 text-center space-y-4">
                        <div className="mx-auto w-14 h-14 bg-amber-100 rounded-full flex items-center justify-center">
                            <Clock className="h-7 w-7 text-amber-600" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-gray-900">Still There?</h2>
                            <p className="text-sm text-gray-500 mt-1">
                                You'll be logged out due to inactivity in
                            </p>
                            <p className="text-3xl font-bold text-amber-600 mt-2">
                                {Math.floor(warningCountdown / 60)}:{String(warningCountdown % 60).padStart(2, '0')}
                            </p>
                        </div>
                        <Button
                            className="w-full bg-slate-900 hover:bg-slate-800 text-white"
                            onClick={() => {
                                setShowWarning(false);
                                resetInactivityTimer();
                            }}
                        >
                            I'm Still Here
                        </Button>
                        <button
                            onClick={() => performLogout(false)}
                            className="text-sm text-gray-400 hover:text-gray-600 w-full"
                        >
                            Logout Now
                        </button>
                    </div>
                </div>
            )}

            {/* Desktop Sidebar */}
            <aside className="hidden md:flex w-64 flex-col bg-white border-r border-gray-200 fixed inset-y-0 z-50">
                <div className="h-16 flex items-center px-6 border-b border-gray-100">
                    <img
                        src="/logo-desktop.png"
                        alt="Yatravi Admin"
                        className="h-10 w-auto object-contain"
                    />
                </div>

                <div className="flex-1 py-6 px-4 space-y-1 overflow-y-auto">
                    {SIDEBAR_ITEMS.map((item) => (
                        <NavItem key={item.href} item={item} />
                    ))}
                </div>

                <div className="p-4 border-t border-gray-100">
                    <Button
                        variant="ghost"
                        className="w-full justify-start text-red-500 hover:text-red-600 hover:bg-red-50"
                        onClick={() => setShowLogoutModal(true)}
                    >
                        <LogOut className="h-4 w-4 mr-2" />
                        Logout
                    </Button>
                </div>
            </aside>

            {/* Mobile Sidebar (Sheet) */}
            <Sheet open={isMobileOpen} onOpenChange={setIsMobileOpen}>
                <SheetContent side="left" className="w-[240px] p-0">
                    <div className="h-16 flex items-center px-6 border-b border-gray-100">
                        <img
                            src="/logo-desktop.png"
                            alt="Yatravi Admin"
                            className="h-9 w-auto object-contain"
                        />
                    </div>
                    <div className="flex-1 py-4 px-3 space-y-1">
                        {SIDEBAR_ITEMS.map((item) => (
                            <NavItem key={item.href} item={item} mobile />
                        ))}
                    </div>
                </SheetContent>
            </Sheet>

            {/* Main Content */}
            <main className="flex-1 md:ml-64 flex flex-col min-h-screen transition-all duration-300">
                {/* Header */}
                <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 sticky top-0 z-40">
                    <div className="flex items-center md:hidden">
                        <Button variant="ghost" size="icon" onClick={() => setIsMobileOpen(true)}>
                            <Menu className="h-5 w-5" />
                        </Button>
                    </div>

                    <div className="flex items-center gap-4 ml-auto">
                        {/* User Profile / Notifications could go here */}
                        <div className="text-sm font-medium text-gray-600">Admin User</div>
                        <div className="h-9 w-9 rounded-xl bg-[#CD1C18]/10 flex items-center justify-center text-[#CD1C18] font-bold text-sm">
                            A
                        </div>
                    </div>
                </header>

                {/* Page Content */}
                <div className="p-4 md:p-8 max-w-7xl mx-auto w-full">
                    {children}
                </div>
            </main>
        </div>
    );
}
