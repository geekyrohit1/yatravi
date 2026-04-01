"use client";

import React, { useState } from 'react';
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
    FileText
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent } from '@/components/ui/sheet';
import { cn } from '@/lib/utils';

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

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const [isMobileOpen, setIsMobileOpen] = useState(false);

    // Don't render admin shell for login page
    if (pathname === '/admin/login') {
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
                        onClick={async () => {
                            await fetch('/api/auth/logout', { method: 'POST', credentials: 'include' });
                            window.location.href = '/admin/login';
                        }}
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
