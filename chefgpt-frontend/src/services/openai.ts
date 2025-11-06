import { api } from './api';

export interface GenerateRecipeRequest {
  ingredients: string[];
  style?: string;
}

export interface RecipeResponse {
  title: string;
  ingredients: string;
  steps: string;
}

/**
 * Genera una receta usando el endpoint del backend /recipes/ai
 * El backend se encarga de llamar a OpenAI, manteniendo la API key segura
 */
export async function generateRecipe(
  request: GenerateRecipeRequest
): Promise<RecipeResponse> {
  const { ingredients, style } = request;
  
  // Convertir array de ingredientes a string separado por comas
  const ingredientsString = ingredients.join(', ');
  
  try {
    // Llamar al endpoint del backend
    const response = await api.post('/recipes/ai', {
      ingredients: ingredientsString,
      style: style || undefined,
    });

    return {
      title: response.data.title || 'Receta generada',
      ingredients: response.data.ingredients || '',
      steps: response.data.steps || '',
    };
  } catch (error: any) {
    console.error('Error generating recipe:', error);
    const errorMessage = error.response?.data?.message || error.message || 'Error desconocido';
    throw new Error(`Error al generar la receta: ${errorMessage}`);
  }
}

