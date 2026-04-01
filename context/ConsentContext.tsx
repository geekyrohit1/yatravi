"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';

interface ConsentPreferences {
    essential: boolean;
    analytics: boolean;
    personalization: boolean;
}

interface ConsentContextType {
    preferences: ConsentPreferences;
    hasResponded: boolean;
    updatePreferences: (prefs: Partial<ConsentPreferences>) => void;
    acceptAll: () => void;
    denyAll: () => void;
}

const ConsentContext = createContext<ConsentContextType | undefined>(undefined);

export const ConsentProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [preferences, setPreferences] = useState<ConsentPreferences>({
        essential: true,
        analytics: false,
        personalization: false,
    });
    const [hasResponded, setHasResponded] = useState(false);

    useEffect(() => {
        const savedConsent = typeof window !== 'undefined' ? localStorage.getItem('yatravi_cookie_consent') : null;
        if (savedConsent) {
            try {
                const parsed = JSON.parse(savedConsent);
                setPreferences(parsed);
                setHasResponded(true);
            } catch (e) {
                console.error("Failed to parse consent", e);
            }
        }
    }, []);

    const updatePreferences = (newPrefs: Partial<ConsentPreferences>) => {
        const updated = { ...preferences, ...newPrefs, essential: true };
        setPreferences(updated);
        setHasResponded(true);
        localStorage.setItem('yatravi_cookie_consent', JSON.stringify(updated));
    };

    const acceptAll = () => {
        const allIn = { essential: true, analytics: true, personalization: true };
        setPreferences(allIn);
        setHasResponded(true);
        localStorage.setItem('yatravi_cookie_consent', JSON.stringify(allIn));
    };

    const denyAll = () => {
        const minimal = { essential: true, analytics: false, personalization: false };
        setPreferences(minimal);
        setHasResponded(true);
        localStorage.setItem('yatravi_cookie_consent', JSON.stringify(minimal));
    };

    return (
        <ConsentContext.Provider value={{ preferences, hasResponded, updatePreferences, acceptAll, denyAll }}>
            {children}
        </ConsentContext.Provider>
    );
};

export const useConsent = () => {
    const context = useContext(ConsentContext);
    if (!context) {
        throw new Error('useConsent must be used within a ConsentProvider');
    }
    return context;
};
