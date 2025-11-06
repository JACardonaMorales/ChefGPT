import { api } from './api';

export interface Profile {
  id: number;
  bio: string;
  avatar: string;
  userId: number;
  createdAt: string;
  updatedAt: string;
  user?: any;
}

export interface UpdateProfileDto {
  bio?: string;
  avatar?: string;
}

export const profilesService = {
  getAll: async (): Promise<Profile[]> => {
    const response = await api.get('/profiles');
    return response.data;
  },

  getById: async (id: number): Promise<Profile> => {
    const response = await api.get(`/profiles/${id}`);
    return response.data;
  },

  getByUserId: async (userId: number): Promise<Profile> => {
    const response = await api.get(`/profiles/user/${userId}`);
    return response.data;
  },

  update: async (id: number, data: UpdateProfileDto): Promise<Profile> => {
    const response = await api.patch(`/profiles/${id}`, data);
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    await api.delete(`/profiles/${id}`);
  },
};

