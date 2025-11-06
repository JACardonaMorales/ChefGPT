import { useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { motion } from 'framer-motion';
import RecipeForm from '@/components/RecipeForm';
import { CreateRecipeDto, recipesService } from '@/services/recipes';
import { ChefHat, Sparkles, AlertCircle } from 'lucide-react';

export default function CreateRecipe() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (data: CreateRecipeDto) => {
    try {
      setIsLoading(true);
      setError(null);
      console.log('Enviando receta:', data);
      const recipe = await recipesService.create(data);
      console.log('Receta creada exitosamente:', recipe);
      router.push(`/recipes/${recipe.id}`);
    } catch (error: any) {
      console.error('Error completo:', error);
      console.error('Error response:', error.response);
      console.error('Error message:', error.message);
      
      let errorMessage = 'Error al crear la receta';
      
      if (error.response) {
        // Error del servidor
        const serverError = error.response.data;
        if (serverError?.message) {
          if (Array.isArray(serverError.message)) {
            errorMessage = `Error de validación: ${serverError.message.join(', ')}`;
          } else {
            errorMessage = serverError.message;
          }
        } else if (error.response.status === 0 || error.code === 'ERR_NETWORK') {
          errorMessage = 'No se pudo conectar al servidor. ¿Está corriendo el backend en http://localhost:3001?';
        } else {
          errorMessage = `Error del servidor (${error.response.status}): ${JSON.stringify(serverError)}`;
        }
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      setError(errorMessage);
      alert(`Error al crear la receta:\n\n${errorMessage}\n\nRevisa la consola para más detalles.`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>Crear Receta - ChefGPT</title>
      </Head>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-xl flex items-center justify-center shadow-lg">
              <ChefHat className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-4xl font-display font-bold bg-gradient-to-r from-primary-500 to-secondary-500 bg-clip-text text-transparent">
              Crear Nueva Receta
            </h1>
          </div>
          <p className="text-gray-600 dark:text-gray-400">
            Comparte tu receta favorita con la comunidad
          </p>
        </motion.div>

        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl"
          >
            <div className="flex items-start space-x-3">
              <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 mt-0.5" />
              <div className="flex-1">
                <h3 className="font-semibold text-red-800 dark:text-red-200 mb-1">
                  Error al crear la receta
                </h3>
                <p className="text-sm text-red-700 dark:text-red-300 whitespace-pre-wrap">
                  {error}
                </p>
              </div>
            </div>
          </motion.div>
        )}

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <RecipeForm onSubmit={handleSubmit} isLoading={isLoading} />
        </motion.div>
      </div>
    </>
  );
}
