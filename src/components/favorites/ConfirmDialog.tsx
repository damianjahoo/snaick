import React, { useEffect, useRef } from "react";
import type { FavoriteListItemResponse } from "../../types";

interface ConfirmDialogProps {
  isOpen: boolean;
  favoriteToDelete: FavoriteListItemResponse | null;
  loading: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmDialog({ isOpen, favoriteToDelete, loading, onConfirm, onCancel }: ConfirmDialogProps) {
  const confirmButtonRef = useRef<HTMLButtonElement>(null);
  const cancelButtonRef = useRef<HTMLButtonElement>(null);

  // Handle keyboard navigation and focus management
  useEffect(() => {
    if (isOpen) {
      // Focus the cancel button by default (safer choice)
      cancelButtonRef.current?.focus();
      document.body.style.overflow = "hidden";

      const handleEscape = (e: KeyboardEvent) => {
        if (e.key === "Escape") {
          onCancel();
        }
      };

      const handleTab = (e: KeyboardEvent) => {
        if (e.key === "Tab") {
          e.preventDefault();
          // Toggle focus between cancel and confirm buttons
          if (document.activeElement === cancelButtonRef.current) {
            confirmButtonRef.current?.focus();
          } else {
            cancelButtonRef.current?.focus();
          }
        }
      };

      document.addEventListener("keydown", handleEscape);
      document.addEventListener("keydown", handleTab);

      return () => {
        document.removeEventListener("keydown", handleEscape);
        document.removeEventListener("keydown", handleTab);
        document.body.style.overflow = "unset";
      };
    }
  }, [isOpen, onCancel]);

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onCancel();
    }
  };

  const handleConfirm = () => {
    if (!loading) {
      onConfirm();
    }
  };

  const handleCancel = () => {
    if (!loading) {
      onCancel();
    }
  };

  if (!isOpen || !favoriteToDelete) return null;

  return (
    <div
      className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="dialog-title"
      aria-describedby="dialog-description"
    >
      <button
        className="absolute inset-0 w-full h-full bg-transparent border-none cursor-default"
        onClick={handleBackdropClick}
        aria-label="Anuluj usuwanie"
        tabIndex={-1}
      />

      <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 max-w-md w-full border border-white/20 shadow-2xl relative z-10">
        {/* Dialog Header */}
        <div className="mb-4">
          <div className="flex items-center justify-center w-12 h-12 mx-auto mb-4 bg-red-500/20 rounded-full border border-red-500/30">
            <span className="text-2xl text-red-300">⚠️</span>
          </div>
          <h3 id="dialog-title" className="text-lg font-semibold text-white text-center mb-2">
            Usuń z ulubionych?
          </h3>
          <p id="dialog-description" className="text-blue-100/80 text-sm text-center leading-relaxed">
            Czy na pewno chcesz usunąć <strong className="text-white">&quot;{favoriteToDelete.title}&quot;</strong> z
            ulubionych przekąsek?
            <br />
            <span className="text-xs text-blue-100/60 mt-2 block">Ta akcja nie może zostać cofnięta.</span>
          </p>
        </div>

        {/* Dialog Actions */}
        <div className="flex gap-3 justify-end">
          <button
            ref={cancelButtonRef}
            onClick={handleCancel}
            disabled={loading}
            className="px-4 py-2 bg-white/10 hover:bg-white/20 disabled:bg-white/5 text-white disabled:text-white/50 rounded-lg transition-colors disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-white/50 text-sm font-medium"
            aria-label="Anuluj usuwanie przekąski"
          >
            Anuluj
          </button>
          <button
            ref={confirmButtonRef}
            onClick={handleConfirm}
            disabled={loading}
            className="px-4 py-2 bg-red-500/80 hover:bg-red-500/90 disabled:bg-red-500/40 text-white disabled:text-white/50 rounded-lg transition-colors disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-red-400/50 text-sm font-medium flex items-center gap-2"
            aria-label="Potwierdź usunięcie przekąski z ulubionych"
          >
            {loading && <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white/80"></div>}
            {loading ? "Usuwanie..." : "Usuń"}
          </button>
        </div>
      </div>
    </div>
  );
}
