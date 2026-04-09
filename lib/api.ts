import { API_BASE_URL } from "@/constants";

export async function getGlobalSettings() {
    try {
        const res = await fetch(`${API_BASE_URL}/api/settings`, { next: { revalidate: 60 } });
        if (!res.ok) return null;
        return await res.json();
    } catch (error) {
        console.error('Failed to fetch global settings:', error);
        return null;
    }
}

export async function getGlobalSeo() {
    const settings = await getGlobalSettings();
    return settings?.globalSeo || {};
}
