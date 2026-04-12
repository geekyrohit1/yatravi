"use client";

import React, { useState, useEffect } from 'react';
import { Phone, CheckCircle, User, Mail, Calendar, Loader2, ArrowRight, X, Users } from 'lucide-react';
import { API_BASE_URL } from '@/constants';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import dayjs, { Dayjs } from 'dayjs';

// Minimalist MUI Theme for InquiryWidget calendar
const inquiryCalendarTheme = createTheme({
    palette: {
        primary: {
            main: '#FB5012',
        },
    },
    typography: {
        fontFamily: 'inherit',
    },
    components: {
        MuiTextField: {
            styleOverrides: {
                root: {
                    '& .MuiOutlinedInput-root': {
                        borderRadius: '12px',
                        backgroundColor: '#f9fafb80',
                        fontSize: '13px',
                        height: '42px',
                        '@media (min-width: 768px)': {
                            height: '46px',
                        },
                        border: '1px solid #f3f4f6',
                        fontFamily: 'inherit',
                        fontWeight: 500,
                        '&:hover': {
                            borderColor: '#FB5012',
                            backgroundColor: '#fff',
                        },
                        '&.Mui-focused': {
                            borderColor: '#FB5012',
                            backgroundColor: '#fff',
                            boxShadow: '0 0 0 4px rgba(251, 80, 18, 0.05)',
                        },
                        '& fieldset': {
                            border: 'none',
                        },
                    },
                    '& .MuiInputBase-input': {
                        padding: '0 12px 0 44px',
                        color: '#6b7280',
                        '&::placeholder': {
                            color: '#d1d5db',
                            opacity: 1,
                        },
                    },
                },
            },
        },
        // @ts-ignore - Modern MUI versions use different slot names in theme, but this is used for popper styling
        MuiPickersPopper: {
            styleOverrides: {
                paper: {
                    borderRadius: '16px',
                    boxShadow: '0 20px 40px -12px rgba(0, 0, 0, 0.15)',
                    border: '1px solid #f3f4f6',
                    marginTop: '8px',
                },
            },
        },
    },
});

interface InquiryWidgetProps {
    title?: string;
    onClose?: () => void;
    showPaxCount?: boolean;
    roundedBottom?: boolean;
    packageId?: string;
    packageTitle?: string;
    source?: string;
}

export const InquiryWidget = React.memo(({ 
    title, 
    onClose, 
    showPaxCount = false, 
    roundedBottom = false,
    packageId = undefined,
    packageTitle = undefined,
    source = 'Inquiry Widget'
}: InquiryWidgetProps) => {
    const [submitted, setSubmitted] = useState(false);
    const [paxCount, setPaxCount] = useState(2);
    const [loading, setLoading] = useState(false);
    const [travelDate, setTravelDate] = useState<Dayjs | null>(null);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
    });
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const response = await fetch(`${API_BASE_URL}/api/enquiries`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: formData.name,
                    email: formData.email,
                    phone: formData.phone,
                    message: `Travel Date: ${travelDate?.format('DD MMM YYYY') || 'Not specified'} | Travellers: ${showPaxCount ? paxCount : 'N/A'}`,
                    packageId,
                    packageTitle,
                    travelDate: travelDate?.format('DD MMM YYYY') || 'Not specified',
                    travellers: showPaxCount ? paxCount : 0,
                    source
                })
            });

            if (response.ok) {
                setSubmitted(true);
                setFormData({ name: '', email: '', phone: '' });
                setTravelDate(null);
                
                // Auto-close after 2.5 seconds if onClose is provided
                if (onClose) {
                    setTimeout(() => {
                        onClose();
                        setSubmitted(false);
                    }, 2500);
                } else {
                    setTimeout(() => setSubmitted(false), 3000);
                }
            } else {
                alert('Failed to submit. Please try again.');
            }
        } catch (error) {
            console.error('Submission error:', error);
            alert('Failed to submit. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <ThemeProvider theme={inquiryCalendarTheme}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
                <div className={`bg-white rounded-t-xl md:rounded-xl shadow-[0_8px_40px_rgba(0,0,0,0.08)] border-x border-t border-gray-100 overflow-hidden pointer-events-auto flex flex-col max-h-[90vh] md:max-h-[85vh] ${roundedBottom ? 'rounded-b-xl border-b' : 'rounded-b-none'}`}>
            {/* Minimalist Header - Fixed at Top */}
            <div className="bg-brand px-5 py-3 md:py-8 text-white text-center relative overflow-hidden shrink-0">
                {onClose && (
                    <button 
                        onClick={onClose}
                        className="absolute right-2.5 top-1/2 -translate-y-1/2 p-2 hover:bg-white/10 rounded-full transition-colors z-20"
                    >
                        <X className="w-5 h-5" />
                    </button>
                )}
                <h3 className="font-bold text-[18px] md:text-[20px] tracking-tight relative z-10 pr-6">
                    {title || "Planning a Trip?"}
                </h3>
                <p className="text-[10px] md:text-[11px] text-white/90 mt-1 font-bold tracking-[0.05em] uppercase opacity-90 relative z-10">Free expert consultation</p>
                
                {/* Subtle Background pattern */}
                <div className="absolute inset-0 opacity-10 pointer-events-none bg-[radial-gradient(circle,_white_1px,_transparent_1px)] bg-[length:16px_16px]" />
            </div>

            {/* Scrollable Form Body */}
            <form onSubmit={handleSubmit} className="flex flex-col overflow-hidden">
                <div className="overflow-y-auto no-scrollbar px-5 pt-3 pb-4 md:px-8 md:pt-5 md:pb-6">
                    {submitted ? (
                        <div className="text-center py-6 md:py-12 animate-in zoom-in duration-500">
                            <div className="w-10 h-10 md:w-16 md:h-16 bg-green-50 text-green-600 rounded-xl md:rounded-2xl flex items-center justify-center mx-auto mb-3 md:mb-6 shadow-sm border border-green-100">
                                <CheckCircle className="w-5 h-5 md:w-8 md:h-8" />
                            </div>
                            <h4 className="font-bold text-base md:text-xl text-gray-900 mb-1 md:mb-2 tracking-tight">Request Sent! 🎉</h4>
                            <p className="text-[11px] md:text-[13px] text-gray-500 leading-relaxed font-medium">
                                Our travel expert will reach out to you within <span className="text-brand font-bold">30 minutes</span>.
                            </p>
                        </div>
                    ) : (
                        <div className="space-y-2 md:space-y-3">
                        <div className="space-y-1">
                            <label className="text-[10px] font-semibold md:font-bold text-gray-500 md:text-gray-400 uppercase tracking-wider md:tracking-widest ml-1">Full Name</label>
                            <div className="relative group">
                                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300 group-focus-within:text-brand transition-colors" />
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    placeholder="Your Full Name"
                                    className="w-full pl-11 pr-4 py-2 md:py-2.5 border border-gray-100 rounded-xl text-[13px] font-medium focus:outline-none focus:border-brand focus:ring-4 focus:ring-brand/5 transition-all bg-gray-50/50 placeholder:text-gray-300"
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-1">
                            <label className="text-[10px] font-semibold md:font-bold text-gray-500 md:text-gray-400 uppercase tracking-wider md:tracking-widest ml-1">Email Address</label>
                            <div className="relative group">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300 group-focus-within:text-brand transition-colors" />
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    placeholder="your@email.com"
                                    className="w-full pl-11 pr-4 py-2 md:py-2.5 border border-gray-100 rounded-xl text-[13px] font-medium focus:outline-none focus:border-brand focus:ring-4 focus:ring-brand/5 transition-all bg-gray-50/50 placeholder:text-gray-300"
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-1">
                            <label className="text-[10px] font-semibold md:font-bold text-gray-500 md:text-gray-400 uppercase tracking-wider md:tracking-widest ml-1">Mobile Number</label>
                            <div className="relative group">
                                <div className="absolute left-4 top-1/2 -translate-y-1/2 flex items-center pr-3 mr-2">
                                    <Phone className="w-4 h-4 text-gray-400" />
                                </div>
                                <input
                                    type="tel"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    placeholder="+91 98765 43210"
                                    className="w-full pl-11 md:pl-12 pr-4 py-2 md:py-2.5 border border-gray-100 rounded-xl text-[13px] font-medium focus:outline-none focus:border-brand focus:ring-4 focus:ring-brand/5 transition-all bg-gray-50/50 placeholder:text-gray-300"
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-1">
                            <label className="text-[10px] font-semibold md:font-bold text-gray-500 md:text-gray-400 uppercase tracking-wider md:tracking-widest ml-1">Travel Date</label>
                            <div className="relative group inquiry-datepicker">
                                {mounted ? (
                                    <DatePicker
                                        value={travelDate}
                                        onChange={(newValue) => setTravelDate(newValue)}
                                        minDate={dayjs()}
                                        format="DD MMM YYYY"
                                        slotProps={{
                                            textField: {
                                                fullWidth: true,
                                                placeholder: "Select Travel Date",
                                                required: true,
                                            },
                                            popper: {
                                                sx: { zIndex: 10000 }
                                            }
                                        }}
                                    />
                                ) : (
                                    <input 
                                        type="text" 
                                        placeholder="Select Travel Date" 
                                        disabled 
                                        className="w-full pl-4 pr-4 py-[9px] md:py-[11px] border border-gray-100 rounded-xl text-[13px] font-medium bg-gray-50/50 text-gray-400" 
                                    />
                                )}
                            </div>
                        </div>

                        {showPaxCount && (
                            <div className="space-y-1">
                                <label className="text-[10px] font-semibold md:font-bold text-gray-500 md:text-gray-400 uppercase tracking-wider md:tracking-widest ml-1">No. of Travellers</label>
                                <div className="flex items-center justify-between border border-gray-100 rounded-xl px-4 py-2 bg-gray-50/50">
                                    <div className="flex items-center gap-3">
                                        <Users className="w-4 h-4 text-gray-300" />
                                        <span className="text-[13px] font-medium text-gray-600">Total Travellers</span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <button 
                                            type="button"
                                            onClick={() => setPaxCount(Math.max(1, paxCount - 1))}
                                            className="w-7 h-7 rounded-full bg-white border border-gray-100 flex items-center justify-center text-gray-400 hover:text-brand hover:border-brand/20 transition-all shadow-sm font-bold"
                                        >
                                            -
                                        </button>
                                        <span className="text-sm font-bold text-gray-800 w-4 text-center">{paxCount}</span>
                                        <button 
                                            type="button"
                                            onClick={() => setPaxCount(Math.min(30, paxCount + 1))}
                                            className="w-7 h-7 rounded-full bg-white border border-gray-100 flex items-center justify-center text-gray-400 hover:text-brand hover:border-brand/20 transition-all shadow-sm font-bold"
                                        >
                                            +
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}

                            <div className="flex justify-center mt-4">
                                <span className="text-[9px] md:text-[10px] font-bold text-gray-400 uppercase tracking-widest bg-gray-50/50 px-3 py-1 rounded-full border border-gray-100 flex items-center gap-1.5">
                                    <CheckCircle className="w-2.5 h-2.5" />
                                    100% Privacy Guaranteed
                                </span>
                            </div>
                        </div>
                    )}
                </div>

                {!submitted && (
                    <div className="shrink-0 bg-white border-t border-gray-100 p-4 md:p-5 space-y-3">
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-3 md:py-4 bg-brand hover:bg-brand-dark text-white font-bold tracking-wider text-[11px] md:text-[12px] uppercase rounded-xl shadow-lg shadow-brand/20 transition-all active:scale-[0.98] disabled:opacity-70 flex items-center justify-center gap-2 group"
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                    Connecting...
                                </>
                            ) : (
                                <>
                                    Get Free Quote
                                    <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                                </>
                            )}
                        </button>

                        {/* Hotline Integration within Footer */}
                        <div className="flex items-center justify-center gap-3 text-gray-600 pt-1">
                            <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center shadow-sm border border-gray-100">
                                <Phone className="w-3 text-brand" />
                            </div>
                            <div className="flex flex-col">
                                <span className="text-[8px] md:text-[9px] text-gray-400 font-bold uppercase tracking-widest leading-none mb-0.5">Hotline</span>
                                <a href="tel:+919587505726" className="text-[13px] md:text-[14px] font-bold text-gray-900 hover:text-brand transition-colors tracking-tight leading-none">+91 95875 05726</a>
                            </div>
                        </div>
                    </div>
                )}
            </form>

                </div>
            </LocalizationProvider>
        </ThemeProvider>
    );
});
