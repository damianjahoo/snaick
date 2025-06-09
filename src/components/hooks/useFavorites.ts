import { useState, useCallback } from "react";
import type { UseFavoritesReturn, FavoriteListResponse, FavoriteListItemResponse, PaginationMeta } from "../../types";

const DEFAULT_META: PaginationMeta = {
  total: 0,
  page: 1,
  limit: 6,
  has_more: false,
};

export function useFavorites(): UseFavoritesReturn {
  const [favorites, setFavorites] = useState<FavoriteListItemResponse[]>([]);
  const [meta, setMeta] = useState<PaginationMeta>(DEFAULT_META);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  const loadPage = useCallback(async (page: number) => {
    if (page < 1) return;

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/favorites?page=${page}&limit=6`);

      if (response.status === 401) {
        window.location.href = "/login";
        return;
      }

      if (!response.ok) {
        throw new Error("Błąd podczas ładowania ulubionych przekąsek");
      }

      const data: FavoriteListResponse = await response.json();
      setFavorites(data.data);
      setMeta(data.meta);
      setCurrentPage(page);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Wystąpił nieoczekiwany błąd");
    } finally {
      setLoading(false);
    }
  }, []);

  const refreshList = useCallback(async () => {
    await loadPage(currentPage);
  }, [loadPage, currentPage]);

  const removeFavorite = useCallback(
    async (favoriteId: number) => {
      setError(null);

      try {
        const response = await fetch(`/api/favorites/${favoriteId}`, {
          method: "DELETE",
        });

        if (response.status === 401) {
          window.location.href = "/login";
          return;
        }

        if (response.status === 404) {
          // Element już nie istnieje - odśwież listę
          await refreshList();
          return;
        }

        if (!response.ok) {
          throw new Error("Błąd podczas usuwania przekąski z ulubionych");
        }

        // Optimistic update - usuń z listy lokalnie
        setFavorites((prevFavorites) => prevFavorites.filter((fav) => fav.id !== favoriteId));

        // Zaktualizuj meta - zmniejsz total
        setMeta((prevMeta) => ({
          ...prevMeta,
          total: Math.max(0, prevMeta.total - 1),
        }));
      } catch (err) {
        setError(err instanceof Error ? err.message : "Wystąpił nieoczekiwany błąd");
        throw err; // Re-throw dla komponentów wywołujących
      }
    },
    [refreshList]
  );

  return {
    favorites,
    meta,
    loading,
    error,
    currentPage,
    loadPage,
    removeFavorite,
    refreshList,
  };
}
