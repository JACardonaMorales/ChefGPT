import Link from 'next/link';
import { motion } from 'framer-motion';
import { Recipe } from '@/services/recipes';
import { Heart, Clock, ChefHat } from 'lucide-react';

interface RecipeCardProps {
  recipe: Recipe;
  onFavorite?: (recipeId: number) => void;
  isFavorite?: boolean;
}

export default function RecipeCard({ recipe, onFavorite, isFavorite }: RecipeCardProps) {
  // Handle ingredients - can be string or array from API
  const ingredientsValue = recipe.ingredients as string | string[];
  let ingredientsStr = '';
  if (typeof ingredientsValue === 'string') {
    ingredientsStr = ingredientsValue;
  } else if (Array.isArray(ingredientsValue)) {
    ingredientsStr = ingredientsValue.join(', ');
  }
  const ingredientsPreview = ingredientsStr.substring(0, 100);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      whileHover={{ y: -5, scale: 1.02 }}
      className="group"
    >
      <div className="card h-full hover:shadow-2xl transition-all cursor-pointer overflow-hidden">
        {/* Image placeholder with gradient */}
        <div className="relative h-48 bg-gradient-to-br from-primary-400 to-secondary-400 -m-6 mb-4 flex items-center justify-center">
          <ChefHat className="w-16 h-16 text-white opacity-80" />
          {recipe.style && (
            <div className="absolute top-4 right-4">
              <span className="bg-white/90 text-primary-600 text-xs px-3 py-1 rounded-full font-semibold">
                {recipe.style}
              </span>
            </div>
          )}
        </div>

        <div className="flex justify-between items-start mb-3">
          <Link href={`/recipes/${recipe.id}`} className="flex-1">
            <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 group-hover:text-primary-500 transition-colors line-clamp-2">
              {recipe.title}
            </h3>
          </Link>
          {onFavorite && (
            <motion.button
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 0.9 }}
              onClick={(e) => {
                e.preventDefault();
                onFavorite(recipe.id);
              }}
              className={`ml-2 ${isFavorite ? 'text-primary-500' : 'text-gray-400 hover:text-primary-500'} transition-colors`}
              aria-label={isFavorite ? 'Quitar de favoritos' : 'Agregar a favoritos'}
            >
              <Heart className={`w-5 h-5 ${isFavorite ? 'fill-current' : ''}`} />
            </motion.button>
          )}
        </div>

        <div className="mb-4">
          <p className="text-gray-600 dark:text-gray-400 text-sm line-clamp-2">
            {ingredientsPreview}
            {ingredientsPreview.length < ingredientsStr.length && '...'}
          </p>
        </div>

        <div className="flex justify-between items-center pt-4 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
            <Clock className="w-4 h-4 mr-1" />
            <span>{new Date(recipe.createdAt).toLocaleDateString()}</span>
          </div>
          <Link
            href={`/recipes/${recipe.id}`}
            className="text-primary-500 hover:text-primary-600 font-semibold text-sm flex items-center group-hover:gap-2 transition-all"
          >
            Ver receta
            <span className="ml-1 group-hover:translate-x-1 transition-transform">→</span>
          </Link>
        </div>
      </div>
    </motion.div>
  );
}
