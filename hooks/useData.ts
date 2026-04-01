import useSWR from 'swr';
import { API_BASE_URL } from '@/constants';

const fetcher = (url: string) => fetch(url).then(res => res.json());

// Fetch all packages from API
export function usePackages() {
    const { data, error, isLoading } = useSWR(`${API_BASE_URL}/api/packages`, fetcher);
    return {
        packages: data || [],
        isLoading,
        isError: error
    };
}

// Fetch all destinations from API
export function useDestinations() {
    const { data, error, isLoading } = useSWR(`${API_BASE_URL}/api/destinations`, fetcher);
    return {
        destinations: data || [],
        isLoading,
        isError: error
    };
}

// Fetch homepage configuration
export function useHomepageConfig() {
    const { data, error, isLoading } = useSWR(`${API_BASE_URL}/api/homepage`, fetcher);
    return {
        config: data,
        isLoading,
        isError: error
    };
}

// Fetch global settings
export function useGlobalSettings() {
    const { data, error, isLoading } = useSWR(`${API_BASE_URL}/api/settings`, fetcher);
    return {
        settings: data,
        isLoading,
        isError: error
    };
}
