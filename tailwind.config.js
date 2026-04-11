/** @type {import('tailwindcss').Config} */
export default {
    darkMode: 'class',
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
        "./pages/**/*.{js,ts,jsx,tsx}",
        "./components/**/*.{js,ts,jsx,tsx}",
        "./app/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                brand: {
                    DEFAULT: "#FB5012", // Tangelo
                    light: "#FF7541",
                    dark: "#253034", // Professional Deep Navy/Black
                    accent: "#9BA2FF", // Sparse Vista Blue
                    deep: "#0F172A",
                },
                border: "hsl(var(--border))",
                input: "hsl(var(--input))",
                ring: "hsl(var(--ring))",
                background: "hsl(var(--background))",
                foreground: "hsl(var(--foreground))",
                primary: {
                    DEFAULT: "hsl(var(--primary))",
                    foreground: "hsl(var(--primary-foreground))",
                },
                secondary: {
                    DEFAULT: "hsl(var(--secondary))",
                    foreground: "hsl(var(--secondary-foreground))",
                },
                destructive: {
                    DEFAULT: "hsl(var(--destructive))",
                    foreground: "hsl(var(--destructive-foreground))",
                },
                muted: {
                    DEFAULT: "hsl(var(--muted))",
                    foreground: "hsl(var(--muted-foreground))",
                },
                accent: {
                    DEFAULT: "hsl(var(--accent))",
                    foreground: "hsl(var(--accent-foreground))",
                },
                popover: {
                    DEFAULT: "hsl(var(--popover))",
                    foreground: "hsl(var(--popover-foreground))",
                },
                card: {
                    DEFAULT: "hsl(var(--card))",
                    foreground: "hsl(var(--card-foreground))",
                },
            },
            borderRadius: {
                lg: "var(--radius)",
                md: "calc(var(--radius) - 2px)",
                sm: "calc(var(--radius) - 4px)",
            },
            fontFamily: {
                sans: ['var(--font-montserrat)', 'ui-sans-serif', 'system-ui', 'sans-serif'],
                alt: ['var(--font-montserrat-alt)', 'sans-serif'],
                fancy: ['var(--font-orange-avenue)', 'serif'],
                engagement: ['var(--font-engagement)', 'cursive'],
                'dm-serif': ['var(--font-dm-serif)', 'serif'],
                mono: ['ui-monospace', 'SFMono-Regular', 'Menlo', 'Monaco', 'Consolas', 'monospace'],
            },
            keyframes: {
                'fade-in-up': {
                    '0%': { opacity: '0', transform: 'translateY(20px)' },
                    '100%': { opacity: '1', transform: 'translateY(0)' },
                },
                'fade-in-down': {
                    '0%': { opacity: '0', transform: 'translateY(-20px)' },
                    '100%': { opacity: '1', transform: 'translateY(0)' },
                },
                'shimmer': {
                    '100%': { transform: 'translateX(100%)' },
                },
                'gradient-xy': {
                    '0%, 100%': {
                        'background-size': '400% 400%',
                        'background-position': 'left center'
                    },
                    '50%': {
                        'background-size': '200% 200%',
                        'background-position': 'right center'
                    }
                },
                'search-pill-expand': {
                    '0%': { 'clip-path': 'circle(30% at 50% 90%)', opacity: '0', transform: 'scale(0.98)' },
                    '100%': { 'clip-path': 'circle(150% at 50% 90%)', opacity: '1', transform: 'scale(1)' },
                },
                'fade-in': {
                    '0%': { opacity: '0' },
                    '100%': { opacity: '1' },
                }
            },
            animation: {
                'fade-in-up': 'fade-in-up 0.5s ease-out forwards',
                'fade-in-down': 'fade-in-down 0.5s ease-out forwards',
                'shimmer': 'shimmer 2s infinite linear',
                'gradient-xy': 'gradient-xy 8s ease infinite',
                'search-pill-expand': 'search-pill-expand 0.1s ease-out forwards',
                'fade-in': 'fade-in 0.3s ease-out forwards',
            },
        },
    },
    plugins: [],
}
