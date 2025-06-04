import { useState, useCallback } from "react";
import type { UseFavoriteDetailsReturn, FavoriteDetailsResponse } from "../../types";

export function useFavoriteDetails(): UseFavoriteDetailsReturn {
  const [favoriteDetails, setFavoriteDetails] = useState<FavoriteDetailsResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadDetails = useCallback(async (favoriteId: number) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/favorites/${favoriteId}`);

      if (response.status === 401) {
        window.location.href = "/login";
        return;
      }

      if (response.status === 404) {
        throw new Error("Przekąska nie została znaleziona");
      }

      if (!response.ok) {
        throw new Error("Błąd podczas ładowania szczegółów przekąski");
      }

      const data: FavoriteDetailsResponse = await response.json();
      setFavoriteDetails(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Wystąpił nieoczekiwany błąd");
    } finally {
      setLoading(false);
    }
  }, []);

  const clearDetails = useCallback(() => {
    setFavoriteDetails(null);
    setError(null);
    setLoading(false);
  }, []);

  return {
    favoriteDetails,
    loading,
    error,
    loadDetails,
    clearDetails,
  };
}
