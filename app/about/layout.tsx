import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'About Us | Our Story & Vision',
    description: 'Learn about Yatravi, our mission to redefine travel, and our commitment to providing premium experiences at the lowest prices since 2024.',
};

export default function AboutLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <>{children}</>;
}
