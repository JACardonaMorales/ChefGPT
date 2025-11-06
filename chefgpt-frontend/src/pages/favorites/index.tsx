import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { favoritesService, Favorite } from '@/services/favorites';
import { Recipe } from '@/services/recipes';
import RecipeCard from '@/components/RecipeCard';
import { useAuth } from '@/contexts/AuthContext';
import { Heart, BookOpen, Loader2, Sparkles } from 'lucide-react';

export default function FavoritesIndex() {
  const router = useRouter();
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const [favorites, setFavorites] = useState<Favorite[]>([]);
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/auth/login');
      return;
    }
    if (isAuthenticated) {
      loadFavorites();
    }
  }, [isAuthenticated, authLoading]);

  const loadFavorites = async () => {
    try {
      setIsLoading(true);
      const favs = await favoritesService.getAll();
      setFavorites(favs);
      
      const recipeList = favs
        .map((fav) => fav.recipe)
        .filter((recipe): recipe is Recipe => recipe !== undefined);
      setRecipes(recipeList);
    } catch (err) {
      setError('Error al cargar los favoritos');
      console.error('Error loading favorites:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFavorite = async (recipeId: number) => {
    try {
      await favoritesService.deleteByRecipe(recipeId);
      loadFavorites();
    } catch (err) {
      console.error('Error removing favorite:', err);
    }
  };

  if (authLoading || !isAuthenticated) {
    return null;
  }

  return (
    <>
      <Head>
        <title>Favoritos - ChefGPT</title>
      </Head>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center space-x-3 mb-2">
            <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-xl flex items-center justify-center shadow-lg">
              <Heart className="w-6 h-6 text-white fill-current" />
            </div>
            <h1 className="text-4xl font-display font-bold bg-gradient-to-r from-primary-500 to-secondary-500 bg-clip-text text-transparent">
              Mis Recetas Favoritas
            </h1>
          </div>
          <p className="text-gray-600 dark:text-gray-400">
            Tus recetas guardadas para consultarlas cuando quieras
          </p>
        </motion.div>

        {/* Loading State */}
        {isLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="card text-center py-12"
          >
            <Loader2 className="w-8 h-8 animate-spin mx-auto text-primary-500 mb-4" />
            <p className="text-gray-600 dark:text-gray-400">Cargando favoritos...</p>
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
            className="card text-center py-16"
          >
            <motion.div
              animate={{ 
                scale: [1, 1.1, 1],
                rotate: [0, 5, -5, 0]
              }}
              transition={{ 
                duration: 2,
                repeat: Infinity,
                repeatType: "reverse"
              }}
              className="inline-block mb-6"
            >
              <div className="w-24 h-24 bg-gradient-to-br from-primary-100 to-secondary-100 dark:from-primary-900/30 dark:to-secondary-900/30 rounded-full flex items-center justify-center">
                <Heart className="w-12 h-12 text-primary-500" />
              </div>
            </motion.div>
            <h3 className="text-2xl font-bold mb-3 text-gray-900 dark:text-gray-100">
              Aún no tienes recetas guardadas
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-md mx-auto">
              ¡Explora nuestras recetas y guarda tus favoritas para acceder a ellas fácilmente!
            </p>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link
                href="/recipes"
                className="btn-primary inline-flex items-center space-x-2"
              >
                <Sparkles className="w-5 h-5" />
                <span>Explorar Recetas</span>
              </Link>
            </motion.div>
          </motion.div>
        )}

        {/* Favorites Grid */}
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
                  isFavorite={true}
                />
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </>
  );
}
