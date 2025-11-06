import { api } from './api';

export interface Favorite {
  id: number;
  userId: number;
  recipeId: number;
  createdAt: string;
  user?: any;
  recipe?: any;
}

export interface CreateFavoriteDto {
  recipeId: number;
}

export const favoritesService = {
  getAll: async (): Promise<Favorite[]> => {
    const response = await api.get('/favorites');
    return response.data;
  },

  getById: async (id: number): Promise<Favorite> => {
    const response = await api.get(`/favorites/${id}`);
    return response.data;
  },

  create: async (data: CreateFavoriteDto): Promise<Favorite> => {
    const response = await api.post('/favorites', data);
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    await api.delete(`/favorites/${id}`);
  },

  deleteByRecipe: async (recipeId: number): Promise<void> => {
    await api.delete(`/favorites/recipe/${recipeId}`);
  },
};

