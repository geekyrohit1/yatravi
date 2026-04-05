"use client";

import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Users, Plus, Trash2, Mail, User, Loader2, X, Shield, ShieldAlert, KeyRound, Crown } from 'lucide-react';
import { API_BASE_URL } from '@/constants';
import dayjs from 'dayjs';

interface AdminUser {
    _id: string;
    name: string;
    email: string;
    role: string;
    createdAt: string;
}

export default function UsersPage() {
    const [users, setUsers] = useState<AdminUser[]>([]);
    const [currentUser, setCurrentUser] = useState<AdminUser | null>(null);
    const [loading, setLoading] = useState(true);
    
    // Modal states
    const [showModal, setShowModal] = useState(false);
    const [modalStep, setModalStep] = useState<1 | 2>(1); // 1: Details, 2: OTP
    const [formLoading, setFormLoading] = useState(false);
    const [formData, setFormData] = useState({ email: '', name: '', role: 'admin' });
    const [otp, setOtp] = useState('');
    const [error, setError] = useState('');
    const [otpSentMessage, setOtpSentMessage] = useState('');

    useEffect(() => {
        fetchCurrentUser();
        fetchUsers();
    }, []);

    const fetchCurrentUser = async () => {
        try {
            const res = await fetch(`${API_BASE_URL}/api/admin/me`, { credentials: 'include' });
            if (res.ok) {
                const data = await res.json();
                setCurrentUser(data);
            }
        } catch (error) {
            console.error('Failed to fetch current user');
        }
    };

    const fetchUsers = async () => {
        try {
            const res = await fetch(`${API_BASE_URL}/api/admin/users`, {
                credentials: 'include'
            });
            if (res.ok) {
                const data = await res.json();
                setUsers(data);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleRequestCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        
        if (!formData.name || !formData.email) {
            setError('Please fill in all fields');
            return;
        }

        setFormLoading(true);
        try {
            const res = await fetch(`${API_BASE_URL}/api/admin/users/request-create`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
                credentials: 'include'
            });

            const data = await res.json();

            if (res.ok && data.success) {
                setOtpSentMessage(data.message || 'OTP sent to your email.');
                setModalStep(2);
            } else {
                setError(data.message || 'Failed to request user creation');
            }
        } catch (error) {
            setError('An error occurred');
        } finally {
            setFormLoading(false);
        }
    };

    const handleVerifyAndCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        
        if (otp.length !== 6) {
            setError('Please enter a valid 6-digit OTP');
            return;
        }

        setFormLoading(true);
        try {
            const res = await fetch(`${API_BASE_URL}/api/admin/users`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...formData, otp }),
                credentials: 'include'
            });

            const data = await res.json();

            if (res.ok && data.success) {
                setShowModal(false);
                setModalStep(1);
                setOtp('');
                setFormData({ email: '', name: '', role: 'admin' });
                fetchUsers();
                alert('User created successfully. A welcome email has been sent.');
            } else {
                setError(data.message || 'Failed to verify OTP and create user');
            }
        } catch (error) {
            setError('An error occurred');
        } finally {
            setFormLoading(false);
        }
    };

    const handleDelete = async (id: string, email: string) => {
        if (!confirm(`Are you sure you want to delete ${email}?`)) return;

        try {
            const res = await fetch(`${API_BASE_URL}/api/admin/users/${id}`, {
                method: 'DELETE',
                credentials: 'include'
            });

            const data = await res.json();

            if (res.ok && data.success) {
                fetchUsers();
            } else {
                alert(data.message || 'Failed to delete user');
            }
        } catch (error) {
            alert('An error occurred');
        }
    };

    const handleTerminateSessions = async (id: string, email: string) => {
        if (!confirm(`Terminate all active sessions for ${email}? This will log them out of all devices instantly.`)) return;

        try {
            const res = await fetch(`${API_BASE_URL}/api/admin/users/${id}/terminate-sessions`, {
                method: 'POST',
                credentials: 'include'
            });

            const data = await res.json();

            if (res.ok && data.success) {
                alert('All sessions terminated successfully');
            } else {
                alert(data.message || 'Failed to terminate sessions');
            }
        } catch (error) {
            alert('An error occurred while terminating sessions');
        }
    };

    const isSuperAdmin = currentUser?.role === 'superadmin';

    // Helper component for Roles
    const RoleBadge = ({ role }: { role: string }) => {
        if (role === 'superadmin') {
            return (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200 shadow-sm">
                    <Crown className="w-3.5 h-3.5 text-amber-500" />
                    Super Admin
                </span>
            );
        }
        return (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200">
                <Shield className="w-3.5 h-3.5 text-blue-500" />
                Admin
            </span>
        );
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-gray-900">Admin Users</h1>
                    <p className="text-gray-500 mt-1">Manage who can access the admin panel</p>
                </div>
                {isSuperAdmin && (
                    <Button
                        onClick={() => {
                            setModalStep(1);
                            setOtp('');
                            setError('');
                            setShowModal(true);
                        }}
                        className="bg-slate-900 hover:bg-slate-800"
                    >
                        <Plus className="w-4 h-4 mr-2" />
                        Add User
                    </Button>
                )}
            </div>

            {/* Stats */}
            <Card className="bg-white border-0 shadow-sm rounded-2xl">
                <CardContent className="p-4 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center">
                        <Users className="w-5 h-5 text-purple-600" />
                    </div>
                    <div>
                        <p className="text-2xl font-bold text-gray-900">{users.length}</p>
                        <p className="text-xs text-gray-500">Total Admin Users</p>
                    </div>
                </CardContent>
            </Card>

            {/* Users Table */}
            <div className="bg-white rounded-2xl shadow-sm border-0 overflow-hidden">
                <Table>
                    <TableHeader>
                        <TableRow className="bg-gray-50/50">
                            <TableHead>User</TableHead>
                            <TableHead>Email</TableHead>
                            <TableHead>Role</TableHead>
                            <TableHead>Created</TableHead>
                            <TableHead className="w-[120px] text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {loading ? (
                            <TableRow key="loading">
                                <TableCell colSpan={5} className="text-center py-16">
                                    <div className="animate-pulse text-gray-400">Loading users...</div>
                                </TableCell>
                            </TableRow>
                        ) : users.length === 0 ? (
                            <TableRow key="empty">
                                <TableCell colSpan={5} className="text-center py-16">
                                    <div className="flex flex-col items-center gap-2">
                                        <Users className="w-8 h-8 text-gray-300" />
                                        <p className="text-gray-500">No admin users</p>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ) : (
                            users.map((user) => (
                                <TableRow key={user._id} className="hover:bg-gray-50/50">
                                    <TableCell>
                                        <div className="flex items-center gap-3">
                                            <div className="w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center">
                                                <User className="w-4 h-4 text-slate-600" />
                                            </div>
                                            <span className="font-medium text-gray-900">{user.name}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-2 text-gray-600">
                                            <Mail className="w-3.5 h-3.5" />
                                            {user.email}
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <RoleBadge role={user.role || 'admin'} />
                                    </TableCell>
                                    <TableCell className="text-gray-500">
                                        {dayjs(user.createdAt).format('DD MMM YYYY')}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex items-center justify-end gap-1">
                                            {isSuperAdmin && (
                                                <>
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => handleTerminateSessions(user._id, user.email)}
                                                        className="text-amber-600 hover:text-amber-700 hover:bg-amber-50"
                                                        title="Terminate all sessions"
                                                    >
                                                        <ShieldAlert className="w-4 h-4" />
                                                    </Button>
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => handleDelete(user._id, user.email)}
                                                        className="text-red-500 hover:text-red-700 hover:bg-red-50"
                                                        title="Delete User"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </Button>
                                                </>
                                            )}
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>

            {/* Add User Modal */}
            {showModal && (
                <div
                    className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[9999] flex items-center justify-center p-4 transition-all"
                    onClick={() => setShowModal(false)}
                >
                    <div
                        className="bg-white rounded-2xl shadow-2xl max-w-md w-full animate-in zoom-in-95 duration-200"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {modalStep === 1 ? (
                            <>
                                <div className="flex items-center justify-between p-6 border-b border-gray-100">
                                    <div>
                                        <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                                            <Plus className="w-5 h-5" /> Add New Admin User
                                        </h2>
                                        <p className="text-sm text-gray-500 mt-1">Fill details to add a new team member.</p>
                                    </div>
                                    <button
                                        onClick={() => setShowModal(false)}
                                        className="p-2 hover:bg-gray-100 rounded-full transition-colors self-start"
                                    >
                                        <X className="w-5 h-5 text-gray-500" />
                                    </button>
                                </div>
                                
                                <form onSubmit={handleRequestCreate} className="p-6 space-y-5">
                                    {error && (
                                        <div className="p-3 text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg">
                                            {error}
                                        </div>
                                    )}

                                    <div className="space-y-2">
                                        <Label htmlFor="name" className="text-gray-700">Full Name</Label>
                                        <Input
                                            id="name"
                                            placeholder="e.g. John Doe"
                                            value={formData.name}
                                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                            className="h-11 border-gray-200 focus:border-slate-500"
                                            required
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="email" className="text-gray-700">Email Address</Label>
                                        <Input
                                            id="email"
                                            type="email"
                                            placeholder="admin@yatravi.com"
                                            value={formData.email}
                                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                            className="h-11 border-gray-200 focus:border-slate-500"
                                            required
                                        />
                                    </div>

                                    <div className="space-y-2 pt-2">
                                        <Label className="text-gray-700 block mb-2">Role</Label>
                                        <div className="grid grid-cols-2 gap-3">
                                            <button
                                                type="button"
                                                onClick={() => setFormData({ ...formData, role: 'admin' })}
                                                className={`flex items-center justify-center gap-2 h-11 rounded-xl border font-medium text-sm transition-all ${
                                                    formData.role === 'admin' 
                                                    ? 'border-blue-500 bg-blue-50 text-blue-700' 
                                                    : 'border-gray-200 hover:border-gray-300 text-gray-600'
                                                }`}
                                            >
                                                <Shield className="w-4 h-4" /> Admin
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => setFormData({ ...formData, role: 'superadmin' })}
                                                className={`flex items-center justify-center gap-2 h-11 rounded-xl border font-medium text-sm transition-all ${
                                                    formData.role === 'superadmin' 
                                                    ? 'border-amber-500 bg-amber-50 text-amber-700' 
                                                    : 'border-gray-200 hover:border-gray-300 text-gray-600'
                                                }`}
                                            >
                                                <Crown className="w-4 h-4" /> Super Admin
                                            </button>
                                        </div>
                                    </div>

                                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 flex items-start gap-3 mt-4">
                                        <ShieldAlert className="w-5 h-5 text-slate-500 mt-0.5 shrink-0" />
                                        <p className="text-xs text-slate-600 leading-tight">
                                            For security, an OTP will be sent to <strong>YOUR</strong> email to verify and authorize this creation.
                                        </p>
                                    </div>

                                    <div className="flex gap-3 pt-2">
                                        <Button
                                            type="button"
                                            variant="outline"
                                            onClick={() => setShowModal(false)}
                                            className="flex-1 rounded-xl h-11"
                                        >
                                            Cancel
                                        </Button>
                                        <Button
                                            type="submit"
                                            disabled={formLoading}
                                            className="flex-1 rounded-xl h-11 bg-slate-900 hover:bg-slate-800"
                                        >
                                            {formLoading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : 'Send Verification OTP'}
                                        </Button>
                                    </div>
                                </form>
                            </>
                        ) : (
                            <>
                                <div className="p-6 text-center space-y-4">
                                    <div className="mx-auto w-14 h-14 bg-slate-100 rounded-full flex items-center justify-center">
                                        <KeyRound className="h-7 w-7 text-slate-700" />
                                    </div>
                                    <div>
                                        <h2 className="text-xl font-bold text-gray-900">Verify Your Identity</h2>
                                        <p className="text-sm text-gray-500 mt-1 px-4">{otpSentMessage}</p>
                                    </div>
                                </div>

                                <form onSubmit={handleVerifyAndCreate} className="px-6 pb-6 space-y-5">
                                    {error && (
                                        <div className="p-3 text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg">
                                            {error}
                                        </div>
                                    )}

                                    <div className="space-y-3">
                                        <Label htmlFor="otp" className="text-center block text-gray-700">Enter 6-Digit OTP</Label>
                                        <Input
                                            id="otp"
                                            type="text"
                                            inputMode="numeric"
                                            pattern="[0-9]{6}"
                                            maxLength={6}
                                            placeholder="000000"
                                            value={otp}
                                            onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                                            required
                                            autoFocus
                                            autoComplete="one-time-code"
                                            className="h-14 bg-gray-50 border-gray-200 focus:border-slate-500 focus:bg-white text-center text-2xl font-bold tracking-[0.5em] rounded-xl"
                                        />
                                    </div>

                                    <div className="flex gap-3 pt-2">
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            onClick={() => setModalStep(1)}
                                            className="w-1/3 rounded-xl h-11 text-slate-500 hover:bg-slate-50 hover:text-slate-700"
                                        >
                                            ← Back
                                        </Button>
                                        <Button
                                            type="submit"
                                            disabled={formLoading || otp.length !== 6}
                                            className="w-2/3 rounded-xl h-11 bg-slate-900 hover:bg-slate-800"
                                        >
                                            {formLoading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : '✓ Create User'}
                                        </Button>
                                    </div>
                                </form>
                            </>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
