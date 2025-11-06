import { useState } from 'react';
import Head from 'next/head';
import ChatInput from '@/components/ChatInput';
import RecipeCard from '@/components/RecipeCard';
import { generateRecipe } from '@/services/openai';
import { Recipe } from '@/services/recipes';

export default function Chat() {
  const [generatedRecipe, setGeneratedRecipe] = useState<Recipe | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSend = async (ingredients: string[], style?: string) => {
    setIsLoading(true);
    setError(null);
    setGeneratedRecipe(null);

    try {
      const result = await generateRecipe({ ingredients, style });
      
      // Convertir la respuesta a formato Recipe
      const recipe: Recipe = {
        id: 0,
        title: result.title,
        ingredients: result.ingredients,
        steps: result.steps,
        style: style,
        userId: 1,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      setGeneratedRecipe(recipe);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al generar la receta');
      console.error('Error generating recipe:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>Chat IA - ChefGPT</title>
      </Head>

      <div className="px-4 sm:px-0">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">
          💬 Chat con IA para Recetas
        </h1>

        <div className="grid lg:grid-cols-2 gap-6">
          <div>
            <ChatInput onSend={handleSend} isLoading={isLoading} />
            
            {error && (
              <div className="card bg-red-50 border border-red-200">
                <p className="text-red-800">{error}</p>
              </div>
            )}
          </div>

          <div>
            {generatedRecipe && (
              <div className="card">
                <h2 className="text-2xl font-bold mb-4">{generatedRecipe.title}</h2>
                
                {generatedRecipe.style && (
                  <span className="inline-block bg-primary-100 text-primary-800 text-xs px-2 py-1 rounded-full mb-4">
                    {generatedRecipe.style}
                  </span>
                )}

                <div className="mb-4">
                  <h3 className="font-semibold text-gray-700 mb-2">Ingredientes:</h3>
                  <p className="text-gray-600 whitespace-pre-line">
                    {generatedRecipe.ingredients}
                  </p>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-700 mb-2">Pasos:</h3>
                  <p className="text-gray-600 whitespace-pre-line">
                    {generatedRecipe.steps}
                  </p>
                </div>
              </div>
            )}

            {!generatedRecipe && !isLoading && (
              <div className="card text-center text-gray-500">
                <p>Ingresa ingredientes para generar una receta</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

