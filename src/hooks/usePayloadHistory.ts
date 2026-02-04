import { useState, useEffect } from "react";
import { Payload } from "@/types/payload";

const HISTORY_KEY = "payload_history";
const FAVORITES_KEY = "payload_favorites";
const MAX_HISTORY = 50;

interface PayloadHistoryItem {
    payload: Payload;
    timestamp: number;
}

export const usePayloadHistory = () => {
    const [history, setHistory] = useState<PayloadHistoryItem[]>([]);
    const [favorites, setFavorites] = useState<string[]>([]);

    // Load history and favorites from localStorage
    useEffect(() => {
        const loadedHistory = localStorage.getItem(HISTORY_KEY);
        const loadedFavorites = localStorage.getItem(FAVORITES_KEY);

        if (loadedHistory) {
            try {
                setHistory(JSON.parse(loadedHistory));
            } catch (error) {
                console.error("Failed to load history:", error);
            }
        }

        if (loadedFavorites) {
            try {
                setFavorites(JSON.parse(loadedFavorites));
            } catch (error) {
                console.error("Failed to load favorites:", error);
            }
        }
    }, []);

    // Add payload to history
    const addToHistory = (payload: Payload) => {
        const newHistory = [
            { payload, timestamp: Date.now() },
            ...history.filter((item) => item.payload.id !== payload.id),
        ].slice(0, MAX_HISTORY);

        setHistory(newHistory);
        localStorage.setItem(HISTORY_KEY, JSON.stringify(newHistory));
    };

    // Clear all history
    const clearHistory = () => {
        setHistory([]);
        localStorage.removeItem(HISTORY_KEY);
    };

    // Remove item from history
    const removeFromHistory = (payloadId: string) => {
        const newHistory = history.filter((item) => item.payload.id !== payloadId);
        setHistory(newHistory);
        localStorage.setItem(HISTORY_KEY, JSON.stringify(newHistory));
    };

    // Toggle favorite
    const toggleFavorite = (payloadId: string) => {
        const newFavorites = favorites.includes(payloadId)
            ? favorites.filter((id) => id !== payloadId)
            : [...favorites, payloadId];

        setFavorites(newFavorites);
        localStorage.setItem(FAVORITES_KEY, JSON.stringify(newFavorites));
    };

    // Check if payload is favorite
    const isFavorite = (payloadId: string) => {
        return favorites.includes(payloadId);
    };

    // Get favorite payloads from history
    const getFavoritePayloads = () => {
        return history
            .filter((item) => favorites.includes(item.payload.id))
            .map((item) => item.payload);
    };

    return {
        history,
        favorites,
        addToHistory,
        clearHistory,
        removeFromHistory,
        toggleFavorite,
        isFavorite,
        getFavoritePayloads,
    };
};
