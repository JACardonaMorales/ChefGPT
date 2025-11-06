'use client';

import Link from 'next/link';
import { useRouter } from 'next/router';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import Logo from './Logo';
import ThemeToggle from './ThemeToggle';
import { useAuth } from '@/contexts/AuthContext';
import { ChefHat, Sparkles, LogOut, User } from 'lucide-react';
import { cn } from '@/lib/utils';

const navLinks = [
  { href: '/', label: 'Inicio', icon: '🏠' },
  { href: '/chat', label: 'Chat IA', icon: '💬' },
  { href: '/recipes', label: 'Recetas', icon: '📚' },
  { href: '/favorites', label: 'Favoritos', icon: '❤️' },
];

export default function Header() {
  const [pathname, setPathname] = useState('/');
  
  // Usar useRouter normalmente - debe estar disponible en el contexto de Next.js
  const router = useRouter();
  
  // Usar useAuth - debe estar disponible porque HeaderWrapper solo renderiza cuando está montado
  const { isAuthenticated, user, logout } = useAuth();

  useEffect(() => {
    // Inicializar pathname desde window.location si está disponible
    if (typeof window !== 'undefined') {
      setPathname(window.location.pathname);
    }
    
    // Actualizar pathname cuando el router esté listo
    if (router.isReady) {
      setPathname(router.pathname);
    }
  }, []);

  useEffect(() => {
    if (router.isReady) {
      setPathname(router.pathname);
      
      const handleRouteChange = () => {
        if (router.isReady) {
          setPathname(router.pathname);
        }
      };
      
      if (router.events) {
        router.events.on('routeChangeComplete', handleRouteChange);
        return () => {
          router.events?.off('routeChangeComplete', handleRouteChange);
        };
      }
    }
  }, [router.isReady, router.pathname, router.events]);

  const handleLogout = () => {
    logout();
    if (router.isReady) {
      router.push('/');
    } else if (typeof window !== 'undefined') {
      window.location.href = '/';
    }
  };

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
      className="sticky top-0 z-50 w-full backdrop-blur-md bg-white/80 dark:bg-gray-900/80 border-b border-gray-200 dark:border-gray-800 shadow-sm"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Logo />

          {/* Navigation */}
          {isAuthenticated && (
            <nav className="hidden md:flex items-center space-x-1">
              {navLinks.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={cn(
                      'px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200',
                      isActive
                        ? 'bg-primary-500 text-white shadow-md'
                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                    )}
                  >
                    <span className="mr-2">{link.icon}</span>
                    {link.label}
                  </Link>
                );
              })}
            </nav>
          )}

          {/* Right side */}
          <div className="flex items-center space-x-4">
            <ThemeToggle />
            {isAuthenticated ? (
              <>
                <div className="hidden sm:flex items-center space-x-2 px-3 py-2 bg-gray-100 dark:bg-gray-800 rounded-lg">
                  <User className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    {user?.name}
                  </span>
                </div>
                <motion.button
                  onClick={handleLogout}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center space-x-2 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all"
                >
                  <LogOut className="w-4 h-4" />
                  <span className="hidden sm:inline">Salir</span>
                </motion.button>
              </>
            ) : (
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link
                  href="/auth/login"
                  className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-primary-500 to-primary-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Iniciar Sesión</span>
                </Link>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </motion.header>
  );
}

