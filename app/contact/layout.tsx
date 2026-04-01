import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Contact Us | Get a Free Travel Consultation',
    description: 'Speak with our travel experts to plan your dream journey. Contact Yatravi for domestic and international holiday packages and expert guidance.',
};

export default function ContactLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <>{children}</>;
}
