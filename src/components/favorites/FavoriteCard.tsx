import React from "react";
import type { FavoriteListItemResponse } from "../../types";

interface FavoriteCardProps {
  favorite: FavoriteListItemResponse;
  onViewDetails: (id: number) => void;
  onRemove: (favorite: FavoriteListItemResponse) => void;
}

export function FavoriteCard({ favorite, onViewDetails, onRemove }: FavoriteCardProps) {
  const handleViewDetails = () => {
    onViewDetails(favorite.id);
  };

  const handleRemove = () => {
    onRemove(favorite);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("pl-PL", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="bg-white/5 backdrop-blur-lg rounded-xl p-6 border border-white/10 hover:border-white/20 transition-all duration-200 hover:transform hover:scale-[1.02] focus-within:ring-2 focus-within:ring-blue-400/50 focus-within:border-blue-400/50">
      {/* Card Header */}
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-white mb-2 line-clamp-2 leading-tight">{favorite.title}</h3>
        <p className="text-blue-100/80 text-sm mb-3 line-clamp-3 leading-relaxed">{favorite.description}</p>
      </div>

      {/* Card Meta */}
      <div className="flex items-center justify-between mb-4">
        <span className="px-3 py-1 bg-green-500/20 text-green-200 rounded-full text-sm font-medium border border-green-500/30">
          {favorite.kcal} kcal
        </span>
        <span className="text-xs text-blue-100/60 font-medium">{formatDate(favorite.added_at)}</span>
      </div>

      {/* Card Actions */}
      <div className="flex gap-2">
        <button
          onClick={handleViewDetails}
          className="flex-1 px-4 py-2 bg-blue-500/20 hover:bg-blue-500/30 focus:bg-blue-500/30 text-blue-200 rounded-lg transition-colors text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-400/50 active:scale-95 transform"
          aria-label={`Zobacz szczegóły przekąski: ${favorite.title}`}
        >
          Zobacz szczegóły
        </button>
        <button
          onClick={handleRemove}
          className="px-4 py-2 bg-red-500/20 hover:bg-red-500/30 focus:bg-red-500/30 text-red-200 rounded-lg transition-colors text-sm font-medium focus:outline-none focus:ring-2 focus:ring-red-400/50 active:scale-95 transform"
          aria-label={`Usuń z ulubionych: ${favorite.title}`}
        >
          Usuń
        </button>
      </div>
    </div>
  );
}
