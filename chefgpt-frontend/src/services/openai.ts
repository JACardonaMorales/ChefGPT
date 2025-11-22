import { api } from './api';
import { Recipe } from './recipes';

export interface GenerateRecipeRequest {
  ingredients: string[];
  style?: string;
  autoSave?: boolean; // 🆕 Si es true, guarda automáticamente
}

export interface RecipeResponse {
  title: string;
  ingredients: string;
  steps: string;
}

/**
 * Genera una receta usando el endpoint del backend /recipes/ai
 * El backend se encarga de llamar a Gemini AI, manteniendo la API key segura
 * 
 * @param request - Datos para generar la receta
 * @param request.ingredients - Lista de ingredientes
 * @param request.style - Estilo culinario (opcional)
 * @param request.autoSave - Si es true, guarda automáticamente en el perfil (default: true)
 * @returns Receta generada (y opcionalmente guardada)
 */
export async function generateRecipe(
  request: GenerateRecipeRequest
): Promise<Recipe | RecipeResponse> {
  const { ingredients, style, autoSave = true } = request;
  
  // Convertir array de ingredientes a string separado por comas
  const ingredientsString = ingredients.join(', ');
  
  try {
    // Llamar al endpoint del backend
    const response = await api.post('/recipes/ai', {
      ingredients: ingredientsString,
      style: style || undefined,
      autoSave: autoSave, // 🆕 Enviar flag de autoSave
    });

    // Si autoSave es true, el backend devuelve una Recipe completa (con id, userId, etc.)
    // Si autoSave es false, devuelve solo { title, ingredients, steps }
    if (autoSave && response.data.id) {
      // Receta guardada en la BD
      return response.data as Recipe;
    }

    // Solo receta generada (no guardada)
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

/**
 * 🆕 Genera una receta SIN guardarla automáticamente
 */
export async function generateRecipePreview(
  ingredients: string[],
  style?: string
): Promise<RecipeResponse> {
  return generateRecipe({ ingredients, style, autoSave: false }) as Promise<RecipeResponse>;
}