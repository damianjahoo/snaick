import { useState, useCallback } from "react";

export interface UseModalReturn {
  isOpen: boolean;
  selectedFavoriteId: number | null;
  openModal: (favoriteId: number) => void;
  closeModal: () => void;
}

export function useModal(): UseModalReturn {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedFavoriteId, setSelectedFavoriteId] = useState<number | null>(null);

  const openModal = useCallback((favoriteId: number) => {
    setSelectedFavoriteId(favoriteId);
    setIsOpen(true);
  }, []);

  const closeModal = useCallback(() => {
    setIsOpen(false);
    setSelectedFavoriteId(null);
  }, []);

  return {
    isOpen,
    selectedFavoriteId,
    openModal,
    closeModal,
  };
}
