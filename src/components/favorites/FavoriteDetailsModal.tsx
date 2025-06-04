import React, { useEffect } from "react";
import type { FavoriteDetailsResponse } from "../../types";
import { NutritionChart } from "./NutritionChart";

interface FavoriteDetailsModalProps {
  isOpen: boolean;
  favoriteDetails: FavoriteDetailsResponse | null;
  loading: boolean;
  onClose: () => void;
  onRemove: (favorite: FavoriteDetailsResponse) => void;
}

export function FavoriteDetailsModal({
  isOpen,
  favoriteDetails,
  loading,
  onClose,
  onRemove,
}: FavoriteDetailsModalProps) {
  // Handle keyboard navigation
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose]);

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleRemove = () => {
    if (favoriteDetails) {
      onRemove(favoriteDetails);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("pl-PL", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <button
        className="absolute inset-0 w-full h-full bg-transparent border-none cursor-default"
        onClick={handleBackdropClick}
        aria-label="Zamknij modal"
        tabIndex={-1}
      />
      <div
        className="bg-white/10 backdrop-blur-lg rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto border border-white/20 shadow-2xl relative z-10"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        {/* Modal Header */}
        <div className="sticky top-0 bg-white/10 backdrop-blur-lg border-b border-white/20 p-6">
          <div className="flex items-center justify-between">
            <h2 id="modal-title" className="text-xl font-semibold text-white">
              Szczegóły przekąski
            </h2>
            <div className="flex gap-2">
              {favoriteDetails && (
                <button
                  onClick={handleRemove}
                  className="px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-200 rounded-lg transition-colors text-sm font-medium focus:outline-none focus:ring-2 focus:ring-red-400/50"
                >
                  Usuń z ulubionych
                </button>
              )}
              <button
                onClick={onClose}
                className="p-2 hover:bg-white/10 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-400/50"
                aria-label="Zamknij modal"
              >
                <span className="text-white text-xl">×</span>
              </button>
            </div>
          </div>
        </div>

        {/* Modal Content */}
        <div className="p-6">
          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-200 mx-auto mb-4"></div>
              <p className="text-blue-100/80">Ładowanie szczegółów przekąski...</p>
            </div>
          ) : favoriteDetails ? (
            <div className="space-y-8">
              {/* Header with title and meta */}
              <div className="text-center">
                <h3 className="text-2xl font-bold text-white mb-2">{favoriteDetails.snack.title}</h3>
                <p className="text-blue-100/80 text-lg leading-relaxed mb-4">{favoriteDetails.snack.description}</p>
                <div className="flex flex-wrap items-center justify-center gap-4 text-sm">
                  <span className="px-3 py-1 bg-green-500/20 text-green-200 rounded-full font-medium border border-green-500/30">
                    {favoriteDetails.snack.kcal} kcal
                  </span>
                  <span className="px-3 py-1 bg-blue-500/20 text-blue-200 rounded-full font-medium border border-blue-500/30">
                    {favoriteDetails.snack.snack_type}
                  </span>
                  <span className="px-3 py-1 bg-purple-500/20 text-purple-200 rounded-full font-medium border border-purple-500/30">
                    {favoriteDetails.snack.preferred_diet}
                  </span>
                </div>
              </div>

              {/* Two column layout */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Left Column - Recipe Details */}
                <div className="space-y-6">
                  {/* Ingredients */}
                  <div>
                    <h4 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                      <span className="text-xl">🥄</span>
                      Składniki
                    </h4>
                    <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                      <p className="text-blue-100/90 whitespace-pre-line leading-relaxed">
                        {favoriteDetails.snack.ingredients}
                      </p>
                    </div>
                  </div>

                  {/* Instructions */}
                  <div>
                    <h4 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                      <span className="text-xl">👨‍🍳</span>
                      Sposób przygotowania
                    </h4>
                    <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                      <p className="text-blue-100/90 whitespace-pre-line leading-relaxed">
                        {favoriteDetails.snack.instructions}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Right Column - Nutrition & Meta */}
                <div className="space-y-6">
                  {/* Nutrition Info */}
                  <div>
                    <h4 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                      <span className="text-xl">📊</span>
                      Wartości odżywcze
                    </h4>
                    <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                      <NutritionChart
                        kcal={favoriteDetails.snack.kcal}
                        protein={favoriteDetails.snack.protein}
                        fat={favoriteDetails.snack.fat}
                        carbohydrates={favoriteDetails.snack.carbohydrates}
                        fibre={favoriteDetails.snack.fibre}
                      />
                    </div>
                  </div>

                  {/* Additional Info */}
                  <div>
                    <h4 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                      <span className="text-xl">ℹ️</span>
                      Informacje dodatkowe
                    </h4>
                    <div className="bg-white/5 rounded-lg p-4 border border-white/10 space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-blue-100/80">Lokalizacja:</span>
                        <span className="text-white font-medium">{favoriteDetails.snack.location}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-blue-100/80">Cel:</span>
                        <span className="text-white font-medium">{favoriteDetails.snack.goal}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-blue-100/80">Dodano do ulubionych:</span>
                        <span className="text-white font-medium">{formatDate(favoriteDetails.added_at)}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-blue-100/80">Utworzono:</span>
                        <span className="text-white font-medium">{formatDate(favoriteDetails.snack.created_at)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">😕</div>
              <h3 className="text-xl font-semibold text-red-200 mb-2">Nie udało się załadować szczegółów</h3>
              <p className="text-red-200/80 mb-4">Wystąpił błąd podczas ładowania szczegółów przekąski.</p>
              <button
                onClick={onClose}
                className="px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-200 rounded-lg transition-colors"
              >
                Zamknij
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
