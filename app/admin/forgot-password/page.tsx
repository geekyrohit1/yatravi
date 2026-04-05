"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, Mail, KeyRound, CheckCircle, Lock, ArrowRight, Eye, EyeOff } from 'lucide-react';
import { API_BASE_URL } from '@/constants';
import Link from 'next/link';

export default function ForgotPasswordPage() {
    const router = useRouter();
    const [step, setStep] = useState<'email' | 'otp' | 'newpassword'>('email');
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    // Step 1: Send reset OTP
    const handleSendOTP = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            const res = await fetch(`${API_BASE_URL}/api/auth/forgot-password`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email }),
                credentials: 'include',
            });
            const data = await res.json();
            if (res.ok) {
                setStep('otp');
            } else {
                setError(data.message || 'Failed to send OTP');
            }
        } catch {
            setError('An error occurred. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    // Step 2: Verify OTP
    const handleVerifyOTP = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        // We just move to next step — reset-password API verifies OTP on final submit
        if (otp.length !== 6) {
            setError('Please enter a valid 6-digit OTP');
            return;
        }
        setStep('newpassword');
    };

    // Step 3: Reset password
    const handleResetPassword = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        if (newPassword !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }
        if (newPassword.length < 6) {
            setError('Password must be at least 6 characters');
            return;
        }
        setLoading(true);
        try {
            const res = await fetch(`${API_BASE_URL}/api/auth/reset-password`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, otp, newPassword }),
                credentials: 'include',
            });
            const data = await res.json();
            if (res.ok && data.success) {
                setSuccess(true);
                setTimeout(() => router.push('/admin/login'), 2000);
            } else {
                setError(data.message || 'Failed to reset password. OTP may have expired.');
                // Go back to OTP step
                setStep('otp');
                setOtp('');
            }
        } catch {
            setError('An error occurred. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const stepTitles = {
        email: { title: 'Forgot Password', desc: 'Enter your admin email to receive a reset OTP', icon: Mail },
        otp: { title: 'Enter OTP', desc: `We sent a 6-digit code to ${email}`, icon: KeyRound },
        newpassword: { title: 'New Password', desc: 'Set your new secure password', icon: Lock },
    };

    const current = stepTitles[step];
    const StepIcon = current.icon;

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-100 p-4">
            <Card className="w-full max-w-[420px] shadow-lg border-0">
                <CardHeader className="text-center space-y-3 pb-2">
                    <div className="mx-auto w-14 h-14 bg-slate-900 rounded-full flex items-center justify-center">
                        <StepIcon className="h-7 w-7 text-white" />
                    </div>
                    <CardTitle className="text-2xl font-bold text-slate-900">
                        {success ? 'Password Reset!' : current.title}
                    </CardTitle>
                    <CardDescription className="text-slate-500">
                        {success ? 'Redirecting to login...' : current.desc}
                    </CardDescription>

                    {/* Step Indicator */}
                    <div className="flex items-center justify-center gap-2 pt-1">
                        {(['email', 'otp', 'newpassword'] as const).map((s) => (
                            <div
                                key={s}
                                className={`h-1.5 w-8 rounded-full transition-colors ${step === s || (s === 'email' && (step === 'otp' || step === 'newpassword')) || (s === 'otp' && step === 'newpassword') ? 'bg-slate-900' : 'bg-slate-300'}`}
                            />
                        ))}
                    </div>
                </CardHeader>

                <CardContent className="pt-4">
                    {success ? (
                        <div className="p-4 text-center text-green-700 bg-green-50 border border-green-200 rounded-lg flex flex-col items-center gap-2">
                            <CheckCircle className="h-8 w-8 text-green-600" />
                            <p className="font-medium">Password reset successfully!</p>
                            <p className="text-sm">Redirecting to login page...</p>
                        </div>
                    ) : step === 'email' ? (
                        <form onSubmit={handleSendOTP} className="space-y-5">
                            {error && (
                                <div className="p-3 text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg">{error}</div>
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
                            <Button type="submit" className="w-full h-11 bg-slate-900 hover:bg-slate-800 text-white font-medium" disabled={loading}>
                                {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <ArrowRight className="mr-2 h-4 w-4" />}
                                Send Reset OTP
                            </Button>
                            <div className="text-center">
                                <Link href="/admin/login" className="text-sm text-slate-500 hover:text-slate-700">
                                    ← Back to Login
                                </Link>
                            </div>
                        </form>
                    ) : step === 'otp' ? (
                        <form onSubmit={handleVerifyOTP} className="space-y-5">
                            <div className="p-3 text-sm text-green-700 bg-green-50 border border-green-200 rounded-lg flex items-center gap-2">
                                <CheckCircle className="h-4 w-4" />
                                OTP sent! Check your email.
                            </div>
                            {error && (
                                <div className="p-3 text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg">{error}</div>
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
                                    autoFocus
                                    autoComplete="one-time-code"
                                    className="h-14 bg-white border-slate-200 focus:border-slate-400 text-center text-2xl font-bold tracking-[0.5em]"
                                />
                            </div>
                            <Button type="submit" className="w-full h-11 bg-slate-900 hover:bg-slate-800 text-white font-medium" disabled={otp.length !== 6}>
                                <ArrowRight className="mr-2 h-4 w-4" />
                                Verify OTP
                            </Button>
                            <div className="flex items-center justify-between text-sm">
                                <button type="button" onClick={() => { setStep('email'); setError(''); }} className="text-slate-500 hover:text-slate-700">
                                    ← Change email
                                </button>
                                <button type="button" onClick={handleSendOTP} disabled={loading} className="text-blue-600 hover:text-blue-800">
                                    Resend OTP
                                </button>
                            </div>
                        </form>
                    ) : (
                        <form onSubmit={handleResetPassword} className="space-y-5">
                            {error && (
                                <div className="p-3 text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg">{error}</div>
                            )}
                            <div className="space-y-2">
                                <Label htmlFor="newPassword" className="text-slate-700">New Password</Label>
                                <div className="relative">
                                    <Input
                                        id="newPassword"
                                        type={showPassword ? 'text' : 'password'}
                                        placeholder="Min. 6 characters"
                                        value={newPassword}
                                        onChange={(e) => setNewPassword(e.target.value)}
                                        required
                                        autoFocus
                                        className="h-11 bg-white border-slate-200 focus:border-slate-400 pr-10"
                                    />
                                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                    </button>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="confirmPassword" className="text-slate-700">Confirm Password</Label>
                                <Input
                                    id="confirmPassword"
                                    type="password"
                                    placeholder="Re-enter password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    required
                                    className="h-11 bg-white border-slate-200 focus:border-slate-400"
                                />
                            </div>
                            <Button type="submit" className="w-full h-11 bg-slate-900 hover:bg-slate-800 text-white font-medium" disabled={loading}>
                                {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <CheckCircle className="mr-2 h-4 w-4" />}
                                Reset Password
                            </Button>
                        </form>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
