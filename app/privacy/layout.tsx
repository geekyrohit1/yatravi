import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Privacy Policy | Data Protection & Privacy',
    description: 'Read Yatravi\'s privacy policy to understand how we collect, use, and protect your personal information.',
};

export default function PrivacyLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <>{children}</>;
}
