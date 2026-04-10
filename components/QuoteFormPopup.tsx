"use client";

import React, { useState, useEffect, useRef } from 'react';
import {
    Phone, CheckCircle, User, Mail, MapPin, Users,
    Wallet, MessageSquare, Plane, Globe, MapPinned, Sparkles, X,
    Star, Shield, Headphones, Send, Heart, Loader2
} from 'lucide-react';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import dayjs, { Dayjs } from 'dayjs';
import { API_BASE_URL } from '@/constants';

// Custom MUI Theme for stylish calendar
const calendarTheme = createTheme({
    palette: {
        primary: {
            main: '#FB5012', // Tangelo
            light: '#FF7541',
            dark: '#D44310',
        },
    },
    typography: {
        fontFamily: 'inherit',
    },
    components: ({
        MuiTextField: {
            styleOverrides: {
                root: {
                    '& .MuiOutlinedInput-root': {
                        borderRadius: '12px',
                        backgroundColor: '#fff',
                        fontSize: '14px',
                        height: '48px',
                        '&:hover .MuiOutlinedInput-notchedOutline': {
                            borderColor: '#eb670e',
                        },
                        '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                            borderColor: '#eb670e',
                            borderWidth: '2px',
                        },
                    },
                    '& .MuiOutlinedInput-notchedOutline': {
                        borderColor: '#e5e7eb',
                    },
                    '& .MuiInputBase-input': {
                        padding: '12px 14px',
                        fontSize: '14px',
                        fontWeight: 500,
                        color: '#374151',
                    },
                    '& .MuiInputAdornment-root': {
                        marginLeft: '4px',
                    },
                    '& .MuiIconButton-root': {
                        color: '#eb670e',
                        padding: '8px',
                        '&:hover': {
                            backgroundColor: 'rgba(0, 210, 255, 0.1)',
                        },
                    },
                },
            },
        },

        MuiPickersCalendarHeader: {
            styleOverrides: {
                root: {
                    paddingLeft: '20px',
                    paddingRight: '12px',
                    marginBottom: '8px',
                },
                label: {
                    fontSize: '16px',
                    fontWeight: 700,
                    color: '#1f2937',
                    textTransform: 'capitalize',
                },
                switchViewButton: {
                    color: '#eb670e',
                    '&:hover': {
                        backgroundColor: 'rgba(0, 210, 255, 0.1)',
                    },
                },
            },
        },
        MuiDayCalendar: {
            styleOverrides: {
                weekDayLabel: {
                    fontSize: '12px',
                    fontWeight: 700,
                    color: '#9ca3af',
                    width: '40px',
                    height: '32px',
                },
                monthContainer: {
                    padding: '0 8px',
                },
            },
        },
        MuiPickersPopper: {
            styleOverrides: {
                paper: {
                    borderRadius: '20px',
                    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
                    border: '1px solid #f3f4f6',
                    overflow: 'hidden',
                    marginTop: '8px',
                },
            },
        },
        MuiPickersLayout: {
            styleOverrides: {
                root: {
                    '& .MuiPickersLayout-contentWrapper': {
                        padding: '12px',
                    },
                },
            },
        },
        MuiIconButton: {
            styleOverrides: {
                root: {
                    '&.MuiPickersArrowSwitcher-button': {
                        backgroundColor: '#f3f4f6',
                        borderRadius: '10px',
                        width: '36px',
                        height: '36px',
                        '&:hover': {
                            backgroundColor: 'rgba(0, 210, 255, 0.1)',
                            color: '#3a7bd5',
                        },
                    },
                },
            },
        },
        MuiPickersToolbar: {
            styleOverrides: {
                root: {
                    backgroundColor: '#eb670e',
                    '& .MuiTypography-root': {
                        color: '#fff',
                    },
                },
            },
        },
    }) as any,
});

interface QuoteFormPopupProps {
    isOpen: boolean;
    onClose: () => void;
}

export const QuoteFormPopup: React.FC<QuoteFormPopupProps> = ({ isOpen, onClose }) => {
    const isNavigating = useRef(false);

    useEffect(() => {
        if (isOpen) {
            const handlePopState = () => {
                onClose();
            };
            
            window.history.pushState({ popup: 'QuoteFormPopup' }, '');
            window.addEventListener('popstate', handlePopState);
            
            return () => {
                window.removeEventListener('popstate', handlePopState);
                if (window.history.state && window.history.state.popup === 'QuoteFormPopup') {
                    window.history.back();
                }
                // Reset focus to remove stuck mobile states
                if (typeof document !== 'undefined') (document.activeElement as HTMLElement)?.blur();
            };
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isOpen]);

    const [submitted, setSubmitted] = useState(false);
    const [loading, setLoading] = useState(false);
    const [departureDate, setDepartureDate] = useState<Dayjs | null>(null);
    const [returnDate, setReturnDate] = useState<Dayjs | null>(null);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        destination: '',
        travelers: '2',
        tripType: '',
        budget: '',
        hotelPreference: '',
        flightClass: '',
        message: ''
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            // Build detailed message from all form fields
            const detailsMessage = [
                formData.destination && `Destination: ${formData.destination}`,
                departureDate && `Departure: ${departureDate.format('DD MMM YYYY')}`,
                returnDate && `Return: ${returnDate.format('DD MMM YYYY')}`,
                `Travelers: ${formData.travelers}`,
                formData.tripType && `Trip Type: ${formData.tripType}`,
                formData.budget && `Budget: ${formData.budget}`,
                formData.hotelPreference && `Hotel: ${formData.hotelPreference}`,
                formData.flightClass && `Flight: ${formData.flightClass}`,
                formData.message && `Special Requirements: ${formData.message}`
            ].filter(Boolean).join(' | ');

            const response = await fetch(`${API_BASE_URL}/api/enquiries`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: formData.name,
                    email: formData.email,
                    phone: formData.phone,
                    message: detailsMessage,
                    source: 'Quote Form Popup'
                })
            });

            if (response.ok) {
                setSubmitted(true);
                setTimeout(() => {
                    setSubmitted(false);
                    onClose();
                }, 3000);
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

    if (!isOpen) return null;

    const tripTypes = [
        'Honeymoon',
        'Family Vacation',
        'Adventure Trip',
        'Solo Travel',
        'Group Tour',
        'Business + Leisure',
        'Pilgrimage',
        'Beach Getaway',
        'Weekend Trip'
    ];

    const budgetRanges = [
        'Under ₹25,000',
        '₹25,000 - ₹50,000',
        '₹50,000 - ₹1,00,000',
        '₹1,00,000 - ₹2,00,000',
        '₹2,00,000 - ₹5,00,000',
        'Above ₹5,00,000',
        'Flexible / Luxury'
    ];

    const hotelTypes = [
        '3 Star',
        '4 Star',
        '5 Star',
        'Luxury Resort',
        'Boutique Hotel',
        'Homestay',
        'No Preference'
    ];

    const flightOptions = [
        'Economy',
        'Premium Economy',
        'Business Class',
        'First Class',
        'No Preference'
    ];

    const inputClasses = "w-full pl-11 pr-4 py-3.5 border border-gray-200 rounded-2xl text-[13px] focus:outline-none focus:border-brand focus:ring-4 focus:ring-brand/5 transition-all bg-white hover:border-gray-300 placeholder:text-gray-300 font-medium";
    const selectClasses = "w-full pl-11 pr-10 py-3.5 border border-gray-200 rounded-2xl text-[13px] focus:outline-none focus:border-brand focus:ring-4 focus:ring-brand/5 transition-all bg-white text-gray-700 appearance-none cursor-pointer hover:border-gray-300 font-medium";
    const labelClasses = "block text-[13px] font-medium text-gray-500 mb-2 tracking-[0.02em]";

    return (
        <ThemeProvider theme={calendarTheme}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
                <div
                    className="fixed inset-0 z-[100] flex items-end lg:items-center justify-center bg-black/60 backdrop-blur-md p-0 lg:p-4 animate-in fade-in duration-300"
                    onClick={onClose}
                >
                    <div
                        className="relative w-full max-w-5xl bg-white rounded-t-3xl lg:rounded-3xl shadow-2xl overflow-hidden animate-in slide-in-from-bottom lg:zoom-in-95 duration-500 flex flex-col lg:flex-row h-[92vh] lg:max-h-[95vh]"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <button
                            onClick={onClose}
                            aria-label="Close quote form"
                            className="absolute top-4 right-4 z-20 p-2.5 rounded-full bg-white shadow-xl hover:bg-gray-100 text-gray-400 hover:text-gray-800 transition-all hover:scale-110"
                        >
                            <X className="w-5 h-5" />
                        </button>

                        {/* Left Side - Tangelo Branding Panel */}
                        <div className="hidden lg:flex lg:w-[42%] bg-brand p-10 flex-col justify-between relative overflow-hidden">

                            {/* Decorative Background Elements */}
                            <div className="absolute inset-0">
                                {/* Gradient Overlay */}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />

                                {/* Geometric Shapes */}
                                <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/3 translate-x-1/3" />
                                <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-1/3 -translate-x-1/3" />

                                {/* Dotted Pattern */}
                                <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle,_white_1px,_transparent_1px)] bg-[length:24px_24px]" />
                            </div>

                            {/* Top Section - Title */}
                            <div className="relative z-10">
                                <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full mb-6">
                                    <Sparkles className="w-4 h-4 text-white" />
                                    <span className="text-white text-xs font-bold tracking-wide">100% Free Consultation</span>
                                </div>

                                <h2 className="text-white text-4xl font-extrabold leading-tight mb-4">
                                    Plan Your <br />
                                    <span className="text-white/90">Dream Trip</span>
                                </h2>
                                <p className="text-white/80 text-sm leading-relaxed max-w-xs font-medium">
                                    Share your preferences and our expert travel consultants will design a personalized itinerary just for you.
                                </p>
                            </div>

                            {/* Middle Section - Feature Cards */}
                            <div className="relative z-10 space-y-3 my-8">
                                {[
                                    { icon: Plane, title: '50+ Destinations', sub: 'Worldwide coverage' },
                                    { icon: Shield, title: 'Price Guarantee', sub: 'Unmatched value' },
                                    { icon: Headphones, title: '24/7 Support', sub: 'Always here' }
                                ].map((feat, i) => (
                                    <div key={i} className="flex items-center gap-4 bg-white/40 border border-white/60 backdrop-blur-sm rounded-2xl p-4 group/item hover:bg-white transition-all duration-300">
                                        <div className="w-12 h-12 rounded-xl bg-brand/10 flex items-center justify-center flex-shrink-0 group-hover/item:bg-brand group-hover/item:text-white transition-colors">
                                            <feat.icon className="w-6 h-6 text-brand group-hover/item:text-white transition-colors" />
                                        </div>
                                        <div>
                                            <h4 className="text-brand-deep font-bold text-sm">{feat.title}</h4>
                                            <p className="text-gray-600 text-xs font-semibold">{feat.sub}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Bottom Section - Stats & Contact */}
                            <div className="relative z-10">
                                {/* Stats */}
                                <div className="flex items-center gap-6 mb-6 pb-6 border-b border-white/20">
                                    <div className="text-center">
                                        <div className="text-2xl font-bold text-white">5000+</div>
                                        <div className="text-[10px] font-bold text-white/70 tracking-tighter">Happy Users</div>
                                    </div>
                                    <div className="w-px h-10 bg-white/20" />
                                    <div className="text-center">
                                        <div className="text-2xl font-bold text-white flex items-center justify-center gap-1">
                                            4.9 <Star className="w-4 h-4 text-white fill-white" />
                                        </div>
                                        <div className="text-[10px] font-bold text-white/70 tracking-tighter">Rating</div>
                                    </div>
                                    <div className="w-px h-10 bg-white/20" />
                                    <div className="text-center">
                                        <div className="text-2xl font-bold text-white">10+</div>
                                        <div className="text-[10px] font-bold text-white/70 tracking-tighter">Years Exp.</div>
                                    </div>
                                </div>

                                {/* Contact */}
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                                        <Phone className="w-5 h-5 text-white" />
                                    </div>
                                    <div>
                                        <p className="text-white/60 text-[10px] font-bold tracking-wide">Need help? Call us</p>
                                        <a href="tel:+919587505726" className="text-white font-bold tracking-wide text-lg hover:text-white/80 transition-colors">
                                            +91 95875 05726
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Right Side - Form */}
                        <div className="flex-1 lg:w-[58%] overflow-y-auto bg-gray-50">
                            {/* Mobile Header */}
                            <div className="lg:hidden relative p-8 text-gray-900 border-b border-gray-100 overflow-hidden">
                                {/* Decorative Background Shapes */}
                                <div className="absolute inset-0 pointer-events-none overflow-hidden select-none opacity-40">
                                    <div className="absolute -top-[20%] -right-[10%] w-[60%] h-[80%] bg-gradient-to-br from-brand/10 to-transparent blur-[60px] rounded-full animate-pulse" />
                                    <div className="absolute bottom-0 -left-[10%] w-[50%] h-[60%] bg-gradient-to-tr from-blue-500/5 to-transparent blur-[50px] rounded-full animate-pulse [animation-delay:2s]" />
                                    <div className="absolute inset-0 opacity-[0.02] bg-[radial-gradient(#000_0.5px,_transparent_0.5px)] bg-[length:16px_16px]" />
                                </div>

                                <div className="relative z-10 flex flex-col items-center text-center">
                                    <h3 className="text-[22px] font-bold tracking-tight text-gray-900">Get Your Free Quote</h3>
                                    <p className="text-[13px] font-medium text-gray-400 mt-2 tracking-[0.01em]">Fill details for a customized trip plan</p>
                                </div>
                            </div>

                            <div className="p-6 lg:p-8">
                                {submitted ? (
                                    <div className="text-center py-16 animate-in zoom-in duration-500">
                                        <div className="w-24 h-24 bg-gradient-to-br from-green-400 to-emerald-600 text-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl shadow-green-200 transition-all hover:scale-110">
                                            <CheckCircle className="w-12 h-12" />
                                        </div>
                                        <h4 className="font-black text-3xl text-gray-800 mb-4 tracking-tight">Request Received! 🎉</h4>
                                        <p className="text-base text-gray-500 max-w-sm mx-auto leading-relaxed font-medium">
                                            You're one step closer to your dream trip. Our <span className="text-brand font-bold">Yatravi Expert</span> will be in touch within 24 hours with a personalized itinerary and the best deals.
                                        </p>
                                    </div>
                                ) : (
                                    <form onSubmit={handleSubmit} className="space-y-5">
                                        {/* Desktop Header */}
                                        <div className="hidden lg:block mb-6">
                                            <h3 className="text-2xl font-bold text-gray-800">Tell Us About Your Trip</h3>
                                            <p className="text-sm text-gray-400 mt-1">The more details you share, the better we can plan your perfect vacation</p>
                                        </div>

                                        {/* Personal Info Section */}
                                        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
                                            <h4 className="text-[14px] font-semibold text-gray-800 mb-5 flex items-center gap-2 tracking-tight">
                                                <User className="w-4 h-4 text-brand" />
                                                Personal Information
                                            </h4>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <div>
                                                    <label className={labelClasses}>Full Name *</label>
                                                    <div className="relative">
                                                        <User className="absolute left-4 top-3.5 w-4 h-4 text-gray-400" />
                                                        <input
                                                            type="text"
                                                            name="name"
                                                            value={formData.name}
                                                            onChange={handleChange}
                                                            placeholder="Enter your name"
                                                            className={inputClasses}
                                                            required
                                                        />
                                                    </div>
                                                </div>
                                                <div>
                                                    <label className={labelClasses}>Email Address *</label>
                                                    <div className="relative">
                                                        <Mail className="absolute left-4 top-3.5 w-4 h-4 text-gray-400" />
                                                        <input
                                                            type="email"
                                                            name="email"
                                                            value={formData.email}
                                                            onChange={handleChange}
                                                            placeholder="your@email.com"
                                                            className={inputClasses}
                                                            required
                                                        />
                                                    </div>
                                                </div>
                                                <div className="md:col-span-2">
                                                    <label className={labelClasses}>Phone Number *</label>
                                                    <div className="relative">
                                                        <div className="absolute left-4 top-3.5 flex items-center gap-1 border-r border-gray-200 pr-3">
                                                            <span className="text-xs font-medium text-gray-400">+91</span>
                                                        </div>
                                                        <input
                                                            type="tel"
                                                            name="phone"
                                                            value={formData.phone}
                                                            onChange={handleChange}
                                                            placeholder="Mobile Number"
                                                            className="w-full pl-[4.5rem] pr-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-brand focus:ring-2 focus:ring-brand/20 transition-all bg-white hover:border-gray-300"
                                                            required
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Trip Details Section */}
                                        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
                                            <h4 className="text-[14px] font-semibold text-gray-800 mb-5 flex items-center gap-2 tracking-tight">
                                                <Globe className="w-4 h-4 text-brand" />
                                                Trip Details
                                            </h4>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <div className="md:col-span-2">
                                                    <label className={labelClasses}>Where would you like to go?</label>
                                                    <div className="relative">
                                                        <MapPin className="absolute left-4 top-3.5 w-4 h-4 text-gray-400" />
                                                        <input
                                                            type="text"
                                                            name="destination"
                                                            value={formData.destination}
                                                            onChange={handleChange}
                                                            placeholder="e.g., Maldives, Dubai, Thailand, Goa..."
                                                            className={inputClasses}
                                                        />
                                                    </div>
                                                </div>

                                                {/* Stylish Date Pickers - Fixed Layout */}
                                                <div>
                                                    <label className={labelClasses}>Departure Date *</label>
                                                    <DatePicker
                                                        value={departureDate}
                                                        onChange={(newValue) => setDepartureDate(newValue)}
                                                        minDate={dayjs()}
                                                        format="DD MMM YYYY"
                                                        slotProps={{
                                                            textField: {
                                                                fullWidth: true,
                                                                placeholder: "Select date",
                                                                required: true,
                                                            },
                                                            popper: {
                                                                placement: 'bottom-start',
                                                                sx: {
                                                                    zIndex: 9999,
                                                                },
                                                            },
                                                        }}
                                                    />
                                                </div>
                                                <div>
                                                    <label className={labelClasses}>Return Date</label>
                                                    <DatePicker
                                                        value={returnDate}
                                                        onChange={(newValue) => setReturnDate(newValue)}
                                                        minDate={departureDate || dayjs()}
                                                        format="DD MMM YYYY"
                                                        slotProps={{
                                                            textField: {
                                                                fullWidth: true,
                                                                placeholder: "Select date",
                                                            },
                                                            popper: {
                                                                placement: 'bottom-start',
                                                                sx: {
                                                                    zIndex: 9999,
                                                                },
                                                            },
                                                        }}
                                                    />
                                                </div>

                                                <div>
                                                    <label className={labelClasses}>Number of Travelers *</label>
                                                    <div className="relative">
                                                        <Users className="absolute left-4 top-3.5 w-4 h-4 text-gray-400" />
                                                        <select
                                                            name="travelers"
                                                            value={formData.travelers}
                                                            onChange={handleChange}
                                                            className={selectClasses}
                                                            required
                                                        >
                                                            <option value="1">1 Traveler</option>
                                                            <option value="2">2 Travelers (Couple)</option>
                                                            <option value="3">3 Travelers</option>
                                                            <option value="4">4 Travelers</option>
                                                            <option value="5">5 Travelers</option>
                                                            <option value="6">6 Travelers</option>
                                                            <option value="7+">7+ Travelers (Group)</option>
                                                        </select>
                                                        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                                                            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                                            </svg>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div>
                                                    <label className={labelClasses}>Trip Type</label>
                                                    <div className="relative">
                                                        <Heart className="absolute left-4 top-3.5 w-4 h-4 text-gray-400" />
                                                        <select
                                                            name="tripType"
                                                            value={formData.tripType}
                                                            onChange={handleChange}
                                                            className={selectClasses}
                                                        >
                                                            <option value="">Select Trip Type</option>
                                                            {tripTypes.map(type => (
                                                                <option key={type} value={type}>{type}</option>
                                                            ))}
                                                        </select>
                                                        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                                                            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                                            </svg>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Preferences Section */}
                                        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
                                            <h4 className="text-[14px] font-semibold text-gray-800 mb-5 flex items-center gap-2 tracking-tight">
                                                <Star className="w-4 h-4 text-brand" />
                                                Trip Preferences
                                            </h4>
                                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                                <div>
                                                    <label className={labelClasses}>Budget Range</label>
                                                    <div className="relative">
                                                        <Wallet className="absolute left-4 top-3.5 w-4 h-4 text-gray-400" />
                                                        <select
                                                            name="budget"
                                                            value={formData.budget}
                                                            onChange={handleChange}
                                                            className={selectClasses}
                                                        >
                                                            <option value="">Select Budget</option>
                                                            {budgetRanges.map(range => (
                                                                <option key={range} value={range}>{range}</option>
                                                            ))}
                                                        </select>
                                                        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                                                            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                                            </svg>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div>
                                                    <label className={labelClasses}>Hotel Preference</label>
                                                    <div className="relative">
                                                        <MapPinned className="absolute left-4 top-3.5 w-4 h-4 text-gray-400" />
                                                        <select
                                                            name="hotelPreference"
                                                            value={formData.hotelPreference}
                                                            onChange={handleChange}
                                                            className={selectClasses}
                                                        >
                                                            <option value="">Select Hotel Type</option>
                                                            {hotelTypes.map(type => (
                                                                <option key={type} value={type}>{type}</option>
                                                            ))}
                                                        </select>
                                                        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                                                            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                                            </svg>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div>
                                                    <label className={labelClasses}>Flight Class</label>
                                                    <div className="relative">
                                                        <Plane className="absolute left-4 top-3.5 w-4 h-4 text-gray-400" />
                                                        <select
                                                            name="flightClass"
                                                            value={formData.flightClass}
                                                            onChange={handleChange}
                                                            className={selectClasses}
                                                        >
                                                            <option value="">Select Class</option>
                                                            {flightOptions.map(option => (
                                                                <option key={option} value={option}>{option}</option>
                                                            ))}
                                                        </select>
                                                        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                                                            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                                            </svg>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Special Requirements */}
                                        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
                                            <label className={labelClasses}>Special Requirements or Preferences</label>
                                            <div className="relative mt-1.5">
                                                <MessageSquare className="absolute left-4 top-3.5 w-4 h-4 text-gray-400" />
                                                <textarea
                                                    name="message"
                                                    value={formData.message}
                                                    onChange={handleChange}
                                                    placeholder="Tell us about any special requests, dietary needs, accessibility requirements, or activities you'd like to include..."
                                                    rows={4}
                                                    className="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-brand focus:ring-2 focus:ring-brand/20 transition-all bg-white resize-none hover:border-gray-300"
                                                />
                                            </div>
                                        </div>

                                        {/* Submit Button */}
                                        <button
                                            type="submit"
                                            disabled={loading}
                                            className="w-full bg-brand text-white font-bold py-4 rounded-xl shadow-[0_8px_25px_rgba(251,80,18,0.3)] hover:shadow-[0_12px_35px_rgba(251,80,18,0.4)] transition-all active:scale-[0.98] flex items-center justify-center gap-3 group text-[14px] tracking-wide disabled:opacity-70 mt-4"
                                        >
                                            {loading ? (
                                                <>
                                                    <Loader2 className="w-5 h-5 animate-spin" />
                                                    <span>Connecting...</span>
                                                </>
                                            ) : (
                                                <>
                                                    <Send className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                                    Send Inquiry
                                                </>
                                            )}
                                        </button>

                                        <p className="text-xs text-gray-400 text-center flex items-center justify-center gap-1">
                                            <Shield className="w-3 h-3" />
                                            Your information is safe with us. We respect your privacy.
                                        </p>
                                    </form>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </LocalizationProvider>
        </ThemeProvider>
    );
};
