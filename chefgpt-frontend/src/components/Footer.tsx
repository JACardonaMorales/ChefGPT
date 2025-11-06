import Link from 'next/link';
import { Twitter, Instagram, Github, Mail } from 'lucide-react';
import Logo from './Logo';

export default function Footer() {
  return (
    <footer className="bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <Logo />
            <p className="mt-4 text-gray-600 dark:text-gray-400 max-w-md">
              Genera recetas increíbles con inteligencia artificial. 
              Tu asistente de cocina personal con IA.
            </p>
          </div>

          {/* Links */}
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-4">
              Enlaces
            </h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/"
                  className="text-gray-600 dark:text-gray-400 hover:text-primary-500 transition-colors"
                >
                  Inicio
                </Link>
              </li>
              <li>
                <Link
                  href="/chat"
                  className="text-gray-600 dark:text-gray-400 hover:text-primary-500 transition-colors"
                >
                  Chat IA
                </Link>
              </li>
              <li>
                <Link
                  href="/recipes"
                  className="text-gray-600 dark:text-gray-400 hover:text-primary-500 transition-colors"
                >
                  Recetas
                </Link>
              </li>
              <li>
                <Link
                  href="/favorites"
                  className="text-gray-600 dark:text-gray-400 hover:text-primary-500 transition-colors"
                >
                  Favoritos
                </Link>
              </li>
            </ul>
          </div>

          {/* Social */}
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-4">
              Síguenos
            </h3>
            <div className="flex space-x-4">
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center hover:bg-primary-500 hover:text-white transition-colors"
              >
                <Twitter className="w-5 h-5" />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center hover:bg-primary-500 hover:text-white transition-colors"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center hover:bg-primary-500 hover:text-white transition-colors"
              >
                <Github className="w-5 h-5" />
              </a>
              <a
                href="mailto:contact@chefgpt.com"
                className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center hover:bg-primary-500 hover:text-white transition-colors"
              >
                <Mail className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-800 flex flex-col sm:flex-row justify-between items-center">
          <p className="text-gray-600 dark:text-gray-400 text-sm">
            © 2025 ChefGPT. Todos los derechos reservados.
          </p>
          <div className="flex space-x-6 mt-4 sm:mt-0">
            <Link
              href="/contact"
              className="text-gray-600 dark:text-gray-400 hover:text-primary-500 text-sm transition-colors"
            >
              Contacto
            </Link>
            <Link
              href="/support"
              className="text-gray-600 dark:text-gray-400 hover:text-primary-500 text-sm transition-colors"
            >
              Soporte
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

