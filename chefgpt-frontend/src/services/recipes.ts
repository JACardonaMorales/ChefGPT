import { api } from './api';

export interface Recipe {
  id: number;
  title: string;
  ingredients: string;
  steps: string;
  style?: string;
  userId: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateRecipeDto {
  title: string;
  ingredients: string;
  steps: string;
  style?: string;
}

export interface GenerateRecipeDto {
  ingredients: string;
  style?: string;
}

export const recipesService = {
  getAll: async (): Promise<Recipe[]> => {
    const response = await api.get('/recipes');
    return response.data;
  },

  getById: async (id: number): Promise<Recipe> => {
    const response = await api.get(`/recipes/${id}`);
    return response.data;
  },

  create: async (data: CreateRecipeDto): Promise<Recipe> => {
    const response = await api.post('/recipes', data);
    return response.data;
  },

  update: async (id: number, data: Partial<CreateRecipeDto>): Promise<Recipe> => {
    const response = await api.patch(`/recipes/${id}`, data);
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    await api.delete(`/recipes/${id}`);
  },

  generateWithAI: async (data: GenerateRecipeDto): Promise<{ title: string; ingredients: string; steps: string }> => {
    const response = await api.post('/recipes/ai', data);
    return response.data;
  },
};

