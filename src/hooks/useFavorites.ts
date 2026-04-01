import { useState, useCallback } from 'react';

const FAVORITES_STORAGE_KEY = 'crypto_favorites';

function loadFavoritesFromStorage(): Set<string> {
  try {
    const stored = localStorage.getItem(FAVORITES_STORAGE_KEY);
    if (!stored) return new Set();
    const parsed: unknown = JSON.parse(stored);
    if (Array.isArray(parsed))
      return new Set<string>(parsed.filter((item) => typeof item === 'string'));
    return new Set();
  } catch {
    return new Set();
  }
}

function saveFavoritesToStorage(favorites: Set<string>): void {
  try {
    localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(Array.from(favorites)));
  } catch {
    // Silently ignore storage write failures (e.g. private mode quota exceeded)
  }
}

export interface IUseFavoritesResult {
  favoriteIds: Set<string>;
  toggleFavorite: (id: string) => void;
  isFavorite: (id: string) => boolean;
}

/**
 * Manages the set of favourite coin IDs, persisting the selection to localStorage
 * so it survives page reloads.
 * @returns favoriteIds set, a stable toggleFavorite handler, and an isFavorite predicate.
 */
export function useFavorites(): IUseFavoritesResult {
  const [favoriteIds, setFavoriteIds] = useState<Set<string>>(loadFavoritesFromStorage);

  const toggleFavorite = useCallback((id: string) => {
    setFavoriteIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      saveFavoritesToStorage(next);
      return next;
    });
  }, []);

  const isFavorite = useCallback((id: string) => favoriteIds.has(id), [favoriteIds]);

  return { favoriteIds, toggleFavorite, isFavorite };
}
