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
import { Users, Plus, Trash2, Mail, User, Loader2, X, Shield, ShieldAlert } from 'lucide-react';
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
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [formLoading, setFormLoading] = useState(false);
    const [formData, setFormData] = useState({ email: '', name: '' });
    const [error, setError] = useState('');

    useEffect(() => {
        fetchUsers();
    }, []);

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

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setFormLoading(true);

        try {
            const res = await fetch(`${API_BASE_URL}/api/admin/users`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
                credentials: 'include'
            });

            const data = await res.json();

            if (res.ok && data.success) {
                setShowModal(false);
                setFormData({ email: '', name: '' });
                fetchUsers();
            } else {
                setError(data.message || 'Failed to create user');
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

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-gray-900">Admin Users</h1>
                    <p className="text-gray-500 mt-1">Manage who can access the admin panel</p>
                </div>
                <Button
                    onClick={() => setShowModal(true)}
                    className="bg-slate-900 hover:bg-slate-800"
                >
                    <Plus className="w-4 h-4 mr-2" />
                    Add User
                </Button>
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
                                        <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700">
                                            <Shield className="w-3 h-3" />
                                            {user.role || 'admin'}
                                        </span>
                                    </TableCell>
                                    <TableCell className="text-gray-500">
                                        {dayjs(user.createdAt).format('DD MMM YYYY')}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex items-center justify-end gap-1">
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
                    className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                    onClick={() => setShowModal(false)}
                >
                    <div
                        className="bg-white rounded-2xl shadow-2xl max-w-md w-full"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="flex items-center justify-between p-6 border-b border-gray-100">
                            <h2 className="text-xl font-bold text-gray-900">Add Admin User</h2>
                            <button
                                onClick={() => setShowModal(false)}
                                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                            >
                                <X className="w-5 h-5 text-gray-500" />
                            </button>
                        </div>

                        <form onSubmit={handleCreate} className="p-6 space-y-4">
                            {error && (
                                <div className="p-3 text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg">
                                    {error}
                                </div>
                            )}

                            <div className="space-y-2">
                                <Label htmlFor="name">Name</Label>
                                <Input
                                    id="name"
                                    placeholder="Admin Name"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className="h-11"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="email">Email Address *</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="admin@example.com"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    required
                                    className="h-11"
                                />
                                <p className="text-xs text-gray-500">This email will receive OTP for login</p>
                            </div>

                            <div className="flex gap-3 pt-4">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => setShowModal(false)}
                                    className="flex-1"
                                >
                                    Cancel
                                </Button>
                                <Button
                                    type="submit"
                                    disabled={formLoading}
                                    className="flex-1 bg-slate-900 hover:bg-slate-800"
                                >
                                    {formLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                                    Add User
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
