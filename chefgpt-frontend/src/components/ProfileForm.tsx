import { useState, FormEvent, useEffect } from 'react';
import { motion } from 'framer-motion';
import { profilesService, UpdateProfileDto } from '@/services/profiles';
import { Save, Loader2, Image as ImageIcon } from 'lucide-react';

interface ProfileFormProps {
  userId: number;
  onUpdate?: () => void;
}

export default function ProfileForm({ userId, onUpdate }: ProfileFormProps) {
  const [formData, setFormData] = useState<UpdateProfileDto>({
    bio: '',
    avatar: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingProfile, setIsLoadingProfile] = useState(true);

  useEffect(() => {
    loadProfile();
  }, [userId]);

  const loadProfile = async () => {
    try {
      setIsLoadingProfile(true);
      const profile = await profilesService.getByUserId(userId);
      setFormData({
        bio: profile.bio || '',
        avatar: profile.avatar || '',
      });
    } catch (error) {
      console.error('Error loading profile:', error);
    } finally {
      setIsLoadingProfile(false);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const profile = await profilesService.getByUserId(userId);
      await profilesService.update(profile.id, formData);
      onUpdate?.();
      alert('Perfil actualizado exitosamente');
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Error al actualizar el perfil');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoadingProfile) {
    return (
      <div className="card text-center py-12">
        <Loader2 className="w-8 h-8 animate-spin mx-auto text-primary-500 mb-4" />
        <p className="text-gray-600 dark:text-gray-400">Cargando perfil...</p>
      </div>
    );
  }

  return (
    <motion.form
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      onSubmit={handleSubmit}
      className="card"
    >
      <div className="mb-6">
        <label htmlFor="bio" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
          Biografía
        </label>
        <textarea
          id="bio"
          value={formData.bio}
          onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
          className="input-field"
          rows={6}
          placeholder="Escribe algo sobre ti..."
        />
      </div>

      <div className="mb-6">
        <label htmlFor="avatar" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
          URL del Avatar
        </label>
        <div className="relative">
          <ImageIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="url"
            id="avatar"
            value={formData.avatar}
            onChange={(e) => setFormData({ ...formData, avatar: e.target.value })}
            className="input-field pl-10"
            placeholder="https://ejemplo.com/avatar.jpg"
          />
        </div>
        {formData.avatar && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mt-4"
          >
            <img
              src={formData.avatar}
              alt="Avatar preview"
              className="w-32 h-32 rounded-full object-cover border-4 border-primary-200 dark:border-primary-800 shadow-lg"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = 'none';
              }}
            />
          </motion.div>
        )}
      </div>

      <div className="flex justify-end pt-4 border-t border-gray-200 dark:border-gray-700">
        <motion.button
          type="submit"
          disabled={isLoading}
          whileHover={{ scale: isLoading ? 1 : 1.02 }}
          whileTap={{ scale: isLoading ? 1 : 0.98 }}
          className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              <span>Guardando...</span>
            </>
          ) : (
            <>
              <Save className="w-5 h-5" />
              <span>Guardar Perfil</span>
            </>
          )}
        </motion.button>
      </div>
    </motion.form>
  );
}
