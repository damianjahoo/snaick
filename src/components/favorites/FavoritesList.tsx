import React, { useEffect, useState } from "react";
import { useFavorites } from "../hooks/useFavorites";
import { useFavoriteDetails } from "../hooks/useFavoriteDetails";
import { useModal } from "../hooks/useModal";
import { toast } from "sonner";
import { FavoriteCard } from "./FavoriteCard";
import { Pagination } from "./Pagination";
import { FavoriteDetailsModal } from "./FavoriteDetailsModal";
import { EmptyState } from "./EmptyState";
import { ConfirmDialog } from "./ConfirmDialog";
import type { FavoriteListItemResponse, FavoriteDetailsResponse } from "../../types";

export function FavoritesList() {
  const { favorites, meta, loading, error, currentPage, loadPage, removeFavorite } = useFavorites();
  const { favoriteDetails, loading: detailsLoading, loadDetails, clearDetails } = useFavoriteDetails();
  const { isOpen, openModal, closeModal } = useModal();

  // Confirm dialog state
  const [confirmDialog, setConfirmDialog] = useState<{
    isOpen: boolean;
    favoriteToDelete: FavoriteListItemResponse | null;
    loading: boolean;
  }>({
    isOpen: false,
    favoriteToDelete: null,
    loading: false,
  });

  // Load initial data
  useEffect(() => {
    loadPage(1);
  }, [loadPage]);

  // Handle viewing details
  const handleViewDetails = async (favoriteId: number) => {
    openModal(favoriteId);
    await loadDetails(favoriteId);
  };

  // Handle modal close
  const handleCloseModal = () => {
    closeModal();
    clearDetails();
  };

  // Handle remove favorite (from card) - show confirmation
  const handleRemoveFavoriteFromCard = async (favorite: FavoriteListItemResponse) => {
    setConfirmDialog({
      isOpen: true,
      favoriteToDelete: favorite,
      loading: false,
    });
  };

  // Handle remove favorite (from modal) - show confirmation
  const handleRemoveFavoriteFromModal = async (favorite: FavoriteDetailsResponse) => {
    // Convert FavoriteDetailsResponse to FavoriteListItemResponse for confirm dialog
    const favoriteForDialog: FavoriteListItemResponse = {
      id: favorite.id,
      snack_id: favorite.snack_id,
      title: favorite.snack.title,
      description: favorite.snack.description,
      kcal: favorite.snack.kcal,
      added_at: favorite.added_at,
    };

    setConfirmDialog({
      isOpen: true,
      favoriteToDelete: favoriteForDialog,
      loading: false,
    });
  };

  // Confirm removal
  const handleConfirmRemoval = async () => {
    if (!confirmDialog.favoriteToDelete) return;

    setConfirmDialog((prev) => ({ ...prev, loading: true }));

    try {
      await removeFavorite(confirmDialog.favoriteToDelete.id);

      // Show success toast only after successful removal
      toast.success("Przekąska została usunięta z ulubionych");

      // Close modal if it was open for removed item
      if (isOpen && favoriteDetails?.id === confirmDialog.favoriteToDelete.id) {
        handleCloseModal();
      }

      // Close confirm dialog
      setConfirmDialog({
        isOpen: false,
        favoriteToDelete: null,
        loading: false,
      });
    } catch {
      // Show error toast when removal fails
      toast.error("Nie udało się usunąć przekąski z ulubionych");
      setConfirmDialog((prev) => ({ ...prev, loading: false }));
    }
  };

  // Cancel removal
  const handleCancelRemoval = () => {
    if (!confirmDialog.loading) {
      setConfirmDialog({
        isOpen: false,
        favoriteToDelete: null,
        loading: false,
      });
    }
  };

  // Handle pagination
  const handlePageChange = (page: number) => {
    loadPage(page);
  };

  // Show loading state
  if (loading && favorites.length === 0) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-200 mx-auto mb-4"></div>
          <p className="text-blue-100/80">Ładowanie ulubionych przekąsek...</p>
        </div>
      </div>
    );
  }

  // Show error state
  if (error && favorites.length === 0) {
    return (
      <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-6 text-center">
        <p className="text-red-200 mb-4">{error}</p>
        <button
          onClick={() => loadPage(1)}
          className="px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-200 rounded-lg transition-colors"
        >
          Spróbuj ponownie
        </button>
      </div>
    );
  }

  // Show empty state
  if (!loading && favorites.length === 0) {
    return <EmptyState />;
  }

  return (
    <div className="space-y-8">
      {/* Favorites Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {favorites.map((favorite) => (
          <FavoriteCard
            key={favorite.id}
            favorite={favorite}
            onViewDetails={handleViewDetails}
            onRemove={handleRemoveFavoriteFromCard}
          />
        ))}
      </div>

      {/* Pagination */}
      <Pagination meta={meta} currentPage={currentPage} loading={loading} onPageChange={handlePageChange} />

      {/* Favorite Details Modal */}
      <FavoriteDetailsModal
        isOpen={isOpen}
        favoriteDetails={favoriteDetails}
        loading={detailsLoading}
        onClose={handleCloseModal}
        onRemove={handleRemoveFavoriteFromModal}
      />

      {/* Confirm Dialog */}
      <ConfirmDialog
        isOpen={confirmDialog.isOpen}
        favoriteToDelete={confirmDialog.favoriteToDelete}
        loading={confirmDialog.loading}
        onConfirm={handleConfirmRemoval}
        onCancel={handleCancelRemoval}
      />
    </div>
  );
}
