import { useRouter } from 'next/router';
import Head from 'next/head';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import ProfileForm from '@/components/ProfileForm';
import { usersService, User } from '@/services/users';
import { User as UserIcon, Mail, Loader2 } from 'lucide-react';

export default function UserProfile() {
  const router = useRouter();
  const { userId } = router.query;
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (userId) {
      loadUser();
    }
  }, [userId]);

  const loadUser = async () => {
    try {
      setIsLoading(true);
      const userData = await usersService.getById(Number(userId));
      setUser(userData);
    } catch (error) {
      console.error('Error loading user:', error);
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
            <Loader2 className="w-12 h-12 animate-spin mx-auto text-primary-500 mb-4" />
            <p className="text-gray-600 dark:text-gray-400">Cargando perfil...</p>
          </div>
        </div>
      </>
    );
  }

  if (!user) {
    return (
      <>
        <Head>
          <title>Usuario no encontrado - ChefGPT</title>
        </Head>
        <div className="max-w-4xl mx-auto px-4 py-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="card bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800"
          >
            <p className="text-red-800 dark:text-red-200 text-lg">❌ Usuario no encontrado</p>
          </motion.div>
        </div>
      </>
    );
  }

  return (
    <>
      <Head>
        <title>{user.name} - Perfil - ChefGPT</title>
      </Head>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Profile Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="card mb-8"
        >
          <div className="flex items-center space-x-6">
            {user.profile?.avatar ? (
              <motion.img
                whileHover={{ scale: 1.05 }}
                src={user.profile.avatar}
                alt={user.name}
                className="w-32 h-32 rounded-full object-cover border-4 border-primary-200 dark:border-primary-800 shadow-lg"
              />
            ) : (
              <div className="w-32 h-32 rounded-full bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center border-4 border-primary-200 dark:border-primary-800 shadow-lg">
                <UserIcon className="w-16 h-16 text-white" />
              </div>
            )}
            <div className="flex-1">
              <h1 className="text-4xl font-display font-bold mb-2 text-gray-900 dark:text-gray-100">
                {user.name}
              </h1>
              <div className="flex items-center text-gray-600 dark:text-gray-400 mb-3">
                <Mail className="w-4 h-4 mr-2" />
                <span>{user.email}</span>
              </div>
              {user.profile?.bio && (
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                  {user.profile.bio}
                </p>
              )}
            </div>
          </div>
        </motion.div>

        {/* Edit Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <h2 className="text-3xl font-display font-bold mb-6 text-gray-900 dark:text-gray-100">
            Editar Perfil
          </h2>
          <ProfileForm userId={user.id} onUpdate={loadUser} />
        </motion.div>
      </div>
    </>
  );
}
