import Head from 'next/head';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Bot, BookOpen, Heart, ChefHat, Sparkles, Utensils, User, FileText } from 'lucide-react';

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

const features = [
  {
    icon: Bot,
    title: 'Genera Recetas con IA',
    description: 'Ingresa tus ingredientes y deja que la IA cree recetas deliciosas para ti',
    color: 'from-primary-500 to-primary-600',
    link: '/chat',
    emoji: '🤖',
  },
  {
    icon: BookOpen,
    title: 'Explora Recetas',
    description: 'Descubre recetas creadas por otros usuarios o crea las tuyas propias',
    color: 'from-secondary-400 to-secondary-500',
    link: '/recipes',
    emoji: '📝',
  },
  {
    icon: Heart,
    title: 'Tus Favoritos',
    description: 'Guarda tus recetas favoritas para acceder a ellas fácilmente',
    color: 'from-accent-green to-accent-orange',
    link: '/favorites',
    emoji: '❤️',
  },
];

const steps = [
  {
    icon: Utensils,
    step: '1',
    title: 'Ingresa tus ingredientes',
    description: 'Ve a la sección de Chat IA y escribe los ingredientes que tienes disponibles',
  },
  {
    icon: Sparkles,
    step: '2',
    title: 'Especifica un estilo',
    description: 'Opcionalmente, indica un estilo culinario (italiano, mexicano, etc.)',
  },
  {
    icon: ChefHat,
    step: '3',
    title: 'Recibe tu receta',
    description: 'La IA generará una receta completa con título, ingredientes y pasos detallados',
  },
  {
    icon: Heart,
    step: '4',
    title: 'Guarda tus favoritas',
    description: 'Guarda tus recetas favoritas para consultarlas después',
  },
];

export default function Home() {
  return (
    <>
      <Head>
        <title>ChefGPT - Tu asistente de cocina con IA</title>
        <meta name="description" content="Genera recetas increíbles con inteligencia artificial" />
      </Head>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
            className="inline-block mb-6"
          >
            <div className="w-20 h-20 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-3xl flex items-center justify-center shadow-2xl">
              <span className="text-4xl">👨‍🍳</span>
            </div>
          </motion.div>
          <h1 className="text-5xl md:text-6xl font-display font-bold mb-6">
            <span className="bg-gradient-to-r from-primary-500 to-secondary-500 bg-clip-text text-transparent">
              Bienvenido a ChefGPT
            </span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
            Tu asistente de cocina personal con inteligencia artificial
          </p>
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Link
              href="/chat"
              className="inline-flex items-center space-x-2 px-8 py-4 bg-gradient-to-r from-primary-500 to-primary-600 text-white rounded-2xl font-semibold text-lg shadow-xl hover:shadow-2xl transition-all"
            >
              <Sparkles className="w-5 h-5" />
              <span>Probar ahora</span>
            </Link>
          </motion.div>
        </motion.div>

        {/* Features Cards */}
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-20"
        >
          {features.map((feature, index) => (
            <motion.div
              key={index}
              variants={item}
              whileHover={{ scale: 1.05, y: -5 }}
              className="group"
            >
              <Link href={feature.link}>
                <div className="card h-full hover:shadow-2xl transition-all cursor-pointer">
                  <div className={`w-16 h-16 bg-gradient-to-br ${feature.color} rounded-2xl flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 transition-transform`}>
                    <span className="text-3xl">{feature.emoji}</span>
                  </div>
                  <h2 className="text-xl font-bold mb-3 text-gray-900 dark:text-gray-100">
                    {feature.title}
                  </h2>
                  <p className="text-gray-600 dark:text-gray-400 mb-4">
                    {feature.description}
                  </p>
                  <div className="flex items-center text-primary-500 font-semibold">
                    Explorar
                    <span className="ml-2 group-hover:translate-x-1 transition-transform">→</span>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>

        {/* How it Works */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-20"
        >
          <div className="text-center mb-12">
            <h2 className="text-4xl font-display font-bold mb-4 text-gray-900 dark:text-gray-100">
              ¿Cómo funciona?
            </h2>
            <p className="text-gray-600 dark:text-gray-400 text-lg">
              Sigue estos simples pasos para generar recetas increíbles
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {steps.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="relative"
              >
                <div className="card text-center h-full">
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg">
                      {step.step}
                    </div>
                  </div>
                  <div className="mt-8 mb-4">
                    <step.icon className="w-12 h-12 mx-auto text-primary-500" />
                  </div>
                  <h3 className="text-lg font-bold mb-2 text-gray-900 dark:text-gray-100">
                    {step.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">
                    {step.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <div className="card bg-gradient-to-r from-primary-500 to-secondary-500 text-white">
            <h2 className="text-3xl font-display font-bold mb-4">
              ¿Listo para crear recetas increíbles?
            </h2>
            <p className="text-lg mb-6 opacity-90">
              Comienza ahora y descubre el poder de la IA en la cocina
            </p>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link
                href="/chat"
                className="inline-flex items-center space-x-2 px-8 py-4 bg-white text-primary-500 rounded-xl font-semibold shadow-xl hover:shadow-2xl transition-all"
              >
                <ChefHat className="w-5 h-5" />
                <span>Empezar ahora</span>
              </Link>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </>
  );
}
