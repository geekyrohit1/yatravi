import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cleanSlug(text: string): string {
    return text
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-') // Replace non-alphanumeric with hyphens
        .replace(/^-+|-+$/g, '');    // Trim hyphens from both ends
}

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}
