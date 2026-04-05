"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, Mail, KeyRound, ArrowRight, CheckCircle, Lock } from 'lucide-react';
import { API_BASE_URL } from '@/constants';
import Link from 'next/link';

export default function AdminLoginPage() {
    const router = useRouter();
    const [step, setStep] = useState<'credentials' | 'otp'>('credentials');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [otp, setOtp] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [otpSent, setOtpSent] = useState(false);

    // Step 1: Verify email + password → triggers OTP send
    const handleCredentials = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const res = await fetch(`${API_BASE_URL}/api/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
                credentials: 'include',
            });

            const data = await res.json();

            if (res.ok && data.success) {
                setOtpSent(true);
                setStep('otp');
            } else {
                setError(data.message || 'Invalid email or password');
            }
        } catch (err) {
            setError('An error occurred. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    // Step 2: Verify OTP → login
    const handleVerifyOTP = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const res = await fetch(`${API_BASE_URL}/api/auth/verify-otp`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, otp }),
                credentials: 'include',
            });

            const data = await res.json();

            if (res.ok && data.success) {
                router.push('/admin/dashboard');
                router.refresh();
            } else {
                setError(data.message || 'Invalid OTP');
            }
        } catch (err) {
            setError('An error occurred. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    // Resend OTP (re-verify password to get new OTP)
    const handleResendOTP = async () => {
        setError('');
        setLoading(true);
        try {
            const res = await fetch(`${API_BASE_URL}/api/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
                credentials: 'include',
            });
            const data = await res.json();
            if (res.ok && data.success) {
                setOtp('');
                setError('');
            } else {
                setError(data.message || 'Failed to resend OTP');
            }
        } catch (err) {
            setError('An error occurred. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-100 p-4">
            <Card className="w-full max-w-[420px] shadow-lg border-0">
                <CardHeader className="text-center space-y-3 pb-2">
                    <div className="mx-auto w-14 h-14 bg-slate-900 rounded-full flex items-center justify-center">
                        {step === 'credentials' ? (
                            <Lock className="h-7 w-7 text-white" />
                        ) : (
                            <KeyRound className="h-7 w-7 text-white" />
                        )}
                    </div>
                    <CardTitle className="text-2xl font-bold text-slate-900">
                        {step === 'credentials' ? 'Admin Login' : 'Verify OTP'}
                    </CardTitle>
                    <CardDescription className="text-slate-500">
                        {step === 'credentials'
                            ? 'Enter your email and password to continue'
                            : `We sent a 6-digit code to ${email}`
                        }
                    </CardDescription>

                    {/* Step Indicator */}
                    <div className="flex items-center justify-center gap-2 pt-1">
                        <div className={`h-1.5 w-10 rounded-full transition-colors ${step === 'credentials' ? 'bg-slate-900' : 'bg-slate-300'}`} />
                        <div className={`h-1.5 w-10 rounded-full transition-colors ${step === 'otp' ? 'bg-slate-900' : 'bg-slate-300'}`} />
                    </div>
                </CardHeader>

                <CardContent className="pt-4">
                    {/* Step 1: Email + Password */}
                    {step === 'credentials' ? (
                        <form onSubmit={handleCredentials} className="space-y-5">
                            {error && (
                                <div className="p-3 text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg">
                                    {error}
                                </div>
                            )}

                            <div className="space-y-2">
                                <Label htmlFor="email" className="text-slate-700">Email Address</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="admin@yatravi.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    autoComplete="email"
                                    className="h-11 bg-white border-slate-200 focus:border-slate-400"
                                />
                            </div>

                            <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <Label htmlFor="password" className="text-slate-700">Password</Label>
                                    <Link
                                        href="/admin/forgot-password"
                                        className="text-xs text-blue-600 hover:text-blue-800 hover:underline"
                                    >
                                        Forgot Password?
                                    </Link>
                                </div>
                                <Input
                                    id="password"
                                    type="password"
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    autoComplete="current-password"
                                    className="h-11 bg-white border-slate-200 focus:border-slate-400"
                                />
                            </div>

                            <Button
                                type="submit"
                                className="w-full h-11 bg-slate-900 hover:bg-slate-800 text-white font-medium"
                                disabled={loading}
                            >
                                {loading ? (
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                ) : (
                                    <ArrowRight className="mr-2 h-4 w-4" />
                                )}
                                Continue
                            </Button>
                        </form>
                    ) : (
                        /* Step 2: OTP */
                        <form onSubmit={handleVerifyOTP} className="space-y-5">
                            {otpSent && (
                                <div className="p-3 text-sm text-green-700 bg-green-50 border border-green-200 rounded-lg flex items-center gap-2">
                                    <CheckCircle className="h-4 w-4" />
                                    OTP sent! Check your email.
                                </div>
                            )}

                            {error && (
                                <div className="p-3 text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg">
                                    {error}
                                </div>
                            )}

                            <div className="space-y-2">
                                <Label htmlFor="otp" className="text-slate-700">Enter 6-Digit OTP</Label>
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
                                    autoComplete="one-time-code"
                                    autoFocus
                                    className="h-14 bg-white border-slate-200 focus:border-slate-400 text-center text-2xl font-bold tracking-[0.5em]"
                                />
                            </div>

                            <Button
                                type="submit"
                                className="w-full h-11 bg-slate-900 hover:bg-slate-800 text-white font-medium"
                                disabled={loading || otp.length !== 6}
                            >
                                {loading ? (
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                ) : (
                                    <CheckCircle className="mr-2 h-4 w-4" />
                                )}
                                Verify & Login
                            </Button>

                            <div className="flex items-center justify-between text-sm">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setStep('credentials');
                                        setOtp('');
                                        setOtpSent(false);
                                        setError('');
                                    }}
                                    className="text-slate-500 hover:text-slate-700"
                                >
                                    ← Go back
                                </button>
                                <button
                                    type="button"
                                    onClick={handleResendOTP}
                                    disabled={loading}
                                    className="text-blue-600 hover:text-blue-800"
                                >
                                    Resend OTP
                                </button>
                            </div>
                        </form>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
