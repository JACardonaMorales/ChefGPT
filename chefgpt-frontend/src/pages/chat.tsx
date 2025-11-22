import { useState, useRef, useEffect } from "react";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { generateRecipe } from "@/services/openai";
import { motion, AnimatePresence } from "framer-motion";
import { ChefHat, Send, Sparkles, Loader2, Check, BookMarked } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import type { Recipe } from "@/services/recipes";

interface Message {
  role: "user" | "assistant";
  content: string;
  recipe?: Recipe | { title: string; ingredients: string; steps: string };
  savedRecipeId?: number; // 🆕 ID de la receta guardada
}

export default function ChatPage() {
  const router = useRouter();
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const [input, setInput] = useState("");
  const [style, setStyle] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showSaveNotification, setShowSaveNotification] = useState(false); // 🆕
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/auth/login');
    }
  }, [isAuthenticated, authLoading, router]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const generateRecipeHandler = async () => {
    if (!input.trim()) {
      setError("Por favor, ingresa al menos un ingrediente");
      return;
    }

    const userMessage: Message = {
      role: "user",
      content: `Ingredientes: ${input}${style ? ` | Estilo: ${style}` : ""}`,
    };
    setMessages((prev) => [...prev, userMessage]);
    setLoading(true);
    setError(null);

    try {
      const ingredients = input
        .split(",")
        .map((ing) => ing.trim())
        .filter((ing) => ing.length > 0);

      // 🆕 Por defecto, autoSave = true (guarda automáticamente)
      const result = await generateRecipe({
        ingredients,
        style: style.trim() || undefined,
        autoSave: true, // 🆕 Guardar automáticamente
      });

      // 🆕 Verificar si la receta fue guardada (tiene id)
      const isSaved = 'id' in result;
      const savedRecipeId = isSaved ? result.id : undefined;

      const assistantMessage: Message = {
        role: "assistant",
        content: isSaved 
          ? `✅ He creado y guardado esta receta en tu perfil: ${result.title}`
          : `He creado una receta especial para ti: ${result.title}`,
        recipe: result,
        savedRecipeId: savedRecipeId, // 🆕
      };

      setMessages((prev) => [...prev, assistantMessage]);
      
      // 🆕 Mostrar notificación de guardado
      if (isSaved) {
        setShowSaveNotification(true);
        setTimeout(() => setShowSaveNotification(false), 5000);
      }

      setInput("");
      setStyle("");
    } catch (err: any) {
      setError(err.message || "Error al generar la receta");
      console.error("Error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey && !loading) {
      e.preventDefault();
      generateRecipeHandler();
    }
  };

  if (authLoading) {
    return null;
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <>
      <Head>
        <title>Chat IA - ChefGPT</title>
      </Head>

      <div className="flex flex-col h-[calc(100vh-4rem)] max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="text-center py-8">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200 }}
            className="inline-block mb-4"
          >
            <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-2xl flex items-center justify-center shadow-lg">
              <ChefHat className="w-8 h-8 text-white" />
            </div>
          </motion.div>
          <h1 className="text-3xl font-display font-bold mb-2 bg-gradient-to-r from-primary-500 to-secondary-500 bg-clip-text text-transparent">
            ChefGPT
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Tu asistente de cocina con IA 🤖✨
          </p>
        </div>

        {/* 🆕 Notificación de guardado */}
        <AnimatePresence>
          {showSaveNotification && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="mb-4 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl flex items-center space-x-3"
            >
              <Check className="w-5 h-5 text-green-600 dark:text-green-400" />
              <div className="flex-1">
                <p className="text-green-800 dark:text-green-200 font-semibold">
                  ¡Receta guardada exitosamente!
                </p>
                <p className="text-green-700 dark:text-green-300 text-sm">
                  Puedes encontrarla en la sección de{" "}
                  <Link href="/recipes" className="underline font-semibold">
                    Recetas
                  </Link>
                </p>
              </div>
              <Link
                href="/recipes"
                className="px-3 py-1 bg-green-600 text-white rounded-lg text-sm hover:bg-green-700 transition-colors flex items-center space-x-1"
              >
                <BookMarked className="w-4 h-4" />
                <span>Ver recetas</span>
              </Link>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Messages Container */}
        <div className="flex-1 overflow-y-auto mb-4 space-y-4 px-2">
          {messages.length === 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-12"
            >
              <Sparkles className="w-12 h-12 mx-auto text-primary-500 mb-4" />
              <p className="text-gray-500 dark:text-gray-400 mb-4">
                ¡Hola! 👨‍🍳 Soy tu chef personal. Escribe tus ingredientes y te
                crearé una receta increíble.
              </p>
              <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-4 max-w-md mx-auto">
                <p className="text-blue-800 dark:text-blue-200 text-sm">
                  💡 <strong>Nuevo:</strong> Las recetas generadas se guardan automáticamente en tu perfil
                </p>
              </div>
            </motion.div>
          )}

          <AnimatePresence>
            {messages.map((message, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[80%] rounded-2xl p-4 ${
                    message.role === "user"
                      ? "bg-primary-500 text-white"
                      : "bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                  }`}
                >
                  {message.role === "assistant" && (
                    <div className="flex items-center mb-2">
                      <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-full flex items-center justify-center mr-2">
                        <ChefHat className="w-4 h-4 text-white" />
                      </div>
                      <span className="font-semibold">ChefGPT</span>
                    </div>
                  )}
                  <p className="mb-2">{message.content}</p>
                  {message.recipe && (
                    <div className="mt-4 pt-4 border-t border-gray-300 dark:border-gray-700">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="font-bold text-lg">
                          {message.recipe.title}
                        </h3>
                        {/* 🆕 Badge de guardado */}
                        {message.savedRecipeId && (
                          <Link
                            href={`/recipes/${message.savedRecipeId}`}
                            className="px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 text-xs rounded-full flex items-center space-x-1 hover:bg-green-200 dark:hover:bg-green-900/50 transition-colors"
                          >
                            <Check className="w-3 h-3" />
                            <span>Guardada</span>
                          </Link>
                        )}
                      </div>
                      <div className="mb-3">
                        <h4 className="font-semibold mb-2">📝 Ingredientes:</h4>
                        <div className="bg-white dark:bg-gray-900 rounded-lg p-3">
                          {Array.isArray(message.recipe.ingredients) ? (
                            <ul className="list-disc list-inside space-y-1">
                              {message.recipe.ingredients.map(
                                (ing: string, idx: number) => (
                                  <li key={idx} className="text-sm">
                                    {ing}
                                  </li>
                                )
                              )}
                            </ul>
                          ) : (
                            <p className="text-sm whitespace-pre-line">
                              {message.recipe.ingredients}
                            </p>
                          )}
                        </div>
                      </div>
                      <div>
                        <h4 className="font-semibold mb-2">👨‍🍳 Pasos:</h4>
                        <div className="bg-white dark:bg-gray-900 rounded-lg p-3">
                          {Array.isArray(message.recipe.steps) ? (
                            <ol className="list-decimal list-inside space-y-2">
                              {message.recipe.steps.map(
                                (step: string, idx: number) => (
                                  <li key={idx} className="text-sm">
                                    {step}
                                  </li>
                                )
                              )}
                            </ol>
                          ) : (
                            <p className="text-sm whitespace-pre-line">
                              {message.recipe.steps}
                            </p>
                          )}
                        </div>
                      </div>
                      {/* 🆕 Link para ver la receta guardada */}
                      {message.savedRecipeId && (
                        <div className="mt-3 pt-3 border-t border-gray-300 dark:border-gray-700">
                          <Link
                            href={`/recipes/${message.savedRecipeId}`}
                            className="text-sm text-blue-600 dark:text-blue-400 hover:underline flex items-center space-x-1"
                          >
                            <BookMarked className="w-4 h-4" />
                            <span>Ver receta guardada →</span>
                          </Link>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {loading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex justify-start"
            >
              <div className="bg-gray-100 dark:bg-gray-800 rounded-2xl p-4">
                <div className="flex items-center space-x-2">
                  <Loader2 className="w-5 h-5 animate-spin text-primary-500" />
                  <span className="text-gray-600 dark:text-gray-400">
                    👨‍🍳 El chef está creando tu receta...
                  </span>
                </div>
              </div>
            </motion.div>
          )}

          {error && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4"
            >
              <p className="text-red-800 dark:text-red-200">❌ {error}</p>
            </motion.div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-4 border border-gray-200 dark:border-gray-700">
          <div className="mb-3">
            <input
              type="text"
              className="input-field"
              placeholder="Estilo culinario (opcional): Ej. Italiano, Mexicano..."
              value={style}
              onChange={(e) => setStyle(e.target.value)}
              disabled={loading}
            />
          </div>
          <div className="flex space-x-2">
            <textarea
              className="input-field resize-none"
              rows={2}
              placeholder="Escribe tus ingredientes aquí... (ej: pollo, arroz, zanahoria)"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyPress}
              disabled={loading}
            />
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={generateRecipeHandler}
              disabled={loading || !input.trim()}
              className="px-6 py-3 bg-gradient-to-r from-primary-500 to-primary-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center space-x-2"
            >
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <Send className="w-5 h-5" />
              )}
            </motion.button>
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 text-center">
            Presiona Enter para enviar • Las recetas se guardan automáticamente
          </p>
        </div>
      </div>
    </>
  );
}