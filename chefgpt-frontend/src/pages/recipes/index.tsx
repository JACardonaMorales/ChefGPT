import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Recipe, recipesService } from '@/services/recipes';
import RecipeCard from '@/components/RecipeCard';
import { useAuth } from '@/contexts/AuthContext';
import { favoritesService } from '@/services/favorites';
import { Plus, BookOpen, Loader2 } from 'lucide-react';

export default function RecipesIndex() {
  const router = useRouter();
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [favorites, setFavorites] = useState<number[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/auth/login');
      return;
    }
    if (isAuthenticated) {
      loadRecipes();
      loadFavorites();
    }
  }, [isAuthenticated, authLoading]);

  const loadRecipes = async () => {
    try {
      setIsLoading(true);
      const data = await recipesService.getAll();
      setRecipes(data);
    } catch (err) {
      setError('Error al cargar las recetas');
      console.error('Error loading recipes:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const loadFavorites = async () => {
    try {
      const favs = await favoritesService.getAll();
      const favoriteIds = favs.map(f => f.recipeId);
      setFavorites(favoriteIds);
    } catch (err) {
      console.error('Error loading favorites:', err);
    }
  };

  const handleFavorite = async (recipeId: number) => {
    try {
      const isFavorite = favorites.includes(recipeId);
      if (isFavorite) {
        // Quitar de favoritos
        const favs = await favoritesService.getAll();
        const favorite = favs.find(f => f.recipeId === recipeId);
        if (favorite) {
          await favoritesService.delete(favorite.id);
          setFavorites(favorites.filter(id => id !== recipeId));
        }
      } else {
        // Agregar a favoritos
        await favoritesService.create({ recipeId });
        setFavorites([...favorites, recipeId]);
      }
    } catch (err) {
      console.error('Error toggling favorite:', err);
      alert('Error al actualizar favoritos. Por favor, intenta de nuevo.');
    }
  };

  if (authLoading || !isAuthenticated) {
    return null;
  }

  return (
    <>
      <Head>
        <title>Recetas - ChefGPT</title>
      </Head>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex justify-between items-center mb-8"
        >
          <div>
            <h1 className="text-4xl font-display font-bold mb-2 bg-gradient-to-r from-primary-500 to-secondary-500 bg-clip-text text-transparent">
              📚 Recetas
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Explora recetas increíbles creadas por nuestra comunidad
            </p>
          </div>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Link
              href="/recipes/create"
              className="btn-primary flex items-center space-x-2"
            >
              <Plus className="w-5 h-5" />
              <span>Crear Receta</span>
            </Link>
          </motion.div>
        </motion.div>

        {/* Loading State */}
        {isLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="card text-center py-12"
          >
            <Loader2 className="w-8 h-8 animate-spin mx-auto text-primary-500 mb-4" />
            <p className="text-gray-600 dark:text-gray-400">Cargando recetas...</p>
          </motion.div>
        )}

        {/* Error State */}
        {error && (
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="card bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800"
          >
            <p className="text-red-800 dark:text-red-200">❌ {error}</p>
          </motion.div>
        )}

        {/* Empty State */}
        {!isLoading && !error && recipes.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="card text-center py-12"
          >
            <BookOpen className="w-16 h-16 mx-auto text-gray-400 mb-4" />
            <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-gray-100">
              No hay recetas aún
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              ¡Sé el primero en crear una receta increíble!
            </p>
            <Link href="/recipes/create" className="btn-primary inline-flex items-center space-x-2">
              <Plus className="w-5 h-5" />
              <span>Crear Primera Receta</span>
            </Link>
          </motion.div>
        )}

        {/* Recipes Grid */}
        {!isLoading && !error && recipes.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {recipes.map((recipe, index) => (
              <motion.div
                key={recipe.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <RecipeCard
                  recipe={recipe}
                  onFavorite={handleFavorite}
                  isFavorite={favorites.includes(recipe.id)}
                />
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </>
  );
}
