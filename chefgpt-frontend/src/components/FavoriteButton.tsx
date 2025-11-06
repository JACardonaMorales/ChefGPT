import { useState, useEffect } from 'react';
import { favoritesService } from '@/services/favorites';

interface FavoriteButtonProps {
  recipeId: number;
  onToggle?: (isFavorite: boolean) => void;
}

export default function FavoriteButton({ recipeId, onToggle }: FavoriteButtonProps) {
  const [isFavorite, setIsFavorite] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    checkFavorite();
  }, [recipeId]);

  const checkFavorite = async () => {
    try {
      const favorites = await favoritesService.getAll();
      const favorite = favorites.find((f) => f.recipeId === recipeId);
      setIsFavorite(!!favorite);
    } catch (error) {
      console.error('Error checking favorite:', error);
    }
  };

  const handleToggle = async () => {
    setIsLoading(true);
    try {
      if (isFavorite) {
        const favorites = await favoritesService.getAll();
        const favorite = favorites.find((f) => f.recipeId === recipeId);
        if (favorite) {
          await favoritesService.delete(favorite.id);
        }
        setIsFavorite(false);
        onToggle?.(false);
      } else {
        await favoritesService.create({ recipeId });
        setIsFavorite(true);
        onToggle?.(true);
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={handleToggle}
      disabled={isLoading}
      className={`text-2xl transition-transform hover:scale-110 ${
        isFavorite ? 'text-red-500' : 'text-gray-400'
      } disabled:opacity-50`}
      aria-label={isFavorite ? 'Quitar de favoritos' : 'Agregar a favoritos'}
    >
      {isFavorite ? '❤️' : '🤍'}
    </button>
  );
}

