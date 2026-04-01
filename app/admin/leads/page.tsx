"use client";

import React, { useEffect, useState } from 'react';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Users, Phone, Mail, MessageSquare, Clock, X, ExternalLink, Trash2 } from 'lucide-react';
import { API_BASE_URL } from '@/constants';
import dayjs from 'dayjs';

interface Enquiry {
    _id: string;
    name: string;
    email: string;
    phone: string;
    message: string;
    status: 'New' | 'Contacted' | 'Converted' | 'Closed';
    createdAt: string;
    packageId?: string;
    packageTitle?: string;
    travelDate?: string;
    travellers?: number;
    source?: string;
}

export default function LeadsPage() {
    const [leads, setLeads] = useState<Enquiry[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedLead, setSelectedLead] = useState<Enquiry | null>(null);

    useEffect(() => {
        fetchLeads();
    }, []);

    const fetchLeads = async () => {
        try {
            const res = await fetch(`${API_BASE_URL}/api/enquiries`, {
                credentials: 'include'
            });
            if (res.ok) {
                const data = await res.json();
                setLeads(data);
            } else {
                console.error('Failed to fetch leads:', res.status);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const updateStatus = async (id: string, newStatus: string) => {
        try {
            const res = await fetch(`${API_BASE_URL}/api/enquiries/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: newStatus }),
                credentials: 'include'
            });
            if (res.ok) {
                setLeads(prev => prev.map(l => l._id === id ? { ...l, status: newStatus as any } : l));
                if (selectedLead && selectedLead._id === id) {
                    setSelectedLead({ ...selectedLead, status: newStatus as any });
                }
            }
        } catch (error) {
            alert('Failed to update status');
        }
    };

    const handleDeleteLead = async (id: string, e: React.MouseEvent) => {
        e.stopPropagation();
        if (!confirm('Are you sure you want to delete this lead?')) return;
        try {
            const res = await fetch(`${API_BASE_URL}/api/enquiries/${id}`, {
                method: 'DELETE',
                credentials: 'include'
            });
            if (res.ok) {
                setLeads(prev => prev.filter(l => l._id !== id));
                if (selectedLead && selectedLead._id === id) {
                    setSelectedLead(null);
                }
            } else {
                alert('Failed to delete lead');
            }
        } catch (error) {
            alert('An error occurred while deleting lead');
        }
    };

    const getStatusStyles = (status: string) => {
        switch (status) {
            case 'New': return 'bg-blue-100 text-blue-700 border-blue-200';
            case 'Contacted': return 'bg-amber-100 text-amber-700 border-amber-200';
            case 'Converted': return 'bg-green-100 text-green-700 border-green-200';
            case 'Closed': return 'bg-gray-100 text-gray-600 border-gray-200';
            default: return 'bg-gray-100 text-gray-600';
        }
    };

    const newLeads = leads.filter(l => l.status === 'New').length;
    const convertedLeads = leads.filter(l => l.status === 'Converted').length;

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold tracking-tight text-gray-900">Leads & Enquiries</h1>
                <p className="text-gray-500 mt-1">Manage customer enquiries and follow-ups</p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Card className="bg-white border-0 shadow-sm rounded-2xl">
                    <CardContent className="p-4 flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center">
                            <Users className="w-5 h-5 text-purple-600" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-gray-900">{leads.length}</p>
                            <p className="text-xs text-gray-500">Total Leads</p>
                        </div>
                    </CardContent>
                </Card>
                <Card className="bg-white border-0 shadow-sm rounded-2xl">
                    <CardContent className="p-4 flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center">
                            <MessageSquare className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-blue-600">{newLeads}</p>
                            <p className="text-xs text-gray-500">New</p>
                        </div>
                    </CardContent>
                </Card>
                <Card className="bg-white border-0 shadow-sm rounded-2xl">
                    <CardContent className="p-4 flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-green-50 flex items-center justify-center">
                            <Users className="w-5 h-5 text-green-600" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-green-600">{convertedLeads}</p>
                            <p className="text-xs text-gray-500">Converted</p>
                        </div>
                    </CardContent>
                </Card>
                <Card className="bg-white border-0 shadow-sm rounded-2xl">
                    <CardContent className="p-4 flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-[#CD1C18]/10 flex items-center justify-center">
                            <Phone className="w-5 h-5 text-[#CD1C18]" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-gray-900">
                                {leads.length > 0 ? Math.round((convertedLeads / leads.length) * 100) : 0}%
                            </p>
                            <p className="text-xs text-gray-500">Conversion</p>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Table */}
            <div className="bg-white rounded-2xl shadow-sm border-0 overflow-hidden">
                <Table>
                    <TableHeader>
                        <TableRow className="bg-gray-50/50">
                            <TableHead className="w-[120px]">Date</TableHead>
                            <TableHead>Customer</TableHead>
                            <TableHead>Package / Trip</TableHead>
                            <TableHead>Contact</TableHead>
                            <TableHead className="max-w-[200px]">Message</TableHead>
                            <TableHead className="w-[140px]">Status</TableHead>
                            <TableHead className="w-[80px] text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {loading ? (
                            <TableRow key="loading">
                                <TableCell colSpan={7} className="text-center py-16">
                                    <div className="animate-pulse text-gray-400">Loading leads...</div>
                                </TableCell>
                            </TableRow>
                        ) : leads.length === 0 ? (
                            <TableRow key="empty">
                                <TableCell colSpan={7} className="text-center py-16">
                                    <div className="flex flex-col items-center gap-2">
                                        <Users className="w-8 h-8 text-gray-300" />
                                        <p className="text-gray-500">No leads yet</p>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ) : (
                            leads.map((lead) => (
                                <TableRow
                                    key={lead._id}
                                    className="hover:bg-gray-50/50 cursor-pointer"
                                    onClick={() => setSelectedLead(lead)}
                                >
                                    <TableCell>
                                        <div className="flex items-center gap-2 text-gray-600">
                                            <Clock className="w-3 h-3" />
                                            <span className="text-sm">{dayjs(lead.createdAt).format('DD MMM')}</span>
                                        </div>
                                        <span className="text-xs text-gray-400">{dayjs(lead.createdAt).format('HH:mm')}</span>
                                    </TableCell>
                                    <TableCell>
                                        <span className="font-medium text-gray-900">{lead.name}</span>
                                    </TableCell>
                                    <TableCell>
                                        <div className="space-y-1">
                                            {lead.packageTitle ? (
                                                <div className="font-bold text-[#CD1C18] text-sm leading-tight">{lead.packageTitle}</div>
                                            ) : (
                                                <div className="text-gray-400 italic text-xs">General Inquiry</div>
                                            )}
                                            {(lead.travelDate || lead.travellers) && (
                                                <div className="flex gap-2 text-[10px] font-bold text-gray-500 uppercase tracking-tighter">
                                                    {lead.travelDate && <span>📅 {dayjs(lead.travelDate).format('DD MMM YY')}</span>}
                                                    {lead.travellers && <span>👥 {lead.travellers} PAX</span>}
                                                </div>
                                            )}
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="space-y-1">
                                            <div className="flex items-center gap-2 text-sm text-gray-700">
                                                <Phone className="w-3 h-3 text-gray-400" />
                                                {lead.phone}
                                            </div>
                                            <div className="flex items-center gap-2 text-xs text-gray-500">
                                                <Mail className="w-3 h-3 text-gray-400" />
                                                {lead.email}
                                            </div>
                                            {lead.source && (
                                                <div className="inline-block px-2 py-0.5 mt-1 bg-gray-100/80 text-gray-500 text-[10px] font-semibold border border-gray-200 rounded-md uppercase tracking-wide">
                                                    {lead.source}
                                                </div>
                                            )}
                                        </div>
                                    </TableCell>
                                    <TableCell className="max-w-[200px]">
                                        <p className="text-sm text-gray-600 truncate" title={lead.message}>
                                            {lead.message || '-'}
                                        </p>
                                    </TableCell>
                                    <TableCell onClick={(e) => e.stopPropagation()}>
                                        <select
                                            value={lead.status}
                                            onChange={(e) => updateStatus(lead._id, e.target.value)}
                                            className={`text-xs font-semibold rounded-lg px-3 py-1.5 border cursor-pointer ${getStatusStyles(lead.status)}`}
                                        >
                                            <option value="New">New</option>
                                            <option value="Contacted">Contacted</option>
                                            <option value="Converted">Converted</option>
                                            <option value="Closed">Closed</option>
                                        </select>
                                    </TableCell>
                                    <TableCell className="text-right" onClick={(e) => e.stopPropagation()}>
                                        <button
                                            onClick={(e) => handleDeleteLead(lead._id, e)}
                                            className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                            title="Delete Lead"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>

            {/* Lead Detail Modal */}
            {selectedLead && (
                <div
                    className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                    onClick={() => setSelectedLead(null)}
                >
                    <div
                        className="bg-white rounded-2xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Modal Header */}
                        <div className="flex items-center justify-between p-6 border-b border-gray-100">
                            <div>
                                <h2 className="text-xl font-bold text-gray-900">{selectedLead.name}</h2>
                                <p className="text-sm text-gray-500">
                                    {dayjs(selectedLead.createdAt).format('DD MMM YYYY, hh:mm A')}
                                </p>
                            </div>
                            <button
                                onClick={() => setSelectedLead(null)}
                                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                            >
                                <X className="w-5 h-5 text-gray-500" />
                            </button>
                        </div>

                        {/* Modal Body */}
                        <div className="p-6 space-y-6">
                            {/* Status */}
                            <div>
                                <label className="text-xs font-semibold text-gray-500 uppercase">Status</label>
                                <select
                                    value={selectedLead.status}
                                    onChange={(e) => updateStatus(selectedLead._id, e.target.value)}
                                    className={`mt-1 w-full text-sm font-semibold rounded-xl px-4 py-3 border cursor-pointer ${getStatusStyles(selectedLead.status)}`}
                                >
                                    <option value="New">New</option>
                                    <option value="Contacted">Contacted</option>
                                    <option value="Converted">Converted</option>
                                    <option value="Closed">Closed</option>
                                </select>
                            </div>

                            {/* Contact Details */}
                            <div className="space-y-3">
                                <label className="text-xs font-semibold text-gray-500 uppercase">Contact Details</label>

                                <a
                                    href={`tel:${selectedLead.phone}`}
                                    className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
                                >
                                    <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                                        <Phone className="w-5 h-5 text-green-600" />
                                    </div>
                                    <div className="flex-1">
                                        <p className="font-medium text-gray-900">{selectedLead.phone}</p>
                                        <p className="text-xs text-gray-500">Tap to call</p>
                                    </div>
                                    <ExternalLink className="w-4 h-4 text-gray-400" />
                                </a>

                                <a
                                    href={`https://wa.me/${selectedLead.phone.replace(/[^0-9]/g, '')}`}
                                    target="_blank"
                                    className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
                                >
                                    <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                                        <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="currentColor">
                                            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                                        </svg>
                                    </div>
                                    <div className="flex-1">
                                        <p className="font-medium text-gray-900">WhatsApp</p>
                                        <p className="text-xs text-gray-500">Open chat</p>
                                    </div>
                                    <ExternalLink className="w-4 h-4 text-gray-400" />
                                </a>

                                <a
                                    href={`mailto:${selectedLead.email}`}
                                    className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
                                >
                                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                                        <Mail className="w-5 h-5 text-blue-600" />
                                    </div>
                                    <div className="flex-1">
                                        <p className="font-medium text-gray-900">{selectedLead.email}</p>
                                        <p className="text-xs text-gray-500">Send email</p>
                                    </div>
                                    <ExternalLink className="w-4 h-4 text-gray-400" />
                                </a>
                            </div>

                            {/* Message */}
                            {selectedLead.message && (
                                <div>
                                    <label className="text-xs font-semibold text-gray-500 uppercase">Message / Details</label>
                                    <div className="mt-2 p-4 bg-gray-50 rounded-xl">
                                        <p className="text-sm text-gray-700 whitespace-pre-wrap">{selectedLead.message}</p>
                                    </div>
                                </div>
                            )}

                            {/* Source & Package Info */}
                            <div className="grid grid-cols-2 gap-4">
                                {selectedLead.packageTitle && (
                                    <div className="col-span-2 p-3 bg-red-50 rounded-xl border border-red-100">
                                        <label className="text-[10px] font-bold text-red-600 uppercase">Interested Package</label>
                                        <p className="font-bold text-gray-900">{selectedLead.packageTitle}</p>
                                    </div>
                                )}
                                {selectedLead.travelDate && (
                                    <div className="p-3 bg-gray-50 rounded-xl border border-gray-100">
                                        <label className="text-[10px] font-bold text-gray-500 uppercase">Travel Date</label>
                                        <p className="font-bold text-gray-900">{dayjs(selectedLead.travelDate).format('DD MMMM YYYY')}</p>
                                    </div>
                                )}
                                {selectedLead.travellers && (
                                    <div className="p-3 bg-gray-50 rounded-xl border border-gray-100">
                                        <label className="text-[10px] font-bold text-gray-500 uppercase">Travellers</label>
                                        <p className="font-bold text-gray-900">{selectedLead.travellers} People</p>
                                    </div>
                                )}
                                {selectedLead.source && (
                                    <div className="p-3 bg-gray-50 rounded-xl border border-gray-100">
                                        <label className="text-[10px] font-bold text-gray-500 uppercase">Lead Source</label>
                                        <p className="font-bold text-gray-900">{selectedLead.source}</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

