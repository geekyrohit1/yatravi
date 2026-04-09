import { API_BASE_URL } from "@/constants";

/**
 * Enhanced fetch with a strict timeout to prevent SSR hanging
 * Critical for fixing 10s+ TBT and LCP delays
 */
async function fetchWithTimeout(url: string, options: any = {}, timeout = 15000) {
    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), timeout);

    try {
        const response = await fetch(url, {
            ...options,
            signal: controller.signal
        });
        clearTimeout(id);
        return response;
    } catch (error) {
        clearTimeout(id);
        throw error;
    }
}

export async function getGlobalSettings() {
    try {
        const res = await fetchWithTimeout(`${API_BASE_URL}/api/settings`, { 
            next: { revalidate: 60 } 
        });
        if (!res.ok) return null;
        return await res.json();
    } catch (error) {
        console.error('Failed to fetch global settings (timeout or error):', error);
        return null;
    }
}

export async function getGlobalSeo() {
    const settings = await getGlobalSettings();
    return settings?.globalSeo || {};
}
