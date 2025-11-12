'use client';

import { useEffect, useState } from 'react';
import Header from './Header';

export default function HeaderWrapper() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Esperar a que el componente esté completamente montado
    setMounted(true);
  }, []);

  if (!mounted) {
    // Renderizar un header placeholder mientras se monta
    return (
      <header className="sticky top-0 z-50 w-full backdrop-blur-md bg-white/80 dark:bg-gray-900/80 border-b border-gray-200 dark:border-gray-800 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
              <div className="w-24 h-6 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
            </div>
            <div className="w-32 h-10 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
          </div>
        </div>
      </header>
    );
  }

  // Renderizar Header solo cuando esté montado en el cliente
  return <Header />;
}