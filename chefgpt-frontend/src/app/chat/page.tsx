"use client";

import { useState, useRef, useEffect } from "react";
import { generateRecipe } from "@/services/openai";
import { motion, AnimatePresence } from "framer-motion";
import { ChefHat, Send, Sparkles, Loader2 } from "lucide-react";

export const dynamic = 'force-dynamic';

interface Message {
  role: "user" | "assistant";
  content: string;
  recipe?: any;
}

export default function ChatPage() {
  const [input, setInput] = useState("");
  const [style, setStyle] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

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

    // Add user message
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

      const result = await generateRecipe({
        ingredients,
        style: style.trim() || undefined,
      });

      const assistantMessage: Message = {
        role: "assistant",
        content: `He creado una receta especial para ti: ${result.title}`,
        recipe: result,
      };

      setMessages((prev) => [...prev, assistantMessage]);
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

  return (
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
          Tu asistente de cocina con IA
        </p>
      </div>

      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto mb-4 space-y-4 px-2">
        {messages.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-12"
          >
            <Sparkles className="w-12 h-12 mx-auto text-primary-500 mb-4" />
            <p className="text-gray-500 dark:text-gray-400">
              ¡Hola! 👨‍🍳 Soy tu chef personal. Escribe tus ingredientes y te
              crearé una receta increíble.
            </p>
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
                    <h3 className="font-bold text-lg mb-3">
                      {message.recipe.title}
                    </h3>
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
                  👨‍🍳 El chef está pensando...
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
          Presiona Enter para enviar
        </p>
      </div>
    </div>
  );
}
