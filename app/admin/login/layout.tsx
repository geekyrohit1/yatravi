import '@/index.css';

export default function AdminLoginLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    // Completely isolated layout - no admin shell
    return children;
}
