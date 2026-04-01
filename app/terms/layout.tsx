import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Terms & Conditions | Service Agreement',
    description: 'Review the terms and conditions for using Yatravi\'s services, including booking, payments, and cancellations.',
};

export default function TermsLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <>{children}</>;
}
