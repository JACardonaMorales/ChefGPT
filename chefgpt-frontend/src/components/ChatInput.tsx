import { useState, FormEvent } from 'react';

interface ChatInputProps {
  onSend: (ingredients: string[], style?: string) => void;
  isLoading?: boolean;
}

export default function ChatInput({ onSend, isLoading }: ChatInputProps) {
  const [ingredients, setIngredients] = useState('');
  const [style, setStyle] = useState('');

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const ingredientsList = ingredients
      .split(',')
      .map((ing) => ing.trim())
      .filter((ing) => ing.length > 0);
    
    if (ingredientsList.length > 0) {
      onSend(ingredientsList, style.trim() || undefined);
      setIngredients('');
      setStyle('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="card">
      <div className="mb-4">
        <label htmlFor="ingredients" className="block text-sm font-medium text-gray-700 mb-2">
          Ingredientes (separados por comas)
        </label>
        <input
          type="text"
          id="ingredients"
          value={ingredients}
          onChange={(e) => setIngredients(e.target.value)}
          className="input-field"
          placeholder="Ej: pollo, arroz, tomate, cebolla"
          required
          disabled={isLoading}
        />
      </div>

      <div className="mb-4">
        <label htmlFor="style" className="block text-sm font-medium text-gray-700 mb-2">
          Estilo Culinario (opcional)
        </label>
        <input
          type="text"
          id="style"
          value={style}
          onChange={(e) => setStyle(e.target.value)}
          className="input-field"
          placeholder="Ej: Italiano, Mexicano, Asiático..."
          disabled={isLoading}
        />
      </div>

      <button
        type="submit"
        disabled={isLoading || !ingredients.trim()}
        className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isLoading ? 'Generando receta...' : '🍳 Generar Receta con IA'}
      </button>
    </form>
  );
}

