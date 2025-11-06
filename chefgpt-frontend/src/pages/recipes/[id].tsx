import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Recipe, recipesService } from '@/services/recipes';
import FavoriteButton from '@/components/FavoriteButton';
import { ArrowLeft, Clock, ChefHat, Utensils, ListChecks } from 'lucide-react';

export default function RecipeDetail() {
  const router = useRouter();
  const { id } = router.query;
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      loadRecipe();
    }
  }, [id]);

  const loadRecipe = async () => {
    try {
      setIsLoading(true);
      const data = await recipesService.getById(Number(id));
      setRecipe(data);
    } catch (err) {
      setError('Error al cargar la receta');
      console.error('Error loading recipe:', err);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <>
        <Head>
          <title>Cargando... - ChefGPT</title>
        </Head>
        <div className="max-w-4xl mx-auto px-4 py-12">
          <div className="card text-center py-16">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto mb-4"></div>
            <p className="text-gray-600 dark:text-gray-400">Cargando receta...</p>
          </div>
        </div>
      </>
    );
  }

  if (error || !recipe) {
    return (
      <>
        <Head>
          <title>Error - ChefGPT</title>
        </Head>
        <div className="max-w-4xl mx-auto px-4 py-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="card bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800"
          >
            <p className="text-red-800 dark:text-red-200 text-lg">❌ {error || 'Receta no encontrada'}</p>
            <Link href="/recipes" className="btn-primary mt-4 inline-block">
              Volver a Recetas
            </Link>
          </motion.div>
        </div>
      </>
    );
  }

  let ingredientsStr = '';
  const ingredientsValue = recipe.ingredients as string | string[];
  if (typeof ingredientsValue === 'string') {
    ingredientsStr = ingredientsValue;
  } else if (Array.isArray(ingredientsValue)) {
    ingredientsStr = ingredientsValue.join('\n');
  }

  let stepsStr = '';
  const stepsValue = recipe.steps as string | string[];
  if (typeof stepsValue === 'string') {
    stepsStr = stepsValue;
  } else if (Array.isArray(stepsValue)) {
    stepsStr = stepsValue.join('\n');
  }

  return (
    <>
      <Head>
        <title>{recipe.title} - ChefGPT</title>
      </Head>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="mb-6"
        >
          <Link
            href="/recipes"
            className="inline-flex items-center space-x-2 text-gray-600 dark:text-gray-400 hover:text-primary-500 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Volver a Recetas</span>
          </Link>
        </motion.div>

        {/* Recipe Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="card"
        >
          {/* Header */}
          <div className="flex justify-between items-start mb-6">
            <div className="flex-1">
              <h1 className="text-4xl font-display font-bold mb-4 text-gray-900 dark:text-gray-100">
                {recipe.title}
              </h1>
              {recipe.style && (
                <span className="inline-block bg-gradient-to-r from-primary-100 to-secondary-100 dark:from-primary-900/30 dark:to-secondary-900/30 text-primary-700 dark:text-primary-300 text-sm px-4 py-2 rounded-full font-semibold mb-4">
                  {recipe.style}
                </span>
              )}
            </div>
            <FavoriteButton recipeId={recipe.id} />
          </div>

          {/* Metadata */}
          <div className="flex items-center space-x-4 mb-8 pb-6 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center text-gray-600 dark:text-gray-400">
              <Clock className="w-4 h-4 mr-2" />
              <span className="text-sm">
                {new Date(recipe.createdAt).toLocaleDateString('es-ES', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </span>
            </div>
          </div>

          {/* Ingredients */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-8"
          >
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl flex items-center justify-center mr-3">
                <Utensils className="w-5 h-5 text-white" />
              </div>
              <h2 className="text-2xl font-display font-bold text-gray-900 dark:text-gray-100">
                Ingredientes
              </h2>
            </div>
            <div className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700 p-6 rounded-2xl border border-gray-200 dark:border-gray-600">
              <p className="text-gray-700 dark:text-gray-300 whitespace-pre-line leading-relaxed">
                {ingredientsStr}
              </p>
            </div>
          </motion.div>

          {/* Steps */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-secondary-500 to-secondary-600 rounded-xl flex items-center justify-center mr-3">
                <ListChecks className="w-5 h-5 text-white" />
              </div>
              <h2 className="text-2xl font-display font-bold text-gray-900 dark:text-gray-100">
                Pasos de Preparación
              </h2>
            </div>
            <div className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700 p-6 rounded-2xl border border-gray-200 dark:border-gray-600">
              <p className="text-gray-700 dark:text-gray-300 whitespace-pre-line leading-relaxed">
                {stepsStr}
              </p>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </>
  );
}
