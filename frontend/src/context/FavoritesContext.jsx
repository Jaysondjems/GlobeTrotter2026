import { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { useAuth } from './AuthContext';

const FavoritesContext = createContext(null);

// Favorites are a client-side convenience feature (no dedicated backend endpoint exists for
// them), persisted in localStorage and namespaced per user so switching accounts on the same
// browser doesn't leak favorites between users.
function storageKey(userId) {
  return `globetrotter_favorites_${userId || 'guest'}`;
}

function readFavorites(userId) {
  try {
    const raw = localStorage.getItem(storageKey(userId));
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function FavoritesProvider({ children }) {
  const { user } = useAuth();
  const userId = user?.id;
  const [favorites, setFavorites] = useState(() => readFavorites(userId));

  useEffect(() => {
    setFavorites(readFavorites(userId));
  }, [userId]);

  useEffect(() => {
    localStorage.setItem(storageKey(userId), JSON.stringify(favorites));
  }, [favorites, userId]);

  const isFavorite = useCallback((destinationId) => favorites.some((f) => f.id === destinationId), [favorites]);

  const toggleFavorite = useCallback((destination) => {
    setFavorites((prev) =>
      prev.some((f) => f.id === destination.id)
        ? prev.filter((f) => f.id !== destination.id)
        : [...prev, destination]
    );
  }, []);

  const value = useMemo(
    () => ({ favorites, isFavorite, toggleFavorite, count: favorites.length }),
    [favorites, isFavorite, toggleFavorite]
  );

  return <FavoritesContext.Provider value={value}>{children}</FavoritesContext.Provider>;
}

export function useFavorites() {
  const ctx = useContext(FavoritesContext);
  if (!ctx) throw new Error('useFavorites must be used within a FavoritesProvider');
  return ctx;
}
